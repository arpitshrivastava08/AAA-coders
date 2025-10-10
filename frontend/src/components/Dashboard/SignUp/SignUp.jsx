// src/components/RegisterUserForm.jsx
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';
import { postuser } from '../../utility/utility'; // Re-use your API function!

export const RegisterUserForm = ({ onSuccess }) => {

  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Role, setRole] = useState('staff'); // Default to staff
  const[otp,setOtp]=useState('');
  const[showotp,setShowotp]=useState(false);
  const[Action,setAction]=useState('Create User');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // You might want a different API endpoint for admin-driven registration
    // For now, we assume 'register' works but skips OTP as admin is trusted.
    if(Action==='Create User'){
     if(await postuser({name:Name,email:Email,password:Password,role:Role},"register")){
      setShowotp(true);
      setAction('verify');
     }
    }
    else{
      await postuser({email:Email,otp:otp},"verifyotp");
    }
  };
  // const verify=async()=>{
  //    if( await postuser({email:Email,otp:otp},"verifyotp")){
  //     // setDisplayotp(false);
  //     // setAction('Login');
  //   }
  // };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Register New User
      </Typography>
      <TextField
        label="Full Name"
        value={Name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Email Address"
        type="email"
        value={Email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Password"
        type="password"
        value={Password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        required
        helperText="Must be 8+ characters with uppercase, lowercase, number, and symbol."
      />
      {(showotp===true)?<TextField
        label="OTP"
        type="password"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        fullWidth
        margin="normal"
        required
      />: <div></div>}
      <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Select value={Role} label="Role" onChange={(e) => setRole(e.target.value)}>
          <MenuItem value="staff">Staff</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {Action}
      </Button>
    </Box>
  );
};