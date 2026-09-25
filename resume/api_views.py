import re
import os
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse, Http404, FileResponse
from django.shortcuts import get_object_or_404
from pathlib import Path

from .models import (
    Template, Resume, PersonalInfo, Education, Experience, Project,
    SkillCategory, Certification, CustomSection, ResumeVersion,
    GeneratedDocument, JobDescription, JobAnalysis
)
from .serializers import (
    UserSerializer, TemplateSerializer, ResumeSerializer, ResumeVersionSerializer,
    GeneratedDocumentSerializer, JobDescriptionSerializer, JobAnalysisSerializer
)
from .pdf_generator import compile_pdf_document

# Seed 3 initial templates if none exist
def ensure_default_templates():
    if not Template.objects.filter(name="Computer Vision / ML Engineer").exists():
        Template.objects.create(
            name="Computer Vision / ML Engineer",
            category="Developer",
            preview_image="cv-ml-engineer.png",
            supported_sections=["personal", "summary", "skills", "experience", "projects", "certifications", "education"]
        )
    if not Template.objects.filter(name="Minimal ATS").exists():
        Template.objects.create(
            name="Minimal ATS",
            category="ATS",
            preview_image="minimal-ats.png",
            supported_sections=["personal", "summary", "education", "experience", "projects", "skills", "certifications"]
        )
    if not Template.objects.filter(name="Modern Developer").exists():
        Template.objects.create(
            name="Modern Developer",
            category="Developer",
            preview_image="modern-dev.png",
            supported_sections=["personal", "summary", "experience", "projects", "skills", "education", "certifications"]
        )
    if not Template.objects.filter(name="Classic Professional").exists():
        Template.objects.create(
            name="Classic Professional",
            category="Classic",
            preview_image="classic-pro.png",
            supported_sections=["personal", "summary", "education", "experience", "skills", "projects"]
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    login(request, user)
    return Response({'user': UserSerializer(user).data, 'message': 'Registered successfully'})


@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        return Response({'user': UserSerializer(user).data, 'message': 'Logged in successfully'})
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def api_logout(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})


