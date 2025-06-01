from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator


User = get_user_model()

class Event(models.Model):
    BUDGET_TYPES = [
        ('SOLO', 'Соло'),
        ('GROUP', 'Групповой'), 
    ]

    PLACES = [
        ('OWN','Своё'),
        ('RENTED','Аренда'),
    ]

    guests_count = models.IntegerField(
        'Число гостей', 
        null=True, 
        blank=True,
        default=0
        )

    description = models.CharField(
        'Описание',
        max_length=2000,                            
        null=True,
        blank=True,
        default=''
        )

    event_date = models.DateTimeField(
    verbose_name="Дата мероприятия",
    help_text="Формат: YYYY-MM-DDTHH:MM"
    )   
    
    title = models.CharField('Название', max_length=255)

    budget_type = models.CharField(
        'Тип бюджета', 
        max_length=20, 
        choices=BUDGET_TYPES,
        default='SOLO'
    )

    venue_type = models.CharField(
        'Место проведения',
        max_length=20,
        choices=PLACES,
        default = 'OWN'
    )

    venue_cost = models.CharField(
        'Стоимость Аренды',
        null=True,  # Разрешаем NULL
        blank=True,  # Разрешаем пустое значение
        default=0    # Дефолтное значение
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
        return f'{self.title} ({self.get_budget_type_display()})'