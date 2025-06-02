from rest_framework import generics, permissions
from .models import Event, Menu
from .serializers import EventSerializer, EventUpdateSerializer, MenuSerializer
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


class MenuListCreateView(generics.ListCreateAPIView):
    serializer_class = MenuSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Menu.objects.filter(
            event_id=self.kwargs['event_id'],
            event__owner=self.request.user
        ).order_by('id')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['event'] = generics.get_object_or_404(
            Event.objects.filter(owner=self.request.user),
            pk=self.kwargs['event_id']
        )
        return context

class MenuRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    serializer_class = MenuSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'item_id'  # Используем item_id вместо pk

    def get_queryset(self):
        return Menu.objects.filter(
            event__owner=self.request.user,
            event_id=self.kwargs['event_id']
        )
