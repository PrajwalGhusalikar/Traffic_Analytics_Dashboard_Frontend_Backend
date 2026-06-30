from django.contrib import admin
from .models import Annotation


@admin.register(Annotation)
class AnnotationAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'annotation_type', 'created_by', 'created_at']
    list_filter = ['annotation_type']
    ordering = ['-date']
