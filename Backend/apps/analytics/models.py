from django.db import models


class DailyMetric(models.Model):

    date = models.DateField(unique=True, db_index=True)
    total_clicks = models.IntegerField(default=0)
    total_impressions = models.IntegerField(default=0)
    avg_ctr = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    avg_rank = models.FloatField(default=0.0)
    active_users = models.IntegerField(default=0)
    new_users = models.IntegerField(default=0)
    engagement_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f'Metrics {self.date}'
