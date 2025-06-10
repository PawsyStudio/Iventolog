from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Event, Menu, Guest
from .serializers import EventSerializer, EventUpdateSerializer, MenuSerializer, EventBudgetSerializer, GuestSerializer, PollSettingsSerializer, EventTitleSerializer
from rest_framework.renderers import JSONRenderer
from rest_framework.exceptions import ValidationError
from rest_framework import status

class EventListCreateView(generics.ListCreateAPIView):
    renderer_classes = [JSONRenderer]  
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(owner=self.request.user).order_by('-created_at')  

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    
    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return EventUpdateSerializer 
        return EventSerializer 

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
    lookup_field = 'item_id'  

    def get_queryset(self):
        return Menu.objects.filter(
            event__owner=self.request.user,
            event_id=self.kwargs['event_id']
        )

class EventBudgetView(generics.RetrieveAPIView):
    serializer_class = EventBudgetSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'  

    def get_object(self):
        event_id = self.kwargs.get('event_id')
        return generics.get_object_or_404(
            Event.objects.filter(owner=self.request.user),
            pk=event_id
        )

    def retrieve(self, request, *args, **kwargs):
        event = self.get_object()
        
        menu_items = event.menu_items.all()
        purchases_total = sum(
            item.price * item.quantity_per_person * (event.guests_count or 0)
            for item in menu_items
        )
        
        venue_total = float(event.venue_cost) if event.venue_type == 'RENTED' and event.venue_cost else 0
        
        overall_total = purchases_total + venue_total
        
        guests = event.guests_count or 0
        per_person = {
            'purchases': purchases_total / guests if guests > 0 else 0,
            'venue': venue_total / guests if guests > 0 else 0,
            'total': overall_total / guests if guests > 0 else 0,
        }
        
        event.purchases_per_person = per_person['purchases']
        event.purchases_overall = purchases_total
        event.venue_per_person = per_person['venue']
        event.venue_overall = venue_total
        event.total_per_person = per_person['total']
        event.total_overall = overall_total
        event.save()
        
        serializer = self.get_serializer(event)
        return Response(serializer.data)

# views.py
class GuestListView(generics.ListCreateAPIView):
    serializer_class = GuestSerializer
    permission_classes = [permissions.AllowAny]

    def get_event(self):
        return generics.get_object_or_404(
            Event.objects.all(),
            pk=self.kwargs['event_id']
        )

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Guest.objects.filter(event_id=self.kwargs['event_id'])
        return Guest.objects.none()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['event'] = self.get_event()
        return context

    def perform_create(self, serializer):
        event = self.get_event()
        serializer.save(event=event)
        event.guests_count = Guest.objects.filter(event=event).count()
        event.save()

class GuestRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    serializer_class = GuestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Guest.objects.filter(
            event__owner=self.request.user,
            event_id=self.kwargs['event_id']
        )

class PollSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = PollSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return generics.get_object_or_404(
            Event.objects.filter(owner=self.request.user),
            pk=self.kwargs['event_id']
        )

class EventTitleView(generics.RetrieveAPIView):
    serializer_class = EventTitleSerializer
    permission_classes = [permissions.AllowAny]  
    
    def get_object(self):
        event_id = self.kwargs.get('event_id')
        return generics.get_object_or_404(Event, pk=event_id)