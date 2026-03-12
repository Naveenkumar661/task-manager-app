from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'status', 'priority', 'deadline', 'created_at']
    list_filter = ['status', 'priority']
    search_fields = ['title', 'user__username']
