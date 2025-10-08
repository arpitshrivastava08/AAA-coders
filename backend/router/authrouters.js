const express=require('express');
//its bassiclly a network guiding the incomming request to the correct network!!!
const authmiddleware=require('../middleware/authmiddleware');
const { register, verifyotp, login } = require('../controllers/authcontroller');
const { newComplaint } = require('../controllers/complaintController');



const router =express.Router();
router.post('/register',register);
router.post('/verifyotp',verifyotp);
router.post('/login',login);
router.post('/newComplaint',newComplaint);





module.exports=router;