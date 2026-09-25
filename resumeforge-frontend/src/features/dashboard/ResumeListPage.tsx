import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, Plus, Copy, Trash2, Edit3, Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { resumeApi, templateApi } from '../../services/api';
import { Resume, Template } from '../../types';
import { Modal } from '../../components/ui/modal';
import { Input } from '../../components/ui/input';
import { GradientButton } from '../../components/ui/GradientButton';
import { toast } from 'sonner';

export const ResumeListPage: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);

  const [title, setTitle] = useState('');
  const [targetRole, setTargetRole] = useState('Full-Stack Software Engineer');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rList, tList] = await Promise.all([
        resumeApi.getAll(),
        templateApi.getAll()
      ]);
      setResumes(rList);
      setTemplates(tList);
      if (tList.length > 0) {
        setSelectedTemplate(tList[0].id);
      }
    } catch (err) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newResume = await resumeApi.create({
        title: title || 'New Professional Resume',
        target_role: targetRole,
        template: selectedTemplate,
        section_order: ['personal', 'summary', 'education', 'experience', 'projects', 'skills', 'certifications'],
        personal_info: {
          full_name: 'Alex Rivera',
          email: 'alex.rivera@example.com',
          phone: '+1 (555) 019-2834',
          location: 'San Francisco, CA',
          linkedin: 'linkedin.com/in/alexrivera-dev',
          github: 'github.com/alexrivera-dev',
          portfolio: 'alexrivera.dev',
          summary: 'Motivated Software Engineer specializing in Python, Django, React, and Full-Stack Web Architecture.'
        }
      });
      toast.success('Resume created successfully!');
      setCreateModal(false);
      navigate(`/editor/${newResume.id}`);
    } catch (err) {
      toast.error('Failed to create resume');
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const dup = await resumeApi.duplicate(id);
      setResumes((prev) => [dup, ...prev]);
      toast.success('Resume duplicated!');
    } catch (err) {
      toast.error('Failed to duplicate resume');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumeApi.delete(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.info('Resume deleted');
    } catch (err) {
      toast.error('Failed to delete resume');
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold mb-2">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>LaTeX PDF Document Studio</span>
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
              My Resumes & Templates
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Create, edit, and compile ATS-compliant LaTeX resumes with live section reordering and A4 PDF rendering.
            </p>
          </div>

          <GradientButton
            onClick={() => setCreateModal(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Create New Resume
          </GradientButton>
        </motion.div>

        {/* Resumes Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">Loading resumes...</div>
        ) : resumes.length === 0 ? (
          <div className="bg-white/90 border border-slate-200/80 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto shadow-soft">
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-200">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-900">No Resumes Found</h3>
            <p className="text-xs text-slate-500">Get started by creating your first LaTeX resume tailored to your target job role.</p>
            <button
              onClick={() => setCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" /> Create First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((r, idx) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="group bg-white/90 border border-slate-200/80 hover:border-indigo-300 rounded-3xl p-6 shadow-card hover:shadow-soft flex flex-col justify-between space-y-5 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      LaTeX PDF
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{r.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{r.target_role || 'General Software Engineer'}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Updated {r.updated_at ? new Date(r.updated_at).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Link
                      to={`/editor/${r.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors border border-indigo-200/60"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </Link>

                    <button
                      onClick={(e) => handleDuplicate(r.id, e)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Duplicate Resume"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleDelete(r.id, e)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={createModal}
          onClose={() => setCreateModal(false)}
          title="Create New LaTeX Resume"
          maxWidth="md"
        >
          <form onSubmit={handleCreateResume} className="space-y-4">
            <Input
              label="Resume Title"
              placeholder="e.g. Sravan_ML_Engineer_Resume"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Input
              label="Target Role"
              placeholder="e.g. Full-Stack Python Developer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              required
            />

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Select LaTeX Template</label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      selectedTemplate === t.id
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-heading font-bold text-slate-900">{t.name}</p>
                    <span className="text-[10px] text-slate-500 uppercase">{t.category}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all mt-2"
            >
              Initialize Resume & Open Editor
            </button>
          </form>
        </Modal>

      </div>
    </div>
  );
};
