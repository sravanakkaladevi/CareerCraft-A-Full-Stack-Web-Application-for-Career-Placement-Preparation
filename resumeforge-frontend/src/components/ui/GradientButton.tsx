import React from 'react';
import { motion } from 'motion/react';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  className = "",
  icon,
  type = "button",
  disabled = false,
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative inline-flex items-center justify-center p-[2px] overflow-hidden rounded-2xl font-semibold text-xs transition-all duration-200 group shadow-md shadow-indigo-500/20 ${className}`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:opacity-90 transition-opacity" />
      <span className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-[14px] bg-indigo-600 text-white font-bold transition-all duration-200 group-hover:bg-indigo-500">
        {icon}
        {children}
      </span>
    </motion.button>
  );
};
