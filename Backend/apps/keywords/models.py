from django.db import models

class Keyword(models.Model):
    CATEGORY_CHOICES = [
        ('informational', 'Informational'),
        ('navigational', 'Navigational'),
        ('transactional', 'Transactional'),
        ('commercial', 'Commercial'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('pending', 'Pending'),
    ]
    DEVICE_TYPE_CHOICES = [
        ('desktop', 'Desktop'),
        ('mobile', 'Mobile'),
        ('tablet', 'Tablet'),
    ]
    SOURCE_TYPE_CHOICES = [
        ('organic', 'Organic'),
        ('paid', 'Paid'),
        ('direct', 'Direct'),
        ('referral', 'Referral'),
    ]

    keyword = models.CharField(max_length=500, db_index=True)
    monthly_searches = models.IntegerField(null=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='informational', db_index=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active', db_index=True)
    rank = models.FloatField(null=True, blank=True, db_index=True)
    previous_rank = models.FloatField(null=True, blank=True)
    device_type = models.CharField(max_length=10, choices=DEVICE_TYPE_CHOICES, default='desktop', db_index=True)
    source_type = models.CharField(max_length=10, choices=SOURCE_TYPE_CHOICES, default='organic', db_index=True)
    clicks = models.IntegerField(default=0, db_index=True)
    impressions = models.IntegerField(default=0)
    ctr = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    landing_page = models.URLField(max_length=2000, blank=True)
    is_priority = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['category', 'status']),
            models.Index(fields=['device_type', 'source_type']),
            models.Index(fields=['rank', 'clicks']),
        ]
        ordering = ['-clicks']

    def __str__(self):
        return self.keyword
