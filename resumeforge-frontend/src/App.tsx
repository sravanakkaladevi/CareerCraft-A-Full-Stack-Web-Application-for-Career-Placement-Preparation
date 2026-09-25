import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { Navbar } from './components/layout/Navbar';
import { authApi } from './services/api';
import { User } from './types';

// Lazy loading feature routes
const Dashboard = lazy(() => import('./features/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const LoginPage = lazy(() => import('./features/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const ResumeListPage = lazy(() => import('./features/dashboard/ResumeListPage').then(m => ({ default: m.ResumeListPage })));
const ResumeEditor = lazy(() => import('./features/editor/ResumeEditor').then(m => ({ default: m.ResumeEditor })));
const TemplateGallery = lazy(() => import('./features/templates/TemplateGallery').then(m => ({ default: m.TemplateGallery })));
const AtsScannerPage = lazy(() => import('./features/ats/AtsScannerPage').then(m => ({ default: m.AtsScannerPage })));
const JobAnalyzer = lazy(() => import('./features/job-analysis/JobAnalyzer').then(m => ({ default: m.JobAnalyzer })));
const MockInterviewPage = lazy(() => import('./features/interview/MockInterviewPage').then(m => ({ default: m.MockInterviewPage })));
const SkillAssessmentPage = lazy(() => import('./features/assessment/SkillAssessmentPage').then(m => ({ default: m.SkillAssessmentPage })));
const LearningHubPage = lazy(() => import('./features/learn/LearningHubPage').then(m => ({ default: m.LearningHubPage })));

// Admin Feature Routes
const AdminLogin = lazy(() => import('./features/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('./features/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./features/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminUsers = lazy(() => import('./features/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminResumes = lazy(() => import('./features/admin/AdminResumes').then(m => ({ default: m.AdminResumes })));
const AdminAts = lazy(() => import('./features/admin/AdminAts').then(m => ({ default: m.AdminAts })));
const AdminInterviews = lazy(() => import('./features/admin/AdminInterviews').then(m => ({ default: m.AdminInterviews })));
const AdminLearning = lazy(() => import('./features/admin/AdminLearning').then(m => ({ default: m.AdminLearning })));
const AdminProjects = lazy(() => import('./features/admin/AdminProjects').then(m => ({ default: m.AdminProjects })));
const AdminJobs = lazy(() => import('./features/admin/AdminJobs').then(m => ({ default: m.AdminJobs })));
const AdminAnalytics = lazy(() => import('./features/admin/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminAuditLogs = lazy(() => import('./features/admin/AdminAuditLogs').then(m => ({ default: m.AdminAuditLogs })));
const AdminSettings = lazy(() => import('./features/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
    <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Module...</span>
  </div>
);

interface ProtectedRouteProps {
  user: User | null;
  authLoading: boolean;
  children: React.ReactElement;
  moduleName?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, authLoading, children, moduleName = 'this feature' }) => {
  if (authLoading) return <PageLoader />;
  if (!user) {
    toast.info(`Please sign in to access ${moduleName}`);
    return <Navigate to="/login" replace />;
  }
  return children;
};

const MainAppContent: React.FC = () => {
  const location = useLocation();
  
  // Initialize user from localStorage to persist login across page refresh (F5)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('careercraft_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(true);
  
  // Default admin session for sravan admin
  const [adminUser, setAdminUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('careercraft_admin_user');
      return saved ? JSON.parse(saved) : { username: 'sravan admin', role: 'Super Admin', email: 'admin@careercraft.io' };
    } catch {
      return { username: 'sravan admin', role: 'Super Admin', email: 'admin@careercraft.io' };
    }
  });

  const updateUserState = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('careercraft_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('careercraft_user');
    }
  };

  useEffect(() => {
    authApi.me()
      .then((meUser) => {
        if (meUser) {
          updateUserState(meUser);
        }
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin-control');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500/20 selection:text-indigo-900">
      {!isAdminRoute && <Navbar user={user} setUser={updateUserState} />}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Admin Routes */}
            <Route path="/admin-control/login" element={<AdminLogin onLoginSuccess={setAdminUser} />} />
            
            <Route 
              path="/admin-control" 
              element={
                adminUser ? (
                  <AdminLayout adminUser={adminUser} onLogout={() => setAdminUser(null)} />
                ) : (
                  <Navigate to="/admin-control/login" replace />
                )
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="resumes" element={<AdminResumes />} />
              <Route path="ats" element={<AdminAts />} />
              <Route path="interviews" element={<AdminInterviews />} />
              <Route path="learning" element={<AdminLearning />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="audit-logs" element={<AdminAuditLogs />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<AdminDashboard />} />
            </Route>

            {/* Public User Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage user={user} setUser={setUser} isRegister={false} />} />
            <Route path="/register" element={<LoginPage user={user} setUser={setUser} isRegister={true} />} />

            {/* Protected User Routes */}
            <Route
              path="/resumes"
              element={
                <ProtectedRoute user={user} authLoading={authLoading} moduleName="Resumes Studio">
                  <ResumeListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor/:id"
              element={
                <ProtectedRoute user={user} authLoading={authLoading} moduleName="Resume Editor">
                  <ResumeEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/templates"
              element={
                <ProtectedRoute user={user} authLoading={authLoading} moduleName="Template Gallery">
                  <TemplateGallery />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ats"
              element={
                <ProtectedRoute user={user} authLoading={authLoading} moduleName="ATS Scanner">
                  <AtsScannerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/job-analysis"
              element={
                <ProtectedRoute user={user} authLoading={authLoading} moduleName="Job Analyzer">
                  <JobAnalyzer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute user={user} authLoading={authLoading} moduleName="Mock Interview">
                  <MockInterviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment"
              element={
                <ProtectedRoute user={user} authLoading={authLoading} moduleName="Skill Projects">
                  <SkillAssessmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn"
              element={
                <ProtectedRoute user={user} authLoading={authLoading} moduleName="Learning Hub">
                  <LearningHubPage />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Toaster position="top-right" richColors theme="light" closeButton />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MainAppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
