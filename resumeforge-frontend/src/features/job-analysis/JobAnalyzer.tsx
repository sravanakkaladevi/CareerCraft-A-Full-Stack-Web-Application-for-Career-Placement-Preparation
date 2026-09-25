import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, XCircle, ArrowRight, FileText, Target } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { jobAnalysisApi, resumeApi } from '../../services/api';
import { JobAnalysis, Resume } from '../../types';
import { toast } from 'sonner';

export const JobAnalyzer: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('Python Developer');
  const [companyName, setCompanyName] = useState('TechCorp');
  const [descriptionText, setDescriptionText] = useState(
    'We are seeking a Backend Developer with strong Python, Django, PostgreSQL, Redis, REST API, Git, Docker, and Celery experience to build scalable microservices.'
  );
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);

  useEffect(() => {
    resumeApi.getAll().then((data) => {
      setResumes(data);
      if (data.length > 0) {
        setSelectedResumeId(data[0].id);
      }
    });
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descriptionText) {
      toast.error('Please enter a job description');
      return;
    }
    setLoading(true);
    try {
      const result = await jobAnalysisApi.analyze({
        job_title: jobTitle,
        company_name: companyName,
        description_text: descriptionText,
        resume_id: selectedResumeId || undefined
      });
      setAnalysis(result);
      toast.success('Job analysis complete!');
    } catch {
      toast.error('Failed to analyze job description');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ATS Keyword Matcher</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Job Description Analyzer</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Paste a target job posting to analyze keyword representation against your resume data. Identifies missing terms without fabricating false experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Target Job Title"
                placeholder="e.g. Python Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
              <Input
                label="Company Name"
                placeholder="e.g. Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            {resumes.length > 0 && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Select Resume to Match
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.target_role || 'General'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Textarea
              label="Paste Job Description"
              placeholder="Paste full job description text here..."
              rows={8}
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full font-semibold"
              isLoading={loading}
              icon={<Target className="w-4 h-4" />}
            >
              Analyze Job & Calculate Match
            </Button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {analysis ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Match Analysis Results</h3>
                  <p className="text-xs text-slate-500">{jobTitle} {companyName ? `at ${companyName}` : ''}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">{analysis.match_score}%</span>
                  <Badge variant={analysis.match_score >= 70 ? 'success' : analysis.match_score >= 40 ? 'warning' : 'danger'}>
                    {analysis.match_score >= 70 ? 'Strong Match' : analysis.match_score >= 40 ? 'Partial Match' : 'Low Match'}
                  </Badge>
                </div>
              </div>

              {/* Present Keywords */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Present in Resume ({analysis.present_keywords.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.present_keywords.map((kw) => (
                    <span key={kw} className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md">
                      ✓ {kw}
                    </span>
                  ))}
                  {analysis.present_keywords.length === 0 && (
                    <span className="text-xs text-slate-400 italic">None matched</span>
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-500" /> Missing / Unmatched ({analysis.missing_keywords.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missing_keywords.map((kw) => (
                    <span key={kw} className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-800 border border-red-200 px-2.5 py-1 rounded-md">
                      ○ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Optimization Guidance</h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="font-bold text-slate-900">{idx + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 py-20 space-y-3">
              <Sparkles className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No Job Analysis Selected</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Paste a job description on the left and click "Analyze Job" to review keyword representation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
