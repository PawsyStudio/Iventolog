from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import IventlogUser
from django.utils.translation import gettext_lazy as _

class CustomUserAdmin(UserAdmin):
    model = IventlogUser
    list_display = ('email', 'username', 'telegram_id', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('username', 'telegram_id')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'telegram_id', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'username', 'telegram_id')
    ordering = ('email',)

admin.site.register(IventlogUser, CustomUserAdmin)