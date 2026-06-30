from rest_framework import serializers
from .models import Keyword

COLUMN_CONFIG = [
    {'key': 'keyword',        'label': 'Keyword',         'sortable': True,  'required': True,  'visible': True,  'width': 260},
    {'key': 'monthly_searches','label': 'Monthly Searches','sortable': True,  'required': False, 'visible': True,  'width': 160},
    {'key': 'clicks',         'label': 'Clicks',          'sortable': True,  'required': False, 'visible': True,  'width': 100},
    {'key': 'impressions',    'label': 'Impressions',     'sortable': True,  'required': False, 'visible': True,  'width': 120},
    {'key': 'ctr',            'label': 'CTR (%)',         'sortable': True,  'required': False, 'visible': True,  'width': 100},
    {'key': 'rank',           'label': 'Current Rank',   'sortable': True,  'required': False, 'visible': True,  'width': 130},
    {'key': 'previous_rank',  'label': 'Previous Rank',  'sortable': True,  'required': False, 'visible': False, 'width': 130},
    {'key': 'landing_page',   'label': 'Landing Page',   'sortable': False, 'required': False, 'visible': True,  'width': 220},
    {'key': 'category',       'label': 'Category',       'sortable': True,  'required': False, 'visible': True,  'width': 130},
    {'key': 'status',         'label': 'Status',         'sortable': True,  'required': False, 'visible': False, 'width': 100},
    {'key': 'device_type',    'label': 'Device Type',    'sortable': True,  'required': False, 'visible': False, 'width': 120},
    {'key': 'source_type',    'label': 'Source Type',    'sortable': True,  'required': False, 'visible': False, 'width': 120},
    {'key': 'is_priority',    'label': 'Priority',       'sortable': True,  'required': False, 'visible': False, 'width': 90},
    {'key': 'created_at',     'label': 'Created',        'sortable': True,  'required': False, 'visible': False, 'width': 160},
]


class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = [
            'id', 'keyword', 'monthly_searches', 'clicks', 'impressions',
            'ctr', 'rank', 'previous_rank', 'landing_page',
            'category', 'status', 'device_type', 'source_type',
            'is_priority', 'created_at',
        ]


class ColumnConfigSerializer(serializers.Serializer):
    key = serializers.CharField()
    label = serializers.CharField()
    sortable = serializers.BooleanField()
    required = serializers.BooleanField()
    visible = serializers.BooleanField()
    width = serializers.IntegerField()
