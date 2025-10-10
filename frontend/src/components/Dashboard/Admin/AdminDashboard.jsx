// --- React and Hooks ---
import React, { useState, useEffect, useCallback } from 'react';

// --- Custom Components ---
import { RegisterUserForm } from '../SignUp/SignUp.jsx';
import { Header } from '../Shared/Header/Header';
import { Footer } from '../Shared/Footer/Footer';

// --- Utility Functions ---
import { getAllComplaints } from '../../utility/utility.js';

// --- Material-UI Components ---
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip, // ✅ 1. ADDED IMPORTS
  Container,
  Dialog,
  DialogContent,
  FormControl, // ✅ 1. ADDED IMPORTS
  Grid,
  LinearProgress,
  MenuItem, // ✅ 1. ADDED IMPORTS
  Paper,
  Select, // ✅ 1. ADDED IMPORTS
  Stack,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';

// --- Material-UI Icons ---
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// ✅ 1. ADDED ICON IMPORTS (assuming 'lucide-react')
import { MapPin, Calendar, User } from 'lucide-react';

const AdminDashboard = () => {
  // --- State Management ---
  const [email, setEmail] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [tab, setTab] = useState(0);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [localStatuses, setLocalStatuses] = useState({}); // ✅ 2. ADDED STATE FOR CARD STATUS

  // --- Data Fetching ---
  const fetchComplaints = useCallback(async () => {
    const data = await getAllComplaints("allComplaints");
    if (data) {
      setComplaints(data);
    }
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
    fetchComplaints();
  }, [fetchComplaints]);

  // --- Handlers & Helper Functions ---
  const handleOpenModal = () => setOpenRegisterModal(true);
  const handleCloseModal = () => setOpenRegisterModal(false);
  const handleTabChange = (event, newValue) => setTab(newValue);

  // ✅ 3. ADDED HELPERS & HANDLERS FOR THE CARDS
  const getPriorityColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return { text: 'High Priority', color: '#d32f2f' };
      case 'medium': return { text: 'Medium Priority', color: '#ed6c02' };
      case 'low': return { text: 'Low Priority', color: '#2e7d32' };
      default: return { text: 'Standard', color: '#6c757d' };
    }
  };
  
  const handleLocalStatusChange = (complaintId, newStatus) => {
    setLocalStatuses(prev => ({ ...prev, [complaintId]: newStatus }));
  };

  const handleSaveProgress = (complaintId) => {
    console.log(`Saving progress for complaint ${complaintId}`);
    // Add your API call logic here
  };

  const handleViewDetails = (complaintId) => {
    console.log(`Viewing details for complaint ${complaintId}`);
    // Add your navigation or modal logic here
  };

  // Static data for analytics
  const analyticsData = { /* ... your analytics data ... */ };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header userType="admin" />
      <Box component="main" sx={{ bgcolor: '#f5f5f5', py: 4, flex: '1 0 auto' }}>
        <Container maxWidth="lg">
          {/* Header and Register Button */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Admin Reports & Analytics
              </Typography>
              <Typography color="text.secondary">
                View detailed insights about all complaints
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{ height: 'fit-content' }}
              onClick={handleOpenModal}
            >
              Register Staff
            </Button>
            <Dialog open={openRegisterModal} onClose={handleCloseModal}>
              <DialogContent>
                <RegisterUserForm onSuccess={handleCloseModal} />
              </DialogContent>
            </Dialog>
          </Box>

          {/* Analytics Cards */}
          <Grid container spacing={3} mb={4}>
            {/* ... your existing analytics Grid items ... */}
          </Grid>

          {/* Tab Navigation */}
          <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="All Complaints" />
            <Tab label="By Category" />
          </Tabs>

          {/* --- TAB PANELS --- */}
          {tab === 0 && (
            // ✅ 4. PASTED THE CARD RENDERING CODE DIRECTLY HERE
            <>
              {complaints.length === 0 ? (
                <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    No complaints found.
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={5}>
                  {complaints.map((complaint) => {
                    const currentStatusText = localStatuses[complaint._id] || complaint.status?.toLowerCase() || 'pending';
                    const priorityStyles = getPriorityColor(complaint.urgency);
                    const isStatusChanged = currentStatusText !== (complaint.status?.toLowerCase() || 'pending');

                    return (
                      <Grid item xs={12} md={10} key={complaint._id}>
                        <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                          <Stack spacing={2} sx={{ flexGrow: 1 }}>
                            {/* Header and Priority */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="h6">{complaint.title}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {complaint._id.substring(0, 8)}
                                </Typography>
                              </Box>
                              <Chip
                                label={priorityStyles.text}
                                variant="outlined"
                                size="small"
                                sx={{ color: priorityStyles.color, borderColor: priorityStyles.color }}
                              />
                            </Box>
                            {/* Description */}
                            <Typography variant="body2" sx={{
                              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                              overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {complaint.description}
                            </Typography>
                            {/* Details */}
                            <Stack spacing={1}>
                              <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
                                <MapPin size={14} style={{ marginRight: '4px' }} /> {complaint.location}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
                                <Calendar size={14} style={{ marginRight: '4px' }} /> {new Date(complaint.createdate).toLocaleDateString()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
                                <User size={14} style={{ marginRight: '4px' }} /> Assigned: {complaint.assigned === 0 ? 'Unassigned' : complaint.assigned}
                              </Typography>
                            </Stack>
                          </Stack>
                          {/* Action Buttons */}
                          <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #eee' }}>
                            <Stack direction="row" spacing={1} justifyContent="space-between">
                              <FormControl size="small" sx={{ minWidth: 120 }}>
                                <Select value={currentStatusText} onChange={(e) => handleLocalStatusChange(complaint._id, e.target.value)}>
                                  <MenuItem value="pending">Pending</MenuItem>
                                  <MenuItem value="in-progress">In Progress</MenuItem>
                                  <MenuItem value="resolved">Resolved</MenuItem>
                                </Select>
                              </FormControl>
                              <Button variant="contained" size="small" onClick={() => handleSaveProgress(complaint._id)} disabled={!isStatusChanged} color={isStatusChanged ? 'warning' : 'primary'}>
                                Save Progress
                              </Button>
                              <Button variant="outlined" size="small" onClick={() => handleViewDetails(complaint._id)}>
                                View Details
                              </Button>
                            </Stack>
                          </Box>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </>
          )}

          {tab === 1 && (
            <Card>
              {/* ... your "By Category" content ... */}
            </Card>
          )}

        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export { AdminDashboard };