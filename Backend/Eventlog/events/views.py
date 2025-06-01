from rest_framework import generics, permissions
from .models import Event
from .serializers import EventSerializer, EventUpdateSerializer
from rest_framework.renderers import JSONRenderer

class EventListCreateView(generics.ListCreateAPIView):
    renderer_classes = [JSONRenderer]  # Явно указываем JSON-рендерер
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(owner=self.request.user).order_by('-created_at')  # Сортировка по дате

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return EventUpdateSerializer  # Для обновления - ограниченный сериализатор
        return EventSerializer  # Для остальных методов - полный

    def get_queryset(self):
        return Event.objects.filter(owner=self.request.user)