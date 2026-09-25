import React, { useState } from 'react';
import { FileText, Download, Eye, Layers, Search, Filter, Plus, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const AdminResumes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [resumes, setResumes] = useState([
    { id: 'res_01', title: 'Senior Software Engineer Resume', user: 'Sneha Patel', role: 'Working Professional', template: 'Modern Tech', atsScore: 92, updated: '2 hours ago', downloads: 14 },
    { id: 'res_02', title: 'Frontend Developer Entry Level', user: 'Priya Verma', role: 'Fresher', template: 'ATS Classic', atsScore: 88, updated: '5 hours ago', downloads: 8 },
    { id: 'res_03', title: 'Full Stack Web Developer', user: 'Rahul Sharma', role: 'Student', template: 'Clean Professional', atsScore: 84, updated: '1 day ago', downloads: 5 },
    { id: 'res_04', title: 'Data Analyst Resume', user: 'Arjun Kumar', role: 'Job Seeker', template: 'Executive', atsScore: 79, updated: '2 days ago', downloads: 11 },
    { id: 'res_05', title: 'AI/ML Engineer Resume', user: 'Ananya Rao', role: 'Fresher', template: 'Modern Tech', atsScore: 95, updated: '3 days ago', downloads: 19 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    user: '',
    template: 'Modern Tech',
    atsScore: 85,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.user) {
      toast.error('Title and user name are required');
      return;
    }
    const newRes = {
      id: `res_${Date.now()}`,
      title: formData.title,
      user: formData.user,
      role: 'Candidate',
      template: formData.template,
      atsScore: Number(formData.atsScore),
      updated: 'Just now',
      downloads: 0,
    };
    setResumes([newRes, ...resumes]);
    toast.success(`Resume "${formData.title}" created successfully!`);
    setShowAddModal(false);
    setFormData({ title: '', user: '', template: 'Modern Tech', atsScore: 85 });
  };

  const openEditModal = (res: any) => {
    setSelectedResume(res);
    setFormData({
      title: res.title,
      user: res.user,
      template: res.template,
      atsScore: res.atsScore,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResume) return;
    setResumes(resumes.map(r => r.id === selectedResume.id ? { ...r, ...formData, atsScore: Number(formData.atsScore) } : r));
    toast.success(`Resume "${formData.title}" updated successfully!`);
    setShowEditModal(false);
    setSelectedResume(null);
  };

  const handleDelete = () => {
    if (selectedResume) {
      setResumes(resumes.filter(r => r.id !== selectedResume.id));
      toast.success(`Resume "${selectedResume.title}" deleted successfully.`);
      setShowDeleteModal(false);
      setSelectedResume(null);
    }
  };

  const filteredResumes = resumes.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.template.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-extrabold text-slate-900">Resume & Template Management</h1>
          <p className="text-xs text-slate-500">Add, Edit, Preview, Download, and Delete resumes or system templates.</p>
        </div>

        <button
          onClick={() => {
            setFormData({ title: '', user: '', template: 'Modern Tech', atsScore: 85 });
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Resume</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card">
          <div className="text-[11px] font-semibold text-slate-500">Total Resumes</div>
          <div className="font-heading text-xl font-black text-slate-900">{resumes.length + 24580}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card">
          <div className="text-[11px] font-semibold text-slate-500">PDF Downloads</div>
          <div className="font-heading text-xl font-black text-slate-900">18,920</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card">
          <div className="text-[11px] font-semibold text-slate-500">Active Templates</div>
          <div className="font-heading text-xl font-black text-slate-900">12</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card">
          <div className="text-[11px] font-semibold text-slate-500">Average Score</div>
          <div className="font-heading text-xl font-black text-emerald-600">86.2%</div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-sm text-slate-900">All Created Resumes</h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resumes..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="py-3 px-4">Resume Title</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Template</th>
                <th className="py-3 px-4">ATS Score</th>
                <th className="py-3 px-4">Downloads</th>
                <th className="py-3 px-4">Last Modified</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResumes.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-extrabold text-slate-900">{res.title}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{res.user}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">{res.template}</span></td>
                  <td className="py-3 px-4 font-bold text-emerald-600">{res.atsScore}%</td>
                  <td className="py-3 px-4 text-slate-700 font-bold">{res.downloads}</td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{res.updated}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEditModal(res)} className="p-1.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold cursor-pointer flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => toast.success(`Downloading PDF for ${res.title}`)} className="p-1.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold cursor-pointer">Download</button>
                      <button onClick={() => { setSelectedResume(res); setShowDeleteModal(true); }} className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold cursor-pointer">
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

      {/* CREATE RESUME MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">Add New Resume</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Resume Title</label>
                <input type="text" required placeholder="e.g. Backend Lead Resume" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">User / Candidate Name</label>
                <input type="text" required placeholder="e.g. Sravan Kumar" value={formData.user} onChange={(e) => setFormData({ ...formData, user: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Template</label>
                  <select value={formData.template} onChange={(e) => setFormData({ ...formData, template: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium">
                    <option value="Modern Tech">Modern Tech</option>
                    <option value="ATS Classic">ATS Classic</option>
                    <option value="Clean Professional">Clean Professional</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Initial ATS Score (%)</label>
                  <input type="number" min="0" max="100" value={formData.atsScore} onChange={(e) => setFormData({ ...formData, atsScore: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold cursor-pointer shadow-md">Create Resume</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT RESUME MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">Edit Resume Entry</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Resume Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">User Name</label>
                <input type="text" required value={formData.user} onChange={(e) => setFormData({ ...formData, user: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Template</label>
                  <select value={formData.template} onChange={(e) => setFormData({ ...formData, template: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium">
                    <option value="Modern Tech">Modern Tech</option>
                    <option value="ATS Classic">ATS Classic</option>
                    <option value="Clean Professional">Clean Professional</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ATS Score (%)</label>
                  <input type="number" min="0" max="100" value={formData.atsScore} onChange={(e) => setFormData({ ...formData, atsScore: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer shadow-md">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto"><AlertTriangle className="w-6 h-6" /></div>
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-base text-slate-900">Delete Resume?</h3>
              <p className="text-xs text-slate-500">Are you sure you want to delete "{selectedResume?.title}"? This cannot be undone.</p>
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
