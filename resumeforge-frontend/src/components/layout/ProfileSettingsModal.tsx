import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { User as UserIcon, Lock, Mail, Shield, Check, X, Camera, Key, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '../../types';

interface ProfileSettingsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser?: (updated: User) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ user, isOpen, onClose, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'account'>('profile');
  
  // Form State
  const [fullName, setFullName] = useState(user?.username || 'Sravan Kumar');
  const [email, setEmail] = useState(user?.email || 'sravansravan824@gmail');
  const [avatar, setAvatar] = useState(user?.avatar || '/avatars/professional.jpg');
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const avatarsList = [
    { src: '/avatars/student.jpg', label: 'Student' },
    { src: '/avatars/fresher.jpg', label: 'Fresher' },
    { src: '/avatars/jobseeker.jpg', label: 'Job Seeker' },
    { src: '/avatars/professional.jpg', label: 'Professional' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile settings and avatar updated successfully!');
      if (onUpdateUser && user) {
        onUpdateUser({ ...user, username: fullName, email, avatar });
      }
      onClose();
    }, 400);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully!');
      onClose();
    }, 400);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 border border-slate-200 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
          <div className="relative">
            <img className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-200 shadow-xs" src={avatar} alt="User Avatar" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <Camera className="w-3 h-3" />
            </div>
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-xl text-slate-900">{fullName}</h2>
            <p className="text-xs text-slate-500 font-mono">{email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
              {user?.username === 'sravan admin' ? 'Super Admin' : 'Candidate Account'}
            </span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'security' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Security & Password
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'account' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Account Details
          </button>
        </div>

        {/* TAB 1: PROFILE INFO & AVATAR PICKER */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            
            {/* Avatar Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">Select Profile Picture Avatar</label>
              <div className="grid grid-cols-4 gap-2">
                {avatarsList.map((av) => (
                  <div
                    key={av.src}
                    onClick={() => setAvatar(av.src)}
                    className={`p-1.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      avatar === av.src ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img className="w-10 h-10 rounded-xl object-cover" src={av.src} alt={av.label} />
                    <span className="text-[10px] font-semibold text-slate-700">{av.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Full Name / Display Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Current Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">New Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Confirm New Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: ACCOUNT DETAILS */}
        {activeTab === 'account' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-semibold">Username:</span>
                <span className="font-extrabold text-slate-900 font-mono">{user?.username}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-semibold">Account Role:</span>
                <span className="font-bold text-purple-700">{user?.username === 'sravan admin' ? 'Super Administrator' : 'Standard User'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-semibold">Member Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500 font-semibold">Platform:</span>
                <span className="font-bold text-slate-800">CareerCraft Placement Prep</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};
