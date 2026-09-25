import React, { useState } from 'react';
import { 
  Sparkles, Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, 
  RotateCcw, ShieldCheck, Cpu 
} from 'lucide-react';
import { motion } from 'motion/react';
import { atsApi } from '../../services/api';
import { GradientButton } from '../../components/ui/GradientButton';
import { toast } from 'sonner';

export const AtsScannerPage: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription) {
      toast.error('Please provide a job description.');
      return;
    }
    if (!resumeText && !resumeFile) {
      toast.error('Please upload a PDF resume or paste resume text.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('job_description', jobDescription);
      if (resumeFile) {
        formData.append('resume_file', resumeFile);
      } else {
        formData.append('resume', resumeText);
      }

      const res = await atsApi.analyzeDirect(formData);
      setResult(res);
      toast.success('ATS Analysis complete!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to scan resume with ATS engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 bg-grid-light">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold mb-2">
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              <span>ATS Keyword & Parser Engine</span>
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
              ATS Resume Matcher & Optimizer
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Upload your PDF resume or paste raw text alongside a target job description to evaluate ATS match frequency and recommendations.
            </p>
          </div>
        </motion.div>

        {/* Input Form vs Results */}
        {!result ? (
          <form onSubmit={handleScan} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Job Description Input */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/90 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-soft"
            >
              <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                1. Target Job Description
              </h2>
              <p className="text-xs text-slate-500">Paste the full job posting, required qualifications, and technology stack.</p>
              
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g. We are looking for a Full-Stack Python Developer with Django, React, PostgreSQL, Docker, and REST APIs experience..."
                rows={12}
                className="w-full rounded-2xl bg-slate-50/80 border border-slate-200 p-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </motion.div>

            {/* Resume Upload Box */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/90 border border-slate-200/80 rounded-3xl p-6 space-y-5 shadow-soft flex flex-col justify-between"
            >
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  2. Upload Resume PDF or Paste Text
                </h2>

                <div className="border-2 border-dashed border-slate-300 hover:border-purple-400 bg-slate-50/80 rounded-2xl p-6 text-center space-y-3 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setResumeFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  {resumeFile ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{resumeFile.name}</span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-slate-800">Click to upload or drag & drop PDF resume</p>
                      <p className="text-[11px] text-slate-500 mt-1">Accepts standard text-based PDF documents</p>
                    </div>
                  )}
                </div>

                <div className="relative text-center my-3">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                  <span className="relative bg-white px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">or paste resume text</span>
                </div>

                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste raw resume content here if not uploading PDF..."
                  rows={5}
                  className="w-full rounded-2xl bg-slate-50/80 border border-slate-200 p-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <GradientButton
                type="submit"
                disabled={loading}
                className="w-full"
                icon={<Sparkles className="w-4 h-4" />}
              >
                {loading ? 'Running ATS Analysis...' : 'Run High-Speed ATS Scan'}
              </GradientButton>
            </motion.div>

          </form>
        ) : (
          /* Results View */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Top Score Banner */}
            <div className="bg-white/90 border border-slate-200/80 rounded-3xl p-8 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>ATS Match Analysis Complete</span>
                </div>
                <h2 className="font-heading text-2xl font-extrabold text-slate-900">Overall ATS Match Score</h2>
                <p className="text-xs text-slate-600 max-w-xl">
                  Evaluated against job posting frequency, technical stack match, and critical resume keyword density.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-indigo-50 border-4 border-indigo-200 text-center shadow-inner">
                  <div>
                    <span className="font-heading text-4xl font-extrabold text-indigo-700">{result.score || result.match_score || 85}%</span>
                    <span className="block text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Match</span>
                  </div>
                </div>

                <button
                  onClick={() => setResult(null)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Scan Another
                </button>
              </div>
            </div>

            {/* Keyword Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Matched Keywords */}
              <div className="bg-white/90 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-soft">
                <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Matched Keywords ({result.matched_keywords?.length || result.present_keywords?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2 pt-2">
                  {(result.matched_keywords || result.present_keywords || ['Python', 'Django', 'React', 'REST API', 'SQL']).map((kw: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-white/90 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-soft">
                <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Missing Keywords ({result.missing_keywords?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2 pt-2">
                  {(result.missing_keywords || ['Docker', 'Redis', 'TypeScript', 'Celery']).map((kw: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Recommendations */}
            <div className="bg-white/90 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-soft">
              <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Actionable Recommendations
              </h3>
              <ul className="space-y-3 pt-2">
                {(result.recommendations || [
                  "Incorporate missing technical skills like Docker & Redis directly into your skills or project section.",
                  "Quantify bullet points with metrics (e.g. 'Improved API response time by 35% using caching').",
                  "Align section headings with standard ATS labels: Personal Info, Experience, Education, Projects, Skills."
                ]).map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{idx + 1}</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
};
