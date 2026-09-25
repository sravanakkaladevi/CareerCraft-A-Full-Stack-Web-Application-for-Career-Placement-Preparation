import React, { useState } from 'react';
import { Sparkles, CheckCircle, AlertTriangle, FileText, Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export const AdminAts: React.FC = () => {
  const [scans, setScans] = useState([
    { id: 'ats_01', user: 'Ananya Rao', resume: 'AI ML Resume.pdf', score: 95, keywords: 'Python, PyTorch, Scikit-Learn', date: '10 mins ago', status: 'Passed' },
    { id: 'ats_02', user: 'Sneha Patel', resume: 'Senior Dev.pdf', score: 92, keywords: 'React, Node.js, PostgreSQL', date: '45 mins ago', status: 'Passed' },
    { id: 'ats_03', user: 'Priya Verma', resume: 'Frontend Dev.pdf', score: 88, keywords: 'JavaScript, HTML5, CSS3', date: '2 hours ago', status: 'Passed' },
    { id: 'ats_04', user: 'Rahul Sharma', resume: 'Student Resume.pdf', score: 84, keywords: 'Python, Django, React', date: '3 hours ago', status: 'Passed' },
    { id: 'ats_05', user: 'Arjun Kumar', resume: 'Data Analyst.pdf', score: 79, keywords: 'SQL, Tableau, Excel', date: '5 hours ago', status: 'Warning' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedScan, setSelectedScan] = useState<any>(null);

  const [formData, setFormData] = useState({
    user: '',
    resume: '',
    score: 88,
    keywords: '',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user || !formData.resume) {
      toast.error('User name and resume file name are required.');
      return;
    }
    const newScan = {
      id: `ats_${Date.now()}`,
      user: formData.user,
      resume: formData.resume,
      score: Number(formData.score),
      keywords: formData.keywords || 'Python, React, Django',
      date: 'Just now',
      status: Number(formData.score) >= 80 ? 'Passed' : 'Warning',
    };
    setScans([newScan, ...scans]);
    toast.success(`ATS Scan log created for ${formData.user}`);
    setShowAddModal(false);
    setFormData({ user: '', resume: '', score: 88, keywords: '' });
  };

  const openEditModal = (scan: any) => {
    setSelectedScan(scan);
    setFormData({
      user: scan.user,
      resume: scan.resume,
      score: scan.score,
      keywords: scan.keywords,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScan) return;
    setScans(scans.map(s => s.id === selectedScan.id ? { ...s, ...formData, score: Number(formData.score) } : s));
    toast.success(`ATS Scan log updated!`);
    setShowEditModal(false);
    setSelectedScan(null);
  };

  const handleDelete = () => {
    if (selectedScan) {
      setScans(scans.filter(s => s.id !== selectedScan.id));
      toast.success(`ATS Scan record deleted.`);
      setShowDeleteModal(false);
      setSelectedScan(null);
    }
  };

  const distributions = [
    { range: '90–100', percentage: '34%', count: 10609, color: 'bg-emerald-500' },
    { range: '80–89', percentage: '42%', count: 13105, color: 'bg-blue-500' },
    { range: '70–79', percentage: '16%', count: 4992, color: 'bg-amber-500' },
    { range: '60–69', percentage: '6%', count: 1872, color: 'bg-orange-500' },
    { range: 'Below 60', percentage: '2%', count: 626, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-extrabold text-slate-900">ATS Engine Control & Analytics</h1>
          <p className="text-xs text-slate-500">Create test scans, edit rule logs, monitor score distributions, and delete records.</p>
        </div>

        <button 
          onClick={() => {
            setFormData({ user: '', resume: '', score: 88, keywords: '' });
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Test ATS Scan</span>
        </button>
      </div>

      {/* Score Distribution Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {distributions.map((dist) => (
          <div key={dist.range} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Score {dist.range}</span>
              <span className="font-extrabold text-slate-900">{dist.percentage}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className={`h-full ${dist.color}`} style={{ width: dist.percentage }} />
            </div>
            <div className="text-[10px] text-slate-400 font-semibold">{dist.count.toLocaleString()} scans</div>
          </div>
        ))}
      </div>

      {/* Recent Scans Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-sm text-slate-900">Recent ATS Scan Logs</h3>
          <span className="text-xs font-bold text-purple-600">{scans.length + 31200} Total Scans</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Resume File</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Matched Keywords</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-extrabold text-slate-900">{scan.user}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{scan.resume}</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">{scan.score}%</td>
                  <td className="py-3 px-4 text-slate-500">{scan.keywords}</td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{scan.date}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEditModal(scan)} className="p-1.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] cursor-pointer flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => { setSelectedScan(scan); setShowDeleteModal(true); }} className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] cursor-pointer">
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

      {/* CREATE SCAN MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">Add ATS Scan Entry</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">User Name</label>
                <input type="text" required placeholder="e.g. Sravan Kumar" value={formData.user} onChange={(e) => setFormData({ ...formData, user: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Resume File Name</label>
                <input type="text" required placeholder="Resume_FullStack.pdf" value={formData.resume} onChange={(e) => setFormData({ ...formData, resume: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Score (%)</label>
                  <input type="number" min="0" max="100" value={formData.score} onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Keywords</label>
                  <input type="text" placeholder="Python, Django, AI" value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold cursor-pointer shadow-md">Create Scan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SCAN MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">Edit ATS Scan Record</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">User Name</label>
                <input type="text" required value={formData.user} onChange={(e) => setFormData({ ...formData, user: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Resume File Name</label>
                <input type="text" required value={formData.resume} onChange={(e) => setFormData({ ...formData, resume: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Score (%)</label>
                  <input type="number" min="0" max="100" value={formData.score} onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Keywords</label>
                  <input type="text" value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
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
              <h3 className="font-heading font-extrabold text-base text-slate-900">Delete ATS Scan Record?</h3>
              <p className="text-xs text-slate-500">Are you sure you want to delete scan record for {selectedScan?.user}?</p>
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
