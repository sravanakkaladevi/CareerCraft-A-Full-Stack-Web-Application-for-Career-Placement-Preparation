from django.urls import path
from . import views

urlpatterns = [
    path('', views.resume_home, name='resume_home'),
    path('download/', views.download_pdf, name='download_pdf'),
    path('ats/', views.ats_analyzer, name='ats_analyzer'),
    path('export-resumeforge/', views.export_to_resumeforge, name='export_to_resumeforge'),
]