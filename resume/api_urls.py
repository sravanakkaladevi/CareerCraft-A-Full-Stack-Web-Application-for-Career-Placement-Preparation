from django.urls import path
from . import api_views

urlpatterns = [
    # Auth
    path('auth/register/', api_views.api_register, name='api_register'),
    path('auth/login/', api_views.api_login, name='api_login'),
    path('auth/logout/', api_views.api_logout, name='api_logout'),
    path('auth/me/', api_views.api_me, name='api_me'),

    # Resumes
    path('resumes/', api_views.resume_list_create, name='api_resume_list_create'),
    path('resumes/<uuid:pk>/', api_views.resume_detail, name='api_resume_detail'),
    path('resumes/<uuid:pk>/duplicate/', api_views.resume_duplicate, name='api_resume_duplicate'),
    path('resumes/<uuid:pk>/versions/', api_views.resume_versions, name='api_resume_versions'),
    path('resumes/<uuid:pk>/versions/<int:version_id>/restore/', api_views.restore_version, name='api_restore_version'),

    # Templates
    path('templates/', api_views.template_list, name='api_template_list'),

    # PDF Document Compilation
    path('resumes/<uuid:pk>/generate/', api_views.generate_pdf, name='api_generate_pdf'),
    path('documents/<uuid:doc_id>/', api_views.document_detail, name='api_document_detail'),
    path('documents/<uuid:doc_id>/status/', api_views.document_status, name='api_document_status'),
    path('documents/<uuid:doc_id>/download/', api_views.download_pdf, name='api_download_pdf'),

    # Job Analysis
    path('job-analysis/', api_views.analyze_job, name='api_analyze_job'),
    path('job-analysis/<int:pk>/', api_views.get_job_analysis, name='api_get_job_analysis'),
]
