import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { Agriculture, TrendingUp, Support, AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🌾 Smart Crop Advisor
          </Typography>
          {user && (
            <IconButton color="inherit" onClick={() => navigate('/dashboard')}>
              <AccountCircle />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            Smart Crop Advisor
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            AI-Powered Crop Prediction System for Modern Farmers
          </Typography>
          <Typography variant="body1" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
            Get personalized crop recommendations based on your soil conditions, weather data, 
            and agricultural best practices. Make informed decisions to maximize your harvest.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            sx={{ mt: 2, px: 4, py: 1.5 }}
          >
            {user ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <Agriculture sx={{ fontSize: 60, color: '#2e7d32', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Smart Predictions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Advanced AI algorithms analyze soil pH, nutrients, weather conditions, 
                  and historical data to recommend the best crops for your farm.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <TrendingUp sx={{ fontSize: 60, color: '#ff9800', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Detailed Care Guides
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Week-by-week growing instructions, pest management tips, 
                  and optimal harvesting guidelines for maximum yield.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <Support sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Expert Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Report prediction issues, get help with crop problems, 
                  and access our comprehensive agricultural knowledge base.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Statistics Section */}
        <Box sx={{ textAlign: 'center', mb: 6, p: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Trusted by Farmers Worldwide
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary">8+</Typography>
              <Typography variant="body1">Crop Types</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary">95%</Typography>
              <Typography variant="body1">Accuracy Rate</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary">24/7</Typography>
              <Typography variant="body1">Support</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary">100%</Typography>
              <Typography variant="body1">Free to Use</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Ready to Optimize Your Farming?
          </Typography>
          <Typography variant="body1" paragraph>
            Join thousands of farmers who are already using Smart Crop Advisor 
            to make data-driven agricultural decisions.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              sx={{ mr: 2 }}
            >
              Start Predicting
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/contact')}
            >
              Contact Support
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;