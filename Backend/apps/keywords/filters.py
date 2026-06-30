import django_filters
from .models import Keyword


class KeywordFilter(django_filters.FilterSet):
    category = django_filters.MultipleChoiceFilter(choices=Keyword.CATEGORY_CHOICES)
    status = django_filters.MultipleChoiceFilter(choices=Keyword.STATUS_CHOICES)
    device_type = django_filters.MultipleChoiceFilter(choices=Keyword.DEVICE_TYPE_CHOICES)
    source_type = django_filters.MultipleChoiceFilter(choices=Keyword.SOURCE_TYPE_CHOICES)
    rank_min = django_filters.NumberFilter(field_name='rank', lookup_expr='gte')
    rank_max = django_filters.NumberFilter(field_name='rank', lookup_expr='lte')
    is_priority = django_filters.BooleanFilter()

    class Meta:
        model = Keyword
        fields = ['category', 'status', 'device_type', 'source_type', 'rank_min', 'rank_max', 'is_priority']
