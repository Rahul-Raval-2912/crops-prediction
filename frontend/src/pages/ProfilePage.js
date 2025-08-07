import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Alert
} from '@mui/material';
import { ArrowBack, Person, Edit, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    location: '',
    farm_size: '',
    phone: '',
    address: ''
  });
  const [adminActions, setAdminActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchAdminActions();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/profile/', {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAdminActions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin-actions/', {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      setAdminActions(response.data);
    } catch (error) {
      console.error('Error fetching admin actions:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.put('http://localhost:8000/api/profile/', profile, {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const activeAdminAction = adminActions.find(action => action.is_active);

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">
            My Profile
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Admin Action Alert */}
        {activeAdminAction && (
          <Alert 
            severity={activeAdminAction.action_type === 'warning' ? 'warning' : 'error'} 
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              {activeAdminAction.action_type === 'suspend' ? '⚠️ Account Suspended' : '⚠️ Admin Warning'}
            </Typography>
            <Typography variant="body2">
              <strong>Reason:</strong> {activeAdminAction.reason}
            </Typography>
            {activeAdminAction.expires_at && (
              <Typography variant="body2">
                <strong>Expires:</strong> {new Date(activeAdminAction.expires_at).toLocaleDateString()}
              </Typography>
            )}
          </Alert>
        )}

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: '#2e7d32' }}>
                <Person sx={{ fontSize: 40 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {profile.username}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Farmer & Smart Crop Advisor User
                </Typography>
              </Box>
              <Button
                variant={editing ? "contained" : "outlined"}
                startIcon={editing ? <Save /> : <Edit />}
                onClick={editing ? handleSave : () => setEditing(true)}
                disabled={loading}
              >
                {editing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Username"
                  value={profile.username}
                  disabled={!editing}
                  onChange={(e) => setProfile({...profile, username: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profile.email}
                  disabled={!editing}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={profile.phone}
                  disabled={!editing}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Farm Location"
                  value={profile.location}
                  disabled={!editing}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Farm Size (hectares)"
                  type="number"
                  value={profile.farm_size}
                  disabled={!editing}
                  onChange={(e) => setProfile({...profile, farm_size: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Address"
                  value={profile.address}
                  disabled={!editing}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                />
              </Grid>
            </Grid>

            {editing && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditing(false);
                    fetchProfile(); // Reset changes
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfilePage;