import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  Divider,
  Stack,
} from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.100',
        py: 6,
        mt: 8,
        borderTop: '1px solid #ddd',
      }}
    >
      <Container maxWidth="lg">
        {/* Top Row: 3 Columns */}
        <Grid container spacing={4} justifyContent="space-between">
          {/* About */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              🎪 Caravan Chronicle
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Making our circus city better, one complaint at a time. Empowering citizens to speak up and track civic issues.
            </Typography>
          </Grid>

          {/* Useful Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Useful Links
            </Typography>
            <Stack spacing={1}>
              <Link href="/about" color="inherit" underline="hover">About Us</Link>
              <Link href="/faq" color="inherit" underline="hover">FAQs</Link>
              <Link href="/terms" color="inherit" underline="hover">Terms & Conditions</Link>
              <Link href="/privacy" color="inherit" underline="hover">Privacy Policy</Link>
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: <Link href="mailto:support@caravanchronicle.com" underline="hover">support@caravanchronicle.com</Link><br />
              Phone: <Link href="tel:+1234567890" underline="hover">+1 (234) 567-890</Link><br />
              Address: 123 Carnival Street, Circus City, CC 10001
            </Typography>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 4 }} />

        {/* Bottom Row */}
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Caravan Chronicle. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export { 
    Footer
};
