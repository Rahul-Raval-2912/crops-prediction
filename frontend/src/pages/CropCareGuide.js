import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { ExpandMore, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { cropAPI } from '../services/api';

const CropCareGuide = () => {
  const { cropId } = useParams();
  const navigate = useNavigate();
  const [careData, setCareData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareInstructions();
  }, [cropId]);

  const fetchCareInstructions = async () => {
    try {
      const response = await cropAPI.getCropCareInstructions(cropId);
      setCareData(response.data);
    } catch (error) {
      console.error('Error fetching care instructions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!careData) return <Typography>Care guide not found</Typography>;

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
            {careData.crop_name} - Care Guide
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Crop Overview */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {careData.crop_name}
            </Typography>
            <Chip
              label={`Growth Period: ${careData.growth_period} days`}
              color="primary"
              sx={{ mb: 2 }}
            />
            <Typography variant="body1" paragraph>
              {careData.care_instructions}
            </Typography>
          </CardContent>
        </Card>

        {/* Optimal Conditions */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Optimal Growing Conditions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Temperature:</strong> {careData.optimal_conditions.temperature}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Humidity:</strong> {careData.optimal_conditions.humidity}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>pH Level:</strong> {careData.optimal_conditions.ph}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Rainfall:</strong> {careData.optimal_conditions.rainfall}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Soil Type:</strong> {careData.optimal_conditions.soil_type}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Weekly Care Guide */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Weekly Care Instructions
            </Typography>
            {careData.weekly_guides?.map((guide, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">
                    Week {guide.week_number}: {guide.stage}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" paragraph>
                    {guide.care_instruction}
                  </Typography>
                  {guide.tips && (
                    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Tips:</strong> {guide.tips}
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CropCareGuide;