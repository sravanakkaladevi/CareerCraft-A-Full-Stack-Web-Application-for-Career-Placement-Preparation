import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileText, Sparkles, CheckCircle, ArrowRight, Layers, FileCheck, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { resumeApi } from '../../services/api';
import { toast } from 'sonner';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateResume = async () => {
    try {
      const newResume = await resumeApi.create({
        title: 'Software Developer Resume',
        target_role: 'Full Stack Engineer',
        section_order: ['personal', 'summary', 'experience', 'education', 'projects', 'skills', 'certifications'],
        personal_info: {
          full_name: 'Alex Rivera',
          email: 'alex.rivera@example.com',
          phone: '+1 (555) 234-5678',
          location: 'San Francisco, CA',
          linkedin: 'https://linkedin.com/in/alexrivera',
          github: 'https://github.com/alexrivera',
          portfolio: 'https://alexrivera.dev',
          summary: 'Passionate Full Stack Developer specializing in React, TypeScript, and Django. Experienced in building high-throughput REST APIs and responsive user interfaces.'
        }
      });
      toast.success('Resume draft created!');
      navigate(`/editor/${newResume.id}`);
    } catch {
      toast.error('Could not initialize resume draft');
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 min-h-[calc(100vh-3.5rem)]">
      {/* Grid subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-slate-100 text-xs font-semibold mb-6 border border-slate-800 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Dedicated LaTeX Document Generation Architecture</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]"
          >
            Build once. <br className="hidden sm:inline" />
            Generate a <span className="text-slate-700 underline decoration-slate-300 underline-offset-8">professional resume</span> anywhere.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal"
          >
            Create structured resumes, switch templates, preview the real compiled PDF, and tailor your resume to the exact job you're applying for.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button
              size="lg"
              variant="primary"
              onClick={handleCreateResume}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto font-semibold px-8 shadow-md"
            >
              Create Resume
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/templates')}
              icon={<Layers className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Explore Templates
            </Button>
          </motion.div>
        </div>

        {/* Animated Interactive Paper Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 max-w-5xl mx-auto rounded-xl p-3 sm:p-4 bg-slate-900/90 shadow-2xl border border-slate-800"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="font-mono ml-2 text-slate-300 text-[11px]">ResumeForge Editor — Python_Developer.pdf</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Compiled PDF
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-100 rounded-b-lg overflow-hidden min-h-[380px]">
            {/* Editor Preview Side */}
            <div className="md:col-span-5 p-5 bg-white border-r border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Structured Data</span>
                <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">Auto-saved</span>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5">
                  <div className="text-slate-400 font-sans text-[11px]">Personal Information</div>
                  <div className="font-semibold text-slate-900">Alex Rivera</div>
                  <div className="text-slate-500">alex.rivera@example.com</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5">
                  <div className="text-slate-400 font-sans text-[11px]">Experience Bullet Points</div>
                  <div className="text-slate-700">• Architected RESTful APIs with Django REST Framework</div>
                  <div className="text-slate-700">• Reduced database queries by 40% with PostgreSQL indexing</div>
                </div>
              </div>
            </div>

            {/* Compiled PDF Sheet Canvas */}
            <div className="md:col-span-7 p-6 bg-slate-200/80 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="paper-canvas w-full max-w-md p-6 bg-white rounded shadow-lg text-slate-900 space-y-3"
              >
                <div className="text-center pb-2 border-b border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">ALEX RIVERA</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">alex.rivera@example.com | +1 (555) 234-5678 | San Francisco, CA</p>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1.5">Professional Summary</h4>
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    Full Stack Software Engineer with 3+ years of experience designing and deploying scalable web services, microservices, and React interfaces.
                  </p>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1.5">Technical Experience</h4>
                  <div className="flex justify-between items-baseline text-[10.5px]">
                    <span className="font-bold text-slate-800">Software Engineer Intern — TechCraft</span>
                    <span className="text-[9.5px] text-slate-500">2023 – Present</span>
                  </div>
                  <ul className="text-[9.5px] text-slate-600 list-disc list-inside mt-1 space-y-0.5">
                    <li>Engineered RESTful endpoints with Django REST Framework and PostgreSQL</li>
                    <li>Designed responsive frontend views using React, TypeScript, and Tailwind CSS</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Engineered for Document Precision</h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">No complex LaTeX syntax required. Simply enter structured data and get clean, compilation-isolated PDFs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Controlled LaTeX Templates</h3>
              <p className="text-slate-600 text-xs leading-relaxed">User inputs are sanitized and safely injected into ATS-friendly LaTeX sources before rendering.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Job Description Matcher</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Analyze job postings against your resume data to identify missing technical keywords and representation.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-700 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Resume Versioning</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Save targeted versions (e.g. Python Dev v1, Backend Dev v2) with instant restoration and duplication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 bg-slate-900 text-slate-400 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 ResumeForge. Intelligent Resume Engineering Platform.</p>
        </div>
      </footer>
    </div>
  );
};
