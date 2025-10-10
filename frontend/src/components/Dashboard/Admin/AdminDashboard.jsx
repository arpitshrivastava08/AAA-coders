// --- React and Hooks ---
import React, { useState, useEffect, useCallback } from 'react';

// --- Custom Components ---
import { RegisterUserForm } from '../SignUp/SignUp.jsx';
import { Header } from '../Shared/Header/Header';
import { Footer } from '../Shared/Footer/Footer';

// --- Utility Functions ---
import { getAllComplaints, getStaffnumber, assignmentStaff } from '../../utility/utility.js';

// --- Material-UI Components ---
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogContent,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tabs,
  Tab,
  Typography,
  Chip,
} from '@mui/material';

// --- Material-UI Icons ---
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// --- Icon Imports ---
import { MapPin, Calendar, User } from 'lucide-react';

const AdminDashboard = () => {
  // --- State Management ---
  const [email, setEmail] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [tab, setTab] = useState(0);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [localAssignments, setLocalAssignments] = useState({});
  const [staffCount, setStaffCount] = useState(0);
  const [status, setStatus] = useState('');
  const [localStatuses, setLocalStatuses] = useState({});

  // --- Data Fetching ---
  const fetchComplaints = useCallback(async () => {
    try {
      const data = await getAllComplaints("allComplaints");
      if (data) {
        setComplaints(data);
      }
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    }
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
    fetchComplaints();
  }, [fetchComplaints]);

  useEffect(() => {
    const fetchStaffCount = async () => {
      try {
        const count = await getStaffnumber("getStaffnumber");
        if (count) {
          setStaffCount(count);
        }
      } catch (error) {
        console.error("Failed to fetch staff count:", error);
      }
    };
    fetchStaffCount();
  }, []);

  // --- Handlers & Helper Functions ---
  const handleOpenModal = () => setOpenRegisterModal(true);
  const handleCloseModal = () => setOpenRegisterModal(false);
  const handleTabChange = (event, newValue) => setTab(newValue);

  const getPriorityColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return { text: 'high', color: '#d32f2f' };
      case 'medium': return { text: 'medium', color: '#ed6c02' };
      case 'low': return { text: 'low', color: '#2e7d32' };
      default: return { text: 'Standard', color: '#6c757d' };
    }
  };

  const handleAssignmentChange = (complaintId, staffId) => {
    setLocalAssignments(prev => ({ ...prev, [complaintId]: staffId }));
  };

  const handleSaveChanges = async (complaintId) => {
    const newStaffId = localAssignments[complaintId];
    const status = localStatuses[complaintId];

    try {
      const success = await assignmentStaff({ complaintId: complaintId, newStaffId: newStaffId, status: status }, "assignmentStaff");
      if (success) {
        // After a successful save, update the main complaints list to show the change immediately
        setComplaints(prevComplaints =>
          prevComplaints.map(c =>
            c._id === complaintId ? { ...c, assigned: newStaffId } : c
          )
        );
        setComplaints(prevComplaints =>
          prevComplaints.map(c =>
            c._id === complaintId ? { ...c, urgency: status } : c
          )
        );

        // And remove the entry from localAssignments to reset the button state
        setLocalAssignments(prev => {
          const newAssignments = { ...prev };
          delete newAssignments[complaintId];
          return newAssignments;
        });
      }
    } catch (error) {
      console.error("Failed to save assignment:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleViewDetails = (complaintId) => {
    console.log(`Viewing details for complaint ${complaintId}`);
    // Add your navigation or modal logic here
  };
  const handleStatusChange = (complaintId, newStatus) => {
    setLocalStatuses(prevStatuses => ({
      ...prevStatuses, // Keep all the old statuses
      [complaintId]: newStatus // Update the status for just this one complaint
    }));
  };

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

          {/* Tab Navigation */}
          <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="All Complaints" />
            <Tab label="By Category" />
          </Tabs>

          {/* --- TAB PANELS --- */}
          {tab === 0 && (
            <>
              {complaints.length === 0 ? (
                <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    No complaints found.
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {complaints.map((complaint) => {
                    const priorityStyles = getPriorityColor(complaint.urgency);

                    return (
                      <Grid item xs={12} sm={6} lg={4} key={complaint._id}>
                        <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
                          <Stack spacing={2} sx={{ flexGrow: 1 }}>
                            {/* Card Header */}
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
                            {/* Card Body */}
                            <Typography variant="body2" sx={{
                              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                              overflow: 'hidden', textOverflow: 'ellipsis', minHeight: '60px'
                            }}>
                              {complaint.description}
                            </Typography>
                            {/* Card Details */}
                            <Stack spacing={1}>
                              <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
                                <MapPin size={14} style={{ marginRight: '8px' }} /> {complaint.location}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
                                <Calendar size={14} style={{ marginRight: '8px' }} /> {new Date(complaint.createdate).toLocaleDateString()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
                                <User size={14} style={{ marginRight: '8px' }} /> Assigned: {complaint.assigned === 0 ? 'Unassigned' : complaint.assigned}
                              </Typography>
                            </Stack>
                          </Stack>

                          {/* Card Actions */}
                          <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #eee' }}>
                            <Stack direction="row" spacing={1} justifyContent="space-between">
                              <FormControl size="small" sx={{ minWidth: 140 }}>
                                <Select
                                  value={localAssignments[complaint._id] ?? complaint.assigned ?? 0}
                                  onChange={(e) => handleAssignmentChange(complaint._id, e.target.value)}
                                >
                                  <MenuItem value={0}>Unassigned</MenuItem>
                                  {Array.from({ length: staffCount }, (_, i) => i + 1).map((staffId) => (
                                    <MenuItem key={staffId} value={staffId}>
                                      Assign to Staff {staffId}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <FormControl size="small" sx={{ minWidth: 120 }}>
                                <Select
                                  // 1. Look up THIS complaint's status in the state object.
                                  //    If it's not there, use the original status from the data.
                                  value={localStatuses[complaint._id] ?? complaint.urgency ?? 'low'}

                                  // 2. When this dropdown changes, call the handler with THIS complaint's ID.
                                  onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                                >
                                  <MenuItem value="low">Low</MenuItem>
                                  <MenuItem value="medium">Medium</MenuItem>
                                  <MenuItem value="high">High</MenuItem>
                                </Select>
                              </FormControl>

                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleSaveChanges(complaint._id)}
                                // Logic for disabling the button
                                disabled={!(complaint._id in localAssignments) && !(complaint._id in localStatuses)}
                                // Logic for changing the color
                                color={(complaint._id in localAssignments) || (complaint._id in localStatuses) ? '' : 'primary'}
                              >
                                Save Changes
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
              <Typography sx={{ p: 2 }}>Content for "By Category" goes here.</Typography>
            </Card>
          )}

        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export { AdminDashboard };