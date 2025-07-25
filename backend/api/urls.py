from django.urls import path
from .views import cluster_questions, ocr_scan

urlpatterns = [
    path('cluster/', cluster_questions),
    path('ocr/', ocr_scan),
]
