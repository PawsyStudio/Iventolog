from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    budget_type_display = serializers.CharField(
        source='get_budget_type_display', 
        read_only=True
    )
    
    class Meta:
        model = Event
        fields = ['id', 'name', 'budget_type', 'budget_type_display', 'created_at']
        extra_kwargs = {
            'name': {
                'required': True,
                'allow_blank': False,
                'error_messages': {
                    'required': 'Название мероприятия обязательно',
                    'blank': 'Название не может быть пустым'
                }
            },
            'budget_type': {
                'required': True,
                'error_messages': {
                    'required': 'Выберите тип бюджета',
                    'invalid_choice': 'Допустимые значения: solo или group'
                }
            }
        }