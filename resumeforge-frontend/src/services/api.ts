import axios from 'axios';
import { Resume, Template, ResumeVersion, GeneratedDocument, JobAnalysis, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth APIs
export const authApi = {
  me: async (): Promise<User | null> => {
    try {
      const res = await api.get('/auth/me/');
      return res.data.user;
    } catch {
      return null;
    }
  },
  login: async (credentials: Record<string, string>): Promise<{ user: User; message: string }> => {
    const res = await api.post('/auth/login/', credentials);
    return res.data;
  },
  register: async (data: Record<string, string>): Promise<{ user: User; message: string }> => {
    const res = await api.post('/auth/register/', data);
    return res.data;
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout/');
  }
};

// Admin Control APIs
export const adminApi = {
  login: async (credentials: Record<string, string>) => {
    const res = await api.post('/admin/login/', credentials);
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/admin/stats/');
    return res.data;
  }
};

// Resume APIs
export const resumeApi = {
  getAll: async (): Promise<Resume[]> => {
    const res = await api.get('/resumes/');
    return res.data;
  },
  getById: async (id: string): Promise<Resume> => {
    const res = await api.get(`/resumes/${id}/`);
    return res.data;
  },
  create: async (data: Partial<Resume>): Promise<Resume> => {
    const res = await api.post('/resumes/', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Resume>): Promise<Resume> => {
    const res = await api.patch(`/resumes/${id}/`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/resumes/${id}/`);
  },
  duplicate: async (id: string): Promise<Resume> => {
    const res = await api.post(`/resumes/${id}/duplicate/`);
    return res.data;
  },
  getVersions: async (id: string): Promise<ResumeVersion[]> => {
    const res = await api.get(`/resumes/${id}/versions/`);
    return res.data;
  },
  createVersion: async (id: string, title?: string): Promise<ResumeVersion> => {
    const res = await api.post(`/resumes/${id}/versions/`, { title });
    return res.data;
  },
  restoreVersion: async (id: string, versionId: number): Promise<Resume> => {
    const res = await api.post(`/resumes/${id}/versions/${versionId}/restore/`);
    return res.data;
  }
};

// Templates API
export const templateApi = {
  getAll: async (): Promise<Template[]> => {
    const res = await api.get('/templates/');
    return res.data;
  }
};

// PDF Document Generation API
export const documentApi = {
  generatePDF: async (resumeId: string): Promise<GeneratedDocument> => {
    const res = await api.post(`/resumes/${resumeId}/generate/`);
    return res.data;
  },
  getStatus: async (docId: string): Promise<{ id: string; status: string; pdf_url: string; error_message: string }> => {
    const res = await api.get(`/documents/${docId}/status/`);
    return res.data;
  },
  getDownloadUrl: (docId: string): string => {
    return `${API_BASE_URL}/documents/${docId}/download/`;
  }
};

// Job Analysis API
export const jobAnalysisApi = {
  analyze: async (data: { job_title: string; company_name?: string; description_text: string; resume_id?: string }): Promise<JobAnalysis> => {
    const res = await api.post('/job-analysis/', data);
    return res.data;
  },
  getById: async (id: number): Promise<JobAnalysis> => {
    const res = await api.get(`/job-analysis/${id}/`);
    return res.data;
  }
};

// Unified Executive Dashboard API
export const dashboardApi = {
  getStats: async () => {
    const res = await api.get('/dashboard/stats/');
    return res.data;
  }
};

// ATS Resume Direct Scanner API
export const atsApi = {
  analyzeDirect: async (formData: FormData) => {
    const res = await api.post('/ats/analyze/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};

// Mock Interview API
export const interviewApi = {
  getCategories: async () => {
    const res = await api.get('/interview/categories/');
    return res.data;
  },
  getQuestions: async (categoryId: number) => {
    const res = await api.get(`/interview/questions/${categoryId}/`);
    return res.data;
  },
  submitQuiz: async (data: { category_id: number; answers: Record<string, string> }) => {
    const res = await api.post('/interview/submit/', data);
    return res.data;
  }
};

// Skill Assessment API
export const assessmentApi = {
  getDomains: async () => {
    const res = await api.get('/assessment/domains/');
    return res.data;
  }
};

// Learning Hub API
export const learnApi = {
  getLanguages: async () => {
    const res = await api.get('/learn/languages/');
    return res.data;
  },
  getTopics: async (langId: number) => {
    const res = await api.get(`/learn/topics/${langId}/`);
    return res.data;
  },
  getLessonDetail: async (lessonId: number) => {
    const res = await api.get(`/learn/lessons/${lessonId}/`);
    return res.data;
  },
  getBlogs: async () => {
    const res = await api.get('/learn/blogs/');
    return res.data;
  }
};
