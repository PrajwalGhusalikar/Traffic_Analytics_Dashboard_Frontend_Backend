import django_filters
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Annotation
from .serializers import AnnotationSerializer


class AnnotationFilter(django_filters.FilterSet):
    date_from = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    annotation_type = django_filters.MultipleChoiceFilter(choices=Annotation.TYPE_CHOICES)

    class Meta:
        model = Annotation
        fields = ['date_from', 'date_to', 'annotation_type']


class AnnotationViewSet(viewsets.ModelViewSet):
    """Full CRUD for chart annotations."""
    queryset = Annotation.objects.all()
    serializer_class = AnnotationSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = AnnotationFilter
    ordering_fields = ['date', 'created_at', 'title', 'annotation_type']
    ordering = ['date']
    pagination_class = None  