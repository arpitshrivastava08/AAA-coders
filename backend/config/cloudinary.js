require('dotenv').config();
const cloudinary=require('cloudinary').v2; //it imports cloudinary node.js sdk version 2 api

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
module.exports= cloudinary;