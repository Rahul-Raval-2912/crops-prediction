import React, { useState, useEffect } from 'react';
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
  Menu,
  MenuItem,
  IconButton,
  Chip
} from '@mui/material';
import { AccountCircle, ExitToApp, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/authAPI';
import PredictionForm from '../components/PredictionForm';
import PredictionResults from '../components/PredictionResults';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [predictionResults, setPredictionResults] = useState(null);
  const [activeTab, setActiveTab] = useState('predict');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await auth.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      logout();
    } catch (error) {
      logout(); // Logout locally even if API fails
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        await auth.deleteAccount();
        logout();
      } catch (error) {
        alert('Failed to delete account');
      }
    }
  };

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🌾 Smart Crop Advisor - Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user?.username}
          </Typography>
          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => navigate('/profile')}>
              <AccountCircle sx={{ mr: 1 }} /> My Profile
            </MenuItem>
            {user?.is_staff && (
              <MenuItem onClick={() => navigate('/admin')}>
                <Delete sx={{ mr: 1 }} /> Admin Panel
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} /> Logout
            </MenuItem>
            <MenuItem onClick={handleDeleteAccount} sx={{ color: 'error.main' }}>
              <Delete sx={{ mr: 1 }} /> Delete Account
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {dashboardData?.total_predictions || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Predictions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Predictions
                </Typography>
                {dashboardData?.recent_predictions?.map((pred, index) => (
                  <Chip
                    key={index}
                    label={`${pred.soil_data.location} - ${pred.confidence_score.toFixed(1)}%`}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Navigation Tabs */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant={activeTab === 'predict' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('predict')}
            sx={{ mr: 2 }}
          >
            New Prediction
          </Button>
          <Button
            variant={activeTab === 'care' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('care')}
            sx={{ mr: 2 }}
          >
            Crop Care Guide
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/past-predictions')}
          >
            Past Predictions
          </Button>
        </Box>

        {/* Content */}
        {activeTab === 'predict' && (
          <>
            <PredictionForm onPredictionResult={setPredictionResults} />
            {predictionResults && (
              <PredictionResults results={predictionResults} />
            )}
          </>
        )}

        {activeTab === 'care' && (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Crop Care Guides
              </Typography>
              <Typography variant="body1">
                Select a crop from your predictions to view detailed care instructions,
                or browse all available crops and their growing guides.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => setActiveTab('predict')}
              >
                Make a Prediction First
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;