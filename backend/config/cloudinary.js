require('dotenv').config();
const cloudinary=require('cloudinary').v2; //it imports cloudinary node.js sdk version 2 api

cloudinary.config({
    cloud_name: "dmih97ify",
    api_key: "585976771648816",
    api_secret: "x9bm0r9cr49yA7ctsIWk1Bdnxng",
});
module.exports= cloudinary;