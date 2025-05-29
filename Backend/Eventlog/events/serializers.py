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
            'event_date', 'created_at'  # Добавил event_date!
        ]
        extra_kwargs = {
            'title': {'required': True, 'allow_blank': False},
            'budget_type': {'required': True},
            'event_date': {'required': True},  # Обязательное поле!
            'venue_cost': {'required': False, 'allow_null': True}
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Показываем venue_cost только для аренды
        if instance.venue_type != 'RENTED':
            data.pop('venue_cost', None)  # Полностью убираем поле из ответа
        return data
