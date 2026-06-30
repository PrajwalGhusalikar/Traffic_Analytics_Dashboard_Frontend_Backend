from django.contrib import admin
from .models import DailyMetric


@admin.register(DailyMetric)
class DailyMetricAdmin(admin.ModelAdmin):
    list_display = ['date', 'total_clicks', 'total_impressions', 'avg_ctr', 'avg_rank', 'active_users', 'new_users', 'engagement_rate']
    ordering = ['-date']
