import React, { useState } from 'react';
import { Code2, Plus, ExternalLink, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'AI Resume Synthesizer & LaTeX Compiler', category: 'AI / Full Stack', difficulty: 'Advanced', tech: 'Python, Django, React, LaTeX', submissions: 1420, status: 'Active' },
    { id: 2, name: 'Real-time Analytics Dashboard', category: 'Frontend', difficulty: 'Intermediate', tech: 'React, TypeScript, Recharts', submissions: 980, status: 'Active' },
    { id: 3, name: 'Microservices E-Commerce API', category: 'Backend', difficulty: 'Advanced', tech: 'Django, PostgreSQL, Redis', submissions: 1150, status: 'Active' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProj, setSelectedProj] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'AI / Full Stack',
    difficulty: 'Intermediate',
    tech: '',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Project name is required');
      return;
    }
    const newProj = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      difficulty: formData.difficulty,
      tech: formData.tech || 'Python, React, Django',
      submissions: 0,
      status: 'Active',
    };
    setProjects([newProj, ...projects]);
    toast.success(`Skill project "${formData.name}" added!`);
    setShowAddModal(false);
  };

  const openEditModal = (p: any) => {
    setSelectedProj(p);
    setFormData({
      name: p.name,
      category: p.category,
      difficulty: p.difficulty,
      tech: p.tech,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProj) return;
    setProjects(projects.map(p => p.id === selectedProj.id ? { ...p, ...formData } : p));
    toast.success(`Project "${formData.name}" updated!`);
    setShowEditModal(false);
    setSelectedProj(null);
  };

  const handleDelete = () => {
    if (selectedProj) {
      setProjects(projects.filter(p => p.id !== selectedProj.id));
      toast.success(`Project "${selectedProj.name}" deleted.`);
      setShowDeleteModal(false);
      setSelectedProj(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-extrabold text-slate-900">Skill Projects Control</h1>
          <p className="text-xs text-slate-500">Create, Edit, and Delete real-world capstone projects for student portfolios.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ name: '', category: 'AI / Full Stack', difficulty: 'Intermediate', tech: '' });
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill Project</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-sm text-slate-900">Skill Project Catalog</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="py-3 px-4">Project Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Technologies</th>
                <th className="py-3 px-4">Submissions</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-extrabold text-slate-900">{p.name}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">{p.category}</span></td>
                  <td className="py-3 px-4 font-bold text-purple-700">{p.difficulty}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{p.tech}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{p.submissions}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEditModal(p)} className="p-1.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] cursor-pointer flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => { setSelectedProj(p); setShowDeleteModal(true); }} className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] cursor-pointer">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">Add Skill Project</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Project Name</label>
                <input type="text" required placeholder="e.g. AI Resume Compiler" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium">
                    <option value="AI / Full Stack">AI / Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Difficulty</label>
                  <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tech Stack</label>
                <input type="text" placeholder="Python, Django, React" value={formData.tech} onChange={(e) => setFormData({ ...formData, tech: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold cursor-pointer shadow-md">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">Edit Skill Project</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Project Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium">
                    <option value="AI / Full Stack">AI / Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Difficulty</label>
                  <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tech Stack</label>
                <input type="text" value={formData.tech} onChange={(e) => setFormData({ ...formData, tech: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer shadow-md">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto"><AlertTriangle className="w-6 h-6" /></div>
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-base text-slate-900">Delete Project?</h3>
              <p className="text-xs text-slate-500">Are you sure you want to delete "{selectedProj?.name}"?</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer shadow-md">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
