import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText, Sparkles, HelpCircle, Code2, ArrowRight, Play, Star,
  CheckCircle2, Download, Search, Bell, Users, Check, Sparkle,
  Send, Briefcase, Award, Globe, Heart, ShieldCheck, BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { dashboardApi, resumeApi } from '../../services/api';
import { DashboardStats, Resume } from '../../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const savedUserStr = localStorage.getItem('careercraft_user');
  const user = savedUserStr ? JSON.parse(savedUserStr) : null;

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [activeModal, setActiveModal] = useState<'about' | 'blog' | 'contact' | 'privacy' | 'terms' | 'cookie' | null>(null);
  const [policyAgreed, setPolicyAgreed] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, resumeList] = await Promise.all([
        dashboardApi.getStats(),
        resumeApi.getAll()
      ]);
      setStats(statsData);
      setResumes(resumeList);
    } catch (err) {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  const roleCards = [
    {
      title: 'Students',
      desc: 'Build skills, create your resume, and get placement ready.',
      avatar: '/avatars/student.jpg',
      color: 'bg-[#e0f2fe]/80 border-blue-200/80',
      btnHover: 'group-hover:bg-blue-600',
      path: '/assessment'
    },
    {
      title: 'Freshers',
      desc: 'Create ATS-friendly resumes and prepare for your first job.',
      avatar: '/avatars/fresher.jpg',
      color: 'bg-[#ffe4e6]/80 border-pink-200/80',
      btnHover: 'group-hover:bg-pink-600',
      path: '/resumes'
    },
    {
      title: 'Job Seekers',
      desc: 'Improve your profile, applications, and interview readiness.',
      avatar: '/avatars/jobseeker.jpg',
      color: 'bg-[#dcfce7]/80 border-emerald-200/80',
      btnHover: 'group-hover:bg-emerald-600',
      path: '/ats'
    },
    {
      title: 'Working Professionals',
      desc: 'Upskill, improve your profile, and advance your career.',
      avatar: '/avatars/professional.jpg',
      color: 'bg-[#f3e8ff]/80 border-purple-200/80',
      btnHover: 'group-hover:bg-purple-600',
      path: '/learn'
    },
    {
      title: 'Career Switchers',
      desc: 'Build the skills and resume needed for your next career move.',
      avatar: '/avatars/professional.jpg',
      color: 'bg-[#fef3c7]/80 border-amber-200/80',
      btnHover: 'group-hover:bg-amber-600',
      path: '/resumes'
    },
    {
      title: 'Developers',
      desc: 'Showcase projects, technical skills, and experience professionally.',
      avatar: '/avatars/jobseeker.jpg',
      color: 'bg-[#e0e7ff]/80 border-indigo-200/80',
      btnHover: 'group-hover:bg-indigo-600',
      path: '/assessment'
    },
    {
      title: 'AI Professionals',
      desc: 'Highlight AI, ML, and modern technical skills.',
      avatar: '/avatars/student.jpg',
      color: 'bg-[#fae8ff]/80 border-fuchsia-200/80',
      btnHover: 'group-hover:bg-fuchsia-600',
      path: '/learn'
    },
    {
      title: 'Students / Graduates',
      desc: 'Prepare for placements with projects, resumes, and interview practice.',
      avatar: '/avatars/fresher.jpg',
      color: 'bg-[#ccfbf1]/80 border-teal-200/80',
      btnHover: 'group-hover:bg-teal-600',
      path: '/interview'
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12 flex flex-col justify-between">

      {/* Main Content Area */}
      <div>

        {/* Hero Section matching latest screenshot */}
        <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Column Text & CTAs */}
            <div className="lg:col-span-5 space-y-5">

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/70 border border-purple-200 text-purple-800 text-xs font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>AI-Powered Career & Resume Platform</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-0.5"
              >
                <h1 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Build Your Career,
                </h1>
                <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
                  One Step Ahead
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-lg"
              >
                Create ATS-friendly resumes, get ATS insights, practice interviews, learn in-demand skills and track your career — all in one place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                <button
                  onClick={() => navigate('/resumes')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-all hover:scale-102"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/interview')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-800 font-bold text-xs border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-800 text-slate-800" />
                  <span>Watch Demo</span>
                </button>
              </motion.div>

              {/* Authentic Feature Highlight Row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 pt-3 border-t border-slate-200/60"
              >
                <div className="flex -space-x-2 overflow-hidden">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="/avatars/student.jpg" alt="User" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="/avatars/fresher.jpg" alt="User" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="/avatars/jobseeker.jpg" alt="User" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="/avatars/professional.jpg" alt="User" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">Built for students, job seekers & professionals</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-slate-700">All-in-one platform</span>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Right Column Floating Mockup Window matching latest screenshot */}
            <div className="lg:col-span-7 relative">

              {/* Handwritten Note Annotation */}
              <div className="absolute -top-6 right-8 z-20 hidden sm:flex items-center gap-1 text-indigo-600 font-handwriting text-lg rotate-3">
                <span>All the tools you need in one place.</span>
                <span className="text-lg">⤵</span>
              </div>

              {/* Mockup Container Window */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-glow-indigo overflow-hidden flex flex-col md:flex-row min-h-[460px] relative"
              >

                {/* Dark Sidebar inside Mockup */}
                <div className="w-full md:w-36 bg-slate-900 text-white p-4 flex md:flex-col justify-between shrink-0">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center text-xs font-black">C</div>
                      <span>CareerCraft</span>
                    </div>
                    <div className="hidden md:flex flex-col gap-2 text-[11px] font-semibold text-slate-400">
                      <span className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold"><FileText className="w-3.5 h-3.5" /> Dashboard</span>
                      <span className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:text-white cursor-pointer"><FileText className="w-3.5 h-3.5" /> Resumes</span>
                      <span className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:text-white cursor-pointer"><Sparkles className="w-3.5 h-3.5" /> ATS Scanner</span>
                      <span className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:text-white cursor-pointer"><HelpCircle className="w-3.5 h-3.5" /> Mock Interview</span>
                      <span className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:text-white cursor-pointer"><Code2 className="w-3.5 h-3.5" /> Skill Projects</span>
                      <span className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:text-white cursor-pointer"><BookOpen className="w-3.5 h-3.5" /> Learning Hub</span>
                    </div>
                  </div>
                </div>

                {/* Main Window Inner Body matching screenshot */}
                <div className="flex-1 p-5 space-y-4 bg-slate-50/50">

                  {/* Top Bar inside mockup */}
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <div>
                      <h4 className="font-heading font-extrabold text-sm text-slate-900">Good morning, Candidate! 👋</h4>
                      <p className="text-[10px] text-slate-500">Let's make progress on your career goals today.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-400" />
                      <Bell className="w-4 h-4 text-slate-400" />
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">S</div>
                    </div>
                  </div>

                  {/* 4 Top Action Cards inside mockup */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-[10px] font-bold text-slate-900">Create Resume</h5>
                        <p className="text-[8px] text-slate-500">Professional templates</p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-blue-600" />
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-[10px] font-bold text-slate-900">ATS Analysis</h5>
                        <p className="text-[8px] text-slate-500">Check & improve score</p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-emerald-600" />
                    </div>

                    <div className="p-2.5 rounded-xl bg-pink-50/80 border border-pink-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-[10px] font-bold text-slate-900">Mock Interview</h5>
                        <p className="text-[8px] text-slate-500">AI-powered practice</p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-pink-600" />
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-[10px] font-bold text-slate-900">LaTeX Export</h5>
                        <p className="text-[8px] text-slate-500">Compile to PDF</p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-purple-600" />
                    </div>
                  </div>

                  {/* Resume Details + ATS Score Grid inside mockup */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">

                    {/* Your Resume Preview Box */}
                    <div className="sm:col-span-7 bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Your Resume</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => navigate('/resumes')} className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold">Edit Resume</button>
                          <button onClick={() => navigate('/resumes')} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] font-bold border border-slate-200">Download PDF</button>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <h5 className="font-heading font-extrabold text-xs text-slate-900">Alex Rivera</h5>
                        <p className="text-[9px] text-slate-500">Software Developer | Python | React | PostgreSQL</p>
                      </div>

                      <div className="text-[9px] space-y-0.5 border-t border-slate-100 pt-1.5">
                        <strong className="block text-slate-800">Education</strong>
                        <p className="text-slate-600">Master of Computer Applications (MCA) | State University</p>
                      </div>
                    </div>

                    {/* ATS Score Meter Box */}
                    <div className="sm:col-span-5 bg-white rounded-2xl border border-slate-200 p-3 space-y-2 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block text-left">ATS Score</span>
                      <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 font-black text-sm flex items-center justify-center mx-auto shadow-inner">
                        92%
                      </div>
                      <div className="text-[9px] space-y-0.5 text-left text-slate-600 font-semibold pt-1">
                        <div className="flex items-center gap-1 text-emerald-600 font-bold"><Check className="w-2.5 h-2.5" /> Good structure</div>
                        <div className="flex items-center gap-1 text-emerald-600 font-bold"><Check className="w-2.5 h-2.5" /> Relevant keywords</div>
                        <div className="flex items-center gap-1 text-emerald-600 font-bold"><Check className="w-2.5 h-2.5" /> Professional tone</div>
                        <div className="flex items-center gap-1 text-emerald-600 font-bold"><Check className="w-2.5 h-2.5" /> ATS friendly</div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Floating AI Suggestions Window Box matching screenshot */}
                <div className="absolute right-3 top-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-3 shadow-xl space-y-1.5 w-44 hidden md:block z-30">
                  <div className="flex items-center gap-1 text-[10px] font-extrabold text-purple-700">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>AI Suggestions</span>
                  </div>
                  <ul className="text-[8px] space-y-1 text-slate-600 font-semibold">
                    <li className="flex items-center gap-1 text-emerald-600"><span>+</span> Add impact metrics</li>
                    <li className="flex items-center gap-1 text-emerald-600"><span>+</span> Include relevant keywords</li>
                    <li className="flex items-center gap-1 text-blue-600"><span>+</span> Improve bullet points</li>
                    <li className="flex items-center gap-1 text-purple-600"><span>+</span> Use action verbs</li>
                  </ul>
                </div>

              </motion.div>

            </div>

          </div>
        </section>

        {/* Personalized User Interest Recommendation Banner */}
        {user?.targetAim && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
            <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-xs">
                    Tailored Workspace
                  </span>
                  <span className="text-xs font-semibold text-purple-100">
                    Role: <strong>{user.role || 'Fresher'}</strong>
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-lg text-white">
                  Target Goal: {user.targetAim}
                </h3>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="font-bold text-purple-100">Your Interests:</span>
                  {(user.interests || ['Web Development', 'Artificial Intelligence']).map((interest: string) => (
                    <span key={interest} className="px-2.5 py-0.5 rounded-full bg-white/15 text-white font-bold text-[11px] border border-white/20">
                      ✓ {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigate('/learn')}
                  className="px-4 py-2.5 rounded-full bg-white text-indigo-700 font-extrabold text-xs shadow-md hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Explore {user.targetAim} Roadmap →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 4 Feature Cards Grid matching screenshot */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => navigate('/resumes')}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">AI Resume Builder</h3>
                  <p className="text-[11px] text-slate-500 leading-snug">Create stunning, ATS-friendly resumes with smart AI suggestions.</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-all shrink-0 ml-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => navigate('/ats')}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">ATS Scanner</h3>
                  <p className="text-[11px] text-slate-500 leading-snug">Check your resume score and get improvement tips.</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-all shrink-0 ml-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => navigate('/interview')}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 text-pink-600 flex items-center justify-center font-bold shrink-0">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-pink-600 transition-colors">Mock Interview</h3>
                  <p className="text-[11px] text-slate-500 leading-snug">Practice with AI-driven interview questions.</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-pink-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-all shrink-0 ml-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => navigate('/learn')}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">Learning Hub</h3>
                  <p className="text-[11px] text-slate-500 leading-snug">Learn in-demand skills with structured roadmaps.</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-all shrink-0 ml-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>

          </div>
        </section>

        {/* "Tools for Every Career Journey" Section with CONTINUOUS LEFT-TO-RIGHT MARQUEE ANIMATION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 space-y-8 overflow-hidden">

          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold border border-blue-200">
              For Everyone
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tools for Every Career Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Whether you're a student, job seeker, or working professional — CareerCraft has everything you need.
            </p>
          </div>

          {/* Gliding Infinite Marquee Carousel: RIGHT → LEFT Animated Row as requested */}
          <div className="relative w-full overflow-x-auto scrollbar-none py-2 cursor-grab active:cursor-grabbing">
            <div className="flex gap-6 w-max animate-marquee-rtl">
              {[...roleCards, ...roleCards].map((card, idx) => (
                <div
                  key={idx}
                  tabIndex={0}
                  role="button"
                  onClick={() => navigate(card.path)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(card.path);
                    }
                  }}
                  className={`w-[300px] sm:w-[330px] h-[104px] rounded-3xl p-4 border ${card.color} shadow-xs hover:shadow-soft transition-all cursor-pointer flex items-center justify-between group shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <img className="w-13 h-13 rounded-2xl object-cover shadow-xs border-2 border-white shrink-0" src={card.avatar} alt={card.title} />
                    <div className="space-y-0.5 min-w-0 pr-1">
                      <h3 className="font-heading font-extrabold text-sm text-slate-900 truncate">{card.title}</h3>
                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">{card.desc}</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-white text-slate-700 ${card.btnHover} group-hover:text-white flex items-center justify-center transition-all shrink-0 ml-2 shadow-xs`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Capabilities Bar */}
          <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-heading text-sm font-extrabold text-slate-900">AI Powered</div>
                <div className="text-[10px] font-semibold text-slate-500">ATS Resume Builder</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-heading text-sm font-extrabold text-slate-900">LaTeX Engine</div>
                <div className="text-[10px] font-semibold text-slate-500">PDF Compilation</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-heading text-sm font-extrabold text-slate-900">Mock Practice</div>
                <div className="text-[10px] font-semibold text-slate-500">AI Interviews</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-heading text-sm font-extrabold text-slate-900">Learning Hub</div>
                <div className="text-[10px] font-semibold text-slate-500">Skill Roadmaps</div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Banner matching latest screenshot */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-glow-indigo flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0">
                <Send className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-heading text-xl font-extrabold text-white">Ready to Build a Better Career?</h3>
                <p className="text-xs text-indigo-100">Empower your placement preparation with CareerCraft today.</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/resumes')}
              className="px-6 py-3.5 rounded-full bg-white text-indigo-900 font-extrabold text-xs shadow-md hover:bg-indigo-50 transition-all flex items-center gap-2 shrink-0"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </section>

      </div>

      {/* Footer matching brand logo & policy requirements */}
      <footer className="border-t border-slate-200/80 bg-white pt-12 pb-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

            {/* Col 1: Logo & About */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5 font-bold tracking-tight">
                <img src="/logo.png" alt="CareerCraft - Build • Learn • Practice • Grow" className="h-10 w-auto object-contain" />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm">
                All-in-one platform for resumes, ATS analysis, interview practice, and career growth designed by Sravan Kumar.
              </p>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-2">
              <h4 className="font-heading font-extrabold text-slate-900 text-xs uppercase tracking-wider">Product</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-500">
                <li><Link to="/resumes" className="hover:text-indigo-600 font-semibold">AI Resume Builder</Link></li>
                <li><Link to="/ats" className="hover:text-indigo-600 font-semibold">ATS Scanner</Link></li>
                <li><Link to="/interview" className="hover:text-indigo-600 font-semibold">Mock Interview</Link></li>
                <li><Link to="/assessment" className="hover:text-indigo-600 font-semibold">Skill Projects</Link></li>
                <li><Link to="/learn" className="hover:text-indigo-600 font-semibold">Learning Hub</Link></li>
              </ul>
            </div>

            {/* Col 3: Company (Careers removed, About Creator added) */}
            <div className="space-y-2">
              <h4 className="font-heading font-extrabold text-slate-900 text-xs uppercase tracking-wider">Company</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-500">
                <li><button onClick={() => setActiveModal('about')} className="hover:text-indigo-600 font-semibold text-left cursor-pointer">About the Creator</button></li>
                <li><button onClick={() => setActiveModal('blog')} className="hover:text-indigo-600 font-semibold text-left cursor-pointer">Blog</button></li>
                <li><button onClick={() => setActiveModal('contact')} className="hover:text-indigo-600 font-semibold text-left cursor-pointer">Contact</button></li>
                <li><button onClick={() => setActiveModal('privacy')} className="hover:text-indigo-600 font-semibold text-left cursor-pointer">Privacy Policy</button></li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div className="space-y-2">
              <h4 className="font-heading font-extrabold text-slate-900 text-xs uppercase tracking-wider">Subscribe to newsletter</h4>
              <p className="text-[10px] text-slate-500">Get the latest updates, tips and resources.</p>
              <div className="space-y-2 pt-1">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => { setEmailInput(''); toast.success('Subscribed to newsletter!'); }}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span>© 2026 CareerCraft by Sravan Kumar. All rights reserved.</span>
              {policyAgreed && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-[10px] inline-flex items-center gap-1 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Agreed & Approved
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 font-semibold">
              <button onClick={() => setActiveModal('terms')} className="hover:text-slate-900 cursor-pointer">Terms of Service</button>
              <span>|</span>
              <button onClick={() => setActiveModal('privacy')} className="hover:text-slate-900 cursor-pointer">Privacy Policy</button>
              <span>|</span>
              <button onClick={() => setActiveModal('cookie')} className="hover:text-slate-900 cursor-pointer">Cookie Policy</button>
            </div>
          </div>

        </div>
      </footer>

      {/* MODALS FOR ABOUT THE CREATOR & POLICIES */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 border border-slate-200 shadow-2xl relative my-auto max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer font-bold text-sm"
            >
              ✕
            </button>

            {/* ABOUT THE CREATOR MODAL */}
            {activeModal === 'about' && (
              <div className="space-y-4 text-slate-700">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center">
                    SK
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-slate-900">About the Creator</h3>
                    <p className="text-xs text-indigo-600 font-bold">Sravan Kumar — Founder & Developer, CareerCraft</p>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-600">
                  CareerCraft is designed and developed by <strong>Sravan Kumar</strong>, an MCA graduate and software developer focused on building practical applications with Python, Django, AI, and modern web technologies.
                </p>

                <p className="text-xs leading-relaxed text-slate-600">
                  With a focus on solving real career-preparation problems, Sravan built CareerCraft to bring resume building, ATS analysis, interview practice, skill development, and career preparation into a single platform.
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                  <h4 className="font-bold text-slate-900">Sravan Kumar</h4>
                  <p className="text-slate-500 font-semibold text-[11px]">Founder & Developer, CareerCraft</p>
                  <p className="text-slate-600 text-[11px] pt-1">
                    MCA graduate and software developer focused on Python, Django, AI, and full-stack application development.
                  </p>
                </div>

                <blockquote className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-xs italic font-medium">
                  "CareerCraft was built around one idea: career preparation shouldn't require switching between multiple platforms for resumes, ATS analysis, interview practice, learning, and projects."
                </blockquote>

                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}

            {/* BLOG MODAL */}
            {activeModal === 'blog' && (
              <div className="space-y-4">
                <h3 className="font-heading font-extrabold text-xl text-slate-900">CareerCraft Blog & Tech Articles</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Read the latest articles on ATS Optimization, AI Resume Building, System Design Interviews, and Technical Placement Roadmaps written by Sravan Kumar.
                </p>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <h4 className="font-bold text-slate-900">10 ATS Resume Optimization Tips for 2026</h4>
                    <span className="text-[10px] text-slate-400">Published Sep 20, 2026</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <h4 className="font-bold text-slate-900">How to Crack System Design Interviews with AI Mock Practice</h4>
                    <span className="text-[10px] text-slate-400">Published Sep 15, 2026</span>
                  </div>
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs cursor-pointer">Close</button>
              </div>
            )}

            {/* CONTACT MODAL */}
            {activeModal === 'contact' && (
              <div className="space-y-4">
                <h3 className="font-heading font-extrabold text-xl text-slate-900">Contact the Creator</h3>
                <p className="text-xs text-slate-600">Have feedback or suggestions for CareerCraft? Reach out directly to Sravan Kumar.</p>
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1 text-xs text-indigo-900 font-semibold">
                  <div>Email: <a href="mailto:sravansravan824@gmail.com" className="underline font-bold">sravansravan824@gmail.com</a></div>
                  <div>GitHub: <a href="https://github.com" target="_blank" rel="noreferrer" className="underline font-bold">github.com/sravanakkaladevi</a></div>
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer">Close</button>
              </div>
            )}

            {/* TERMS / PRIVACY / COOKIE POLICY MODAL */}
            {(activeModal === 'terms' || activeModal === 'privacy' || activeModal === 'cookie') && (
              <div className="space-y-4 text-slate-700">
                <h3 className="font-heading font-extrabold text-xl text-slate-900 capitalize">
                  {activeModal === 'terms' ? 'Terms of Service' : activeModal === 'privacy' ? 'Privacy Policy' : 'Cookie Policy'}
                </h3>

                <div className="text-xs space-y-2 leading-relaxed max-h-60 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <p>Welcome to CareerCraft. By accessing and using our resume building, ATS analysis, interview practice, and learning hub features, you agree to comply with our platform policies.</p>
                  <p>All candidate user data is processed securely with strict privacy protection. Resume LaTeX compilation files are generated on-demand without third-party data tracking.</p>
                  <p>Cookies are used exclusively to maintain your login session state and optimize application performance.</p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setPolicyAgreed(true);
                      toast.success(`${activeModal.toUpperCase()} Policy Approved & Agreed!`);
                      setActiveModal(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I Agree & Approve Policy</span>
                  </button>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