@api_view(['GET'])
@permission_classes([AllowAny])
def api_me(request):
    if request.user.is_authenticated:
        return Response({'user': UserSerializer(request.user).data})
    return Response({'user': None})


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def resume_list_create(request):
    ensure_default_templates()
    if request.method == 'GET':
        if request.user.is_authenticated:
            resumes = Resume.objects.filter(user=request.user).order_by('-updated_at')
        else:
            resumes = Resume.objects.all().order_by('-updated_at')[:20]
        serializer = ResumeSerializer(resumes, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data.copy()
        if request.user.is_authenticated:
            user_obj = request.user
        else:
            user_obj = None

        if not data.get('template'):
            default_tmpl = Template.objects.first()
            if default_tmpl:
                data['template'] = default_tmpl.id

        if not data.get('section_order'):
            data['section_order'] = ['personal', 'summary', 'education', 'experience', 'projects', 'skills', 'certifications']

        serializer = ResumeSerializer(data=data)
        if serializer.is_valid():
            resume = serializer.save(user=user_obj)
            return Response(ResumeSerializer(resume).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def resume_detail(request, pk):
    resume = get_object_or_404(Resume, pk=pk)

    if request.method == 'GET':
        return Response(ResumeSerializer(resume).data)

    elif request.method in ['PATCH', 'PUT']:
        serializer = ResumeSerializer(resume, data=request.data, partial=True)
        if serializer.is_valid():
            updated_resume = serializer.save()
            return Response(ResumeSerializer(updated_resume).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        resume.delete()
        return Response({'message': 'Resume deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([AllowAny])
def resume_duplicate(request, pk):
    original = get_object_or_404(Resume, pk=pk)
    data = ResumeSerializer(original).data
    data.pop('id', None)
    data['title'] = f"{original.title} (Copy)"
    
    serializer = ResumeSerializer(data=data)
    if serializer.is_valid():
        dup = serializer.save(user=original.user)
        return Response(ResumeSerializer(dup).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def resume_versions(request, pk):
    resume = get_object_or_404(Resume, pk=pk)

    if request.method == 'GET':
        versions = resume.versions.all().order_by('-created_at')
        return Response(ResumeVersionSerializer(versions, many=True).data)

    elif request.method == 'POST':
        snapshot = ResumeSerializer(resume).data
        next_ver = resume.versions.count() + 1
        title = request.data.get('title', f"Version {next_ver}")
        
        ver = ResumeVersion.objects.create(
            resume=resume,
            version_number=next_ver,
            title=title,
            data_snapshot=snapshot
        )
        return Response(ResumeVersionSerializer(ver).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def restore_version(request, pk, version_id):
    resume = get_object_or_404(Resume, pk=pk)
    ver = get_object_or_404(ResumeVersion, pk=version_id, resume=resume)

    snapshot = ver.data_snapshot
    serializer = ResumeSerializer(resume, data=snapshot, partial=True)
    if serializer.is_valid():
        updated = serializer.save()
        return Response(ResumeSerializer(updated).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def template_list(request):
    ensure_default_templates()
    templates = Template.objects.all()
    return Response(TemplateSerializer(templates, many=True).data)


@api_view(['POST'])
@permission_classes([AllowAny])
def generate_pdf(request, pk):
    resume = get_object_or_404(Resume, pk=pk)
    
    doc = GeneratedDocument.objects.create(
        resume=resume,
        template=resume.template,
        status='QUEUED'
    )

    # Perform synchronous/celery-isolated compilation
    compile_pdf_document(doc)

    return Response(GeneratedDocumentSerializer(doc).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def document_detail(request, doc_id):
    doc = get_object_or_404(GeneratedDocument, id=doc_id)
    return Response(GeneratedDocumentSerializer(doc).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def document_status(request, doc_id):
    doc = get_object_or_404(GeneratedDocument, id=doc_id)
    return Response({
        'id': str(doc.id),
        'status': doc.status,
        'pdf_url': doc.pdf_url or (doc.pdf_file.url if doc.pdf_file else ""),
        'error_message': doc.error_message
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def download_pdf(request, doc_id):
    doc = get_object_or_404(GeneratedDocument, id=doc_id)
    if not doc.pdf_file or not os.path.exists(doc.pdf_file.path):
        # Trigger regeneration if file is missing
        compile_pdf_document(doc)

    if doc.pdf_file and os.path.exists(doc.pdf_file.path):
        return FileResponse(open(doc.pdf_file.path, 'rb'), content_type='application/pdf', filename=f"{doc.resume.title}.pdf")
    return Response({'error': 'PDF document not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_job(request):
    job_title = request.data.get('job_title', 'Software Developer')
    company_name = request.data.get('company_name', '')
    description_text = request.data.get('description_text', '')
    resume_id = request.data.get('resume_id')

    if not description_text:
        return Response({'error': 'Job description text is required'}, status=status.HTTP_400_BAD_REQUEST)

    job_desc = JobDescription.objects.create(
        user=request.user if request.user.is_authenticated else None,
        job_title=job_title,
        company_name=company_name,
        description_text=description_text
    )

    resume = None
    if resume_id:
        resume = Resume.objects.filter(id=resume_id).first()

    # Extract keywords from job description
    raw_words = re.findall(r'\b[A-Za-z0-9+#\.\-]{2,}\b', description_text)
    kw_freq = {}
    stop_words = {'and', 'the', 'for', 'with', 'you', 'will', 'are', 'this', 'that', 'have', 'from', 'your', 'work', 'team'}
    for w in raw_words:
        wl = w.lower()
        if wl not in stop_words and len(wl) > 2:
            kw_freq[wl] = kw_freq.get(wl, 0) + 1

    top_keywords = sorted(kw_freq.keys(), key=lambda k: kw_freq[k], reverse=True)[:25]

    present = []
    partial = []
    missing = []

    resume_text = ""
    if resume:
        p = getattr(resume, 'personal_info', None)
        if p and p.summary:
            resume_text += " " + p.summary
        for ed in resume.educations.all():
            resume_text += f" {ed.degree} {ed.field_of_study} {ed.description}"
        for exp in resume.experiences.all():
            resume_text += f" {exp.position} {exp.company} {' '.join(exp.description_bullets or [])}"
        for pr in resume.projects.all():
            resume_text += f" {pr.name} {pr.description} {' '.join(pr.technologies or [])} {' '.join(pr.bullet_points or [])}"
        for sk in resume.skills.all():
            resume_text += f" {sk.category_name} {' '.join(sk.skills_list or [])}"

    resume_text_lower = resume_text.lower()

    for kw in top_keywords:
        if kw in resume_text_lower:
            present.append(kw.capitalize())
        else:
            missing.append(kw.capitalize())

    score = 0.0
    if top_keywords:
        score = round((len(present) / len(top_keywords)) * 100, 1)

    recommendations = [
        f"Include missing technical terms such as {', '.join(missing[:4])} if you possess experience with them.",
        "Ensure your experience bullet points quantify your impact (e.g., performance percentage, latency improvements).",
        "Align project names and skills section directly with the job responsibilities."
    ]

    analysis = JobAnalysis.objects.create(
        job_description=job_desc,
        resume=resume if resume else Resume.objects.first(),
        match_score=score,
        present_keywords=present,
        partial_keywords=partial,
        missing_keywords=missing,
        recommendations=recommendations
    )

    return Response(JobAnalysisSerializer(analysis).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_job_analysis(request, pk):
    analysis = get_object_or_404(JobAnalysis, pk=pk)
    return Response(JobAnalysisSerializer(analysis).data)
