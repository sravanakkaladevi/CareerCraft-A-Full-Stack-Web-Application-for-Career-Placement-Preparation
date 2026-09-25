from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Resume, PersonalInfo, Template, GeneratedDocument, JobAnalysis

class ResumeForgeAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.template = Template.objects.create(
            name="Computer Vision / ML Engineer",
            category="Developer",
            supported_sections=["personal", "summary", "skills", "experience", "projects", "certifications", "education"]
        )

    def test_create_and_list_resume(self):
        """Test creating a resume via REST API and retrieving it."""
        response = self.client.post('/api/resumes/', {
            'title': 'ML Engineer Resume',
            'target_role': 'Computer Vision Engineer',
            'template': self.template.id,
            'personal_info': {
                'full_name': 'Akkaladevi Sravan Kumar',
                'email': 'sravan@example.com',
                'summary': 'MCA Graduate specializing in OpenCV and MediaPipe.'
            }
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        resume_id = response.data['id']
        self.assertEqual(response.data['title'], 'ML Engineer Resume')

        # Retrieve list
        list_resp = self.client.get('/api/resumes/')
        self.assertEqual(list_resp.status_code, status.HTTP_200_OK)
        self.assertTrue(len(list_resp.data) >= 1)

    def test_pdf_generation_flow(self):
        """Test triggering PDF generation workflow and verifying output."""
        resume = Resume.objects.create(
            title='Test Resume',
            template=self.template
        )
        PersonalInfo.objects.create(resume=resume, full_name='Sravan Kumar', email='test@example.com')

        gen_resp = self.client.post(f'/api/resumes/{resume.id}/generate/')
        self.assertEqual(gen_resp.status_code, status.HTTP_201_CREATED)
        self.assertIn(gen_resp.data['status'], ['SUCCESS', 'PROCESSING', 'QUEUED'])

    def test_job_analysis_matching(self):
        """Test job description analyzer and keyword matching algorithm."""
        resume = Resume.objects.create(title='Python Dev')
        PersonalInfo.objects.create(resume=resume, full_name='Sravan', summary='Experienced in Python, Django, OpenCV, and MediaPipe.')

        analysis_resp = self.client.post('/api/job-analysis/', {
            'job_title': 'CV Engineer',
            'description_text': 'Looking for Python, Django, OpenCV, PyTorch, and Docker developer.',
            'resume_id': str(resume.id)
        }, format='json')

        self.assertEqual(analysis_resp.status_code, status.HTTP_201_CREATED)
        self.assertGreater(analysis_resp.data['match_score'], 0)
        self.assertIn('Python', analysis_resp.data['present_keywords'])

    def test_templates_endpoint(self):
        """Test fetching templates list."""
        resp = self.client.get('/api/templates/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(len(resp.data) >= 1)
