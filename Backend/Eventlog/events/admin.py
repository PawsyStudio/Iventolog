from django.contrib import admin
from events.models import Event, Menu

class MenuInline(admin.TabularInline):
    model = Menu
    extra = 0  # Не показывать дополнительные пустые формы
    fields = ('name', 'price', 'quantity_per_person')  # Только эти поля
    readonly_fields = fields  # Только для просмотра (без редактирования)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'budget_type', 'venue_type', 'owner', 'formatted_event_date', 'display_venue_cost', 'created_at')  
    list_filter = ('budget_type', 'venue_type', 'created_at')  
    search_fields = ('title', 'owner__username')
    readonly_fields = ('created_at',)
    list_select_related = ('owner',)
    inlines = [MenuInline]  # Единственное добавление к вашему коду

    def formatted_event_date(self, obj):
        return obj.event_date.strftime('%d.%m.%Y --:--') if obj.event_date else "—"
    formatted_event_date.short_description = 'Дата мероприятия (дд.мм.гггг --:--)'
    
    def display_venue_cost(self, obj):
        return obj.venue_cost if obj.venue_type == 'rent' else "—"
    display_venue_cost.short_description = 'Стоимость аренды'