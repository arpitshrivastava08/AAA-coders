const express=require('express');
//its bassiclly a network guiding the incomming request to the correct network!!!
const authmiddleware=require('../middleware/authmiddleware');
const { register, verifyotp, login } = require('../controllers/authcontroller');
const { newComplaint , getUserComplaints , getSingleComplaint, updateComplaint, deleteComplaint , getAllComplaints, getStaffComplaints} = require('../controllers/complaintController');



const router =express.Router();
router.post('/register',register);
router.post('/verifyotp',verifyotp);
router.post('/login',login);
router.post('/newComplaint',newComplaint);

router.get('/myComplaints', getUserComplaints);

router.get('/myComplaint/:id', getSingleComplaint); // fetch single complaint by ID 
router.put('/myComplaint/:id', updateComplaint); // Update complaint by Id
router.delete('/myComplaint/:id', deleteComplaint); // delete complaint by ID

// Admin Route 
router.get('/allComplaints', getAllComplaints); 

// Staff Route (uses query parameter for staff number)
router.get('/staffComplaints', getStaffComplaints); 
module.exports=router;