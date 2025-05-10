from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('events.urls')),  # Подключение URL приложения events
    path('api/', include('log_auth.urls')),  # Подключение URL аутентификации
]