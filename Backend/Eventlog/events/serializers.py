from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    budget_type_display = serializers.CharField(source='get_budget_type_display', read_only=True)
    venue_type_display = serializers.CharField(source='get_venue_type_display', read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'budget_type', 'budget_type_display', 
            'venue_type', 'venue_type_display', 'venue_cost',
            'event_date', 'created_at', 'description', 'guests_count'
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
        fields = ['description', 'guests_count']  # Только эти поля можно обновлять
        extra_kwargs = {
            'description': {'required': False, 'allow_null': True, 'allow_blank': True},
            'guests_count': {'required': False, 'allow_null': True}
        }
    def validate(self, data):
        # Получаем текущие значения из БД
        instance = self.instance
        if 'description' not in data:
            data['description'] = instance.description
        if 'guests_count' not in data:
            data['guests_count'] = instance.guests_count
        return data

    def update(self, instance, validated_data):
        # Устанавливаем дефолтные значения, если поля не переданы
        if 'description' not in validated_data:
            validated_data['description'] = None
        if 'guests_count' not in validated_data:
            validated_data['guests_count'] = None
            
        return super().update(instance, validated_data)
