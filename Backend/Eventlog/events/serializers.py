from rest_framework import serializers
from .models import Event, Menu, Guest

class MenuSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Menu
        fields = ['id','name','price','quantity_per_person','event']
        extra_kwargs = {
            'name': {'required': True},
            'price':{'required': True},
            'quantity_per_person': {'required': True},
            'event':{'read_only': True}
            }

    def create(self, validated_data):
        validated_data['event'] = self.context['event']
        return super().create(validated_data)
    
class EventSerializer(serializers.ModelSerializer):
    venue_type_display = serializers.CharField(source='get_venue_type_display', read_only=True)
    menu_items = MenuSerializer(many=True, read_only=True)  

    class Meta:
        model = Event
        fields = [
            'id', 'title', 
            'venue_type', 'venue_type_display', 'venue_cost',
            'event_date', 'created_at', 'guests_count', 'menu_items'
        ]
        extra_kwargs = {
            'title': {'required': True, 'allow_blank': False},
            'event_date': {'required': True},
            'venue_cost': {'required': False, 'allow_null': True},
            'guests_count': {'required': False, 'allow_null': True},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.venue_type != 'RENTED':
            data.pop('venue_cost', None) 
        return data

class EventUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'guests_count','venue_type','venue_cost','event_date']  
        extra_kwargs = {
            'guests_count': {'required': False, 'allow_null': True},
            'title': {'required': False, 'allow_null': True},
            'venue_type': {'required': False, 'allow_null': True},
            "venue_cost": {'required': False, 'allow_null': True},
            'event_date': {'required': False, 'allow_null': True},
        }
    
class EventBudgetSerializer(serializers.ModelSerializer):
    venue_type_display = serializers.CharField(source='get_venue_type_display', read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'total_per_person', 'total_overall',
            'purchases_per_person', 'purchases_overall',
            'venue_per_person', 'venue_overall',
            'venue_type', 'venue_type_display',
            'guests_count'
        ]

# serializers.py
class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = ['full_name', 'telegram_id']
        extra_kwargs = {
            'full_name': {'required': True},
            'telegram_id': {'required': True}
        }

class PollSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['allow_menu_selection', 'poll_deadline']
        extra_kwargs = {
            'allow_menu_selection': {'required': False},
            'poll_deadline': {'required': False}
        }




