const { User, Complaint } = require('../models/user');
const cloudary=require('../config/cloudinary');

//geting the photourl after uploading the photo in the cloudanary
exports.savephoto=async(req,res)=>{
try{
    if(!req.file)
        return res.status(501).json({
    message:"Photo not uploaded"
});
const result= await cloudary.uploader.upload(req.file.path,{
    folder:"complaints"
});
res.status(201).json({
    photourl:result.secure_url,
    message:"Photourl generated!!!"
});
    }catch(err){
        res.status(501).json({
            message:"Failed while uploading the photo"
        });
    }

};




exports.newcomplaint=async(req,res)=>{
    try{
        const {email,title,description,category,photourl,location,locationpin,urgency}=req.body;
        const user= await User.findOne({email});
        if(!user){
          return res.status(500).json({
                message:"User not found!!!"
            });
        }

        const complaint=new Complaint({
             user:user._id,
            title,
            description,
            category,
            location,
            locationpin,
            status:"pending", //by default
            photourl,
            createdat: Date.now(),
            urgency:'low'
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
//just saving the complain with photo url