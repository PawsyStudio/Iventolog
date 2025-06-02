from django.contrib import admin
from events.models import Event, Menu

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'budget_type', 'venue_type', 'owner', 'event_date', 'created_at')  # Добавил event_date и venue_type
    list_filter = ('budget_type', 'venue_type', 'created_at')  # Добавил venue_type в фильтры
    search_fields = ('title', 'owner__username')
    readonly_fields = ('created_at',)  # Чтобы дата создания не редактировалась, мудак
    list_select_related = ('owner',)  # Оптимизация запросов, ты же не хочешь тормозов?

    # Если хочешь, чтобы дата отображалась в человеческом формате
    def formatted_event_date(self, obj):
        return obj.event_date.strftime('%d.%m.%Y --:--') if obj.event_date else "—"
    formatted_event_date.short_description = 'Дата мероприятия (дд.мм.гггг --:--)'
    
    # Если хочешь добавить кастомное отображение стоимости аренды только для rent
    def display_venue_cost(self, obj):
        return obj.venue_cost if obj.venue_type == 'rent' else "—"
    display_venue_cost.short_description = 'Стоимость аренды'

    # Можно добавить это в list_display, если хочешь
    list_display = ('title', 'budget_type', 'venue_type', 'owner', 'formatted_event_date', 'display_venue_cost', 'created_at')

