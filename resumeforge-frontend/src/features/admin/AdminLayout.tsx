import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, Sparkles, HelpCircle, Code2, 
  BookOpen, Briefcase, BarChart3, ShieldCheck, Settings, LogOut, 
  Search, Bell, ChevronRight, Menu, X, Globe, Layers, UserCheck, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminLayoutProps {
  adminUser: any;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ adminUser, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    onLogout();
    toast.success('Admin logged out safely.');
    navigate('/admin-control/login');
  };

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/admin-control', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Users',
      items: [
        { name: 'All Users', path: '/admin-control/users', icon: Users },
        { name: 'Students', path: '/admin-control/users?role=Student', icon: UserCheck },
        { name: 'Freshers', path: '/admin-control/users?role=Fresher', icon: UserCheck },
        { name: 'Job Seekers', path: '/admin-control/users?role=JobSeeker', icon: UserCheck },
        { name: 'Professionals', path: '/admin-control/users?role=Professional', icon: UserCheck },
      ]
    },
    {
      title: 'Resume Management',
      items: [
        { name: 'All Resumes', path: '/admin-control/resumes', icon: FileText },
        { name: 'Resume Templates', path: '/admin-control/resumes/templates', icon: Layers },
        { name: 'Resume Downloads', path: '/admin-control/resumes/downloads', icon: FileText },
      ]
    },
    {
      title: 'AI & ATS',
      items: [
        { name: 'ATS Scans', path: '/admin-control/ats', icon: Sparkles },
        { name: 'AI Resume Analysis', path: '/admin-control/ats/analysis', icon: Sparkles },
        { name: 'AI Usage', path: '/admin-control/ats/usage', icon: Sparkles },
      ]
    },
    {
      title: 'Interview',
      items: [
        { name: 'Mock Interviews', path: '/admin-control/interviews', icon: HelpCircle },
        { name: 'Interview Questions', path: '/admin-control/interviews/questions', icon: HelpCircle },
        { name: 'Interview Results', path: '/admin-control/interviews/results', icon: HelpCircle },
      ]
    },
    {
      title: 'Career Content',
      items: [
        { name: 'Skill Projects', path: '/admin-control/projects', icon: Code2 },
        { name: 'Learning Hub', path: '/admin-control/learning', icon: BookOpen },
        { name: 'Courses / Roadmaps', path: '/admin-control/learning/courses', icon: BookOpen },
      ]
    },
    {
      title: 'Jobs',
      items: [
        { name: 'Job Listings', path: '/admin-control/jobs', icon: Briefcase },
        { name: 'Applications', path: '/admin-control/jobs/applications', icon: Briefcase },
        { name: 'Companies', path: '/admin-control/jobs/companies', icon: Briefcase },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { name: 'Platform Analytics', path: '/admin-control/analytics', icon: BarChart3 },
        { name: 'User Activity', path: '/admin-control/analytics/activity', icon: BarChart3 },
        { name: 'AI Usage', path: '/admin-control/analytics/ai', icon: BarChart3 },
        { name: 'System Reports', path: '/admin-control/analytics/reports', icon: BarChart3 },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Notifications', path: '/admin-control/system/notifications', icon: Bell },
        { name: 'Feedback', path: '/admin-control/system/feedback', icon: ShieldCheck },
        { name: 'Audit Logs', path: '/admin-control/audit-logs', icon: ShieldCheck },
        { name: 'Settings', path: '/admin-control/settings', icon: Settings },
      ]
    }
  ];

  // Helper to generate breadcrumbs from pathname
  const getBreadcrumb = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return 'Dashboard';
    const sub = parts[1];
    return sub.charAt(0).toUpperCase() + sub.slice(1);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased">
      
      {/* Container Layout */}
      <div className="flex flex-1 relative">
        
        {/* LEFT SIDEBAR matching screenshot */}
        <aside 
          className={`w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-40 transition-transform md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Sidebar Header Logo */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="CareerCraft Admin Control" className="h-8 w-auto object-contain" />
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Link Back to Main Dashboard */}
            <div className="p-3 border-b border-slate-100 bg-purple-50/40">
              <Link
                to="/dashboard"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white text-xs font-extrabold transition-all shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" />
                  <span>Back to User App</span>
                </div>
                <Globe className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </Link>
            </div>

            {/* Navigation List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-none">
              {navGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    {group.title}
                  </span>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.path || (item.path !== '/admin-control' && location.pathname.startsWith(item.path));
                      const Icon = item.icon;
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.path}
                            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              isActive
                                ? 'bg-purple-50 text-purple-700 font-bold shadow-2xs'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Sidebar Bottom Profile & Logout */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  A
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 truncate">Admin</div>
                  <div className="text-[9px] text-slate-500 font-semibold truncate">Super Admin</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold shrink-0 cursor-pointer"
                title="Logout Admin"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col md:pl-64 min-w-0">
          
          {/* TOP HEADER BAR matching screenshot */}
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
            
            {/* Left: Mobile Menu Trigger + Breadcrumb + Back Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-800 text-xs font-extrabold transition-all border border-purple-200 shadow-2xs cursor-pointer group shrink-0"
                title="Return to Main User Dashboard"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-purple-600 group-hover:text-white transition-colors" />
                <span className="hidden sm:inline">Back to User Site</span>
                <span className="sm:hidden">User Site</span>
              </Link>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 border-l border-slate-200 pl-3">
                <Link to="/admin-control" className="hover:text-slate-900">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                </Link>
                <span>/</span>
                <span className="text-slate-900 font-bold">{getBreadcrumb()}</span>
              </div>
            </div>

            {/* Right Header Control Widgets matching screenshot */}
            <div className="flex items-center gap-3">
              
              {/* Search Bar */}
              <div className="relative hidden sm:block w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search users, resumes, jobs, or anything..."
                  className="w-full bg-slate-100/80 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              {/* Environment Indicator Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Production</span>
              </div>

              {/* Notification Icon */}
              <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1" />
              </button>

              {/* Help Icon */}
              <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl hidden sm:block cursor-pointer">
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Admin Avatar & Label matching screenshot */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                  A
                </div>
                <div className="hidden lg:block text-left leading-tight">
                  <div className="text-xs font-bold text-slate-900">Admin</div>
                  <div className="text-[9px] text-slate-400 font-semibold">Super Admin</div>
                </div>
              </div>

            </div>

          </header>

          {/* PAGE ROUTE OUTLET */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>

        </div>

      </div>

    </div>
  );
};
