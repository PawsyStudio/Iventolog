from rest_framework import generics, permissions
from .models import Event
from .serializers import EventSerializer

class EventListCreateView(generics.ListCreateAPIView):
    """Создание и просмотр мероприятий"""
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """Просмотр, обновление и удаление конкретного мероприятия"""
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(owner=self.request.user)