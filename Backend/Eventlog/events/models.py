from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Event(models.Model):
    BUDGET_TYPES = [
        ('solo', 'Соло'),
        ('group', 'Групповой'), 
    ]
    
    name = models.CharField('Название', max_length=255)
    budget_type = models.CharField(
        'Тип бюджета', 
        max_length=20, 
        choices=BUDGET_TYPES,
        default='solo'
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='events',
        verbose_name='Организатор'
    )
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)

    class Meta:
        verbose_name = 'Мероприятие'
        verbose_name_plural = 'Мероприятия'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} ({self.get_budget_type_display()})'