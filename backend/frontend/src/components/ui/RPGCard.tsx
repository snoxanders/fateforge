import React from 'react';

interface RPGCardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'magic' | 'danger';
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function RPGCard({ 
  title, 
  className = '', 
  children, 
  variant = 'default',
  icon,
  action
}: RPGCardProps) {
  const borderColors = {
    default: 'border-stone-700 hover:border-amber-600/50',
    magic: 'border-indigo-800 hover:border-indigo-500/50',
    danger: 'border-red-900 hover:border-red-700/50'
  };

  const headerColors = {
    default: 'bg-stone-900/80 border-b border-stone-800',
    magic: 'bg-indigo-950/50 border-b border-indigo-900/50',
    danger: 'bg-red-950/30 border-b border-red-900/30'
  };

  return (
    <div className={`relative bg-gray-900/90 border-2 ${borderColors[variant]} rounded-lg shadow-xl overflow-hidden transition-colors duration-300 group ${className}`}>
      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-600/60 rounded-tl-sm z-10" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-600/60 rounded-tr-sm z-10" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-600/60 rounded-bl-sm z-10" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-600/60 rounded-br-sm z-10" />

      {title && (
        <div className={`px-4 py-3 flex items-center justify-between ${headerColors[variant]}`}>
          <div className="flex items-center gap-2">
            {icon && <span className="text-amber-500">{icon}</span>}
            <h3 className="font-serif font-bold text-lg text-amber-500 tracking-wide uppercase text-shadow-sm">
              {title}
            </h3>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      
      <div className="p-4 relative">
        {/* Subtle texture overlay if desired, keeping it clean for now */}
        {children}
      </div>
    </div>
  );
}


