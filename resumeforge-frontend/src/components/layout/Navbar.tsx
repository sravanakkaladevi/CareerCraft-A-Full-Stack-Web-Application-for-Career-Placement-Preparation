import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, LayoutDashboard, Sparkles, HelpCircle, Code2, BookOpen, 
  Rocket, LogOut, User as UserIcon, ArrowRight, Lock, ShieldCheck, Bot 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { authApi } from '../../services/api';
import { User } from '../../types';
import { toast } from 'sonner';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { OnboardingModal } from './OnboardingModal';
import { AiAgentModal } from './AiAgentModal';

interface NavbarProps {
  user: User | null;
  setUser: (u: User | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAiAgentModal, setShowAiAgentModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    localStorage.removeItem('careercraft_user');
    localStorage.removeItem('careercraft_admin_user');
    setUser(null);
    toast.info('Logged out safely');
    navigate('/dashboard');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, requiresAuth: false },
    { label: 'Resumes', path: '/resumes', icon: FileText, requiresAuth: true },
    { label: 'ATS Scanner', path: '/ats', icon: Sparkles, badge: 'AI', requiresAuth: true },
    { label: 'Mock Interview', path: '/interview', icon: HelpCircle, requiresAuth: true },
    { label: 'Skill Projects', path: '/assessment', icon: Code2, requiresAuth: true },
    { label: 'Learning Hub', path: '/learn', icon: BookOpen, requiresAuth: true },
  ];

  const handleNavClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    if (item.requiresAuth && !user) {
      e.preventDefault();
      toast.info(`Please sign in to access ${item.label}`);
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md text-slate-900 shadow-2xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        
        {/* Logo matching uploaded brand logo */}
        <div className="flex items-center gap-6 shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2.5 font-bold tracking-tight group">
            <img src="/logo.png" alt="CareerCraft - Build • Learn • Practice • Grow" className="h-10 w-auto object-contain transition-transform group-hover:scale-102" />
          </Link>
        </div>

        {/* Center Pill Nav Tabs matching latest screenshot */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const isLocked = item.requiresAuth && !user;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => handleNavClick(e, item)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-150 ${
                  active
                    ? 'text-indigo-600 font-bold bg-indigo-50 border border-indigo-200/60 shadow-2xs'
                    : isLocked
                    ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : isLocked ? 'text-slate-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>

                {isLocked && <Lock className="w-3 h-3 text-slate-400 opacity-60 ml-0.5" />}

                {item.badge && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-600 text-white">
                    {item.badge}
                  </span>
                )}

                {active && (
                  <motion.div
                    layoutId="activePillTabIndicator"
                    className="absolute inset-0 bg-indigo-50 border border-indigo-200/80 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons matching latest screenshot */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowAiAgentModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs shadow-2xs hover:bg-indigo-100 transition-all cursor-pointer"
            title="Open AI Agent (Beta)"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Agent</span>
            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-indigo-600 text-white">BETA</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2.5">
              {(user.username === 'sravan admin' || user.username === 'sravan' || (user as any).is_superuser || (user as any).is_staff) && (
                <button
                  onClick={() => navigate('/admin-control')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 border border-purple-300 text-purple-800 font-extrabold text-xs shadow-2xs hover:bg-purple-200 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Control</span>
                </button>
              )}
              <button 
                onClick={() => setShowProfileModal(true)}
                className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full border border-slate-200 transition-all cursor-pointer shadow-2xs group"
                title="Click to view & edit Profile Settings"
              >
                <img 
                  src={user.avatar || '/avatars/professional.jpg'} 
                  className="w-5 h-5 rounded-full object-cover border border-indigo-200 group-hover:scale-105 transition-transform" 
                  alt={user.username} 
                />
                <span>{user.username}</span>
              </button>
              <Button variant="ghost" size="sm" onClick={handleLogout} icon={<LogOut className="w-3.5 h-3.5" />}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/register')}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-all cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden border-t border-slate-200/80 bg-white/95 overflow-x-auto">
        <div className="flex items-center gap-1 px-3 py-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const isLocked = item.requiresAuth && !user;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => handleNavClick(e, item)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  active ? 'bg-indigo-50 text-indigo-600 border border-indigo-200/60 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {isLocked && <Lock className="w-3 h-3 text-slate-400 opacity-70" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* PROFILE SETTINGS MODAL FOR USER */}
      <ProfileSettingsModal 
        user={user} 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        onUpdateUser={(updated) => {
          setUser(updated);
          localStorage.setItem('careercraft_user', JSON.stringify(updated));
        }} 
      />

      {/* AI AGENT BETA MODAL */}
      <AiAgentModal
        user={user}
        isOpen={showAiAgentModal}
        onClose={() => setShowAiAgentModal(false)}
        onUpdateApiKey={(key) => {
          if (user) {
            const updated = { ...user, apiKey: key };
            setUser(updated);
            localStorage.setItem('careercraft_user', JSON.stringify(updated));
          }
        }}
      />

      {/* ONBOARDING Q&A QUESTIONNAIRE MODAL */}
      <OnboardingModal
        user={user}
        isOpen={showOnboardingModal || (!!user && !user.onboardingCompleted)}
        onClose={() => setShowOnboardingModal(false)}
        onComplete={(updated) => {
          setUser(updated);
          localStorage.setItem('careercraft_user', JSON.stringify(updated));
        }}
      />
    </header>
  );
};
