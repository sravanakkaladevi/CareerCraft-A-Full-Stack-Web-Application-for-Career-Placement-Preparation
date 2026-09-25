import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careercraft.settings')
django.setup()

from resume.models import Resume, PersonalInfo, Education, Experience, Project, SkillCategory, Certification, Template
from resume.api_views import ensure_default_templates

ensure_default_templates()

# Clear out any old resumes with personal names
Resume.objects.filter(title__icontains="Sravan").delete()
PersonalInfo.objects.filter(full_name__icontains="Sravan").delete()
PersonalInfo.objects.filter(full_name__icontains="Akkaladevi").delete()

tmpl = Template.objects.filter(name="Computer Vision / ML Engineer").first() or Template.objects.first()

r, _ = Resume.objects.get_or_create(
    title="Full-Stack Software Engineer Resume",
    defaults={
        'target_role': 'Full-Stack Developer / ML Engineer',
        'template': tmpl,
        'section_order': ['personal', 'summary', 'skills', 'experience', 'projects', 'certifications', 'education']
    }
)

r.target_role = 'Full-Stack Developer / ML Engineer'
r.template = tmpl
r.section_order = ['personal', 'summary', 'skills', 'experience', 'projects', 'certifications', 'education']
r.save()

PersonalInfo.objects.update_or_create(
    resume=r,
    defaults={
        'full_name': 'Alex Rivera',
        'email': 'alex.rivera@example.com',
        'phone': '+1 (555) 019-2834',
        'location': 'San Francisco, CA',
        'linkedin': 'https://linkedin.com/in/alexrivera-dev',
        'github': 'https://github.com/alexrivera-dev',
        'portfolio': 'https://alexrivera.dev',
        'summary': 'Results-driven Full-Stack Software Engineer with expertise in Python, Django, React, REST APIs, and Machine Learning algorithms. Experienced in scalable web architectures, database optimization, and CI/CD pipelines.'
    }
)

r.skills.all().delete()
SkillCategory.objects.create(resume=r, category_name='Programming', skills_list=['Python', 'JavaScript', 'TypeScript', 'C++', 'SQL'], order=1)
SkillCategory.objects.create(resume=r, category_name='Frameworks & Web', skills_list=['React', 'Django', 'FastAPI', 'Node.js', 'Next.js', 'REST APIs', 'Tailwind CSS'], order=2)
SkillCategory.objects.create(resume=r, category_name='Data & ML', skills_list=['Scikit-learn', 'TensorFlow', 'Pandas', 'NumPy', 'OpenCV'], order=3)
SkillCategory.objects.create(resume=r, category_name='Databases & Cloud', skills_list=['PostgreSQL', 'Redis', 'Docker', 'AWS Lambda', 'Git', 'Linux'], order=4)

r.experiences.all().delete()
Experience.objects.create(
    resume=r,
    company='TechSphere Solutions',
    position='Software Engineering Intern',
    location='San Francisco, CA',
    start_date='Jan 2025',
    end_date='Present',
    is_current=True,
    description_bullets=[
        'Architected high-throughput RESTful API microservices in Django DRF serving over 50,000 active daily requests.',
        'Engineered responsive React single-page components using TypeScript, Tailwind CSS, and TanStack Query.',
        'Reduced SQL database query execution times by 40% through indexing and caching with Redis.'
    ],
    order=1
)

r.projects.all().delete()
Project.objects.create(
    resume=r,
    name='Real-Time Collaborative Code & Analytics Engine',
    description='Full-Stack Microservices Platform',
    technologies=['Python', 'Django', 'React', 'TypeScript', 'Docker', 'PostgreSQL'],
    github_url='https://github.com/alexrivera-dev/collaborative-code-engine',
    live_url='https://code-engine.example.com',
    bullet_points=[
        'Built a real-time collaborative code analysis platform supporting live code compilation and AST parsing.',
        'Implemented WebSockets for instantaneous multi-user document syncing and execution streaming.',
        'Deployed production environment with Docker containers on AWS ECS with automated GitHub Actions CI/CD pipelines.'
    ],
    order=1
)

r.certifications.all().delete()
Certification.objects.create(
    resume=r,
    name='AWS Certified Solutions Architect -- Associate',
    issuer='Amazon Web Services',
    issue_date='2025',
    order=1
)

r.educations.all().delete()
Education.objects.create(
    resume=r,
    institution='State University of Science & Technology',
    degree='Bachelor of Science in Computer Science',
    field_of_study='Computer Science',
    start_date='2021',
    end_date='2025',
    gpa='3.85 / 4.00',
    order=1
)

print("SUCCESS: Seeded generic candidate resume ('Alex Rivera')!")
