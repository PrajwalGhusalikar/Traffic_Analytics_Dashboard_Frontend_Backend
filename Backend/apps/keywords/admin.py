from django.contrib import admin
from .models import Keyword


@admin.register(Keyword)
class KeywordAdmin(admin.ModelAdmin):
    list_display = ['keyword', 'category', 'status', 'rank', 'clicks', 'impressions', 'ctr', 'device_type', 'is_priority']
    list_filter = ['category', 'status', 'device_type', 'source_type', 'is_priority']
    search_fields = ['keyword']
    ordering = ['-clicks']
