from django.urls import path, include
from . import api_views, admin_views

urlpatterns = [
    # Include resume APIs (Auth, Resumes, PDF compilation, Job Analysis)
    path('', include('resume.api_urls')),

    # Admin Control APIs
    path('admin/login/', admin_views.admin_login, name='api_admin_login'),
    path('admin/stats/', admin_views.admin_stats, name='api_admin_stats'),

    # Unified CareerCraft Module APIs
    path('dashboard/stats/', api_views.dashboard_stats, name='api_dashboard_stats'),
    path('ats/analyze/', api_views.ats_analyze_api, name='api_ats_analyze'),
    
    # Interview APIs
    path('interview/categories/', api_views.interview_categories, name='api_interview_categories'),
    path('interview/questions/<int:category_id>/', api_views.interview_questions, name='api_interview_questions'),
    path('interview/submit/', api_views.interview_submit, name='api_interview_submit'),

    # Skill Assessment APIs
    path('assessment/domains/', api_views.assessment_domains, name='api_assessment_domains'),

    # Learn APIs
    path('learn/languages/', api_views.learn_languages, name='api_learn_languages'),
    path('learn/topics/<int:lang_id>/', api_views.learn_topics, name='api_learn_topics'),
    path('learn/lessons/<int:lesson_id>/', api_views.learn_lesson_detail, name='api_learn_lesson_detail'),
    path('learn/blogs/', api_views.learn_blogs, name='api_learn_blogs'),
]
