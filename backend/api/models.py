from django.db import models
from django.contrib.auth.models import User

class Crop(models.Model):
    name = models.CharField(max_length=100)
    season = models.CharField(max_length=50)
    min_temperature = models.FloatField()
    max_temperature = models.FloatField()
    min_humidity = models.FloatField()
    max_humidity = models.FloatField()
    min_ph = models.FloatField()
    max_ph = models.FloatField()
    min_rainfall = models.FloatField()
    max_rainfall = models.FloatField()
    soil_type = models.CharField(max_length=100)
    growth_period = models.IntegerField()
    care_instructions = models.TextField()
    
    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=200, blank=True)
    farm_size = models.FloatField(null=True, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class SoilData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    ph_level = models.FloatField()
    nitrogen = models.FloatField()
    phosphorus = models.FloatField()
    potassium = models.FloatField()
    organic_matter = models.FloatField()
    soil_type = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

class WeatherData(models.Model):
    location = models.CharField(max_length=200)
    temperature = models.FloatField()
    humidity = models.FloatField()
    rainfall = models.FloatField()
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

class CropPrediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    soil_data = models.ForeignKey(SoilData, on_delete=models.CASCADE)
    weather_data = models.ForeignKey(WeatherData, on_delete=models.CASCADE)
    recommended_crops = models.ManyToManyField(Crop)
    confidence_score = models.FloatField()
    prediction_date = models.DateTimeField(auto_now_add=True)

class CropCareGuide(models.Model):
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    stage = models.CharField(max_length=100)
    week_number = models.IntegerField()
    care_instruction = models.TextField()
    tips = models.TextField(blank=True)
    
    class Meta:
        ordering = ['week_number']

class FalsePositive(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prediction = models.ForeignKey(CropPrediction, on_delete=models.CASCADE)
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    reason = models.TextField()
    reported_date = models.DateTimeField(auto_now_add=True)
    admin_reviewed = models.BooleanField(default=False)
    admin_notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"False positive: {self.crop.name} by {self.user.username}"

class ContactReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    report_type = models.CharField(max_length=50, choices=[
        ('bug', 'Bug Report'),
        ('feature', 'Feature Request'),
        ('general', 'General Inquiry')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.subject} - {self.name}"

class AdminAction(models.Model):
    admin_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin_actions')
    target_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_actions')
    action_type = models.CharField(max_length=50, choices=[
        ('suspend', 'Account Suspended'),
        ('warning', 'Warning Issued'),
        ('delete', 'Account Deleted')
    ])
    reason = models.TextField()
    duration_days = models.IntegerField(null=True, blank=True)  # For suspensions
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.action_type} - {self.target_user.username}"