import React, { useState } from 'react';
import { Briefcase, Plus, Building, MapPin, Users, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const AdminJobs: React.FC = () => {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Senior Full Stack Engineer', company: 'TechCorp Solutions', location: 'Remote / San Francisco', type: 'Full-time', applications: 148, posted: '2 days ago', status: 'Active' },
    { id: 2, title: 'Python Backend Developer', company: 'DataScale Inc', location: 'Hybrid / New York', type: 'Full-time', applications: 92, posted: '5 days ago', status: 'Active' },
    { id: 3, title: 'AI Research Intern', company: 'Innovate AI Labs', location: 'Remote', type: 'Internship', applications: 310, posted: '1 week ago', status: 'Active' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: 'Remote',
    type: 'Full-time',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company) {
      toast.error('Job title and company name are required');
      return;
    }
    const newJob = {
      id: Date.now(),
      title: formData.title,
      company: formData.company,
      location: formData.location,
      type: formData.type,
      applications: 0,
      posted: 'Just now',
      status: 'Active',
    };
    setJobs([newJob, ...jobs]);
    toast.success(`Job opening "${formData.title}" posted successfully!`);
    setShowAddModal(false);
  };

  const openEditModal = (j: any) => {
    setSelectedJob(j);
    setFormData({
      title: j.title,
      company: j.company,
      location: j.location,
      type: j.type,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setJobs(jobs.map(j => j.id === selectedJob.id ? { ...j, ...formData } : j));
    toast.success(`Job "${formData.title}" updated!`);
    setShowEditModal(false);
    setSelectedJob(null);
  };

  const handleDelete = () => {
    if (selectedJob) {
      setJobs(jobs.filter(j => j.id !== selectedJob.id));
      toast.success(`Job opening "${selectedJob.title}" deleted.`);
      setShowDeleteModal(false);
      setSelectedJob(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-extrabold text-slate-900">Job Listings & Partner Companies</h1>
          <p className="text-xs text-slate-500">Post, Edit, Manage applications, and Delete active job opportunities.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ title: '', company: '', location: 'Remote', type: 'Full-time' });
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-sm text-slate-900">Active Job Postings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="py-3 px-4">Job Title</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Applications</th>
                <th className="py-3 px-4">Posted Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-extrabold text-slate-900">{j.title}</td>
                  <td className="py-3 px-4 text-slate-700 font-semibold">{j.company}</td>
                  <td className="py-3 px-4 text-slate-500">{j.location}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">{j.type}</span></td>
                  <td className="py-3 px-4 font-bold text-slate-800">{j.applications}</td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{j.posted}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEditModal(j)} className="p-1.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] cursor-pointer flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => { setSelectedJob(j); setShowDeleteModal(true); }} className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] cursor-pointer">
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

      {/* CREATE JOB MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">Post New Job Opening</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Job Title</label>
                <input type="text" required placeholder="e.g. Senior Backend Engineer" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Company Name</label>
                <input type="text" required placeholder="e.g. CareerCraft AI" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Location</label>
                  <input type="text" placeholder="Remote / Bengaluru" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Job Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold cursor-pointer shadow-md">Post Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT JOB MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">Edit Job Details</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Job Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Company Name</label>
                <input type="text" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Job Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
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

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto"><AlertTriangle className="w-6 h-6" /></div>
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-base text-slate-900">Delete Job Posting?</h3>
              <p className="text-xs text-slate-500">Are you sure you want to delete "{selectedJob?.title}"?</p>
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
