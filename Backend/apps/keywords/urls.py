from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import KeywordViewSet, ColumnConfigView

router = DefaultRouter()
router.register(r'', KeywordViewSet, basename='keyword')

urlpatterns = [

    path('columns/', ColumnConfigView.as_view(), name='keyword-columns'),
    path('', include(router.urls)),
]
