import numpy as np
from .models import Crop

class CropPredictionEngine:
    def __init__(self):
        self.crops = Crop.objects.all()
    
    def calculate_suitability_score(self, crop, soil_data, weather_data):
        """Calculate how suitable a crop is based on soil and weather conditions"""
        score = 0
        factors = 0
        
        # Temperature suitability
        if crop.min_temperature <= weather_data['temperature'] <= crop.max_temperature:
            score += 25
        factors += 25
        
        # Humidity suitability
        if crop.min_humidity <= weather_data['humidity'] <= crop.max_humidity:
            score += 20
        factors += 20
        
        # pH suitability
        if crop.min_ph <= soil_data['ph_level'] <= crop.max_ph:
            score += 25
        factors += 25
        
        # Rainfall suitability
        if crop.min_rainfall <= weather_data['rainfall'] <= crop.max_rainfall:
            score += 20
        factors += 20
        
        # Soil type match
        if crop.soil_type.lower() in soil_data['soil_type'].lower():
            score += 10
        factors += 10
        
        return (score / factors) * 100 if factors > 0 else 0
    
    def predict_crops(self, soil_data, weather_data):
        """Predict suitable crops based on soil and weather data"""
        crop_scores = []
        
        for crop in self.crops:
            score = self.calculate_suitability_score(crop, soil_data, weather_data)
            if score > 50:  # Only include crops with >50% suitability
                crop_scores.append({
                    'crop': crop,
                    'score': score
                })
        
        # Sort by score descending
        crop_scores.sort(key=lambda x: x['score'], reverse=True)
        
        # Return top 5 recommendations
        return crop_scores[:5]
    
    def get_crop_care_instructions(self, crop_id):
        """Get detailed care instructions for a specific crop"""
        try:
            crop = Crop.objects.get(id=crop_id)
            return {
                'crop_name': crop.name,
                'growth_period': crop.growth_period,
                'care_instructions': crop.care_instructions,
                'optimal_conditions': {
                    'temperature': f"{crop.min_temperature}°C - {crop.max_temperature}°C",
                    'humidity': f"{crop.min_humidity}% - {crop.max_humidity}%",
                    'ph': f"{crop.min_ph} - {crop.max_ph}",
                    'rainfall': f"{crop.min_rainfall}mm - {crop.max_rainfall}mm",
                    'soil_type': crop.soil_type
                }
            }
        except Crop.DoesNotExist:
            return None