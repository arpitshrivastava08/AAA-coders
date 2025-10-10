require('dotenv').config();
const express=require('express');
const connectDB=require('./config/db');
const session=require('express-session'); //importing session middleware
const cors=require('cors');


const authrouter =require('./router/authrouters');


const app=express();

app.use(cors({
    origin: 'http://localhost:3001',  // allow requests from React app port 3001
  credentials: true
}));

app.use(express.json());
app.use(session({
     secret: 'supersecretkey',  //used tp sign the session cookie
    resave:false,    //do not save session if not modified
    saveUninitialized:true, //save new session
    cookie:{secure:false} //allow using session without using http
}));
connectDB();

app.use('/api/auth',authrouter);

const port =3000;
app.listen(port,()=>console.log("Server running on",port));