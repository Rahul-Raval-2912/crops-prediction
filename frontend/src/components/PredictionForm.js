import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { CloudDownload } from '@mui/icons-material';
import { cropAPI } from '../services/api';
import { weatherAPI } from '../services/weatherAPI';

const PredictionForm = ({ onPredictionResult }) => {
  const [formData, setFormData] = useState({
    location: '',
    ph_level: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organic_matter: '',
    soil_type: '',
    temperature: '',
    humidity: '',
    rainfall: ''
  });
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const soilTypes = [
    'Clay',
    'Sandy',
    'Loamy',
    'Sandy loam',
    'Clay loam',
    'Silt loam',
    'Black cotton soil',
    'Alluvial',
    'Red soil'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fetchWeatherData = async () => {
    if (!formData.location) {
      alert('Please enter location first');
      return;
    }

    setWeatherLoading(true);
    try {
      const weatherData = await weatherAPI.getCurrentWeather(formData.location);
      setFormData({
        ...formData,
        temperature: Math.round(weatherData.temperature).toString(),
        humidity: weatherData.humidity.toString(),
        rainfall: weatherData.rainfall.toString(),
        location: weatherData.location
      });
      alert('Weather data loaded successfully!');
    } catch (error) {
      // Demo fallback data
      setFormData({
        ...formData,
        temperature: '28',
        humidity: '65',
        rainfall: '2.5'
      });
      alert('Demo weather data loaded!');
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await cropAPI.predictCrops({
        ...formData,
        ph_level: parseFloat(formData.ph_level),
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        organic_matter: parseFloat(formData.organic_matter),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        rainfall: parseFloat(formData.rainfall)
      });
      
      onPredictionResult(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Error getting prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Enter Farm Details
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
                <Tooltip title="Fetch weather data from location">
                  <IconButton
                    onClick={fetchWeatherData}
                    disabled={weatherLoading || !formData.location}
                    color="primary"
                  >
                    {weatherLoading ? <CircularProgress size={24} /> : <CloudDownload />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Soil Type"
                name="soil_type"
                value={formData.soil_type}
                onChange={handleChange}
                required
              >
                {soilTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="pH Level"
                name="ph_level"
                type="number"
                inputProps={{ step: 0.1, min: 0, max: 14 }}
                value={formData.ph_level}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nitrogen (kg/ha)"
                name="nitrogen"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.nitrogen}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Phosphorus (kg/ha)"
                name="phosphorus"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.phosphorus}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Potassium (kg/ha)"
                name="potassium"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.potassium}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Organic Matter (%)"
                name="organic_matter"
                type="number"
                inputProps={{ step: 0.1, min: 0, max: 100 }}
                value={formData.organic_matter}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Temperature (°C)"
                name="temperature"
                type="number"
                inputProps={{ step: 0.1 }}
                value={formData.temperature}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Humidity (%)"
                name="humidity"
                type="number"
                inputProps={{ min: 0, max: 100 }}
                value={formData.humidity}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Rainfall (mm)"
                name="rainfall"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.rainfall}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Get Crop Recommendations'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;