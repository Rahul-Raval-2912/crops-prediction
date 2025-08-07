from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Crop, SoilData, WeatherData, CropPrediction, UserProfile, CropCareGuide, FalsePositive, ContactReport, AdminAction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'location', 'farm_size', 'phone', 'address']

class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = '__all__'

class CropCareGuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropCareGuide
        fields = '__all__'

class SoilDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilData
        fields = '__all__'

class WeatherDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherData
        fields = '__all__'

class CropPredictionSerializer(serializers.ModelSerializer):
    recommended_crops = CropSerializer(many=True, read_only=True)
    soil_data = SoilDataSerializer(read_only=True)
    weather_data = WeatherDataSerializer(read_only=True)
    
    class Meta:
        model = CropPrediction
        fields = '__all__'

class PredictionInputSerializer(serializers.Serializer):
    location = serializers.CharField(max_length=200)
    ph_level = serializers.FloatField()
    nitrogen = serializers.FloatField()
    phosphorus = serializers.FloatField()
    potassium = serializers.FloatField()
    organic_matter = serializers.FloatField()
    soil_type = serializers.CharField(max_length=100)
    temperature = serializers.FloatField()
    humidity = serializers.FloatField()
    rainfall = serializers.FloatField()

class FalsePositiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = FalsePositive
        fields = '__all__'

class ContactReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactReport
        fields = ['name', 'email', 'subject', 'message', 'report_type']

class AdminActionSerializer(serializers.ModelSerializer):
    admin_username = serializers.CharField(source='admin_user.username', read_only=True)
    target_username = serializers.CharField(source='target_user.username', read_only=True)
    
    class Meta:
        model = AdminAction
        fields = ['id', 'admin_username', 'target_username', 'action_type', 'reason', 
                 'duration_days', 'created_at', 'expires_at', 'is_active']