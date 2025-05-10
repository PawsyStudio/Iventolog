from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'budget_type', 'owner', 'created_at')
    list_filter = ('budget_type', 'created_at')
    search_fields = ('name', 'owner__username')