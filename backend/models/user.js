const mongoose=require('mongoose');

const complaintschena= new mongoose.Schema({
    title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['road', 'park', 'market', 'residential'], required: true },
//   urgency: { type: String, enum: ['low', 'medium', 'high'], required: true },
  photourl: { type: String },
  location: {type:String,required:true} ,
  locationpin:{type:String,required:true},
  status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' },
  createdat: { type: Date, default: Date.now }
});


const userschema=new mongoose.Schema({
    name : {type: String , required: true}, //name 
    email:{type: String , required: true, unique:true}, //email
    password: { type:String, required : true }, //password
    otp :{type :String}, //for otp verification
    otpexpiry :{ type :Date},
    isverified : { type : Boolean, default : false}, // email verification state
    complaint :[complaintschena], // A array of complaint is created under each user
    role:{type:String,enum:['citizen','staff','admin'],default:'citizen'},
    priority:{type:Number,default:0}
});

const User=mongoose.model('User',userschema);

module.exports=User;