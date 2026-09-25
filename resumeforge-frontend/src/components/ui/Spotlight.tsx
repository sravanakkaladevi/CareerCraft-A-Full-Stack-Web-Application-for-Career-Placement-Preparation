import React from 'react';
import { motion } from 'motion/react';

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export const Spotlight: React.FC<SpotlightProps> = ({
  className = "",
  fill = "rgba(99, 102, 241, 0.15)",
}) => {
  return (
    <div
      className={`pointer-events-none absolute -top-40 left-0 right-0 h-[500px] w-full overflow-hidden opacity-80 ${className}`}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[120px]"
        style={{ background: fill }}
      />
    </div>
  );
};
