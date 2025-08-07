import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Tab,
  Tabs,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { ArrowBack, Delete, Warning, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [falsePositives, setFalsePositives] = useState([]);
  const [actionDialog, setActionDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionForm, setActionForm] = useState({
    action_type: 'warning',
    reason: '',
    duration_days: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchFalsePositives();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/users/', {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchFalsePositives = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/false-positives/', {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      setFalsePositives(response.data);
    } catch (error) {
      console.error('Error fetching false positives:', error);
    }
  };

  const handleUserAction = async () => {
    try {
      await axios.post('http://localhost:8000/api/admin/user-action/', {
        user_id: selectedUser.id,
        ...actionForm
      }, {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      
      alert('Action applied successfully!');
      setActionDialog(false);
      setActionForm({ action_type: 'warning', reason: '', duration_days: '' });
      fetchUsers();
    } catch (error) {
      alert('Failed to apply action');
    }
  };

  const markFalsePositiveReviewed = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/admin/false-positive/${id}/`, {
        admin_reviewed: true
      }, {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      fetchFalsePositives();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const openActionDialog = (user) => {
    setSelectedUser(user);
    setActionDialog(true);
  };

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: '#d32f2f' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">
            🛡️ Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="User Management" />
            <Tab label="False Positive Reports" />
          </Tabs>
        </Box>

        {/* User Management Tab */}
        {activeTab === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                User Management
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell>Predictions</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{new Date(user.date_joined).toLocaleDateString()}</TableCell>
                        <TableCell>{user.prediction_count || 0}</TableCell>
                        <TableCell>
                          {user.admin_action ? (
                            <Chip 
                              label={user.admin_action.action_type} 
                              color="error" 
                              size="small" 
                            />
                          ) : (
                            <Chip label="Active" color="success" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<Warning />}
                            onClick={() => openActionDialog(user)}
                            sx={{ mr: 1 }}
                          >
                            Action
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* False Positive Reports Tab */}
        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                False Positive Reports
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Crop</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {falsePositives.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.user.username}</TableCell>
                        <TableCell>{report.crop.name}</TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          {report.reason.substring(0, 100)}...
                        </TableCell>
                        <TableCell>{new Date(report.reported_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={report.admin_reviewed ? "Reviewed" : "Pending"} 
                            color={report.admin_reviewed ? "success" : "warning"} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          {!report.admin_reviewed && (
                            <Button
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => markFalsePositiveReviewed(report.id)}
                            >
                              Mark Reviewed
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Action Dialog */}
        <Dialog open={actionDialog} onClose={() => setActionDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Apply Action to {selectedUser?.username}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                select
                label="Action Type"
                value={actionForm.action_type}
                onChange={(e) => setActionForm({...actionForm, action_type: e.target.value})}
                sx={{ mb: 2 }}
              >
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="suspend">Suspend Account</MenuItem>
                <MenuItem value="delete">Delete Account</MenuItem>
              </TextField>

              {actionForm.action_type === 'suspend' && (
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (days)"
                  value={actionForm.duration_days}
                  onChange={(e) => setActionForm({...actionForm, duration_days: e.target.value})}
                  sx={{ mb: 2 }}
                />
              )}

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Reason"
                value={actionForm.reason}
                onChange={(e) => setActionForm({...actionForm, reason: e.target.value})}
                placeholder="Explain why this action is being taken..."
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog(false)}>Cancel</Button>
            <Button
              onClick={handleUserAction}
              variant="contained"
              color="error"
              disabled={!actionForm.reason.trim()}
            >
              Apply Action
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminPanel;