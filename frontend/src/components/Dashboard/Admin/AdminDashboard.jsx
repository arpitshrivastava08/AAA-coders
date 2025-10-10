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

  const analyticsData = {
    totalComplaints: 12,
    resolved: 8,
    inProgress: 3,
    pending: 1,
    pointsEarned: 650,
    categories: {
      'Road Damage': 5,
      'Water Leakage': 4,
      'Garbage': 3,
    },
    monthlyTrend: [
      { month: 'Jun', complaints: 2 },
      { month: 'Jul', complaints: 3 },
      { month: 'Aug', complaints: 4 },
      { month: 'Sep', complaints: 3 },
    ],
  };

  const handleSaveProgress = (complaintId) => {
    console.log(`Saving progress for complaint ${complaintId}`);
    // Add your API call logic here
  };

  // JavaScript-compatible mapping
  const statusKeyMap = {
    resolved: 'resolved',
    'in-progress': 'inProgress',
    pending: 'pending',
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
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Status Distribution" subheader="Breakdown of complaint statuses" />
                  <CardContent>
                    {Object.entries(statusKeyMap).map(([label, key]) => {
                      const value = analyticsData[key];
                      const percent = (value / analyticsData.totalComplaints) * 100;
                      const color =
                        label === 'resolved'
                          ? 'success'
                          : label === 'in-progress'
                          ? 'warning'
                          : 'error';

                      return (
                        <Box key={label} mb={2}>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography>{label}</Typography>
                            <Typography color="text.secondary">{value}</Typography>
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