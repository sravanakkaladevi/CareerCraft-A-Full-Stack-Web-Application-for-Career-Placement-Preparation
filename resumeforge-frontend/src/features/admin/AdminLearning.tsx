import React, { useState } from 'react';
import { BookOpen, Plus, Eye, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const AdminLearning: React.FC = () => {
  const [courses, setCourses] = useState([
    { id: 1, title: 'Python Full Stack Mastery', category: 'Backend Development', lessons: 32, enrolled: 4890, completion: '84%', status: 'Published' },
    { id: 2, title: 'React 19 & Modern Web Architecture', category: 'Frontend', lessons: 28, enrolled: 3910, completion: '78%', status: 'Published' },
    { id: 3, title: 'Data Structures & Algorithms in Python', category: 'CS Fundamentals', lessons: 45, enrolled: 6120, completion: '91%', status: 'Published' },
    { id: 4, title: 'System Design for Tech Interviews', category: 'Advanced', lessons: 20, enrolled: 2450, completion: '72%', status: 'Draft' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Backend Development',
    lessons: 20,
    status: 'Published',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Course title is required');
      return;
    }
    const newC = {
      id: Date.now(),
      title: formData.title,
      category: formData.category,
      lessons: Number(formData.lessons),
      enrolled: 1,
      completion: '100%',
      status: formData.status,
    };
    setCourses([newC, ...courses]);
    toast.success(`Course "${formData.title}" created successfully!`);
    setShowAddModal(false);
  };

  const openEditModal = (c: any) => {
    setSelectedCourse(c);
    setFormData({
      title: c.title,
      category: c.category,
      lessons: c.lessons,
      status: c.status,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, ...formData, lessons: Number(formData.lessons) } : c));
    toast.success(`Course "${formData.title}" updated!`);
    setShowEditModal(false);
    setSelectedCourse(null);
  };

  const handleDelete = () => {
    if (selectedCourse) {
      setCourses(courses.filter(c => c.id !== selectedCourse.id));
      toast.success(`Course "${selectedCourse.title}" deleted.`);
      setShowDeleteModal(false);
      setSelectedCourse(null);
    }
  };

  const toggleStatus = (c: any) => {
    const updatedStatus = c.status === 'Published' ? 'Draft' : 'Published';
    setCourses(courses.map(item => item.id === c.id ? { ...item, status: updatedStatus } : item));
    toast.info(`Course "${c.title}" status changed to ${updatedStatus}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-extrabold text-slate-900">Learning Hub & Course Management</h1>
          <p className="text-xs text-slate-500">Create, Edit, Publish/Unpublish, and Delete learning roadmaps and course modules.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ title: '', category: 'Backend Development', lessons: 20, status: 'Published' });
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-sm text-slate-900">Active Learning Roadmaps & Courses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="py-3 px-4">Course Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Lessons</th>
                <th className="py-3 px-4">Students Enrolled</th>
                <th className="py-3 px-4">Completion Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-extrabold text-slate-900">{c.title}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">{c.category}</span></td>
                  <td className="py-3 px-4 text-slate-800 font-bold">{c.lessons}</td>
                  <td className="py-3 px-4 text-slate-800 font-bold">{c.enrolled.toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">{c.completion}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${c.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEditModal(c)} className="p-1.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] cursor-pointer flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => toggleStatus(c)} className="p-1.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[10px] cursor-pointer">Toggle Status</button>
                      <button onClick={() => { setSelectedCourse(c); setShowDeleteModal(true); }} className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] cursor-pointer">
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

      {/* CREATE COURSE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">Add New Course</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Course Title</label>
                <input type="text" required placeholder="e.g. Next.js 15 Full Stack" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium">
                  <option value="Backend Development">Backend Development</option>
                  <option value="Frontend">Frontend</option>
                  <option value="CS Fundamentals">CS Fundamentals</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Lessons Count</label>
                  <input type="number" min="1" max="100" value={formData.lessons} onChange={(e) => setFormData({ ...formData, lessons: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Publish Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium">
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold cursor-pointer shadow-md">Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COURSE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">Edit Course Details</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Course Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium">
                  <option value="Backend Development">Backend Development</option>
                  <option value="Frontend">Frontend</option>
                  <option value="CS Fundamentals">CS Fundamentals</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Lessons Count</label>
                  <input type="number" min="1" max="100" value={formData.lessons} onChange={(e) => setFormData({ ...formData, lessons: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Publish Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium">
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
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
              <h3 className="font-heading font-extrabold text-base text-slate-900">Delete Course?</h3>
              <p className="text-xs text-slate-500">Are you sure you want to delete "{selectedCourse?.title}"?</p>
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
