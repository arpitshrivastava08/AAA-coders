const Complaint = require('../models/complaint.js');
const User = require('../models/user.js');
const cloudinary=require('../config/cloudinary.js');


//just saving the complain with photo url
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