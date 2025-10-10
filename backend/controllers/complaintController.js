const Complaint = require('../models/complaint.js');
const User = require('../models/user.js');
const cloudinary = require('../config/cloudinary.js');
const fsPromises = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

// Get all complaints for Admin Dashboard
exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({})
            .sort({ createdate: -1 });

        res.status(200).json({
            success: true,
            complaints: complaints
        });
    } catch (err) {
        console.error("Error fetching all complaintts:", err);
        res.status(500).json({
            message: "Error fetching complaints for Admin"
        });
    }
};

// Get Staff Assigned Complaints (Filter by assigned staff number)
exports.getStaffComplaints = async (req, res) => {
    try {
        // The staff number is expected in the query string (e.g., ?staffnumber=Staff #12)
        const staffnumber = Number(req.query.staffnumber);

        if (!staffnumber) {
            return res.status(400).json({ message: 'Staff number is required for filtering.' });
        }

        // Find complaints where the 'assigned' field matches the staffnumber
        const complaints = await Complaint.find({ assigned: staffnumber })
            .sort({ createdate: -1 });

        res.status(200).json({
            success: true,
            complaints: complaints
        });

    } catch (err) {
        console.error("Error fetching staff complaints:", err);
        res.status(500).json({
            message: "Error fetching assigned complaints"
        });
    }
};

// New function to fetch complaints for the logged-in user
exports.getUserComplaints = async (req, res) => {
    try {
        // 1. Check if the user is authenticated (session exists)
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const userId = req.session.user.id;

        // 2. Find all complaints linked to this user ID
        const complaints = await Complaint.find({ user: userId })
            .sort({ createdate: -1 }); // Sort by newest first

        // 3. Return the list of complaints
        res.status(200).json({
            success: true,
            complaints: complaints
        });

    } catch (err) {
        console.error("Error fetching user complaints:", err);
        res.status(500).json({
            message: "Error fetching complaints"
        });
    }
};

exports.newComplaint = async (req, res) => {
    //  Ensure tempFilePath is outside the try block for access in catch/finally
    let tempFilePath = req.file?.path || null;

    try {
        // --- DATA EXTRACTION & VALIDATION ---
        const { email, title, category, description, location, pin } = req.body;

        // Basic required field check (front-end should handle this, but for safety)
        if (!email || !title || !description || !location || !pin) {
            return res.status(400).json({ message: "Missing required complaint fields (title, description, location, pin, or email)." });
        }

        const user = await User.findOne({ email });

        if (!user) {
            // No need for a separate unlink here, the main cleanup logic handles it.
            return res.status(404).json({ message: "User not found!!!" });
        }

        let photoUrl = null;

        // --- CLOUDINARY UPLOAD ---
        if (req.file) {
            try {
                console.log(' Uploading file:', req.file.originalname);

                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'clearcity_complaints',
                    resource_type: 'auto'
                });

                photoUrl = result.secure_url;
                console.log(' Upload successful, URL:', photoUrl);

            } catch (uploadError) {
                console.error(" Cloudinary Upload Error:", uploadError);
                // Do not delete here, use the final cleanup
                return res.status(500).json({
                    message: "Image upload failed. Check Cloudinary API keys.",
                    error: uploadError.message
                });
            }
        }

        // --- SAVE COMPLAINT ---
        const complaint = new Complaint({
            user: user._id,
            title: title,
            description: description,
            // Removed the category HACK and trust the front-end to send correct category
            category: category,
            location: location,
            pin: pin,
            status: "pending",
            photoUrl: photoUrl,
            reatedate: Date.now(),
            urgency: 'low',
            assigned: 0,
        });

        await complaint.save();

        res.status(201).json({
            message: 'Complaint saved successfully!',
            complaint: complaint
        });

    } catch (err) {
        console.error(" Mongoose/General Error:", err.message);

        res.status(500).json({
            message: "Error saving complaint. Check required fields or PIN type.",
            error: err.message // Send the actual error message for better debugging
        });
    } finally {
        // Call the helper function you defined with the corrected imports
        await deleteTempFile(tempFilePath);
    }
};

