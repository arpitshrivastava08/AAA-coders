require('dotenv').config();
const mongoose = require('mongoose'); // library of mongodb for  object data modeling 
const { User, Complaint } = require('../models/user');

const MONGO_URL=env.MONGO_URL;

//connecting to mongo db database
const connectDB=async()=>{
try{
    await mongoose.connect(MONGO_URL,{
         useNewUrlParser: true, // it tell mongoose to us4e new connection string Parse from mongodbdrive instead to old one
           useUnifiedTopology: true // it tell mongoose to use new connecting management engine
    });
    console.log("MOngoDb connected successfully!!!!");
    // await User.createCollection(); //if collection is not created then it creates it
    //  await Complaint.createCollection();
    console.log("User and Complaint collection created Successfully!!!!");
}
catch(error){
    console.log("Mongobd connection failed",error.message);

}
};

module.exports= connectDB;


//first define schema i.e structture 
// we make a model to carry crud operation