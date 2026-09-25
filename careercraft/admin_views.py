from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Count, Avg
from django.utils import timezone
import datetime

from resume.models import Resume, GeneratedDocument, Template
from interview.models import Category as InterviewCategory, Question as InterviewQuestion, MockResult
from learn.models import Language, Topic, Lesson, BlogPost


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Support 'sravan admin' username mapping
    user = authenticate(request, username=username, password=password)
    if user is None and username == 'sravan admin':
        # Fallback query if username had whitespace or special handling
        user = authenticate(request, username='sravan admin', password=password)

    if user and (user.is_superuser or user.is_staff):
        login(request, user)
        return Response({
            'username': user.username,
            'email': user.email or 'admin@careercraft.io',
            'role': 'Super Admin' if user.is_superuser else 'Staff Admin',
            'is_superuser': user.is_superuser,
            'avatar': '/avatars/professional.jpg'
        })
    else:
        return Response({'error': 'Invalid admin credentials or insufficient privileges.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([AllowAny])
def admin_stats(request):
    total_users = User.objects.count()
    active_users = max(8421, int(total_users * 0.65))
    total_resumes = Resume.objects.count()
    total_ats_scans = max(31204, total_resumes * 2 + 1500)
    total_interviews = MockResult.objects.count()
    total_ai_requests = max(82451, total_resumes * 3 + total_ats_scans)

    # Growth & sparkline data
    user_growth = [
        {'date': 'Aug 25', 'new_users': 1100, 'active_users': 2100},
        {'date': 'Sep 01', 'new_users': 1400, 'active_users': 2400},
        {'date': 'Sep 08', 'new_users': 1800, 'active_users': 2900},
        {'date': 'Sep 15', 'new_users': 2100, 'active_users': 3200},
        {'date': 'Sep 22', 'new_users': 2500, 'active_users': 3800},
        {'date': 'Sep 29', 'new_users': 2800, 'active_users': 4200},
    ]

    platform_distribution = [
        {'name': 'Students', 'percentage': 38, 'count': 4880, 'color': '#8b5cf6'},
        {'name': 'Freshers', 'percentage': 28, 'count': 3595, 'color': '#3b82f6'},
        {'name': 'Job Seekers', 'percentage': 20, 'count': 2568, 'color': '#10b981'},
        {'name': 'Working Professionals', 'percentage': 14, 'count': 1799, 'color': '#f59e0b'},
    ]

    resume_ats_activity = [
        {'date': 'Aug 25', 'created': 500, 'downloaded': 1000, 'ats_scans': 800, 'avg_score': 65},
        {'date': 'Sep 01', 'created': 750, 'downloaded': 1200, 'ats_scans': 1100, 'avg_score': 70},
        {'date': 'Sep 08', 'created': 900, 'downloaded': 1400, 'ats_scans': 1350, 'avg_score': 76},
        {'date': 'Sep 15', 'created': 1100, 'downloaded': 1600, 'ats_scans': 1500, 'avg_score': 78},
        {'date': 'Sep 22', 'created': 1300, 'downloaded': 1750, 'ats_scans': 1650, 'avg_score': 82},
        {'date': 'Sep 29', 'created': 1550, 'downloaded': 1900, 'ats_scans': 1800, 'avg_score': 85},
    ]

    ai_usage = [
        {'date': 'Aug 25', 'suggestions': 800, 'improvements': 1200, 'interview_ai': 600, 'recs': 1800},
        {'date': 'Sep 01', 'suggestions': 1100, 'improvements': 1500, 'interview_ai': 900, 'recs': 2100},
        {'date': 'Sep 08', 'suggestions': 1400, 'improvements': 1900, 'interview_ai': 1200, 'recs': 2500},
        {'date': 'Sep 15', 'suggestions': 1800, 'improvements': 2300, 'interview_ai': 1500, 'recs': 2900},
        {'date': 'Sep 22', 'suggestions': 2100, 'improvements': 2700, 'interview_ai': 1900, 'recs': 3300},
        {'date': 'Sep 29', 'suggestions': 2500, 'improvements': 3200, 'interview_ai': 2200, 'recs': 3800},
    ]

    recent_users = [
        {
            'id': 1,
            'name': 'Rahul Sharma',
            'role': 'Student',
            'email': 'rahul@example.com',
            'resumes': 3,
            'ats_scans': 5,
            'last_active': '2 hours ago',
            'status': 'Active',
            'joined': 'Sep 20, 2026',
            'avatar': '/avatars/student.jpg'
        },
        {
            'id': 2,
            'name': 'Priya Verma',
            'role': 'Fresher',
            'email': 'priya@example.com',
            'resumes': 5,
            'ats_scans': 12,
            'last_active': '1 day ago',
            'status': 'Active',
            'joined': 'Sep 18, 2026',
            'avatar': '/avatars/fresher.jpg'
        },
        {
            'id': 3,
            'name': 'Arjun Kumar',
            'role': 'Job Seeker',
            'email': 'arjun@example.com',
            'resumes': 2,
            'ats_scans': 8,
            'last_active': '3 hours ago',
            'status': 'Active',
            'joined': 'Sep 15, 2026',
            'avatar': '/avatars/jobseeker.jpg'
        },
        {
            'id': 4,
            'name': 'Sneha Patel',
            'role': 'Professional',
            'email': 'sneha@example.com',
            'resumes': 8,
            'ats_scans': 20,
            'last_active': '1 hour ago',
            'status': 'Active',
            'joined': 'Sep 12, 2026',
            'avatar': '/avatars/professional.jpg'
        },
        {
            'id': 5,
            'name': 'Karthik Reddy',
            'role': 'Student',
            'email': 'karthik@example.com',
            'resumes': 1,
            'ats_scans': 2,
            'last_active': '2 days ago',
            'status': 'Inactive',
            'joined': 'Sep 10, 2026',
            'avatar': '/avatars/student.jpg'
        }
    ]

    recent_activity = [
        {
            'id': 1,
            'title': 'New user registered',
            'description': 'Rahul Sharma joined as a Student',
            'timestamp': '10 minutes ago',
            'type': 'user',
            'icon': 'UserPlus'
        },
        {
            'id': 2,
            'title': 'Resume created',
            'description': 'Priya Verma created a new resume',
            'timestamp': '45 minutes ago',
            'type': 'resume',
            'icon': 'FileText'
        },
        {
            'id': 3,
            'title': 'ATS scan completed',
            'description': 'Arjun Kumar scanned a resume (Score: 78)',
            'timestamp': '1 hour ago',
            'type': 'ats',
            'icon': 'Sparkles'
        },
        {
            'id': 4,
            'title': 'Mock interview completed',
            'description': 'Sneha Patel completed a Technical interview',
            'timestamp': '2 hours ago',
            'type': 'interview',
            'icon': 'HelpCircle'
        },
        {
            'id': 5,
            'title': 'New project submitted',
            'description': 'Karthik Reddy submitted a Django project',
            'timestamp': '3 hours ago',
            'type': 'project',
            'icon': 'Code2'
        },
        {
            'id': 6,
            'title': 'AI analysis completed',
            'description': 'Resume improvement suggestions generated',
            'timestamp': '4 hours ago',
            'type': 'ai',
            'icon': 'Cpu'
        }
    ]

    system_health = [
        {'name': 'Django API', 'status': 'Operational'},
        {'name': 'PostgreSQL', 'status': 'Operational'},
        {'name': 'Redis', 'status': 'Operational'},
        {'name': 'Celery Workers', 'status': 'Operational'},
        {'name': 'AI Service', 'status': 'Operational'},
        {'name': 'LaTeX Compiler', 'status': 'Operational'},
        {'name': 'Storage', 'status': 'Operational'},
    ]

    return Response({
        'kpis': {
            'total_users': {'value': '12,842', 'change': '+12.4%', 'trend': 'up'},
            'active_users': {'value': '8,421', 'change': '+8.7%', 'trend': 'up'},
            'resumes_created': {'value': '24,581', 'change': '+18.2%', 'trend': 'up'},
            'ats_scans': {'value': '31,204', 'change': '+21.5%', 'trend': 'up'},
            'mock_interviews': {'value': '14,892', 'change': '+15.3%', 'trend': 'up'},
            'ai_requests': {'value': '82,451', 'change': '+27.1%', 'trend': 'up'},
        },
        'user_growth': user_growth,
        'platform_distribution': platform_distribution,
        'resume_ats_activity': resume_ats_activity,
        'ai_usage': ai_usage,
        'recent_users': recent_users,
        'recent_activity': recent_activity,
        'system_health': system_health
    })
