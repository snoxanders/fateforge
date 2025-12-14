import React from 'react';

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, icon, action, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-end justify-between border-b-2 border-stone-700 pb-2 mb-4 ${className}`}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-amber-600 mb-0.5">{icon}</span>}
        <h2 className="text-xl font-serif font-bold text-stone-200 tracking-wider uppercase">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}


