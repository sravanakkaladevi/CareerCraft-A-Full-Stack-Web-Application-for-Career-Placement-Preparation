import React, { useState } from 'react';
import { HelpCircle, Plus, CheckCircle, Clock, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const AdminInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState([
    { id: 1, user: 'Rahul Sharma', type: 'Technical (Python/Django)', questions: 10, score: '88%', duration: '18 mins', status: 'Completed', date: '1 hour ago' },
    { id: 2, user: 'Priya Verma', type: 'HR & Behavioral', questions: 8, score: '92%', duration: '14 mins', status: 'Completed', date: '3 hours ago' },
    { id: 3, user: 'Sneha Patel', type: 'System Design', questions: 5, score: '85%', duration: '25 mins', status: 'Completed', date: '1 day ago' },
    { id: 4, user: 'Arjun Kumar', type: 'Data Structures & Algo', questions: 12, score: '74%', duration: '22 mins', status: 'Completed', date: '2 days ago' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    user: '',
    type: 'Technical (Python/Django)',
    questions: 10,
    score: '85%',
    duration: '15 mins',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user) {
      toast.error('Candidate user name is required');
      return;
    }
    const newItem = {
      id: Date.now(),
      user: formData.user,
      type: formData.type,
      questions: Number(formData.questions),
      score: formData.score.endsWith('%') ? formData.score : `${formData.score}%`,
      duration: formData.duration,
      status: 'Completed',
      date: 'Just now',
    };
    setInterviews([newItem, ...interviews]);
    toast.success(`Mock Interview session added for ${formData.user}`);
    setShowAddModal(false);
  };

  const openEditModal = (item: any) => {
    setSelectedItem(item);
    setFormData({
      user: item.user,
      type: item.type,
      questions: item.questions,
      score: item.score,
      duration: item.duration,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setInterviews(interviews.map(i => i.id === selectedItem.id ? { ...i, ...formData } : i));
    toast.success(`Interview session updated!`);
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const handleDelete = () => {
    if (selectedItem) {
      setInterviews(interviews.filter(i => i.id !== selectedItem.id));
      toast.success(`Interview record deleted.`);
      setShowDeleteModal(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-extrabold text-slate-900">Mock Interview Control</h1>
          <p className="text-xs text-slate-500">Create interview sessions, edit question modules, and delete logs.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ user: '', type: 'Technical (Python/Django)', questions: 10, score: '85%', duration: '15 mins' });
            setShowAddModal(true);
          }} 
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Interview Session</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-sm text-slate-900">Recent Interview Sessions</h3>
          <span className="text-xs font-bold text-purple-600">{interviews.length + 14890} Total Completed</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Interview Category</th>
                <th className="py-3 px-4">Questions</th>
                <th className="py-3 px-4">AI Score</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {interviews.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-extrabold text-slate-900">{item.user}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{item.type}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{item.questions}</td>
                  <td className="py-3 px-4 font-bold text-purple-700">{item.score}</td>
                  <td className="py-3 px-4 text-slate-500">{item.duration}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">{item.status}</span></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEditModal(item)} className="p-1.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] cursor-pointer flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => { setSelectedItem(item); setShowDeleteModal(true); }} className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] cursor-pointer">
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
            <h3 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">Add Interview Session</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">User / Candidate Name</label>
                <input type="text" required placeholder="e.g. Sravan Kumar" value={formData.user} onChange={(e) => setFormData({ ...formData, user: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Interview Category</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium">
                  <option value="Technical (Python/Django)">Technical (Python/Django)</option>
                  <option value="HR & Behavioral">HR & Behavioral</option>
                  <option value="System Design">System Design</option>
                  <option value="Data Structures & Algo">Data Structures & Algo</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Questions</label>
                  <input type="number" min="1" max="50" value={formData.questions} onChange={(e) => setFormData({ ...formData, questions: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Score (%)</label>
                  <input type="text" placeholder="88%" value={formData.score} onChange={(e) => setFormData({ ...formData, score: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold cursor-pointer shadow-md">Add Session</button>
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
            <h3 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">Edit Interview Session</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">User / Candidate Name</label>
                <input type="text" required value={formData.user} onChange={(e) => setFormData({ ...formData, user: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Interview Category</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium">
                  <option value="Technical (Python/Django)">Technical (Python/Django)</option>
                  <option value="HR & Behavioral">HR & Behavioral</option>
                  <option value="System Design">System Design</option>
                  <option value="Data Structures & Algo">Data Structures & Algo</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Questions</label>
                  <input type="number" min="1" max="50" value={formData.questions} onChange={(e) => setFormData({ ...formData, questions: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Score (%)</label>
                  <input type="text" value={formData.score} onChange={(e) => setFormData({ ...formData, score: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
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
              <h3 className="font-heading font-extrabold text-base text-slate-900">Delete Session Record?</h3>
              <p className="text-xs text-slate-500">Are you sure you want to delete session for {selectedItem?.user}?</p>
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
