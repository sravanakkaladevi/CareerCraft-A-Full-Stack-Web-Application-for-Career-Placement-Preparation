import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, Sparkles, HelpCircle, Cpu, ArrowUpRight, 
  Plus, Eye, MoreVertical, CheckCircle2, AlertTriangle, Activity, 
  UserPlus, Code2, Download, Calendar, Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { adminApi } from '../../services/api';
import { toast } from 'sonner';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('30 Days');
  const [userGrowthFilter, setUserGrowthFilter] = useState('30D');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getStats();
      setData(res);
    } catch {
      toast.error('Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  };

  const sparklineUsers = [{ v: 10 }, { v: 14 }, { v: 12 }, { v: 18 }, { v: 22 }, { v: 26 }, { v: 30 }];
  const sparklineActive = [{ v: 15 }, { v: 18 }, { v: 16 }, { v: 20 }, { v: 24 }, { v: 22 }, { v: 28 }];
  const sparklineResumes = [{ v: 20 }, { v: 25 }, { v: 22 }, { v: 30 }, { v: 35 }, { v: 40 }, { v: 45 }];
  const sparklineAts = [{ v: 25 }, { v: 28 }, { v: 32 }, { v: 38 }, { v: 42 }, { v: 48 }, { v: 54 }];
  const sparklineInterviews = [{ v: 12 }, { v: 15 }, { v: 14 }, { v: 20 }, { v: 22 }, { v: 25 }, { v: 30 }];
  const sparklineAi = [{ v: 40 }, { v: 45 }, { v: 52 }, { v: 60 }, { v: 70 }, { v: 78 }, { v: 85 }];

  return (
    <div className="space-y-6">
      
      {/* HEADER ROW matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 tracking-tight">
            Good morning, Admin! 👋
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            Monitor CareerCraft activity, users, AI usage and career tools from one place.
          </p>
        </div>

        {/* Date Range Selector Bar */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80 shrink-0 self-start sm:self-auto">
          {['Today', '7 Days', '30 Days', 'Custom'].map((df) => (
            <button
              key={df}
              onClick={() => setDateFilter(df)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateFilter === df
                  ? 'bg-white text-purple-700 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {df}
            </button>
          ))}
          <Calendar className="w-4 h-4 text-slate-400 ml-1 mr-1.5" />
        </div>
      </div>

      {/* 6 KPI CARDS ROW matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* KPI 1: Total Users */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div className="h-6 w-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineUsers}>
                  <Line type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Total Users</div>
            <div className="font-heading text-xl font-black text-slate-900">12,842</div>
            <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
              <span>↑ 12.4%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Active Users */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div className="h-6 w-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineActive}>
                  <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Active Users</div>
            <div className="font-heading text-xl font-black text-slate-900">8,421</div>
            <div className="text-[10px] font-bold text-emerald-600">↑ 8.7%</div>
          </div>
        </div>

        {/* KPI 3: Resumes Created */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div className="h-6 w-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineResumes}>
                  <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Resumes Created</div>
            <div className="font-heading text-xl font-black text-slate-900">24,581</div>
            <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
              <span>↑ 18.2%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 4: ATS Scans */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="h-6 w-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineAts}>
                  <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">ATS Scans</div>
            <div className="font-heading text-xl font-black text-slate-900">31,204</div>
            <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
              <span>↑ 21.5%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 5: Mock Interviews */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="h-6 w-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineInterviews}>
                  <Line type="monotone" dataKey="v" stroke="#ec4899" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Mock Interviews</div>
            <div className="font-heading text-xl font-black text-slate-900">14,892</div>
            <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
              <span>↑ 15.3%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 6: AI Requests */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="h-6 w-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineAi}>
                  <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">AI Requests</div>
            <div className="font-heading text-xl font-black text-slate-900">82,451</div>
            <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
              <span>↑ 27.1%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

      </div>

      {/* MAIN ANALYTICS SECTION matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: User Growth Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-sm text-slate-900">User Growth</h3>
              <p className="text-[11px] text-slate-500">New users and active users over time</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
              {['7D', '30D', '90D', '1Y'].map((f) => (
                <button
                  key={f}
                  onClick={() => setUserGrowthFilter(f)}
                  className={`px-2 py-0.5 rounded ${
                    userGrowthFilter === f ? 'bg-white text-purple-700 shadow-2xs font-extrabold' : 'text-slate-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.user_growth || []}>
                <defs>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                <Area type="monotone" dataKey="new_users" name="New Users" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNew)" />
                <Area type="monotone" dataKey="active_users" name="Active Users" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Center Column: Platform Distribution Donut Chart matching screenshot */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card space-y-4">
          <div>
            <h3 className="font-heading font-extrabold text-sm text-slate-900">Platform Distribution</h3>
            <p className="text-[11px] text-slate-500">User distribution by role</p>
          </div>

          <div className="relative h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.platform_distribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {(data?.platform_distribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-heading text-lg font-black text-slate-900">12,842</span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase">Total Users</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {(data?.platform_distribution || []).map((item: any) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Admin Quick Actions block matching screenshot */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-heading font-extrabold text-sm text-slate-900">Quick Actions</h3>
            <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700">View All</button>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => toast.success('Add User modal opened')}
              className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>

            <button 
              onClick={() => toast.success('Add Job modal opened')}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Add Job</span>
            </button>

            <button 
              onClick={() => toast.success('Add Content modal opened')}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Add Learning Content</span>
            </button>

            <button 
              onClick={() => toast.success('Add Question modal opened')}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-600" />
              <span>Add Interview Question</span>
            </button>

            <button 
              onClick={() => toast.success('Generating platform reports...')}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>View Reports</span>
            </button>
          </div>
        </div>

      </div>

      {/* SECOND ANALYTICS ROW matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Resume & ATS Activity Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card space-y-4">
          <div>
            <h3 className="font-heading font-extrabold text-sm text-slate-900">Resume & ATS Activity</h3>
            <p className="text-[11px] text-slate-500">Resumes created, downloads and ATS scans</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.resume_ats_activity || []}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                <Bar dataKey="created" name="Created" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="downloaded" name="Downloaded" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ats_scans" name="ATS Scans" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Center: AI Usage Multi-line Chart */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card space-y-4">
          <div>
            <h3 className="font-heading font-extrabold text-sm text-slate-900">AI Usage</h3>
            <p className="text-[11px] text-slate-500">AI feature usage over time</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.ai_usage || []}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                <Line type="monotone" dataKey="suggestions" name="Suggestions" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="improvements" name="Improvements" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="interview_ai" name="Interview AI" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="recs" name="Recommendations" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: System Health Box matching screenshot */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-heading font-extrabold text-sm text-slate-900">System Health</h3>
            <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700">View Details</button>
          </div>

          <div className="space-y-2.5 text-xs">
            {(data?.system_health || []).map((sh: any) => (
              <div key={sh.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-800 font-semibold">{sh.name}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  {sh.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: RECENT USERS TABLE & RECENT ACTIVITY TIMELINE matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Users Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-sm text-slate-900">Recent Users</h3>
            <button className="text-xs font-bold text-purple-600 hover:text-purple-700">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Resumes</th>
                  <th className="py-2.5 px-3">ATS Scans</th>
                  <th className="py-2.5 px-3">Last Active</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Joined</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data?.recent_users || []).map((user: any, idx: number) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0" src={user.avatar} alt={user.name} />
                        <span className="font-extrabold text-slate-900 text-xs">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        user.role === 'Student' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'Fresher' ? 'bg-pink-100 text-pink-700' :
                        user.role === 'Job Seeker' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] font-mono">{user.email}</td>
                    <td className="py-3 px-3 text-slate-700 font-bold">{user.resumes}</td>
                    <td className="py-3 px-3 text-slate-700 font-bold">{user.ats_scans}</td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">{user.last_active}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">{user.joined}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => toast.info(`Viewing user: ${user.name}`)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                        >
                          View
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent Platform Activity Timeline */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-sm text-slate-900">Recent Platform Activity</h3>
            <button className="text-xs font-bold text-purple-600 hover:text-purple-700">View All</button>
          </div>

          <div className="space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-slate-100">
            {(data?.recent_activity || []).map((act: any) => (
              <div key={act.id} className="flex items-start gap-3 relative z-10">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  act.type === 'user' ? 'bg-purple-100 text-purple-600' :
                  act.type === 'resume' ? 'bg-blue-100 text-blue-600' :
                  act.type === 'ats' ? 'bg-emerald-100 text-emerald-600' :
                  act.type === 'interview' ? 'bg-pink-100 text-pink-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">{act.title}</span>
                    <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
