import React, { useState, useEffect } from 'react';
import { Code2, GitBranch, ExternalLink, Layers, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { assessmentApi } from '../../services/api';
import { ProjectDomain } from '../../types';
import { toast } from 'sonner';

export const SkillAssessmentPage: React.FC = () => {
  const [domains, setDomains] = useState<ProjectDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const data = await assessmentApi.getDomains();
      setDomains(data);
    } catch (err) {
      toast.error('Failed to load project domains');
    } finally {
      setLoading(false);
    }
  };

  const domainNames = ['All', ...domains.map((d) => d.name)];

  const filteredDomains = selectedDomain === 'All'
    ? domains
    : domains.filter((d) => d.name === selectedDomain);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 bg-grid-light">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold mb-2">
              <Code2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Placement Project Blueprints</span>
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
              Skill Assessment & Project Incubator
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Curated full-stack & domain project specs across 8 engineering domains to build high-signal resume projects.
            </p>
          </div>
        </motion.div>

        {/* Domain Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {domainNames.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedDomain(name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDomain === name
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {name} Projects
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">Loading project specifications...</div>
        ) : (
          <div className="space-y-10">
            {filteredDomains.map((domain) => (
              <div key={domain.name} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-600" />
                      {domain.name} Domain
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">{domain.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {domain.ideas.map((idea, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -4 }}
                      className="bg-white/90 border border-slate-200/80 rounded-3xl p-6 shadow-card hover:shadow-soft transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {idea.subdomain}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{idea.impact}</span>
                          </div>
                        </div>

                        <h3 className="font-heading text-base font-bold text-slate-900 leading-snug">{idea.name}</h3>

                        <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                          <p><strong className="text-slate-800">Tech Stack:</strong> {idea.tools}</p>
                          <p><strong className="text-slate-800">Database:</strong> {idea.database}</p>
                          <p><strong className="text-slate-800">Language:</strong> {idea.language}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">Difficulty: {idea.difficulty}</span>
                        {idea.github && (
                          <a
                            href={idea.github.startsWith('http') ? idea.github : `https://${idea.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
                          >
                            <GitBranch className="w-3.5 h-3.5" />
                            GitHub Repo
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
