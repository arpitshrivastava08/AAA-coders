import React, { useState } from 'react';
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
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Room as MapPinIcon,
  CalendarToday as CalendarIcon,
  Person as UserIcon,
} from '@mui/icons-material';

import { Header } from '../Shared/Header/Header';
import { Footer } from '../Shared/Footer/Footer';

const StaffDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const allComplaints = [
    {
      id: 'C001',
      title: 'Pothole on Main Street',
      category: 'Road Damage',
      description: 'Large pothole causing traffic issues near the intersection',
      location: 'Main Street, Block A',
      status: 'Open',
      date: '2025-10-02',
      citizenName: 'Akshita Khandelwal',
      priority: 'High',
      assignedTo: null,
    },
    {
      id: 'C002',
      title: 'Water Leak Near Park',
      category: 'Water Leakage',
      description: 'Continuous water leakage from pipeline causing water wastage',
      location: 'Central Park, Gate 2',
      status: 'In Progress',
      date: '2025-10-01',
      citizenName: 'Ashmit Gupta',
      priority: 'Medium',
      assignedTo: 'Municipal Worker #12',
    },
    {
      id: 'C003',
      title: 'Garbage Not Collected',
      category: 'Garbage',
      description: 'Garbage bin overflowing for 3 days, causing hygiene issues',
      location: 'Sector 5, Street 12',
      status: 'Open',
      date: '2025-10-01',
      citizenName: 'Arpit Kumar',
      priority: 'High',
      assignedTo: null,
    },
    {
      id: 'C004',
      title: 'Broken Street Light',
      category: 'Street Light',
      description: 'Street light not working, creating safety concerns at night',
      location: 'Park Avenue, Lane 3',
      status: 'Resolved',
      date: '2025-09-28',
      citizenName: 'Rajesh Sharma',
      priority: 'Low',
      assignedTo: 'Electrician Team A',
    },
  ];

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s === 'open') {
      return { color: 'error.main', bg: 'error.light' };
    }
    if (s === 'in progress') {
      return { color: 'warning.main', bg: 'warning.light' };
    }
    if (s === 'resolved') {
      return { color: 'success.main', bg: 'success.light' };
    }
    return { color: 'text.secondary', bg: 'grey.200' };
  };

  const getPriorityColor = (priority) => {
    const p = priority.toLowerCase();
    if (p === 'high') {
      return { color: 'error.dark', bg: 'error.light' };
    }
    if (p === 'medium') {
      return { color: 'warning.dark', bg: 'warning.light' };
    }
    if (p === 'low') {
      return { color: 'success.dark', bg: 'success.light' };
    }
    return { color: 'text.secondary', bg: 'grey.200' };
  };

  const filteredComplaints = allComplaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      complaint.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesCategory =
      filterCategory === 'all' || complaint.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: allComplaints.length,
    open: allComplaints.filter((c) => c.status === 'Open').length,
    inProgress: allComplaints.filter((c) => c.status === 'In Progress').length,
    resolved: allComplaints.filter((c) => c.status === 'Resolved').length,
  };

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
              Manage and resolve citizen complaints efficiently
            </Typography>
          </Box>

          {/* Stats */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Complaints
                </Typography>
                <Typography variant="h5">{stats.total}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Open
                </Typography>
                <Typography variant="h5" color="error">
                  {stats.open}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  In Progress
                </Typography>
                <Typography variant="h5" color="warning.main">
                  {stats.inProgress}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Resolved
                </Typography>
                <Typography variant="h5" color="success.main">
                  {stats.resolved}
                </Typography>
              </Paper>
            </Grid>
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
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in progress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
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
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Complaint Cards */}
          {filteredComplaints.length > 0 ? (
            <Grid container spacing={2}>
              {filteredComplaints.map((complaint) => {
                const statusStyles = getStatusColor(complaint.status);
                const priorityStyles = getPriorityColor(complaint.priority);
                return (
                  <Grid item xs={12} md={6} key={complaint.id} size={6}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Stack spacing={2} sx={{ flexGrow: 1 }}>
                        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                          <Box>
                            <Typography variant="h6">{complaint.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {complaint.id}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1}>
                            <Chip
                              label={complaint.status}
                              size="small"
                              sx={{
                                color: statusStyles.color,
                                bgcolor: statusStyles.bg,
                              }}
                            />
                            <Chip
                              label={complaint.priority}
                              variant="outlined"
                              size="small"
                              sx={{
                                color: priorityStyles.color,
                                borderColor: priorityStyles.color,
                              }}
                            />
                          </Stack>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            // Remove fixed width
                            // width: 500,
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

                        <Grid
                          container
                          spacing={1}
                          direction="column"
                          alignItems="stretch"
                          wrap="nowrap"
                        >
                          <Grid item>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="flex"
                              alignItems="center"
                            >
                              <MapPinIcon
                                fontSize="small"
                                sx={{ mr: 0.5, color: 'text.secondary' }}
                              />
                              {complaint.location}
                            </Typography>
                          </Grid>

                          <Grid item>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="flex"
                              alignItems="center"
                            >
                              <CalendarIcon
                                fontSize="small"
                                sx={{ mr: 0.5, color: 'text.secondary' }}
                              />
                              {complaint.date}
                            </Typography>
                          </Grid>

                          <Grid item>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="flex"
                              alignItems="center"
                            >
                              <UserIcon
                                fontSize="small"
                                sx={{ mr: 0.5, color: 'text.secondary' }}
                              />
                              {complaint.citizenName}
                            </Typography>
                          </Grid>

                          <Grid item>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="flex"
                              alignItems="center"
                            >
                              Assigned:&nbsp;
                              <Typography
                                component="span"
                                variant="caption"
                                fontWeight="medium"
                              >
                                {complaint.assignedTo ?? 'Unassigned'}
                              </Typography>
                            </Typography>
                          </Grid>
                        </Grid>

                        <Box sx={{ mt: 'auto' }}>
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <FormControl size="small">
                              <Select
                                value={complaint.status.toLowerCase()}
                                onChange={(e) => {
                                  // handle change of status
                                }}
                              >
                                <MenuItem value="open">Open</MenuItem>
                                <MenuItem value="in progress">In Progress</MenuItem>
                                <MenuItem value="resolved">Resolved</MenuItem>
                              </Select>
                            </FormControl>
                            <Button variant="outlined" size="small">
                              Assign Staff
                            </Button>
                            <Button variant="contained" size="small">
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
          ) : (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No complaints found matching your filters.
              </Typography>
            </Paper>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export { StaffDashboard };