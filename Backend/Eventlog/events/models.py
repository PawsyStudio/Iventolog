from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator


User = get_user_model()

class Event(models.Model):
    
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

    event_date = models.DateTimeField(
    verbose_name="Дата мероприятия",
    help_text="Формат: YYYY-MM-DDTHH:MM"
    )   
    
    title = models.CharField('Название', max_length=255)

    venue_type = models.CharField(
        'Место проведения',
        max_length=20,
        choices=PLACES,
        default = 'OWN'
    )

    venue_cost = models.CharField(
        'Стоимость Аренды',
        null=True,  
        blank=True,  
        default=0   
        )

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='events',
        verbose_name='Организатор'
    )
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)

    total_per_person = models.FloatField(
        'Общая за чел.',
        null=True,  
        blank=True,
        )

    total_overall = models.FloatField(
        'Общая общая сумма',
        null=True,  
        blank=True,
        )

    purchases_per_person = models.FloatField(
        'За покупки с чел.',
        null=True,  
        blank=True,
        )

    purchases_overall = models.FloatField(
        'За покупки общая сумма',
        null=True,  
        blank=True,
        )

    venue_per_person = models.FloatField(
        'За помещение с чел.',
        null=True,  
        blank=True,
        )

    venue_overall = models.FloatField(
        'За помещение общая сумма',
        null=True,  
        blank=True,
        )
    allow_menu_selection = models.BooleanField('Разрешить выбор меню', default=False)

    poll_deadline = models.DateTimeField('Дата окончания опроса', null=True, blank=True)

    class Meta:
        verbose_name = 'Мероприятие'
        verbose_name_plural = 'Мероприятия'
        ordering = ['-created_at']

    

    def __str__(self):
        return f'{self.title}'


class Menu(models.Model):

    name = models.CharField(
        'Название товара',
        max_length=20,
        )

    price = models.IntegerField(
        'Цена товара'
        )

    quantity_per_person = models.FloatField(
        'Кол-во на человека'
        )

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='menu_items',
        verbose_name='Мероприятие'
    )

    def __str__(self):
        return f'{self.name}'

class Guest(models.Model):

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='guests',
        verbose_name='Мероприятие'
    )
    full_name = models.CharField('Полное имя', max_length=255)

    telegram_id = models.CharField('Telegram ID', max_length=100)

    class Meta:
        verbose_name = 'Гость'
        verbose_name_plural = 'Гости'
        unique_together = ('event', 'telegram_id')

    def __str__(self):
        return f'{self.full_name} ({self.telegram_id})'