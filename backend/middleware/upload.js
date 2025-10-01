// const multer = require("multer");
// // for handling file upload in express
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// //helper that connects cloudinary to multer this always uploads getting dirrectly send to the cloudinary instead of local storage first

// const cloudinary = require("../config/cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "complaints", // folder name in cloudinary //all folder fille go into complaint folder
//     allowed_formats: ["jpg", "png", "jpeg"], //only allowes  files with extension
//   },
// });
// //creaters a new storage engin4 for multer

// const upload = multer({ storage }); //creates a multer middleware instance that user clodinary storage that we jusat defined

// module.exports = upload;




// //multer handles the file updload in the front
// //cloudarystorage sends the file directly to the cloudinary
