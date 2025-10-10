const mongoose = require('mongoose');

//creating a seperate collections of complaints for all the users
const complaintschema= new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}, //reference to user
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String,  enum: ['Road Damage', 'Water Leakage', 'Garbage Collection', 'Street Light', 'Other', 'road', 'park', 'market', 'residential'],required: true },
  urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  photoUrl: { type: String },
  location: {type:String,required:true} ,
  pin:{type:String,required:true},
  status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' },
  createdate: { type: Date, default: Date.now },
  assigned: { type: Number, default:0},
});

const Complaint = mongoose.model('Complaint', complaintschema);

module.exports = Complaint;
