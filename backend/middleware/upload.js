// middleware/upload.js (NEW FILE)
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '..', 'uploads'); 

// Auto-create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(' Created uploads directory:', uploadDir);
}

// Configure storage strategy
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Use the corrected absolute path
    },
    filename: function (req, file, cb) {
    // Use path.extname to ensure a clean filename and preserve the extension
        const extension = path.extname(file.originalname);
        cb(null, Date.now() + '-' + path.basename(file.originalname, extension) + extension);
    }
});

const fileFilter = function (req, file, cb) {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Only images allowed.`));
    }
};

// Configure Multer instance
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // limit file size to 5MB
});

module.exports = upload;