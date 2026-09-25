from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Template, Resume, PersonalInfo, Education, Experience, Project,
    SkillCategory, Certification, CustomSection, ResumeVersion,
    GeneratedDocument, JobDescription, JobAnalysis
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = '__all__'


class PersonalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalInfo
        fields = ['full_name', 'email', 'phone', 'location', 'linkedin', 'github', 'portfolio', 'summary']


class EducationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Education
        fields = ['id', 'institution', 'degree', 'field_of_study', 'start_date', 'end_date', 'gpa', 'description', 'order']


class ExperienceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Experience
        fields = ['id', 'company', 'position', 'location', 'start_date', 'end_date', 'is_current', 'description_bullets', 'order']


class ProjectSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'technologies', 'github_url', 'live_url', 'bullet_points', 'order']


class SkillCategorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = SkillCategory
        fields = ['id', 'category_name', 'skills_list', 'order']


class CertificationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Certification
        fields = ['id', 'name', 'issuer', 'issue_date', 'credential_url', 'order']


class CustomSectionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = CustomSection
        fields = ['id', 'title', 'content', 'order']


class ResumeVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeVersion
        fields = '__all__'


class GeneratedDocumentSerializer(serializers.ModelSerializer):
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = GeneratedDocument
        fields = ['id', 'resume', 'version', 'template', 'status', 'pdf_url', 'latex_code', 'error_message', 'created_at', 'updated_at']

    def get_pdf_url(self, obj):
        if obj.pdf_url:
            return obj.pdf_url
        if obj.pdf_file:
            return obj.pdf_file.url
        return ""


class ResumeSerializer(serializers.ModelSerializer):
    personal_info = PersonalInfoSerializer(required=False)
    educations = EducationSerializer(many=True, required=False)
    experiences = ExperienceSerializer(many=True, required=False)
    projects = ProjectSerializer(many=True, required=False)
    skills = SkillCategorySerializer(many=True, required=False)
    certifications = CertificationSerializer(many=True, required=False)
    custom_sections = CustomSectionSerializer(many=True, required=False)
    template_details = TemplateSerializer(source='template', read_only=True)

    class Meta:
        model = Resume
        fields = [
            'id', 'user', 'title', 'target_role', 'template', 'template_details',
            'section_order', 'personal_info', 'educations', 'experiences',
            'projects', 'skills', 'certifications', 'custom_sections',
            'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        personal_data = validated_data.pop('personal_info', {})
        educations_data = validated_data.pop('educations', [])
        experiences_data = validated_data.pop('experiences', [])
        projects_data = validated_data.pop('projects', [])
        skills_data = validated_data.pop('skills', [])
        certs_data = validated_data.pop('certifications', [])
        custom_data = validated_data.pop('custom_sections', [])

        resume = Resume.objects.create(**validated_data)

        if personal_data:
            PersonalInfo.objects.create(resume=resume, **personal_data)
        else:
            PersonalInfo.objects.create(resume=resume)

        for ed in educations_data:
            Education.objects.create(resume=resume, **ed)
        for exp in experiences_data:
            Experience.objects.create(resume=resume, **exp)
        for pr in projects_data:
            Project.objects.create(resume=resume, **pr)
        for sk in skills_data:
            SkillCategory.objects.create(resume=resume, **sk)
        for c in certs_data:
            Certification.objects.create(resume=resume, **c)
        for cs in custom_data:
            CustomSection.objects.create(resume=resume, **cs)

        return resume

    def update(self, instance, validated_data):
        personal_data = validated_data.pop('personal_info', None)
        educations_data = validated_data.pop('educations', None)
        experiences_data = validated_data.pop('experiences', None)
        projects_data = validated_data.pop('projects', None)
        skills_data = validated_data.pop('skills', None)
        certs_data = validated_data.pop('certifications', None)
        custom_data = validated_data.pop('custom_sections', None)

        instance.title = validated_data.get('title', instance.title)
        instance.target_role = validated_data.get('target_role', instance.target_role)
        if 'template' in validated_data:
            instance.template = validated_data.get('template')
        if 'section_order' in validated_data:
            instance.section_order = validated_data.get('section_order')
        instance.save()

        # Personal info update
        if personal_data is not None:
            personal, _ = PersonalInfo.objects.get_or_create(resume=instance)
            for k, v in personal_data.items():
                setattr(personal, k, v)
            personal.save()

        # Educations update
        if educations_data is not None:
            instance.educations.all().delete()
            for ed in educations_data:
                ed.pop('id', None)
                Education.objects.create(resume=instance, **ed)

        # Experiences update
        if experiences_data is not None:
            instance.experiences.all().delete()
            for exp in experiences_data:
                exp.pop('id', None)
                Experience.objects.create(resume=instance, **exp)

        # Projects update
        if projects_data is not None:
            instance.projects.all().delete()
            for pr in projects_data:
                pr.pop('id', None)
                Project.objects.create(resume=instance, **pr)

        # Skills update
        if skills_data is not None:
            instance.skills.all().delete()
            for sk in skills_data:
                sk.pop('id', None)
                SkillCategory.objects.create(resume=instance, **sk)

        # Certifications update
        if certs_data is not None:
            instance.certifications.all().delete()
            for c in certs_data:
                c.pop('id', None)
                Certification.objects.create(resume=instance, **c)

        # Custom sections update
        if custom_data is not None:
            instance.custom_sections.all().delete()
            for cs in custom_data:
                cs.pop('id', None)
                CustomSection.objects.create(resume=instance, **cs)

        return instance


class JobDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobDescription
        fields = '__all__'


class JobAnalysisSerializer(serializers.ModelSerializer):
    job_description_details = JobDescriptionSerializer(source='job_description', read_only=True)
    class Meta:
        model = JobAnalysis
        fields = '__all__'
