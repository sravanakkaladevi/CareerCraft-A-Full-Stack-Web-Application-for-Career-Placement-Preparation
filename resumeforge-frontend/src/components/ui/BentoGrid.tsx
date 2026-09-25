import React from 'react';
import { motion } from 'motion/react';

export const BentoGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  );
};

export const BentoGridItem: React.FC<{
  title: string;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  badge?: string;
  linkText?: string;
}> = ({
  title,
  description,
  header,
  icon,
  className = "",
  onClick,
  badge,
  linkText = "Explore Module",
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`row-span-1 rounded-3xl p-6 bg-white/90 border border-slate-200/80 shadow-card hover:shadow-glow-indigo transition-all duration-300 flex flex-col justify-between space-y-4 group cursor-pointer relative overflow-hidden ${className}`}
    >
      {/* Background Hover Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div>
        {header}
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-xs group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            {icon}
          </div>
          {badge && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
              {badge}
            </span>
          )}
        </div>

        <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex items-center text-xs font-semibold text-indigo-600 pt-3 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
        <span>{linkText}</span>
        <svg className="w-3.5 h-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </motion.div>
  );
};
