import { ReactNode } from 'react';

// --- Attribute Box ---
interface AttributeBoxProps {
  label: string;
  value: number;
  modifier: number;
  save?: number;
  onRoll?: () => void;
}

export function AttributeBox({ label, value, modifier, save, onRoll }: AttributeBoxProps) {
  const modStr = modifier >= 0 ? `+${modifier}` : modifier;
  const saveStr = save !== undefined ? (save >= 0 ? `+${save}` : save) : null;

  return (
    <div 
      className="bg-stone-900 border-2 border-stone-700 rounded-lg p-2 flex flex-col items-center shadow-lg hover:border-amber-600/60 transition-colors cursor-pointer group"
      onClick={onRoll}
    >
      <div className="text-[10px] font-bold text-stone-500 tracking-widest uppercase mb-1 group-hover:text-amber-500 transition-colors">
        {label}
      </div>
      <div className="text-3xl font-serif font-bold text-stone-100 leading-none mb-1 text-shadow">
        {modStr}
      </div>
      <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center border border-stone-600 text-sm font-bold text-stone-400 mb-1">
        {value}
      </div>
      {saveStr && (
        <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-1">
          <span>Sv:</span>
          <span className="text-stone-300 font-bold">{saveStr}</span>
        </div>
      )}
    </div>
  );
}

// --- Stat Shield (AC, etc) ---
interface StatShieldProps {
  label: string;
  value: number | string;
  sublabel?: string;
  icon?: ReactNode;
  variant?: 'default' | 'hp' | 'initiative';
}

export function StatShield({ label, value, sublabel, icon, variant = 'default' }: StatShieldProps) {
  const styles = {
    default: {
      bg: 'bg-stone-800',
      border: 'border-stone-600',
      text: 'text-stone-100',
      icon: 'text-stone-500'
    },
    hp: {
      bg: 'bg-red-950/40',
      border: 'border-red-800',
      text: 'text-red-400',
      icon: 'text-red-500'
    },
    initiative: {
      bg: 'bg-amber-950/40',
      border: 'border-amber-700',
      text: 'text-amber-400',
      icon: 'text-amber-500'
    }
  };

  const style = styles[variant];

  return (
    <div className="flex flex-col items-center">
      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">{label}</div>
      <div className={`relative w-20 h-20 flex items-center justify-center ${style.bg} clip-path-shield`}>
        {/* We can use CSS clip-path or an SVG background. Let's try a simple bordered div for now but styled like a shield or box */}
        <div className={`w-16 h-16 rounded-xl rotate-45 border-2 ${style.border} flex items-center justify-center shadow-inner`}>
           <div className="-rotate-45 flex flex-col items-center justify-center">
              {icon && <span className={`mb-0.5 ${style.icon}`}>{icon}</span>}
              <span className={`text-2xl font-serif font-bold ${style.text} text-shadow`}>{value}</span>
           </div>
        </div>
      </div>
      {sublabel && <div className="text-[10px] text-stone-500 mt-1 font-medium">{sublabel}</div>}
    </div>
  );
}

// --- Skill Row ---
interface SkillRowProps {
  name: string;
  modifier: number;
  proficient: boolean;
  ability: string;
}

export function SkillRow({ name, modifier, proficient, ability }: SkillRowProps) {
  return (
    <div className={`flex items-center justify-between py-1.5 px-2 border-b border-stone-800 hover:bg-stone-800/50 transition-colors group cursor-default rounded-sm ${proficient ? 'bg-amber-900/10' : ''}`}>
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-sm rotate-45 border ${proficient ? 'bg-amber-500 border-amber-600' : 'border-stone-600 bg-transparent'}`} />
        <span className={`text-sm ${proficient ? 'text-stone-200 font-bold' : 'text-stone-400'} group-hover:text-amber-100`}>
          {name}
        </span>
        <span className="text-[10px] text-stone-600 font-mono uppercase">({ability})</span>
      </div>
      <span className={`font-serif font-bold ${proficient ? 'text-amber-500' : 'text-stone-500'}`}>
        {modifier >= 0 ? `+${modifier}` : modifier}
      </span>
    </div>
  );
}

