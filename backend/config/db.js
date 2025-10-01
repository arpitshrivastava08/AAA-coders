const mongoose = require('mongoose'); // library of mongodb for  object data modeling 
const User = require('../models/user'); //importing the user model
const MONGO_URL="mongodb+srv://ashmitgupta2006_db_user:GcGaLybQRkMhdQQb@clustercleancity0.mplzaet.mongodb.net/?retryWrites=true&w=majority&appName=Clustercleancity0";

//connecting to mongo db database
const connectDB=async()=>{
try{
    await mongoose.connect(MONGO_URL,{
         useNewUrlParser: true, // it tell mongoose to us4e new connection string Parse from mongodbdrive instead to old one
           useUnifiedTopology: true // it tell mongoose to use new connecting management engine
    });
    console.log("MOngoDb connected successfully!!!!");
    await User.createCollection(); //if collection is not created then it creates it
    console.log("User collection created Successfully!!!!");
}
catch(error){
    console.log("Mongobd connection failed",error).message;

}
};

module.exports= connectDB;


//first define schema i.e structture 
// we make a model to carry crud operation