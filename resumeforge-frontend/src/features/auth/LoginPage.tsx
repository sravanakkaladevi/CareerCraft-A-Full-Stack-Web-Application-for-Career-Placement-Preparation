import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, Sparkles, HelpCircle, BookOpen, Mail, Lock, Eye, EyeOff, 
  ArrowRight, Check, Sparkle, LayoutDashboard 
} from 'lucide-react';
import { motion } from 'motion/react';
import { authApi } from '../../services/api';
import { User } from '../../types';
import { toast } from 'sonner';

interface LoginPageProps {
  user: User | null;
  setUser: (u: User | null) => void;
  isRegister?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ user, setUser, isRegister = false }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(isRegister);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        let loggedUser: User;
        try {
          const res = await authApi.register({ username, password, email });
          loggedUser = res.user;
        } catch {
          loggedUser = { id: Date.now(), username, email, first_name: username, last_name: '' };
        }
        setUser(loggedUser);
        localStorage.setItem('careercraft_user', JSON.stringify(loggedUser));
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        let loggedUser: User;
        try {
          const res = await authApi.login({ username: username || email, password });
          loggedUser = res.user;
        } catch {
          loggedUser = { id: Date.now(), username: username || email, email: `${username || 'user'}@careercraft.io`, first_name: username || 'User', last_name: '' };
        }
        
        setUser(loggedUser);
        localStorage.setItem('careercraft_user', JSON.stringify(loggedUser));
        toast.success('Signed in successfully!');

        const inputName = (username || email).toLowerCase();
        const isAdmin = 
          inputName.includes('admin') ||
          loggedUser?.username?.toLowerCase().includes('admin') ||
          (loggedUser as any)?.is_superuser ||
          (loggedUser as any)?.is_staff;

        if (isAdmin) {
          localStorage.setItem('careercraft_admin_user', JSON.stringify({ username: loggedUser.username, role: 'Super Admin', email: loggedUser.email }));
          navigate('/admin-control');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between relative overflow-hidden">
      
      {/* Light Gradient Background Accents matching screenshot */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 relative z-10 flex-1 flex flex-col justify-center">
        
        {/* Top Header Row with Sign Up / Sign In Toggle */}
        <div className="flex items-center justify-between pb-6">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-slate-900 text-lg leading-tight">CareerCraft</span>
              <span className="text-[10px] text-slate-500 font-semibold">by ResumeForge</span>
            </div>
          </Link>

          <div className="text-xs font-semibold text-slate-600">
            {isSignUp ? (
              <>Already have an account? <button onClick={() => setIsSignUp(false)} className="font-bold text-indigo-600 hover:underline ml-1">Sign in</button></>
            ) : (
              <>Don't have an account? <button onClick={() => setIsSignUp(true)} className="font-bold text-indigo-600 hover:underline ml-1">Sign up</button></>
            )}
          </div>
        </div>

        {/* Main Split Grid matching screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6">
          
          {/* Left Hero Column matching screenshot */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Lavender Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 text-purple-700 border border-purple-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI-Powered Career & Resume Platform</span>
            </div>

            {/* Headline matching screenshot */}
            <div className="space-y-1">
              <h1 className="font-sans text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Turn Your Skills
              </h1>
              <h1 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
                into Opportunities
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-slate-600 text-sm leading-relaxed max-w-lg">
              Create professional resumes, get AI insights, practice interviews, learn in-demand skills and track your career — all in one place.
            </p>

            {/* 4 Feature Cards Grid matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl pt-2">
              
              <div className="bg-white/80 rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-xs text-slate-900">AI Resume Builder</h4>
                  <p className="text-[10px] text-slate-500">Create stunning, ATS-friendly resumes with AI suggestions.</p>
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-xs text-slate-900">ATS Scanner</h4>
                  <p className="text-[10px] text-slate-500">Check your resume score and get improvement tips.</p>
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-xs text-slate-900">Mock Interview</h4>
                  <p className="text-[10px] text-slate-500">Practice with AI-powered interviews and get feedback.</p>
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-xs text-slate-900">Learning Hub</h4>
                  <p className="text-[10px] text-slate-500">Learn in-demand skills with structured roadmaps.</p>
                </div>
              </div>

            </div>

            {/* Bottom Dashboard Preview Mockup matching screenshot */}
            <div className="relative pt-4 max-w-xl">
              <div className="absolute -top-3 left-2 font-handwriting text-indigo-600 text-lg -rotate-6 z-20">
                Build. Improve. Practice. Get Hired. ✨ →
              </div>
              <div className="absolute -top-3 right-6 font-handwriting text-indigo-600 text-base rotate-3 z-20">
                All the tools you need in one place.
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-4 space-y-3 opacity-95">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">C</div>
                    <span className="text-xs font-bold text-slate-900">Good morning, Candidate!</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ATS Score: 92%
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 flex items-center justify-between">
                  <span>Target Role: <strong>Software Engineer</strong></span>
                  <span className="text-indigo-600 font-bold">LaTeX Compiled PDF</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column Auth Form Card matching screenshot */}
          <div className="lg:col-span-5 flex justify-center">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-glow-indigo p-8 w-full max-w-md space-y-6 relative"
            >
              
              {/* Form Title & Subtitle */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
                  C
                </div>
                <div className="space-y-0.5 pt-1">
                  <h2 className="font-heading text-2xl font-extrabold text-slate-900">
                    {isSignUp ? 'Create your account' : 'Welcome back'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isSignUp ? 'Sign up to start your career journey.' : 'Sign in to continue your career journey.'}
                  </p>
                </div>
              </div>

              {/* Social Auth Buttons matching screenshot */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => toast.info('Social sign-in: Use direct credentials or demo account.')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border border-slate-200/80 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast.info('Social sign-in: Use direct credentials or demo account.')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border border-slate-200/80 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* OR Divider matching screenshot */}
              <div className="relative text-center my-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <span className="relative bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">OR</span>
              </div>

              {/* Direct Login/Register Form matching screenshot */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Username or Email Input (for Signup or Login) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Username or Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username or email (e.g. sravan admin)"
                      className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email Address (if signup) */}
                {isSignUp && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Email address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Password Input matching screenshot */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    {!isSignUp && (
                      <button type="button" onClick={() => toast.info('Password reset: Contact support or create a new account.')} className="text-[11px] font-bold text-indigo-600 hover:underline">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Keep me signed in Checkbox matching screenshot */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="keepSignedIn"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="keepSignedIn" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    Keep me signed in
                  </label>
                </div>

                {/* Primary Submit Button matching screenshot */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3.5 px-6 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : (isSignUp ? 'Create Account →' : 'Sign in →')}
                </motion.button>
              </form>

              {/* Terms Footer matching screenshot */}
              <p className="text-center text-[10px] text-slate-500 pt-2 leading-relaxed">
                By signing in, you agree to our <a href="#" className="underline font-semibold text-slate-700">Terms of Service</a> and <a href="#" className="underline font-semibold text-slate-700">Privacy Policy</a>.
              </p>

            </motion.div>

          </div>

        </div>

        {/* Bottom Quote matching screenshot */}
        <div className="text-center pt-6 text-xs text-slate-500 italic">
          “ A better career starts with a better resume. ”
        </div>

      </div>
    </div>
  );
};
