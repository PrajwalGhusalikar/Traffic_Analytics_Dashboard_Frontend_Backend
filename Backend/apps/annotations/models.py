from django.db import models


class Annotation(models.Model):
    TYPE_CHOICES = [
        ('algorithm_update', 'Google Algorithm Update'),
        ('seo_campaign', 'SEO Campaign Launch'),
        ('website_migration', 'Website Migration'),
        ('content_release', 'Content Release'),
        ('product_launch', 'Product Launch'),
        ('other', 'Other'),
    ]

    date = models.DateField(db_index=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    annotation_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='other')
    created_by = models.CharField(max_length=100, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f'{self.title} ({self.date})'
