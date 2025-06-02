from rest_framework import serializers
from .models import Event, Menu

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
    budget_type_display = serializers.CharField(source='get_budget_type_display', read_only=True)
    venue_type_display = serializers.CharField(source='get_venue_type_display', read_only=True)
    menu_items = MenuSerializer(many=True, read_only=True)  

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'budget_type', 'budget_type_display', 
            'venue_type', 'venue_type_display', 'venue_cost',
            'event_date', 'created_at', 'description', 'guests_count', 'menu_items'
        ]
        extra_kwargs = {
            'title': {'required': True, 'allow_blank': False},
            'budget_type': {'required': True},
            'event_date': {'required': True},
            'venue_cost': {'required': False, 'allow_null': True},
            'guests_count': {'required': False, 'allow_null': True},
            'description': {'required': False, 'allow_null': True}
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.venue_type != 'RENTED':
            data.pop('venue_cost', None) 
        return data

class EventUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['description', 'guests_count']  
        extra_kwargs = {
            'description': {'required': False, 'allow_null': True, 'allow_blank': True},
            'guests_count': {'required': False, 'allow_null': True}
        }
    