// Get single complaint
exports.getSingleComplaint = async (req, res) => {
    try {
        // Ensure user is logged in
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const { id } = req.params;
        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found.' });
        }

        // Role-Based Access Control Check
        const isOwner = complaint.user.toString() === req.session.user.id;
        // Allow access if the role is 'admin' or 'staff'
        const isAdminOrStaff = req.session.user.role === 'admin' || req.session.user.role === 'staff';

        if (!isOwner && !isAdminOrStaff) {
            // If not the owner AND not staff/admin, deny access
            return res.status(403).json({ message: 'Unauthorized access to complaint.' });
        }

        // return the complaint object
        res.status(200).json({ success: true, complaint: complaint });

    } catch (err) {
        console.error('Error fetching complaint details for ID:', req.params.id, err); // Improved logging
        res.status(500).json({ message: "Error fetching complaint details." }); // FIX: Corrected typo 'messsage' to 'message'
    }
};

// PUT update complaint
exports.updateComplaint = async (req, res) => {
    // Initialize tempFilePath outside the try block
    let tempFilePath = req.file?.path || null;

    try {
        // Authorization Check 
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({ message: 'Unauthorized. Please log in to update.' });
        }

        const { id } = req.params;
        const updates = req.body;

        const existingComplaint = await Complaint.findById(id);

        if (!existingComplaint) {
            return res.status(404).json({ message: 'Complaint not found for update.' });
        }

        // Role-Based Access Control Check (Existing logic)
        const isOwner = existingComplaint.user.toString() === req.session.user.id;
        const isAdminOrStaff = req.session.user.role === 'admin' || req.session.user.role === 'staff';

        if (!isOwner && !isAdminOrStaff) {
            return res.status(403).json({ message: 'Unauthorized access: You cannot update this complaint.' });
        }

        if (req.file) {
            try {
                console.log(' Updating photo:', req.file.originalname);

                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'clearcity_complaints',
                    resource_type: 'auto'
                });

                updates.photoUrl = result.secure_url;
                console.log(' Photo updated:', updates.photoUrl);

            } catch (uploadError) {
                console.error(" Cloudinary Upload Error:", uploadError);
                // FAILURE #6 FIX: Return detailed error
                return res.status(500).json({
                    message: "Photo update failed.",
                    error: uploadError.message || "Unknown Cloudinary error"
                });
            }
        }

        // Find and update the complaint.
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found for update (post-check).' });
        }

        res.status(200).json({ message: 'Complaint updated successfully!', complaint: updatedComplaint });

    } catch (err) {
        console.error(" Mongoose/General Update error:", err.message);
        // FAILURE #6 FIX: Return detailed error
        res.status(500).json({
            message: "Error updating complaint.",
            error: err.message
        });
    } finally {
        await deleteTempFile(tempFilePath);
    }
};

// DELETE complaint
exports.deleteComplaint = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({ message: 'Unauthorized. Please log in to delete.' });
        }

        const { id } = req.params;

        // Fetch the existing complaint to check ownership/role
        const existingComplaint = await Complaint.findById(id);

        if (!existingComplaint) {
            return res.status(404).json({ message: 'Complaint not found for deletion.' });
        }

        // Role-Based Access Control Check
        const isOwner = existingComplaint.user.toString() === req.session.user.id;
        // Only the owner or an admin should be able to delete
        const isAdmin = req.session.user.role === 'admin';

        // If not the owner AND not admin, deny access
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Unauthorized access: Only the owner or an admin can delete a complaint.' });
        }

        // Proceed with deletion
        const result = await Complaint.findByIdAndDelete(id);

        // This check is already done above, but kept for robustness.
        if (!result) {
            return res.status(404).json({ message: 'Complaint not found for deletion.' });
        }

        res.status(200).json({ message: 'Complaint deleted successfully!' });

    } catch (err) {
        console.error("Delete error:", err); // Added detailed logging
        res.status(500).json({ message: "Error deleting complaint." }); // FIX: Corrected typo 'messsage' to 'message'
    }
};

const deleteTempFile = async (filePath) => {
    try {
        if (filePath && fsSync.existsSync(filePath)) { // Use sync exists check
            await fsPromises.unlink(filePath); // Use async unlink
            console.log(' File deleted:', filePath);
        }
    } catch (err) {
        console.warn('Failed to delete file:', err.message);
    }
}

exports.getStaffnumber = async (req, res) => {

    const countstaff = await User.countDocuments({
        role: 'staff',
        isverified: true
    });

    res.status(200).json({
        success: true,
        staffnumber: countstaff
    })
}

exports.assignmentStaff = async (req, res) => {
    const { complaintId, newStaffId, status } = req.body;
    const complaint = await Complaint.findById(complaintId);
    complaint.assigned = newStaffId;
    complaint.urgency = status;
    await complaint.save();
    res.status(200).json({
        success: true,
        message: "Assigned Successfully!!!"
    });

}