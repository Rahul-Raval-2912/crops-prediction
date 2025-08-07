import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cropAPI } from '../services/api';
import axios from 'axios';

const PredictionResults = ({ results }) => {
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [careInstructions, setCareInstructions] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportDialog, setReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportingCrop, setReportingCrop] = useState(null);

  const handleViewCareInstructions = async (cropId) => {
    try {
      const response = await cropAPI.getCropCareInstructions(cropId);
      setCareInstructions(response.data);
      setDialogOpen(true);
    } catch (error) {
      console.error('Error fetching care instructions:', error);
    }
  };

  const handleReportFalsePositive = (crop) => {
    setReportingCrop(crop);
    setReportDialog(true);
  };

  const submitFalsePositiveReport = async () => {
    try {
      await axios.post('http://localhost:8000/api/report-false-positive/', {
        prediction_id: results.prediction_id,
        crop_id: reportingCrop.id,
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

  const getSuitabilityColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  if (!results) return null;

  return (
    <Box sx={{ mt: 3 }}>
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
            🌾 Crop Recommendations for {results.location}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={`${results.confidence_score?.toFixed(1)}% Confidence`} 
              color="primary" 
              size="large"
              sx={{ fontSize: '1rem', fontWeight: 'bold' }}
            />
            <Typography variant="body1" color="text.secondary">
              Based on your soil and weather conditions
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {results.recommended_crops?.map((crop, index) => (
          <Grid item xs={12} md={6} key={crop.id}>
            <Card sx={{ 
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h5" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                    #{index + 1} {crop.name}
                  </Typography>
                  <Chip 
                    label="RECOMMENDED" 
                    color="success" 
                    size="small" 
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Suitability Score
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={crop.suitability_score}
                    color={getSuitabilityColor(crop.suitability_score)}
                    sx={{ height: 12, borderRadius: 6, mb: 1 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: getSuitabilityColor(crop.suitability_score) === 'success' ? '#2e7d32' : '#ff9800' }}>
                    {crop.suitability_score?.toFixed(1)}% Match
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={crop.season}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                  <Chip
                    label={`${crop.growth_period} days`}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  {crop.care_instructions}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleViewCareInstructions(crop.id)}
                    sx={{ flex: 1 }}
                  >
                    Quick View
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/crop-care/${crop.id}`)}
                    sx={{ flex: 1 }}
                  >
                    Full Care Guide
                  </Button>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleReportFalsePositive(crop)}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Report Wrong Prediction
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {careInstructions?.crop_name} - Care Instructions
        </DialogTitle>
        <DialogContent>
          {careInstructions && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Growth Period: {careInstructions.growth_period} days
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Optimal Growing Conditions:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Temperature:</strong> {careInstructions.optimal_conditions?.temperature}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Humidity:</strong> {careInstructions.optimal_conditions?.humidity}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>pH Level:</strong> {careInstructions.optimal_conditions?.ph}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Rainfall:</strong> {careInstructions.optimal_conditions?.rainfall}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Soil Type:</strong> {careInstructions.optimal_conditions?.soil_type}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Care Instructions:
              </Typography>
              <Typography variant="body1">
                {careInstructions.care_instructions}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* False Positive Report Dialog */}
      <Dialog open={reportDialog} onClose={() => setReportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Report Wrong Prediction
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Help us improve by reporting why this prediction was incorrect:
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Crop:</strong> {reportingCrop?.name}
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
            onClick={submitFalsePositiveReport}
            variant="contained"
            color="error"
            disabled={!reportReason.trim()}
          >
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PredictionResults;