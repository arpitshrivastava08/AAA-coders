import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Tabs,
  Tab,
  LinearProgress,
  Divider,
  Paper,
  Container,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { Header } from '../Shared/Header/Header';
import { Footer } from '../Shared/Footer/Footer';

const AdminDashboard = () => {
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

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // JavaScript-compatible mapping
  const statusKeyMap = {
    resolved: 'resolved',
    'in-progress': 'inProgress',
    pending: 'pending',
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header userType="admin" />

      <Box component="main" sx={{ bgcolor: '#f5f5f5', py: 4, flex: '1 0 auto' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Reports & Analytics
          </Typography>
          <Typography color="text.secondary" mb={4}>
            View detailed insights about your complaint history
          </Typography>

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader title="Total Complaints" action={<BarChartIcon color="action" />} />
                <CardContent>
                  <Typography variant="h4">{analyticsData.totalComplaints}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader title="Resolution Rate" action={<TrendingUpIcon color="primary" />} />
                <CardContent>
                  <Typography variant="h4" color="primary">
                    {Math.round((analyticsData.resolved / analyticsData.totalComplaints) * 100)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader title="Avg. Resolution" action={<PieChartIcon color="action" />} />
                <CardContent>
                  <Typography variant="h4">4.2 days</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                <CardHeader
                  title="Points Earned"
                  titleTypographyProps={{ color: 'inherit' }}
                  action={<EmojiEventsIcon sx={{ color: 'white' }} />}
                />
                <CardContent>
                  <Typography variant="h4">{analyticsData.pointsEarned}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Overview" />
            <Tab label="By Category" />
            <Tab label="Timeline" />
          </Tabs>

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
                          <LinearProgress variant="determinate" value={percent} color={color} />
                        </Box>
                      );
                    })}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Reward Points History" subheader="Your earning milestones" />
                  <CardContent>
                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle1">Submission Rewards</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {analyticsData.totalComplaints} complaints × 50 pts
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {analyticsData.totalComplaints * 50}
                      </Typography>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle1">Resolution Bonus</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {analyticsData.resolved} resolved × 50 pts
                      </Typography>
                      <Typography variant="h6" color="secondary">
                        {analyticsData.resolved * 50}
                      </Typography>
                    </Paper>
                    <Divider />
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <Typography fontWeight="bold">Total Points</Typography>
                      <Typography variant="h5" color="primary">
                        {analyticsData.pointsEarned}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {tab === 1 && (
            <Card>
              <CardHeader title="Complaints by Category" subheader="Distribution across issue types" />
              <CardContent>
                {Object.entries(analyticsData.categories).map(([category, count]) => {
                  const percent = (count / analyticsData.totalComplaints) * 100;
                  return (
                    <Box key={category} mb={3}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography fontWeight="medium">{category}</Typography>
                        <Typography color="text.secondary">{count} complaints</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={percent} color="primary" />
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {tab === 2 && (
            <Card>
              <CardHeader title="Monthly Complaint Trend" subheader="Complaint submission pattern over time" />
              <CardContent>
                {analyticsData.monthlyTrend.map((item) => {
                  const percent = (item.complaints / 5) * 100;
                  return (
                    <Box key={item.month} mb={2} display="flex" alignItems="center">
                      <Box width={50}>
                        <Typography color="text.secondary">{item.month}</Typography>
                      </Box>
                      <Box flex={1} ml={2}>
                        <LinearProgress
                          variant="determinate"
                          value={percent}
                          sx={{ height: 20, borderRadius: 1 }}
                        />
                        <Box position="relative" mt={-2.5} ml={1}>
                          <Typography variant="caption" color="white">
                            {item.complaints}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export { AdminDashboard };