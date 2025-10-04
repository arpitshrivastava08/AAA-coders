import { useState } from 'react';
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
import { Add, CloudUpload, EmojiEvents } from '@mui/icons-material';
import { Header } from '../Shared/Header/Header';
import { Footer } from '../Shared/Footer/Footer';

const CitizenDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
  });
  const [showToast, setShowToast] = useState(false);

  const userComplaints = [
    {
      id: 'C001',
      title: 'Pothole on Main Street',
      category: 'Road Damage',
      description: 'Large pothole causing traffic issues',
      location: 'Main Street, Block A',
      status: 'In Progress',
      date: '2025-09-28',
      hasPhoto: true,
      points: 50,
    },
    {
      id: 'C002',
      title: 'Water Leak Near Park',
      category: 'Water Leakage',
      description: 'Continuous water leakage from pipeline',
      location: 'Central Park, Gate 2',
      status: 'Resolved',
      date: '2025-09-20',
      hasPhoto: true,
      points: 100,
    },
    {
      id: 'C003',
      title: 'Garbage Not Collected',
      category: 'Garbage',
      description: 'Garbage bin overflowing for 3 days',
      location: 'Sector 5, Street 12',
      status: 'Open',
      date: '2025-10-01',
      hasPhoto: false,
      points: 50,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate success
    setShowToast(true);
    setFormData({ title: '', category: '', description: '', location: '' });
    setShowForm(false);
  };

  const totalPoints = userComplaints.reduce((sum, complaint) => sum + (complaint.points || 0), 0);

  return (
    <Box className="min-h-screen flex flex-col">
      <Header />

      <Box component="main" px={4} py={6} flex="1" bgcolor="#f9f9f9">
        <Box maxWidth="lg" mx="auto">
          {/* Title */}
          <Box mb={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Citizen Dashboard
            </Typography>
            <Typography color="text.secondary">
              Manage your complaints and track their progress
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} mb={5}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography color="text.secondary">Total Complaints</Typography>
                <Typography variant="h5">{userComplaints.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography color="text.secondary">Resolved</Typography>
                <Typography variant="h5">
                  {userComplaints.filter((c) => c.status === 'Resolved').length}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography color="text.secondary">In Progress</Typography>
                <Typography variant="h5" color="warning.main">
                  {userComplaints.filter((c) => c.status === 'In Progress').length}
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

          {/* New Complaint Button */}
          <Box mb={4}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowForm(!showForm)}
            >
              Submit New Complaint
            </Button>
          </Box>

          {/* Complaint Form */}
          {showForm && (
            <Paper elevation={3} sx={{ p: 4, mb: 5 }}>
              <Typography variant="h6" gutterBottom>
                New Complaint
              </Typography>
              <form onSubmit={handleSubmit}>
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
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
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

                  <Grid item xs={12}>
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

                  <Grid item xs={12}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      fullWidth
                    >
                      Upload Photo (Optional)
                      <input type="file" hidden accept="image/*" />
                    </Button>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Button type="submit" variant="contained" fullWidth>
                      Submit Complaint
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button variant="outlined" fullWidth onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          )}

          {/* Complaints List */}
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              My Complaints
            </Typography>
            <Grid container spacing={3}>
              {userComplaints.map((complaint) => (
                <Grid item xs={12} md={6} lg={4} key={complaint.id}>
                  <Paper elevation={2} sx={{ p: 2 }}>
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
                      {complaint.date}
                    </Typography>
                    <Typography variant="caption">Points: {complaint.points}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
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
          Complaint submitted! You earned 50 points!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export { CitizenDashboard };
