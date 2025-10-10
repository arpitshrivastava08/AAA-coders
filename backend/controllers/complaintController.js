const Complaint = require('../models/complaint.js');
const User = require('../models/user.js');
const cloudinary=require('../config/cloudinary.js');

// Get all complaints for Admin Dashboard
exports.getAllComplaints = async (req , res) => {
    try {
        const complaints = await Complaint.find({})
            .sort({createdate: -1});

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
exports.newComplaint=async(req,res)=>{
    try{
        const {email,title,category,description,location,pin,photoUrl}=req.body;
        const user= await User.findOne({email});
        if(!user){
          return res.status(404).json({
                message:"User not found!!!"
            });
        }

    //  Upload photo if exists
    // let photourl = null;
    // if (req.file) {
    //   const result = await cloudinary.uploader.upload(req.file.path, {
    //     folder: 'complaints'
    //   });
    //   photourl = result.secure_url;
    // }
        
        const photourl = photoUrl || null;
        const complaint=new Complaint({
            user:user._id,
            title:title,
            description: description,
            category: ['road', 'park', 'market', 'residential'].includes(category.toLowerCase().split(' ')[0]) ? category : 'road', // HACK to match schema/client
            location: location,
            pin:pin,
            status:"pending", //by default
            photoUrl:photourl,
            createdate: Date.now(),
            urgency:'low',
            assigned: 0,
        });

        await complaint.save();
        res.status(201).json({
            message: 'Complaint saved Successfully!!!'
        });
        
    }
    catch(err){
        res.status(500).json({
            messsage: "Error while saving complaint"
        });
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

        // Role-Based Access Control Check
        const isOwner = existingComplaint.user.toString() === req.session.user.id;
        // Staff/Admin can update status, Citizen can update other fields (if status is 'pending')
        const isAdminOrStaff = req.session.user.role === 'admin' || req.session.user.role === 'staff'; 
        
        // If not the owner AND not staff/admin, deny access
        if (!isOwner && !isAdminOrStaff) { 
             return res.status(403).json({ message: 'Unauthorized access: You cannot update this complaint.' });
        }
        
        // Find and update the complaint. { new: true } returns the updated document.
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true } // runValidators enforces schema rules
        );

        // This check is mostly redundant since we checked above, but kept for safety.
        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found for update (post-check).' });
        }

        res.status(200).json({ message: 'Complaint updated successfully!', complaint: updatedComplaint });

    } catch (err) {
        console.error("Update error:", err); // Keep detailed server-side logging
        res.status(500).json({ message: "Error updating complaint." }); 
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