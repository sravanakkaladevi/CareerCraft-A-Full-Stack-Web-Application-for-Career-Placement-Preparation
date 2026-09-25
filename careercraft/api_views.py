from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.db.models import Count, Avg
from django.shortcuts import get_object_or_404

from resume.models import Resume, GeneratedDocument, JobAnalysis, JobDescription
from interview.models import Category as InterviewCategory, Question as InterviewQuestion, MockResult
from learn.models import Language, Topic, Lesson, BlogPost, BlogComment
from ats.services.ats_engine import analyze_resume
from ats.services.pdf_parser import extract_text_from_pdf
from assessment.views import PROJECT_DOMAINS

@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    user = request.user if request.user.is_authenticated else None
    
    total_resumes = Resume.objects.filter(user=user).count() if user else Resume.objects.count()
    total_interviews = MockResult.objects.filter(user=user).count() if user else MockResult.objects.count()
    total_documents = GeneratedDocument.objects.filter(resume__user=user).count() if user else GeneratedDocument.objects.count()
    
    avg_interview_score = 0
    if user:
        user_results = MockResult.objects.filter(user=user)
        if user_results.exists():
            avg_interview_score = int(user_results.aggregate(Avg('percentage'))['percentage__avg'] or 0)
    else:
        all_results = MockResult.objects.all()
        if all_results.exists():
            avg_interview_score = int(all_results.aggregate(Avg('percentage'))['percentage__avg'] or 0)

    recent_resumes = Resume.objects.filter(user=user).order_by('-updated_at')[:5] if user else Resume.objects.order_by('-updated_at')[:5]
    recent_interviews = MockResult.objects.filter(user=user).order_by('-taken_at')[:5] if user else MockResult.objects.order_by('-taken_at')[:5]

    res_data = [
        {
            'id': str(r.id),
            'title': r.title,
            'updated_at': r.updated_at.isoformat(),
            'target_role': r.target_role,
        } for r in recent_resumes
    ]

    int_data = [
        {
            'id': res.id,
            'category_name': res.category.name,
            'score': res.score,
            'total': res.total,
            'percentage': res.percentage,
            'taken_at': res.taken_at.isoformat(),
        } for res in recent_interviews
    ]

    return Response({
        'total_resumes': total_resumes,
        'total_interviews': total_interviews,
        'total_documents': total_documents,
        'avg_interview_score': avg_interview_score,
        'recent_resumes': res_data,
        'recent_interviews': int_data,
        'readiness_score': min(98, max(45, int(avg_interview_score * 0.6 + (total_resumes * 10) + 25)))
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def ats_analyze_api(request):
    job_description = request.data.get("job_description", "")
    resume_text = request.data.get("resume", "")
    resume_file = request.FILES.get("resume_file")

    if resume_file:
        extracted = extract_text_from_pdf(resume_file)
        if extracted:
            resume_text = extracted

    if not resume_text or not job_description:
        return Response({"error": "Both resume text/file and job description are required."}, status=status.HTTP_400_BAD_REQUEST)

    result = analyze_resume(resume_text, job_description)
    return Response(result)


@api_view(['GET'])
@permission_classes([AllowAny])
def interview_categories(request):
    cats = InterviewCategory.objects.all().order_by('order')
    data = []
    for c in cats:
        data.append({
            'id': c.id,
            'name': c.name,
            'description': c.description,
            'question_count': c.question_set.count(),
            'icon': c.icon or 'CODE',
            'logo_url': c.logo_url or ''
        })
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def interview_questions(request, category_id):
    category = get_object_or_404(InterviewCategory, id=category_id)
    questions = InterviewQuestion.objects.filter(category=category)[:20]
    
    q_data = []
    for q in questions:
        q_data.append({
            'id': q.id,
            'question_text': q.question_text,
            'option_a': q.option_a,
            'option_b': q.option_b,
            'option_c': q.option_c,
            'option_d': q.option_d,
            'difficulty': q.difficulty,
        })

    return Response({
        'category_id': category.id,
        'category_name': category.name,
        'questions': q_data
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def interview_submit(request):
    category_id = request.data.get('category_id')
    answers = request.data.get('answers', {}) # map of question_id -> option ('a','b','c','d')

    category = get_object_or_404(InterviewCategory, id=category_id)
    question_ids = list(answers.keys())
    questions = InterviewQuestion.objects.filter(id__in=question_ids)
    
    score = 0
    total = len(questions)
    detailed_results = []

    for q in questions:
        user_ans = str(answers.get(str(q.id)) or answers.get(q.id) or "").strip().lower()
        correct_ans = q.correct_option.strip().lower()
        is_correct = (user_ans == correct_ans)
        if is_correct:
            score += 1
        detailed_results.append({
            'question_id': q.id,
            'question_text': q.question_text,
            'user_answer': user_ans.upper(),
            'correct_answer': q.correct_option.upper(),
            'is_correct': is_correct,
            'explanation': q.explanation,
        })

    percentage = int((score / total) * 100) if total > 0 else 0

    mock_result = None
    if request.user.is_authenticated:
        mock_result = MockResult.objects.create(
            user=request.user,
            category=category,
            score=score,
            total=total,
            percentage=percentage
        )

    return Response({
        'category_name': category.name,
        'score': score,
        'total': total,
        'percentage': percentage,
        'results': detailed_results
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def assessment_domains(request):
    return Response(PROJECT_DOMAINS)


@api_view(['GET'])
@permission_classes([AllowAny])
def learn_languages(request):
    langs = Language.objects.all().order_by('order')
    data = []
    for l in langs:
        data.append({
            'id': l.id,
            'name': l.name,
            'icon': l.icon,
            'color': l.color,
            'description': l.description,
            'topic_count': l.topic_set.count(),
            'tutorial_url': l.tutorial_url,
            'cheatsheet_url': l.cheatsheet_url,
            'practice_url': l.practice_url
        })
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def learn_topics(request, lang_id):
    language = get_object_or_404(Language, id=lang_id)
    topics = Topic.objects.filter(language=language).order_by('order')
    
    t_data = []
    for t in topics:
        lessons = Lesson.objects.filter(topic=t).order_by('order')
        t_data.append({
            'id': t.id,
            'title': t.title,
            'summary': t.summary,
            'level': t.level,
            'lessons': [
                {
                    'id': les.id,
                    'title': les.title,
                    'order': les.order
                } for les in lessons
            ]
        })

    return Response({
        'language_id': language.id,
        'language_name': language.name,
        'topics': t_data
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def learn_lesson_detail(request, lesson_id):
    lesson = get_object_or_404(Lesson, id=lesson_id)
    return Response({
        'id': lesson.id,
        'title': lesson.title,
        'theory': lesson.theory,
        'syntax_example': lesson.syntax_example,
        'practice_note': lesson.practice_note,
        'topic_id': lesson.topic.id,
        'topic_title': lesson.topic.title,
        'language_id': lesson.topic.language.id,
        'language_name': lesson.topic.language.name,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def learn_blogs(request):
    posts = BlogPost.objects.filter(published=True).order_by('-created_at')
    data = []
    for p in posts:
        data.append({
            'id': p.id,
            'title': p.title,
            'category': p.category,
            'summary': p.summary,
            'content': p.content,
            'read_time': p.read_time,
            'created_at': p.created_at.isoformat()
        })
    return Response(data)
