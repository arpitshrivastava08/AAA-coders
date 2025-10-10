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
        // The staff number is expected in the query string (e.g., ?staffNumber=Staff #12)
        const staffNumber = Number(req.query.staffNumber); 
        
        if (!staffNumber) {
            return res.status(400).json({ message: 'Staff number is required for filtering.' });
        }

        // Find complaints where the 'assigned' field matches the staffNumber
        const complaints = await Complaint.find({ assigned: staffNumber })
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
            assigned: null,
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

// GET single complaints
exports.getSingleComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found.' });
        }
        // Basic check to ensure user owns the complaint
        if (complaint.user.toString() !== req.session.user.id) {
             return res.status(403).json({ message: 'Unauthorized access to complaint.' });
        }

        // return the complaint object
        res.status(200).json({ success: true, complaint: complaint });

    } catch (err) {
        res.status(500).json({ messsage: "Error fetching complaint details." });
    }
};

// PUT update complaint
exports.updateComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Find and update the complaint. { new: true } returns the updated document.
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true } // runValidators enforces schema rules
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found for update.' });
        }

        res.status(200).json({ message: 'Complaint updated successfully!', complaint: updatedComplaint });

    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ messsage: "Error updating complaint." });
    }
};

//  DELETE complaint
exports.deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await Complaint.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Complaint not found for deletion.' });
        }

        res.status(200).json({ message: 'Complaint deleted successfully!' });

    } catch (err) {
        res.status(500).json({ messsage: "Error deleting complaint." });
    }
};