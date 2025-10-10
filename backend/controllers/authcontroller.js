const User = require('../models/user.js');
const nodemailer=require('nodemailer');
const crypto=require('crypto');


const transporter=nodemailer.createTransport({
     service :'gmail',  //it is a function to set up the configuration to connect to the gmail service
    auth:{
        user: 'ashmitgupta2006@gmail.com', //senders gmail address
        pass : 'rqguzolthuqgkyru' //.   it is just gmail app password not real pasword this password allows full gmail sending access through my main

    }
});
const generateotp=()=>crypto.randomInt(100000,999999).toString(); //generating random 6 digit pin

exports.register=async(req,res)=>{
    const{name,email,password,role}=req.body;
    let user= await User.findOne({email});
    if(user){

    if(user.isverified){
        return res.status(500).json({
    message:'User is alredge signed in. Plese login'});
        }
    user.name=name;    
    user.password=password;    
    user.otpexpiry=new Date(Date.now()+10*60*1000);
    user.otp=generateotp();
    await user.save();
      await transporter.sendMail({ //sending of the email with the contain from the email to the email given sice the gransport service has alredge being provided
        from: 'ashmitgupta2006@gmail.com',
        to: email,
        subject: 'OTP verification code for the website ClearCity Connect',  //uses nodemailer to send otp to the given email
        text:'Your OTP IS '+ user.otp
    });    
    res.status(200).json({
        message:"OTP is sent successfully!!!!"
    });    
    }
    else{
    const otp =generateotp(); //random 6 digit otp is generated
    const otpexpiry=new Date(Date.now()+10*60*1000); //setting expiry time by adding time with current time
    user = new User({name,email,role,password,otp,otpexpiry}); //creating a ned user object
    await user.save();  //saving the user to mongodb database
     await transporter.sendMail({ //sending of the email with the contain from the email to the email given sice the gransport service has alredge being provided
        from: 'ashmitgupta2006@gmail.com',
        to: email,
        subject: 'OTP verification for the site AOPHILIC',  //uses nodemailer to send otp to the given email
        text:'your OTP is '+ otp
    });
    res.status(200).json({
        message:"OTP is sent successfully!!!!"
    });
    }
    


};
exports.verifyotp=async(req,res)=>{
    const {email,otp}=req.body;
        //check if user is found or not
        const user= await User.findOne({email});
        // if not foun d then return 
        if(!user) return res.status(400).json({message: 'User not Found!!!'});
        // checks if the email is alredge verified or not!!!
        if(user.isverified) return res.status(400).json({message:'User alredge verifiend'});

        if(user.otp!=otp || user.otpexpiry<new Date()){
            return res.status(400).json({message:'Not verified. enter OTP correctly! or Sign in again!!'});

        }
        user.otp=undefined; // no longer needed so we write undefined
        user.isverified=true;
        user.otpexpiry=undefined; // no longer needed coz the user is now verified
        await user.save(); //saves the details in backend batabase

        res.status(200).json({
            success: true,
            message:'Email verified! Successfully. Please Login Now!!!'})
}
exports.login= async(req,res)=>{
        const {email,password,role}=req.body;
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message:'User Not Found'});
        if(user.password!=password) return res.status(400).json({message:'User password is incorrect'});
        if(!user.isverified) return res.status(400).json({message:'email not verifiend'});
        if(user.role!=role) return res.status(404).json({message:'trying to login as someone else!!!'});

        req.session.user={
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            staffnumber: user.staffnumber
        }; //creates a session on successfull login
        //session is a tempararoy memory on serve to remember who are we while browing and calling router like after login ones when the router s are again called then they need to know is this person authorotised or not like this!!!1
        //This avoid for asking email and password again and again
        
        res.status(200).json(
            {
            message:'login succesfull',
            role:user.role,
            name:user.name,
            staffnumber: user.staffnumber
        }) //user
};
exports.logout = (req, res) => {
    req.session.destroy((err) => { // it delete the user session data from yhe server
        //it ensure server forgets who the user was without session the user is treated as logout
        if (err) {
            return res.status(500).json({ message: 'Logout failed', error: err });
        }
        res.json({ message: 'Logout successful' });
    });
};
