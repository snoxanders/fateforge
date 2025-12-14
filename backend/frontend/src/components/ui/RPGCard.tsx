import React from 'react';

interface RPGCardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'magic' | 'danger';
  icon?: React.ReactNode;
  action?: React.ReactNode;
  info?: string;
}

export function RPGCard({ 
  title, 
  className = '', 
  children, 
  variant = 'default',
  icon,
  action,
  info
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
    <div className={`relative bg-gray-900/90 border-2 ${borderColors[variant]} rounded-lg shadow-xl overflow-visible transition-colors duration-300 group ${className}`}>
      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-600/60 rounded-tl-sm z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-600/60 rounded-tr-sm z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-600/60 rounded-bl-sm z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-600/60 rounded-br-sm z-10 pointer-events-none" />

      {title && (
        <div className={`px-4 py-3 flex items-center justify-between ${headerColors[variant]}`}>
          <div className="flex items-center gap-2">
            {icon && <span className="text-amber-500">{icon}</span>}
            <h3 className="font-serif font-bold text-lg text-amber-500 tracking-wide uppercase text-shadow-sm">
              {title}
            </h3>
            
            {/* Info Tooltip */}
            {info && (
              <div className="relative group/info ml-2 z-50">
                <div className="cursor-help text-stone-500 hover:text-amber-400 hover:border-amber-400 border border-stone-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-serif font-bold italic transition-colors">
                  i
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black/95 border border-amber-600/30 rounded-lg shadow-xl text-xs text-stone-300 opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none text-center backdrop-blur-sm">
                  {info}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black/95"></div>
                </div>
              </div>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      
      <div className="p-4 relative">
        {children}
      </div>
    </div>
  );
}
