from rest_framework import serializers
from .models import DailyMetric


class DailyMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyMetric
        fields = [
            'date', 'total_clicks', 'total_impressions',
            'avg_ctr', 'avg_rank', 'active_users', 'new_users', 'engagement_rate',
        ]


class SummarySerializer(serializers.Serializer):
    total_records = serializers.IntegerField()
    total_clicks = serializers.IntegerField()
    total_impressions = serializers.IntegerField()
    avg_ctr = serializers.DecimalField(max_digits=6, decimal_places=2, allow_null=True)
    avg_rank = serializers.FloatField(allow_null=True)
    priority_keywords = serializers.IntegerField()
