from django.db.models import Sum, Avg, Count, Q
from rest_framework import views
from rest_framework.response import Response

from apps.keywords.models import Keyword
from apps.keywords.filters import KeywordFilter
from .models import DailyMetric
from .serializers import DailyMetricSerializer, SummarySerializer

class SummaryView(views.APIView):
    """
    summary cards
    Accepts the same filter/search params as the keyword list so the widgets
    update in sync with the table.
    """

    def get(self, request):
        qs = Keyword.objects.all()

        filterset = KeywordFilter(request.GET, queryset=qs)
        if filterset.is_valid():
            qs = filterset.qs

        search = request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(keyword__icontains=search)

        agg = qs.aggregate(
            total_records=Count('id'),
            total_clicks=Sum('clicks'),
            total_impressions=Sum('impressions'),
            avg_ctr=Avg('ctr'),
            avg_rank=Avg('rank'),
            priority_keywords=Count('id', filter=Q(is_priority=True)),
        )

        serializer = SummarySerializer({
            'total_records': agg['total_records'] or 0,
            'total_clicks': agg['total_clicks'] or 0,
            'total_impressions': agg['total_impressions'] or 0,
            'avg_ctr': agg['avg_ctr'],
            'avg_rank': agg['avg_rank'],
            'priority_keywords': agg['priority_keywords'] or 0,
        })
        return Response(serializer.data)


class ChartView(views.APIView):
    """
    Time-series data for the Insights Chart.
    Accepts date_from / date_to to slice the visible range.
    """

    def get(self, request):
        qs = DailyMetric.objects.all()

        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')

        if date_from:
            qs = qs.filter(date__gte=date_from)
        if date_to:
            qs = qs.filter(date__lte=date_to)

        serializer = DailyMetricSerializer(qs, many=True)
        return Response(serializer.data)
