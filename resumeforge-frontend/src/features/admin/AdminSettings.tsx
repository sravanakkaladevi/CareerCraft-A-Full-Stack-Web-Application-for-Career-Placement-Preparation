import React, { useState } from 'react';
import { Settings, Shield, Cpu, Bell, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const AdminSettings: React.FC = () => {
  const [platformName, setPlatformName] = useState('CareerCraft');
  const [aiModel, setAiModel] = useState('groq/llama-3.3-70b-versatile');
  const [maxResumesPerUser, setMaxResumesPerUser] = useState('20');
  const [latexEngine, setLatexEngine] = useState('pdflatex');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Admin platform settings updated successfully.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-extrabold text-slate-900">Platform Settings & Control</h1>
          <p className="text-xs text-slate-500">Configure global parameters, AI model connections, and system security policies.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 space-y-6">
        
        {/* Section 1: General */}
        <div className="space-y-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 font-heading font-extrabold text-sm text-slate-900">
            <Settings className="w-4 h-4 text-purple-600" />
            <span>General Platform Parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Platform Title</label>
              <input 
                type="text" 
                value={platformName} 
                onChange={(e) => setPlatformName(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Max Resumes per User Account</label>
              <input 
                type="number" 
                value={maxResumesPerUser} 
                onChange={(e) => setMaxResumesPerUser(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: AI & Engine Settings */}
        <div className="space-y-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 font-heading font-extrabold text-sm text-slate-900">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>AI Model & LaTeX Configuration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Primary AI Inference Model</label>
              <select 
                value={aiModel} 
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              >
                <option value="groq/llama-3.3-70b-versatile">Groq Llama-3.3-70b-versatile (Recommended)</option>
                <option value="openai/gpt-4o-mini">OpenAI GPT-4o-mini</option>
                <option value="anthropic/claude-3-haiku">Anthropic Claude 3 Haiku</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">LaTeX PDF Compiler Engine</label>
              <select 
                value={latexEngine} 
                onChange={(e) => setLatexEngine(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              >
                <option value="pdflatex">pdflatex (Local CLI Compiler)</option>
                <option value="xelatex">xelatex (Unicode Support)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Admin Accounts & Credentials */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-heading font-extrabold text-sm text-slate-900">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Admin Control Access</span>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center justify-between">
            <div>
              <div className="font-bold text-xs">Super Admin Account</div>
              <div className="text-[11px] text-purple-700">Username: <code className="font-mono bg-purple-100 px-1.5 py-0.5 rounded">sravan admin</code></div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white font-bold text-[10px]">Super Admin Active</span>
          </div>
        </div>

        <button 
          type="submit" 
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          Save Platform Settings
        </button>

      </form>
    </div>
  );
};
