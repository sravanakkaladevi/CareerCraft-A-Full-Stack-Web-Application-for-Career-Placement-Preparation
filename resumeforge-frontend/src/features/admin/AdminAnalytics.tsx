import React from 'react';
import { BarChart3, Download, TrendingUp, Users, Cpu, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const AdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-extrabold text-slate-900">Platform Analytics & Intelligence</h1>
          <p className="text-xs text-slate-500">In-depth user retention metrics, AI model utilization, and PDF export reports.</p>
        </div>
        <button onClick={() => toast.success('Exporting full analytics report (CSV)...')} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto">
          <Download className="w-4 h-4" />
          <span>Export Audit & Analytics Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs">
            <Users className="w-4 h-4" />
            <span>Monthly Active Users (MAU)</span>
          </div>
          <div className="font-heading text-2xl font-black text-slate-900">8,421</div>
          <p className="text-[11px] text-slate-500">+8.7% growth over last 30 days period.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
            <FileText className="w-4 h-4" />
            <span>Total Resumes Generated</span>
          </div>
          <div className="font-heading text-2xl font-black text-slate-900">24,581</div>
          <p className="text-[11px] text-slate-500">Average ATS rating of 84.5% across all templates.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
            <Cpu className="w-4 h-4" />
            <span>AI Token Inferences</span>
          </div>
          <div className="font-heading text-2xl font-black text-slate-900">82,451</div>
          <p className="text-[11px] text-slate-500">Zero downtime reported on OpenRouter/Groq endpoints.</p>
        </div>
      </div>
    </div>
  );
};
