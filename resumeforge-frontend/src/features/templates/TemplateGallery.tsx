import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Check, ArrowRight, ShieldCheck, Code, BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { templateApi, resumeApi } from '../../services/api';
import { Template } from '../../types';
import { toast } from 'sonner';

export const TemplateGallery: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    templateApi.getAll()
      .then(setTemplates)
      .catch(() => toast.error('Failed to load templates'))
      .finally(() => setLoading(false));
  }, []);

  const handleUseTemplate = async (templateId: number) => {
    try {
      const tmpl = templates.find((t) => t.id === templateId);
      const newResume = await resumeApi.create({
        title: `${tmpl?.name || 'New'} Resume`,
        template: templateId,
        section_order: tmpl?.supported_sections || ['personal', 'summary', 'experience', 'education', 'projects', 'skills', 'certifications'],
        personal_info: {
          full_name: 'Alex Rivera',
          email: 'alex.rivera@example.com',
          phone: '+1 (555) 234-5678',
          location: 'San Francisco, CA',
          linkedin: 'https://linkedin.com/in/alexrivera',
          github: 'https://github.com/alexrivera',
          portfolio: 'https://alexrivera.dev',
          summary: 'Experienced Software Engineer specializing in backend systems, React, and Python development.'
        }
      });
      toast.success(`Created resume using ${tmpl?.name}`);
      navigate(`/editor/${newResume.id}`);
    } catch {
      toast.error('Could not create resume with this template');
    }
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    ATS: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    Developer: <Code className="w-4 h-4 text-indigo-600" />,
    Classic: <BookOpen className="w-4 h-4 text-slate-600" />
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="max-w-2xl pb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Resume Templates</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Select an ATS-engineered LaTeX template. All templates render into standard single/multi-page A4 document canvases.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-900 mb-2" />
          <p>Loading template library...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-center min-h-[160px]">
                  <div className="paper-canvas w-44 h-52 bg-white rounded p-3 text-[7px] text-slate-700 font-serif leading-tight shadow-sm flex flex-col justify-between select-none pointer-events-none">
                    <div>
                      <div className="font-bold text-[9px] text-center text-slate-900 mb-1 font-sans">{template.name.toUpperCase()}</div>
                      <div className="w-full h-0.5 bg-slate-800 mb-2" />
                      <div className="space-y-1">
                        <div className="font-bold text-slate-800">SUMMARY</div>
                        <div className="text-slate-500">Full stack developer with experience in React & Django.</div>
                        <div className="font-bold text-slate-800 mt-1">EXPERIENCE</div>
                        <div className="text-slate-600 font-sans font-bold">Software Engineer</div>
                        <div className="text-slate-500">• Built REST APIs & reduced latency</div>
                      </div>
                    </div>
                    <div className="text-[6px] text-slate-400 text-center">Page 1 of 1</div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-base">
                      {categoryIcons[template.category] || <Layers className="w-4 h-4" />}
                      {template.name}
                    </div>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>

                  <p className="text-xs text-slate-500 mb-4">
                    Optimized for automated applicant tracking systems and modern engineering recruiters.
                  </p>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Supported Sections</div>
                    <div className="flex flex-wrap gap-1">
                      {template.supported_sections.map((sec) => (
                        <span key={sec} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Button
                  variant="primary"
                  className="w-full text-xs font-semibold"
                  onClick={() => handleUseTemplate(template.id)}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Use This Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
