export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  onboardingCompleted?: boolean;
  role?: string; // 'Student' | 'Fresher' | 'Experienced Professional' | 'Career Switcher'
  targetAim?: string; // 'Full-Stack Developer' | 'AI / ML Specialist' | 'Data Scientist' | etc.
  interests?: string[]; // ['Web Development', 'Artificial Intelligence', 'Cloud & DevOps', etc.]
  experienceLevel?: string; // 'Beginner' | 'Intermediate' | 'Advanced'
  apiKey?: string; // Optional custom LLM API Key
}

export interface Template {
  id: number;
  name: string;
  category: string; // "ATS" | "Developer" | "Classic"
  preview_image: string;
  supported_sections: string[];
}

export interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
}

export interface Education {
  id?: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  gpa: string;
  description: string;
  order: number;
}

export interface Experience {
  id?: number;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description_bullets: string[];
  order: number;
}

export interface Project {
  id?: number;
  name: string;
  description: string;
  technologies: string[];
  github_url: string;
  live_url: string;
  bullet_points: string[];
  order: number;
}

export interface SkillCategory {
  id?: number;
  category_name: string;
  skills_list: string[];
  order: number;
}

export interface Certification {
  id?: number;
  name: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  order: number;
}

export interface CustomSection {
  id?: number;
  title: string;
  content: string;
  order: number;
}

export interface Resume {
  id: string;
  user?: number | null;
  title: string;
  target_role: string;
  template: number | null;
  template_details?: Template;
  section_order: string[];
  personal_info?: PersonalInfo;
  educations?: Education[];
  experiences?: Experience[];
  projects?: Project[];
  skills?: SkillCategory[];
  certifications?: Certification[];
  custom_sections?: CustomSection[];
  created_at?: string;
  updated_at?: string;
}

export interface ResumeVersion {
  id: number;
  resume: string;
  version_number: number;
  title: string;
  data_snapshot: Resume;
  created_at: string;
}

export interface GeneratedDocument {
  id: string;
  resume: string;
  version?: number | null;
  template?: number | null;
  status: 'QUEUED' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  pdf_url: string;
  latex_code: string;
  error_message: string;
  created_at: string;
  updated_at: string;
}

export interface JobDescription {
  id?: number;
  job_title: string;
  company_name: string;
  description_text: string;
  created_at?: string;
}

export interface JobAnalysis {
  id: number;
  job_description: number;
  job_description_details?: JobDescription;
  resume: string;
  match_score: number;
  present_keywords: string[];
  partial_keywords: string[];
  missing_keywords: string[];
  recommendations: string[];
  created_at: string;
}

export interface DashboardStats {
  total_resumes: number;
  total_interviews: number;
  total_documents: number;
  avg_interview_score: number;
  readiness_score: number;
  recent_resumes: { id: string; title: string; updated_at: string; target_role: string }[];
  recent_interviews: { id: number; category_name: string; score: number; total: number; percentage: number; taken_at: string }[];
}

export interface InterviewCategory {
  id: number;
  name: string;
  description: string;
  question_count: number;
  icon: string;
  logo_url?: string;
}

export interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizSubmissionResult {
  category_name: string;
  score: number;
  total: number;
  percentage: number;
  results: {
    question_id: number;
    question_text: string;
    user_answer: string;
    correct_answer: string;
    is_correct: boolean;
    explanation: string;
  }[];
}

export interface ProjectIdea {
  name: string;
  subdomain: string;
  language: string;
  tools: string;
  database: string;
  difficulty: string;
  impact: string;
  github: string;
}

export interface ProjectDomain {
  name: string;
  description: string;
  ideas: ProjectIdea[];
}

export interface LearnLanguage {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
  topic_count: number;
  tutorial_url?: string;
  cheatsheet_url?: string;
  practice_url?: string;
}

export interface LearnTopic {
  id: number;
  title: string;
  summary: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons: { id: number; title: string; order: number }[];
}

export interface LessonDetail {
  id: number;
  title: string;
  theory: string;
  syntax_example: string;
  practice_note: string;
  topic_id: number;
  topic_title: string;
  language_id: number;
  language_name: string;
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  read_time: number;
  created_at: string;
}
