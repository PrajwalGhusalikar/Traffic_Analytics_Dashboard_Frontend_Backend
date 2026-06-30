from rest_framework import serializers
from .models import Annotation


class AnnotationSerializer(serializers.ModelSerializer):
    annotation_type_display = serializers.CharField(source='get_annotation_type_display', read_only=True)

    class Meta:
        model = Annotation
        fields = [
            'id', 'date', 'title', 'description',
            'annotation_type', 'annotation_type_display',
            'created_by', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'annotation_type_display']
