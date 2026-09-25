from django.db import models
from django.contrib.auth.models import User
import uuid

class Template(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, default="ATS") # ATS, Developer, Classic
    preview_image = models.CharField(max_length=255, blank=True, null=True)
    latex_template = models.TextField(blank=True, default="")
    supported_sections = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.category})"


class Resume(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes', null=True, blank=True)
    title = models.CharField(max_length=150, default="Untitled Resume")
    target_role = models.CharField(max_length=150, blank=True, default="")
    template = models.ForeignKey(Template, on_delete=models.SET_NULL, null=True, blank=True)
    section_order = models.JSONField(default=list) # e.g. ['personal', 'summary', 'experience', 'education', 'projects', 'skills', 'certifications']
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.user.username if self.user else 'Guest'}"


class PersonalInfo(models.Model):
    resume = models.OneToOneField(Resume, on_delete=models.CASCADE, related_name='personal_info')
    full_name = models.CharField(max_length=150, blank=True, default="")
    email = models.EmailField(blank=True, default="")
    phone = models.CharField(max_length=50, blank=True, default="")
    location = models.CharField(max_length=150, blank=True, default="")
    linkedin = models.URLField(blank=True, default="")
    github = models.URLField(blank=True, default="")
    portfolio = models.URLField(blank=True, default="")
    summary = models.TextField(blank=True, default="")


class Education(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='educations')
    institution = models.CharField(max_length=150)
    degree = models.CharField(max_length=150)
    field_of_study = models.CharField(max_length=150, blank=True, default="")
    start_date = models.CharField(max_length=50, blank=True, default="")
    end_date = models.CharField(max_length=50, blank=True, default="")
    gpa = models.CharField(max_length=20, blank=True, default="")
    description = models.TextField(blank=True, default="")
    order = models.IntegerField(default=0)


class Experience(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='experiences')
    company = models.CharField(max_length=150)
    position = models.CharField(max_length=150)
    location = models.CharField(max_length=150, blank=True, default="")
    start_date = models.CharField(max_length=50, blank=True, default="")
    end_date = models.CharField(max_length=50, blank=True, default="")
    is_current = models.BooleanField(default=False)
    description_bullets = models.JSONField(default=list)
    order = models.IntegerField(default=0)


class Project(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, default="")
    technologies = models.JSONField(default=list)
    github_url = models.URLField(blank=True, default="")
    live_url = models.URLField(blank=True, default="")
    bullet_points = models.JSONField(default=list)
    order = models.IntegerField(default=0)


class SkillCategory(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='skills')
    category_name = models.CharField(max_length=100) # e.g. "Languages", "Frameworks"
    skills_list = models.JSONField(default=list) # e.g. ["Python", "JavaScript"]
    order = models.IntegerField(default=0)


class Certification(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='certifications')
    name = models.CharField(max_length=150)
    issuer = models.CharField(max_length=150, blank=True, default="")
    issue_date = models.CharField(max_length=50, blank=True, default="")
    credential_url = models.URLField(blank=True, default="")
    order = models.IntegerField(default=0)


class CustomSection(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='custom_sections')
    title = models.CharField(max_length=150)
    content = models.TextField(blank=True, default="")
    order = models.IntegerField(default=0)


class ResumeVersion(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='versions')
    version_number = models.IntegerField(default=1)
    title = models.CharField(max_length=150)
    data_snapshot = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)


class GeneratedDocument(models.Model):
    STATUS_CHOICES = [
        ('QUEUED', 'Queued'),
        ('PROCESSING', 'Processing'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='documents')
    version = models.ForeignKey(ResumeVersion, on_delete=models.SET_NULL, null=True, blank=True)
    template = models.ForeignKey(Template, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='QUEUED')
    pdf_file = models.FileField(upload_to='resumes_pdf/', null=True, blank=True)
    pdf_url = models.CharField(max_length=500, blank=True, default="")
    latex_code = models.TextField(blank=True, default="")
    error_message = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class JobDescription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_descriptions', null=True, blank=True)
    job_title = models.CharField(max_length=150)
    company_name = models.CharField(max_length=150, blank=True, default="")
    description_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class JobAnalysis(models.Model):
    job_description = models.ForeignKey(JobDescription, on_delete=models.CASCADE, related_name='analyses')
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='job_analyses')
    match_score = models.FloatField(default=0.0)
    present_keywords = models.JSONField(default=list)
    partial_keywords = models.JSONField(default=list)
    missing_keywords = models.JSONField(default=list)
    recommendations = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
