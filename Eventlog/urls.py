"""
Definition of urls for Eventlog.
"""

from datetime import datetime
from django.urls import path, include
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from log_auth import forms, views, urls


urlpatterns = [
    path('api/', include('log_auth.urls')),  # Все API-эндпоинты начинаются с /api/
    path('admin/', admin.site.urls),
]
