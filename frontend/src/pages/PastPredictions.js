import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { ArrowBack, Report, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/authAPI';
import axios from 'axios';

const PastPredictions = () => {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportDialog, setReportDialog] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await auth.getMyPredictions();
      setPredictions(response.data);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportFalsePositive = async () => {
    try {
      await axios.post('http://localhost:8000/api/report-false-positive/', {
        prediction_id: selectedPrediction.id,
        crop_id: selectedCrop.id,
        reason: reportReason
      }, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      alert('Thank you for your feedback! We\'ll review this prediction.');
      setReportDialog(false);
      setReportReason('');
    } catch (error) {
      alert('Failed to submit report. Please try again.');
    }
  };

  const openReportDialog = (prediction, crop) => {
    setSelectedPrediction(prediction);
    setSelectedCrop(crop);
    setReportDialog(true);
  };

  if (loading) return <Typography>Loading...</Typography>;

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
            My Past Predictions
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Prediction History
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Review your past crop predictions and report any inaccuracies to help us improve.
        </Typography>

        {predictions.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No predictions found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Make your first prediction to see results here.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
              >
                Make Prediction
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {predictions.map((prediction) => (
              <Grid item xs={12} key={prediction.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6">
                          {prediction.soil_data.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(prediction.prediction_date).toLocaleDateString()}
                        </Typography>
                        <Chip
                          label={`${prediction.confidence_score.toFixed(1)}% Confidence`}
                          color="primary"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Box>

                    <Typography variant="subtitle1" gutterBottom>
                      Soil Conditions:
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2">
                          <strong>pH:</strong> {prediction.soil_data.ph_level}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2">
                          <strong>Soil:</strong> {prediction.soil_data.soil_type}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2">
                          <strong>Temp:</strong> {prediction.weather_data.temperature}°C
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2">
                          <strong>Humidity:</strong> {prediction.weather_data.humidity}%
                        </Typography>
                      </Grid>
                    </Grid>

                    <Typography variant="subtitle1" gutterBottom>
                      Recommended Crops:
                    </Typography>
                    <Grid container spacing={2}>
                      {prediction.recommended_crops.map((crop) => (
                        <Grid item xs={12} md={6} key={crop.id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="h6">{crop.name}</Typography>
                                  <Chip label={crop.season} size="small" sx={{ mr: 1 }} />
                                  <Chip label={`${crop.growth_period} days`} size="small" variant="outlined" />
                                </Box>
                                <Box>
                                  <IconButton
                                    onClick={() => navigate(`/crop-care/${crop.id}`)}
                                    color="primary"
                                    title="View Care Guide"
                                  >
                                    <Visibility />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => openReportDialog(prediction, crop)}
                                    color="error"
                                    title="Report Incorrect Prediction"
                                  >
                                    <Report />
                                  </IconButton>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Report Dialog */}
        <Dialog open={reportDialog} onClose={() => setReportDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Report Incorrect Prediction
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" paragraph>
              Help us improve by reporting why this prediction was incorrect for your farm:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Crop:</strong> {selectedCrop?.name}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Reason for reporting"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="e.g., This crop failed due to local climate conditions, soil issues, pest problems, etc."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReportDialog(false)}>Cancel</Button>
            <Button
              onClick={handleReportFalsePositive}
              variant="contained"
              disabled={!reportReason.trim()}
            >
              Submit Report
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default PastPredictions;