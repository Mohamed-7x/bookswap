from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


# Register your models here.
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'city', 'rating', 'total_exchanges']
    fieldsets = UserAdmin.fieldsets + (
        ('Profile', {'fields': ('bio', 'city', 'avatar', 'rating', 'total_exchanges')}),
    )