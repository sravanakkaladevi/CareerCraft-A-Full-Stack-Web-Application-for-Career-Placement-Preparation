import React from 'react';
import { ShieldCheck, Lock, Globe, Clock } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const logs = [
    { id: 'log_01', admin: 'sravan admin (Super Admin)', action: 'Logged in to Admin Control', module: 'Auth System', ip: '127.0.0.1', timestamp: '10 mins ago' },
    { id: 'log_02', admin: 'sravan admin (Super Admin)', action: 'Updated ATS Scanner engine parameters', module: 'ATS Engine', ip: '127.0.0.1', timestamp: '1 hour ago' },
    { id: 'log_03', admin: 'sravan admin (Super Admin)', action: 'Created new Job Listing: Senior Full Stack Engineer', module: 'Job Management', ip: '127.0.0.1', timestamp: '3 hours ago' },
    { id: 'log_04', admin: 'sravan admin (Super Admin)', action: 'Suspended user Vikram Singh (ID: usr_894327)', module: 'User Control', ip: '127.0.0.1', timestamp: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-extrabold text-slate-900">System Audit Trail</h1>
          <p className="text-xs text-slate-500">Immutable security event logs capturing all administrator actions.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors font-mono">
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{log.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{log.admin}</td>
                  <td className="py-3 px-4 text-purple-700 font-semibold">{log.action}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">{log.module}</span></td>
                  <td className="py-3 px-4 text-slate-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
