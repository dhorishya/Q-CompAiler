from django.urls import path
from .views import cluster_questions

urlpatterns = [
    path('cluster/', cluster_questions),
]
