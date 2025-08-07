from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from .models import Crop, SoilData, WeatherData, CropPrediction, UserProfile, CropCareGuide, FalsePositive, ContactReport, AdminAction
from .serializers import (
    CropSerializer, SoilDataSerializer, WeatherDataSerializer,
    CropPredictionSerializer, PredictionInputSerializer, UserSerializer,
    CropCareGuideSerializer, FalsePositiveSerializer, ContactReportSerializer,
    UserProfileSerializer, AdminActionSerializer
)
from .prediction_engine import CropPredictionEngine

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    UserProfile.objects.create(user=user)
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'user_id': user.id,
        'username': user.username
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'is_staff': user.is_staff
        })
    
    return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    request.user.delete()
    return Response({'message': 'Account deleted successfully'})

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=request.user)
    
    if request.method == 'GET':
        data = {
            'username': request.user.username,
            'email': request.user.email,
            'location': profile.location,
            'farm_size': profile.farm_size,
            'phone': profile.phone,
            'address': profile.address
        }
        return Response(data)
    
    elif request.method == 'PUT':
        request.user.username = request.data.get('username', request.user.username)
        request.user.email = request.data.get('email', request.user.email)
        request.user.save()
        
        profile.location = request.data.get('location', profile.location)
        profile.farm_size = request.data.get('farm_size', profile.farm_size)
        profile.phone = request.data.get('phone', profile.phone)
        profile.address = request.data.get('address', profile.address)
        profile.save()
        
        return Response({'message': 'Profile updated successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_admin_actions(request):
    actions = AdminAction.objects.filter(
        target_user=request.user,
        is_active=True
    ).order_by('-created_at')
    serializer = AdminActionSerializer(actions, many=True)
    return Response(serializer.data)

class CropListView(generics.ListAPIView):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [AllowAny]

class CropDetailView(generics.RetrieveAPIView):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [AllowAny]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_crops(request):
    serializer = PredictionInputSerializer(data=request.data)
    
    if serializer.is_valid():
        data = serializer.validated_data
        
        soil_data = SoilData.objects.create(
            user=request.user,
            ph_level=data['ph_level'],
            nitrogen=data['nitrogen'],
            phosphorus=data['phosphorus'],
            potassium=data['potassium'],
            organic_matter=data['organic_matter'],
            soil_type=data['soil_type'],
            location=data['location']
        )
        
        weather_data = WeatherData.objects.create(
            location=data['location'],
            temperature=data['temperature'],
            humidity=data['humidity'],
            rainfall=data['rainfall'],
            date=timezone.now().date()
        )
        
        engine = CropPredictionEngine()
        predictions = engine.predict_crops(data, data)
        
        if predictions:
            prediction = CropPrediction.objects.create(
                user=request.user,
                soil_data=soil_data,
                weather_data=weather_data,
                confidence_score=predictions[0]['score']
            )
            
            for pred in predictions:
                prediction.recommended_crops.add(pred['crop'])
            
            response_data = {
                'prediction_id': prediction.id,
                'location': data['location'],
                'confidence_score': prediction.confidence_score,
                'recommended_crops': [
                    {
                        'id': pred['crop'].id,
                        'name': pred['crop'].name,
                        'season': pred['crop'].season,
                        'suitability_score': pred['score'],
                        'growth_period': pred['crop'].growth_period,
                        'care_instructions': pred['crop'].care_instructions[:200] + '...'
                    }
                    for pred in predictions
                ]
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No suitable crops found'}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def crop_care_instructions(request, crop_id):
    try:
        crop = Crop.objects.get(id=crop_id)
        care_guides = CropCareGuide.objects.filter(crop=crop)
        
        response_data = {
            'crop_name': crop.name,
            'growth_period': crop.growth_period,
            'care_instructions': crop.care_instructions,
            'weekly_guides': CropCareGuideSerializer(care_guides, many=True).data,
            'optimal_conditions': {
                'temperature': f"{crop.min_temperature}°C - {crop.max_temperature}°C",
                'humidity': f"{crop.min_humidity}% - {crop.max_humidity}%",
                'ph': f"{crop.min_ph} - {crop.max_ph}",
                'rainfall': f"{crop.min_rainfall}mm - {crop.max_rainfall}mm",
                'soil_type': crop.soil_type
            }
        }
        return Response(response_data)
    except Crop.DoesNotExist:
        return Response({'error': 'Crop not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_predictions(request):
    predictions = CropPrediction.objects.filter(user=request.user).order_by('-prediction_date')
    serializer = CropPredictionSerializer(predictions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    total_predictions = CropPrediction.objects.filter(user=request.user).count()
    recent_predictions = CropPrediction.objects.filter(user=request.user).order_by('-prediction_date')[:3]
    
    return Response({
        'total_predictions': total_predictions,
        'recent_predictions': CropPredictionSerializer(recent_predictions, many=True).data,
        'username': request.user.username
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def report_false_positive(request):
    try:
        prediction = CropPrediction.objects.get(id=request.data.get('prediction_id'), user=request.user)
        crop = Crop.objects.get(id=request.data.get('crop_id'))
        
        FalsePositive.objects.create(
            user=request.user,
            prediction=prediction,
            crop=crop,
            reason=request.data.get('reason', '')
        )
        
        return Response({'message': 'False positive reported successfully'})
    except (CropPrediction.DoesNotExist, Crop.DoesNotExist):
        return Response({'error': 'Invalid prediction or crop'}, status=400)

@api_view(['POST'])
def contact_report(request):
    serializer = ContactReportSerializer(data=request.data)
    if serializer.is_valid():
        contact_report = serializer.save()
        if request.user.is_authenticated:
            contact_report.user = request.user
            contact_report.save()
        return Response({'message': 'Message sent successfully'})
    return Response(serializer.errors, status=400)

# Admin Views
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_users(request):
    users = User.objects.all().order_by('-date_joined')
    user_data = []
    
    for user in users:
        prediction_count = CropPrediction.objects.filter(user=user).count()
        admin_action = AdminAction.objects.filter(target_user=user, is_active=True).first()
        
        user_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'date_joined': user.date_joined,
            'prediction_count': prediction_count,
            'admin_action': AdminActionSerializer(admin_action).data if admin_action else None
        })
    
    return Response(user_data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_false_positives(request):
    false_positives = FalsePositive.objects.all().order_by('-reported_date')
    data = []
    
    for fp in false_positives:
        data.append({
            'id': fp.id,
            'user': {'username': fp.user.username},
            'crop': {'name': fp.crop.name},
            'reason': fp.reason,
            'reported_date': fp.reported_date,
            'admin_reviewed': fp.admin_reviewed
        })
    
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_user_action(request):
    try:
        target_user = User.objects.get(id=request.data.get('user_id'))
        action_type = request.data.get('action_type')
        reason = request.data.get('reason')
        duration_days = request.data.get('duration_days')
        
        # Deactivate previous actions
        AdminAction.objects.filter(target_user=target_user, is_active=True).update(is_active=False)
        
        expires_at = None
        if duration_days:
            expires_at = timezone.now() + timedelta(days=int(duration_days))
        
        AdminAction.objects.create(
            admin_user=request.user,
            target_user=target_user,
            action_type=action_type,
            reason=reason,
            duration_days=duration_days,
            expires_at=expires_at
        )
        
        if action_type == 'delete':
            target_user.delete()
        
        return Response({'message': 'Action applied successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_false_positive_update(request, fp_id):
    try:
        fp = FalsePositive.objects.get(id=fp_id)
        fp.admin_reviewed = request.data.get('admin_reviewed', fp.admin_reviewed)
        fp.admin_notes = request.data.get('admin_notes', fp.admin_notes)
        fp.save()
        return Response({'message': 'Updated successfully'})
    except FalsePositive.DoesNotExist:
        return Response({'error': 'Report not found'}, status=404)