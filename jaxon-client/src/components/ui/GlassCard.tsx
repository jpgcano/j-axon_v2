import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export function GlassCard({ children, className = '', interactive = false, ...props }: GlassCardProps) {
  const baseClass = interactive ? 'glass-panel-interactive' : 'glass-panel';
  
  return (
    <div className={`${baseClass} p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
