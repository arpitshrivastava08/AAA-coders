import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Chip,
  Stack,
  Container,
  Box,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const Header = ({ userType = 'citizen', points = 0, onLogout }) => {
  const getUserLabel = () => {
    switch (userType) {
      case 'citizen':
        return 'Citizen Portal';
      case 'staff':
        return 'Staff Dashboard';
      case 'admin':
        return 'Admin Panel';
      default:
        return '';
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        background: 'linear-gradient(90deg, #9c27b0, #e91e63)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Left Section */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h5" sx={{ animation: 'float 2s ease-in-out infinite' }}>
              🎪
            </Typography>
            <Typography variant="h6" color="inherit" fontWeight="bold">
              Caravan Chronicle
            </Typography>
            <Chip
              label={getUserLabel()}
              size="small"
              color="secondary"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            />
          </Stack>

          {/* Right Section */}
          <Stack direction="row" spacing={2} alignItems="center">
            {userType === 'citizen' && (
              <Stack direction="row" spacing={1} alignItems="center">
                <StarIcon sx={{ color: '#FFD700', fontSize: 20 }} />
                <Chip
                  label={`${points} Points`}
                  size="small"
                  sx={{ fontWeight: 'bold', backgroundColor: '#fff3cd' }}
                />
              </Stack>
            )}

            <Tooltip title="Notifications">
              <IconButton sx={{ color: 'white' }}>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile">
              <IconButton sx={{ color: 'white' }}>
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>

            {onLogout && (
              <Tooltip title="Logout">
                <IconButton onClick={onLogout} sx={{ color: 'white' }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export {
    Header
};