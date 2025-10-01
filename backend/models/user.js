const mongoose=require('mongoose');
//creating a seperate collections of complaints for all the users
const complaintschema= new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}, //reference to user
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['road', 'park', 'market', 'residential'], required: true },
  urgency: { type: String, enum: ['low', 'medium', 'high'], required: true },
  photourl: { type: String },
  location: {type:String,required:true} ,
  locationpin:{type:String,required:true},
  status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' },
  createdat: { type: Date, default: Date.now },
});

const Complaint = mongoose.model('Complaint', complaintschema);
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
module.exports = {User,Complaint};
//intotal 2 collections are made!!!1





