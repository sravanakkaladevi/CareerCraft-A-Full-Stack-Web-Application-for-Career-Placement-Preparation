import React, { useState } from 'react';
import { Search, Filter, Plus, Shield, UserX, Trash2, Edit, CheckCircle2, AlertTriangle, X, Eye } from 'lucide-react';
import { toast } from 'sonner';

export const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  // Stateful users list
  const [users, setUsers] = useState([
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Student', resumes: 3, atsScans: 5, lastLogin: '2 hours ago', status: 'Active', joined: 'Sep 20, 2026', avatar: '/avatars/student.jpg' },
    { id: 2, name: 'Priya Verma', email: 'priya@example.com', role: 'Fresher', resumes: 5, atsScans: 12, lastLogin: '1 day ago', status: 'Active', joined: 'Sep 18, 2026', avatar: '/avatars/fresher.jpg' },
    { id: 3, name: 'Arjun Kumar', email: 'arjun@example.com', role: 'Job Seeker', resumes: 2, atsScans: 8, lastLogin: '3 hours ago', status: 'Active', joined: 'Sep 15, 2026', avatar: '/avatars/jobseeker.jpg' },
    { id: 4, name: 'Sneha Patel', email: 'sneha@example.com', role: 'Professional', resumes: 8, atsScans: 20, lastLogin: '1 hour ago', status: 'Active', joined: 'Sep 12, 2026', avatar: '/avatars/professional.jpg' },
    { id: 5, name: 'Karthik Reddy', email: 'karthik@example.com', role: 'Student', resumes: 1, atsScans: 2, lastLogin: '2 days ago', status: 'Inactive', joined: 'Sep 10, 2026', avatar: '/avatars/student.jpg' },
    { id: 6, name: 'Ananya Rao', email: 'ananya@example.com', role: 'Fresher', resumes: 4, atsScans: 9, lastLogin: '5 hours ago', status: 'Active', joined: 'Sep 05, 2026', avatar: '/avatars/fresher.jpg' },
    { id: 7, name: 'Vikram Singh', email: 'vikram@example.com', role: 'Job Seeker', resumes: 6, atsScans: 15, lastLogin: '4 days ago', status: 'Suspended', joined: 'Aug 28, 2026', avatar: '/avatars/jobseeker.jpg' },
  ]);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Student',
    status: 'Active',
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handle Add User
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please enter both name and email.');
      return;
    }
    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      resumes: 0,
      atsScans: 0,
      lastLogin: 'Just now',
      status: formData.status,
      joined: 'Today',
      avatar: formData.role === 'Student' ? '/avatars/student.jpg' :
              formData.role === 'Fresher' ? '/avatars/fresher.jpg' :
              formData.role === 'Job Seeker' ? '/avatars/jobseeker.jpg' : '/avatars/professional.jpg',
    };
    setUsers([newUser, ...users]);
    toast.success(`User ${formData.name} added successfully!`);
    setShowAddModal(false);
    setFormData({ name: '', email: '', role: 'Student', status: 'Active' });
  };

  // Handle Edit User
  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    toast.success(`User ${formData.name} updated successfully!`);
    setShowEditModal(false);
    setEditingUser(null);
  };

  // Handle Delete User
  const handleDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      toast.success(`User ${userToDelete.name} deleted successfully.`);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleSuspend = (user: any) => {
    const updatedStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
    setUsers(users.map(u => u.id === user.id ? { ...u, status: updatedStatus } : u));
    toast.info(`User ${user.name} status changed to ${updatedStatus}.`);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-extrabold text-slate-900">User Management</h1>
          <p className="text-xs text-slate-500">Create, Edit, Delete, Suspend, and Audit all platform registered users.</p>
        </div>

        <button 
          onClick={() => {
            setFormData({ name: '', email: '', role: 'Student', status: 'Active' });
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Role Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {['All', 'Student', 'Fresher', 'Job Seeker', 'Professional'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                roleFilter === role
                  ? 'bg-purple-600 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Resumes</th>
                <th className="py-3 px-4">ATS Scans</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" src={user.avatar} alt={user.name} />
                      <span className="font-extrabold text-slate-900 text-xs">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      user.role === 'Student' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'Fresher' ? 'bg-pink-100 text-pink-700' :
                      user.role === 'Job Seeker' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{user.email}</td>
                  <td className="py-3 px-4 text-slate-800 font-bold">{user.resumes}</td>
                  <td className="py-3 px-4 text-slate-800 font-bold">{user.atsScans}</td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      user.status === 'Inactive' ? 'bg-slate-100 text-slate-600' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{user.joined}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button 
                        onClick={() => openEditModal(user)}
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Edit User"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleSuspend(user)}
                        className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-bold cursor-pointer"
                        title="Suspend / Activate User"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative my-auto max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">
              Add New User Account
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Reddy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium"
                  >
                    <option value="Student">Student</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Job Seeker">Job Seeker</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer shadow-md"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative my-auto max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">
              Edit User Details
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium"
                  >
                    <option value="Student">Student</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Job Seeker">Job Seeker</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Drawer Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-5 border border-slate-200 shadow-2xl relative my-auto max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <img className="w-14 h-14 rounded-2xl object-cover border border-slate-200" src={selectedUser.avatar} alt={selectedUser.name} />
              <div>
                <h3 className="font-heading font-extrabold text-lg text-slate-900">{selectedUser.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedUser.email}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[10px]">{selectedUser.role}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">{selectedUser.status}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-heading font-extrabold text-lg text-slate-900">{selectedUser.resumes}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Resumes</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-heading font-extrabold text-lg text-slate-900">{selectedUser.atsScans}</div>
                <div className="text-[10px] text-slate-500 font-semibold">ATS Scans</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-heading font-extrabold text-lg text-slate-900">4.8</div>
                <div className="text-[10px] text-slate-500 font-semibold">Rating</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between border-b border-slate-100 py-1.5"><span>Joined Date:</span> <span className="font-bold text-slate-900">{selectedUser.joined}</span></div>
              <div className="flex justify-between border-b border-slate-100 py-1.5"><span>Last Active:</span> <span className="font-bold text-slate-900">{selectedUser.lastLogin}</span></div>
              <div className="flex justify-between py-1.5"><span>Account ID:</span> <span className="font-mono text-slate-500">usr_89432{selectedUser.id}</span></div>
            </div>

            <button 
              onClick={() => setSelectedUser(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-16 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center border border-slate-200 shadow-2xl my-auto max-h-[85vh] overflow-y-auto">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-base text-slate-900">Delete User Account?</h3>
              <p className="text-xs text-slate-500">Are you sure you want to permanently delete {userToDelete?.name}? This action cannot be undone.</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
