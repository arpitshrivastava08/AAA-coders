const mongoose = require('mongoose');

//creating a seperate collections just for the user
const userschema=new mongoose.Schema({
    name : {type: String , required: true}, //name 
    email:{type: String , required: true, unique:true}, //email
    password: { type:String, required : true }, //password
    otp :{type :String}, //for otp verification
    otpexpiry :{ type :Date},
    isverified : { type : Boolean, default : false}, // email verification state
    role:{type:String,enum:['citizen','staff','admin'],default:'citizen'},
    priority:{type:Number,default:0}
});

const User=mongoose.model('User',userschema);
module.exports = User;





