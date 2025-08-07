from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('delete-account/', views.delete_account, name='delete-account'),
    
    # Profile
    path('profile/', views.user_profile, name='user-profile'),
    path('admin-actions/', views.user_admin_actions, name='user-admin-actions'),
    
    # Crops
    path('crops/', views.CropListView.as_view(), name='crop-list'),
    path('crops/<int:pk>/', views.CropDetailView.as_view(), name='crop-detail'),
    path('crops/<int:crop_id>/care/', views.crop_care_instructions, name='crop-care'),
    
    # Predictions
    path('predict/', views.predict_crops, name='predict-crops'),
    path('my-predictions/', views.user_predictions, name='user-predictions'),
    path('report-false-positive/', views.report_false_positive, name='report-false-positive'),
    
    # Dashboard & Contact
    path('dashboard/', views.dashboard_stats, name='dashboard-stats'),
    path('contact/', views.contact_report, name='contact-report'),
    
    # Admin URLs
    path('admin/users/', views.admin_users, name='admin-users'),
    path('admin/false-positives/', views.admin_false_positives, name='admin-false-positives'),
    path('admin/user-action/', views.admin_user_action, name='admin-user-action'),
    path('admin/false-positive/<int:fp_id>/', views.admin_false_positive_update, name='admin-false-positive-update'),
]