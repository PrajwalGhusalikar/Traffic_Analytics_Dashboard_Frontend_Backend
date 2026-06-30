from django.urls import path
from .views import SummaryView, ChartView

urlpatterns = [
    path('summary/', SummaryView.as_view(), name='dashboard-summary'),
    path('chart/', ChartView.as_view(), name='dashboard-chart'),
]
