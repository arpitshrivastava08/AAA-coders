import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Chip,
  Stack,
  Snackbar, 
  Alert,
  Modal,
  // IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  // FilterList as FilterIcon,
  Room as MapPinIcon,
  CalendarToday as CalendarIcon,
  Person as UserIcon,
} from '@mui/icons-material';

import { Header } from '../Shared/Header/Header';
import { Footer } from '../Shared/Footer/Footer';
import { getStaffComplaints, updateComplaint, getSingleComplaint } from '../../utility/utility';

const getStatusColor = (status) => {
  const s = status?.toLowerCase(); 
  if(s === 'pending' || s === 'pending') {
    return { color: '#173f9f', bg: '#e0e9ff' };
  }
  if (s === 'in-progress') {
    return { color: 'warning.dark', bg: 'warning.light' };
  }
  if (s === 'resolved') {
    return { color: 'success.dark', bg: 'success.light' };
  }

  return { color: 'text.secondary', bg: 'grey.200' };
};

const getPriorityColor = (priority) => {
    const p = priority?.toLowerCase();
    if (p === 'high') {
      return { color: 'error.dark', bg: 'error.light', text: 'High' };
    }
    if (p === 'medium') {
      return { color: 'warning.dark', bg: 'warning.light', text: 'Medium' };
    }
    if (p === 'low' || p === '0' || p === 'unset') {
      return { color: 'success.dark', bg: 'success.light', text: 'Low' };
    }
    return { color: 'text.secondary', bg: 'grey.200', text: 'Unset' };
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const StaffDashboard = () => {
  // Retrieve staffnumber from localStorage (must be assigned field in db)
  const staffnumber = localStorage.getItem('staffnumber');
  const displayId = staffnumber || 'Not Logged In'; // use null as default  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [staffComplaints, setStaffComplaints] = useState([]); 
  const [localStatuses, setLocalStatuses] = useState({}); // Local state for status changes
  const [showToast, setShowToast] = useState(false);
  const [modalpending, setModalpending] = useState(false);
  const [currentComplaintDetails, setCurrentComplaintDetails] = useState(null);

  // 1. Fetching Complaints Assigned to Staff
  const fetchAssignedComplaints = useCallback(async () => {
    if (!staffnumber) return;

    // API CALL: Filters tasks assigned ONLY to this staff member
    const data = await getStaffComplaints(`staffComplaints?staffnumber=${staffnumber}`);
    
    if (data) {
      setStaffComplaints(data);
      // Initialize local status state
      const initialStatuses = data.reduce((acc, c) => {
        acc[c._id] = c.status || 'pending'; 
        return acc;
      }, {});
      setLocalStatuses(initialStatuses);
    }
  }, [staffnumber]);

  useEffect(() => {
    fetchAssignedComplaints();
  }, [fetchAssignedComplaints]);

  // Handler for temporary status change in the dropdown
  const handleLocalStatusChange = (complaintId, newStatus) => {
    setLocalStatuses(prev => ({
      ...prev,
      [complaintId]: newStatus
    }));
  };

  // 3. Status Update Logic (Save Progress Button Action)
  const handleSaveProgress = async (complaintId) => {
    const newStatus = localStatuses[complaintId];
    if (!newStatus) return; 

    const statusToSend = newStatus.toLowerCase(); 

    const dataToSend = { status: statusToSend };
    
    // API CALL: Update status in the database
    const success = await updateComplaint(`myComplaint/${complaintId}`, dataToSend);

    if (success) {
      await fetchAssignedComplaints(); 
      setShowToast(true); 
    } else {
      await fetchAssignedComplaints(); 
    }
  };

  // 4. "View Details" Action
  const handleViewDetails = async (complaintId) => {
    // API CALL: Fetch full details for the modal
    const complaint = await getSingleComplaint(`myComplaint/${complaintId}`); 
    if (complaint) {
        setCurrentComplaintDetails(complaint);
        setModalpending(true);
    }
  };

  const handleCloseModal = () => {
    setModalpending(false);
    setCurrentComplaintDetails(null);
  };
  
  // --- Filtering Logic ---
  const filteredComplaints = staffComplaints.filter((complaint) => {
    const statusToCheck = localStatuses[complaint._id] || complaint.status;

    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      statusToCheck.toLowerCase() === filterStatus.toLowerCase();
    const matchesCategory =
      filterCategory === 'all' || complaint.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory; 
  });

  // Stats
  const total = staffComplaints.length;
  const pendingCount = staffComplaints.filter((c) => c.status?.toLowerCase() === 'pending' || c.status?.toLowerCase() === 'pending').length;
  const inProgressCount = staffComplaints.filter((c) => c.status?.toLowerCase() === 'in-progress').length;
  const resolvedCount = staffComplaints.filter((c) => c.status?.toLowerCase() === 'resolved').length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header userType="staff" />

      <Box component="main" sx={{ flex: 1, py: 4, bgcolor: 'grey.50', overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Box mb={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Staff Portal
            </Typography>
            <Typography color="text.secondary">
              Manage and resolve citizen complaints efficiently. (Assigned ID: **{displayId}**)
            </Typography>
          </Box>

          {/* Stats */}
          <Grid container spacing={3} mb={4}>
            <StatCard title="Total Assigned" count={total} color="#3f51b5" />
            <StatCard title="pending" count={pendingCount} color="error.main" />
            <StatCard title="in-progress" count={inProgressCount} color="warning.main" />
            <StatCard title="resolved" count={resolvedCount} color="success.main" />
          </Grid>

          {/* Filters */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Stack direction="row" alignItems="center">
                  <SearchIcon color="action" sx={{ mr: 1 }} />
                  <TextField
                    fullWidth
                    placeholder="Search by title or location..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="pending">pending</MenuItem>
                    <MenuItem value="in-progress">in-progress</MenuItem>
                    <MenuItem value="resolved">resolved</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    label="Category"
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="Road Damage">Road Damage</MenuItem>
                    <MenuItem value="Water Leakage">Water Leakage</MenuItem>
                    <MenuItem value="Garbage">Garbage</MenuItem>
                    <MenuItem value="Street Light">Street Light</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Complaint Cards */}
          {filteredComplaints.length === 0 ? (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No complaints found assigned to you matching your filters.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={4}>
              {filteredComplaints.map((complaint) => {
                // Use local status for display if changed, otherwise use status from DB
                const currentStatusText = localStatuses[complaint._id] || complaint.status?.toLowerCase() || 'pending';
                const statusStyles = getStatusColor(currentStatusText);
                const priorityStyles = getPriorityColor(complaint.urgency);
                
                // Check if local status differs from DB status to enable "Save Progress"
                const isStatusChanged = currentStatusText !== (complaint.status?.toLowerCase() || 'pending');

                return (
                  <Grid item xs={12} md={6} key={complaint._id}>
                    <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
                      <Stack spacing={2} sx={{ flexGrow: 1 }}>
                        {/* Header and Priority */}
                        <Box display="flex" justifyContent="space-between" flexWrap="wrap" alignItems="center">
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
                            sx={{
                              color: priorityStyles.color,
                              borderColor: priorityStyles.color,
                            }}
                          />
                        </Box>

                        <Typography variant="body2" sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'normal',
                          }}
                        >
                          {complaint.description}
                        </Typography>

                        {/* Details */}
                        <Grid container spacing={1} direction="column" wrap="nowrap">
                          <Grid item>
                            <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
                              <MapPinIcon fontSize="small" sx={{ mr: 0.5 }} />
                              {complaint.location}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
                              <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                              {new Date(complaint.createdate).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
                              <UserIcon fontSize="small" sx={{ mr: 0.5 }} />
                              Assigned: {complaint.assigned === 0 ? 'Unassigned' : complaint.assigned}
                            </Typography>
                          </Grid>
                        </Grid>

                        {/* Action Buttons */}
                        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #eee' }}>
                          <Stack direction="row" spacing={1} justifyContent="space-between">
                            {/* Status Update Dropdown */}
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={currentStatusText}
                                onChange={(e) => handleLocalStatusChange(complaint._id, e.target.value)}
                              >
                                <MenuItem value="pending">pending</MenuItem>
                                <MenuItem value="in-progress">in-progress</MenuItem>
                                <MenuItem value="resolved">resolved</MenuItem>
                              </Select>
                            </FormControl>
                            
                            {/* Save Progress Button */}
                            <Button 
                                variant="contained" 
                                size="small"
                                onClick={() => handleSaveProgress(complaint._id)}
                                disabled={!isStatusChanged}
                                color={isStatusChanged ? 'warning' : 'inherit'}
                            >
                              Save Progress
                            </Button>

                            {/* View Details Button */}
                            <Button variant="outlined" size="small" onClick={() => handleViewDetails(complaint._id)}>
                              View Details
                            </Button>
                          </Stack>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Details Modal */}
      <DetailsModal 
        pending={modalpending} 
        handleClose={handleCloseModal} 
        complaint={currentComplaintDetails} 
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
      />

      {/* Snackbar */}
      <Snackbar
        pending={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowToast(false)} severity="success" sx={{ width: '100%' }}>
          Progress saved successfully!
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

// Supporting Components

const StatCard = ({ title, count, color }) => (
    <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} sx={{ p: 2, borderBottom: `4px solid ${color}` }}>
            <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
            <Typography variant="h5" sx={{ color: color }}>
                {count}
            </Typography>
        </Paper>
    </Grid>
);

const DetailsModal = ({ pending, handleClose, complaint, getPriorityColor, getStatusColor }) => {
    if (!complaint) return null;
  
    const priorityStyles = getPriorityColor(complaint.urgency);
    const statusStyles = getStatusColor(complaint.status);

    return (
      <Modal pending={pending} onClose={handleClose} aria-labelledby="complaint-details-title">
        <Box sx={modalStyle}>
          <Typography id="complaint-details-title" variant="h5" component="h2" mb={3} fontWeight="bold">
            Complaint Details: {complaint.title}
          </Typography>
          
          {/* Status and Priority Chips */}
          <Stack direction="row" spacing={2} mb={3}>
            <Chip 
                label={`Status: ${complaint.status || 'pending'}`} 
                sx={{ bgcolor: statusStyles.bg, color: statusStyles.color, fontWeight: 'bold' }}
            />
            <Chip 
                label={`Priority: ${priorityStyles.text}`} 
                sx={{ bgcolor: priorityStyles.bg, color: priorityStyles.color, fontWeight: 'bold' }}
            />
          </Stack>

          <Grid container spacing={3}>
            {/* Metadata */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Category</Typography>
              <Typography variant="body1" mb={1}>{complaint.category}</Typography>
              
              <Typography variant="subtitle2" color="text.secondary">Location</Typography>
              <Typography variant="body1" mb={1}>{complaint.location}, PIN: {complaint.pin}</Typography>
              
              <Typography variant="subtitle2" color="text.secondary">Assigned To</Typography>
              <Typography variant="body1" mb={1}>{complaint.assigned || 0}</Typography>
              
            </Grid>

            {/* Description */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Full Description</Typography>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflowY: 'auto' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {complaint.description}
                </Typography>
              </Paper>
            </Grid>
            
            {/* Photo */}
            {complaint.photoUrl && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Citizen Submitted Photo
                </Typography>
                <Box component="img" src={complaint.photoUrl} alt="Complaint image" sx={{ 
                    maxWidth: '100%', 
                    height: 'auto', 
                    borderRadius: 1, 
                    border: '1px solid #ccc'
                }} />
              </Grid>
            )}

            <Grid item xs={12} mt={3}>
              <Button onClick={handleClose} variant="contained" color="primary">
                Close
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    );
  };

export { StaffDashboard };