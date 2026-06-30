from rest_framework import viewsets, views
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Keyword
from .serializers import KeywordSerializer, ColumnConfigSerializer, COLUMN_CONFIG
from .filters import KeywordFilter
from .ordering import SortByOrderingFilter
from .pagination import FlexiblePageNumberPagination

# Fields returned for each row — excludes heavy/unused fields for performance.
_LIST_FIELDS = (
    'id', 'keyword', 'monthly_searches', 'clicks', 'impressions',
    'ctr', 'rank', 'previous_rank', 'landing_page',
    'category', 'status', 'device_type', 'source_type',
    'is_priority', 'created_at',
)


class KeywordViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = KeywordSerializer
    pagination_class = FlexiblePageNumberPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, SortByOrderingFilter]
    filterset_class = KeywordFilter
    search_fields = ['keyword', 'landing_page']
    ordering_fields = [
        'keyword', 'monthly_searches', 'clicks', 'impressions',
        'ctr', 'rank', 'previous_rank', 'category', 'status',
        'device_type', 'source_type', 'is_priority', 'created_at',
    ]
    ordering = ['-clicks']

    def get_queryset(self):
        return Keyword.objects.only(*_LIST_FIELDS)


class ColumnConfigView(views.APIView):
    """Returns the data-driven column definition for the keyword table."""

    def get(self, request):
        serializer = ColumnConfigSerializer(COLUMN_CONFIG, many=True)
        return Response(serializer.data)
