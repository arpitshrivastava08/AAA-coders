import { useState,useEffect , useCallback} from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, CloudUpload, EmojiEvents, Edit, Delete } from '@mui/icons-material';
import { Header } from '../Shared/Header/Header';
import { Footer } from '../Shared/Footer/Footer';
import { postComplaint, getComplaints, getSingleComplaint, updateComplaint, deleteComplaint} from '../../utility/utility';


const CitizenDashboard = () => {
  const[email,setEmail]=useState('');
  const [complaint, setUserComplaints] = useState([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // new useEffect to fetch complaints
  // Centralized Fetching Function to get the latest list of user complaints
  const fetchComplaints = useCallback(async () => {
    const data = await getComplaints("myComplaints"); 
    if (data) {
      setUserComplaints(data);
    }
  }, []);

  // Initial fetch on component mount
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const [showForm, setShowForm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [currentComplaintId, setCurrentComplaintId] = useState(null); 
  const [formData, setFormData] = useState({
    title: '',
    category: 'Other',
    description: '',
    location: '',
    pin: '',
    photoUrl:null,
  });

  // Resets the form and sets the mode for a NEW complaint submission
  const startNewComplaint = () => {
    setIsEditing(false);
    setCurrentComplaintId(null);
    setFormData({ title: '', category: 'Other', description: '', location: '', pin: '', photoUrl: null });
    setShowForm(true);
  };
 
  const startEditComplaint = async (complaintId) => {
    // Construct the URL path for fetching a single complaint
    const complaint = await getSingleComplaint(`myComplaint/${complaintId}`);
    if (complaint && complaint.title) {
        setIsEditing(true);
        setCurrentComplaintId(complaintId);
        // Populate form with fetched data
        setFormData({
            title: complaint.title,
            category: complaint.category,
            description: complaint.description,
            location: complaint.location,
            pin: String(complaint.pin), 
            photoUrl: complaint.photoUrl || null,
        });
        setShowForm(true);
    }
    else if(complaint === false) {
      setShowForm(false); 
      // the utility func alreasy alerts on failure, but we ensure the form isn't shown
      setShowForm(false);
    }
  };


  // Handler for NEW complaint SUBMISSION (POST)
  const handleNewSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("userEmail");
    const dataToSend = { ...formData, email: email, pin: formData.pin || "000000" };

    const success = await postComplaint(dataToSend, "newComplaint");

    if (success) {
      await fetchComplaints(); // Refresh list instantly
      setShowToast(true);
      startNewComplaint(); // Reset form to clear values
      setShowForm(false);
    } else {
      alert("Complaint submission failed ");
    }
  };

  // Handler for UPDATE complaint (PUT)
  const handleUpdate = async (e) => {
    e.preventDefault();
    // Use currentComplaintId to identify the resource to update
    const dataToSend = { ...formData };
    
    const success = await updateComplaint(`myComplaint/${currentComplaintId}`, dataToSend);
    if (success) {
        await fetchComplaints(); // Refresh list
        setShowToast(true);
        setShowForm(false);
    }
  };

  // Handler for DELETE complaint (DELETE)
  const handleDelete = async () => {
    if(window.confirm('Are you sure you want to delete this complaint? This cannot be undone.')) {
        const success = await deleteComplaint(`myComplaint/${currentComplaintId}`);
        if (success) {
            await fetchComplaints(); // Refresh list
            setShowForm(false);
        }
    }
  };

// Calculates total points based on the fetched data
  const totalPoints = complaint.reduce((sum, complaint) => sum + (complaint.priority || 0), 0);
  
  return (
    <Box className="min-h-screen flex flex-col">
      <Header />

      <Box component="main" px={4} py={6} flex="1" bgcolor="#f9f9f9">
        <Box maxWidth="lg" mx="auto">
          
          {/* Title and Stats Cards */}
          <Box mb={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Citizen Dashboard
            </Typography>
            <Typography color="text.secondary">
              Manage your complaints and track their progress
            </Typography>
          </Box>
          <Grid container spacing={3} mb={5}>
            {/* ... (Stat cards displaying real data based on complaint.length) ... */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography color="text.secondary">Total Complaints</Typography>
                <Typography variant="h5">{complaint.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography color="text.secondary">Resolved</Typography>
                <Typography variant="h5">
                  {complaint.filter((c) => c.status === 'resolved').length}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography color="text.secondary">In Progress</Typography>
                <Typography variant="h5" color="warning.main">
                  {complaint.filter((c) => c.status === 'in-progress').length}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  background: 'linear-gradient(45deg, #3f51b5, #6573c3)',
                  color: '#fff',
                }}
              >
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmojiEvents fontSize="small" />
                  Total Points
                </Typography>
                <Typography variant="h5">{totalPoints}</Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* 1. Complaints List (Display section above the button) */}
          <Box mb={5}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              My Complaints
            </Typography>
            <Grid container spacing={3}>
              {complaint.map((complaint) => (
                <Grid item xs={12} md={6} lg={4} key={complaint._id}>
                  <Paper 
                    elevation={2} 
                    sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: '#e0e0e0' } }}
                    // Click the card to load data into the form for editing
                    onClick={() => startEditComplaint(complaint._id)}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {complaint.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {complaint.description}
                    </Typography>
                    <Typography variant="body2">📍 {complaint.location}</Typography>
                    <Typography variant="body2" color="primary">
                      Status: {complaint.status}
                    </Typography>
                    <Typography variant="caption" display="block" mt={1}>
                      Date: {new Date(complaint.createdate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption">Points: {complaint.priority || 0}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>


          {/* 2. New Complaint Button */}
          <Box mb={4}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={startNewComplaint}
            >
              Submit New Complaint
            </Button>
          </Box>

          {/* 3. Complaint Form (The dynamic form) */}
          {showForm && (
            <Paper elevation={3} sx={{ p: 4, mb: 5 }}>
              <Typography variant="h6" gutterBottom>
                {isEditing ? `Edit Complaint` : 'New Complaint'}
              </Typography>
              {/* Select the correct handler (Update vs. New Submit) based on mode */}
              <form onSubmit={isEditing ? handleUpdate : handleNewSubmit}> 
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Complaint Title"
                      fullWidth
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        fullWidth
                        label="Category"
                      >
                        <MenuItem value="Road Damage">Road Damage</MenuItem>
                        <MenuItem value="Water Leakage">Water Leakage</MenuItem>
                        <MenuItem value="Garbage">Garbage Collection</MenuItem>
                        <MenuItem value="Street Light">Street Light</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Location"
                      fullWidth
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </Grid>
                  

                  <Grid item xs={12} sm={8}>
                    <TextField
                      label="Description"
                      multiline
                      rows={4}
                      fullWidth
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Location Pincode"
                      fullWidth
                      required
                      value={formData.pin}
                      inputProps={{ maxLength: 6 , minLength: 6}}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setFormData({ ...formData, pin: value });
                        }
                      }}
                    />
                  </Grid>


                  <Grid item xs={12} md={4}>
                    {/* Photo Upload/Update Button */}
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      fullWidth
                    >
                      {/* Text changes based on mode */}
                      {isEditing ? 'Update Photo (Optional)' : 'Upload Photo (Optional)'}
                      <input type="file" hidden accept="image/*" />
                    </Button>
                  </Grid>

                  
                  {isEditing ? (
                    // EDIT MODE BUTTONS: Update, Delete, Cancel
                    <>
                      <Grid item xs={12} md={4}>
                        <Button type="submit" startIcon={<Edit />} variant="contained" fullWidth>
                          Update Complaint
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Button variant="contained" color="error" startIcon={<Delete />} fullWidth onClick={handleDelete}>
                          Delete Complaint
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Button variant="outlined" fullWidth onClick={() => setShowForm(false)}>
                          Cancel
                        </Button>
                      </Grid>
                    </>
                  ) : (
                    // NEW COMPLAINT MODE BUTTONS: Submit, Cancel (occupies remaining space)
                    <>
                      <Grid item xs={12} md={4}>
                        <Button type="submit" variant="contained" fullWidth>
                          Submit Complaint
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Button variant="outlined" fullWidth onClick={() => setShowForm(false)}>
                          Cancel
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
              </form>
            </Paper>
          )}
        </Box>
      </Box>

      <Footer />

      {/* Snackbar */}
      <Snackbar
        open={showToast}
        autoHideDuration={4000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowToast(false)} severity="success" sx={{ width: '100%' }}>
          Action successful!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export { CitizenDashboard };