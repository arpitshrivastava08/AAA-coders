const express=require('express');
//its bassiclly a network guiding the incomming request to the correct network!!!
const authmiddleware=require('../middleware/authmiddleware');
const { register, verifyotp, login } = require('../controllers/authcontroller');



const router =express.Router();
router.post('/register',register);
router.post('/verifyotp',verifyotp);
router.post('/login',login);






module.exports=router;