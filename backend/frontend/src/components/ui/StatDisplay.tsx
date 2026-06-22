import { ReactNode } from 'react';

// --- Attribute Box (compacto, pensado para grid 3 colunas no mobile) ---
interface AttributeBoxProps {
  label: string;
  value: number;
  modifier: number;
  save?: number;
  onRoll?: () => void;
}

export function AttributeBox({ label, value, modifier, save, onRoll }: AttributeBoxProps) {
  const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  const saveStr = save !== undefined ? (save >= 0 ? `+${save}` : `${save}`) : null;

  return (
    <button
      type="button"
      onClick={onRoll}
      className="flex flex-col items-center rounded-xl border border-stone-700/80 bg-stone-900/80 px-1 py-2.5 active:scale-95 active:border-amber-600/60 transition-all"
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80">{label}</span>
      <span className="my-0.5 font-serif text-2xl font-bold leading-none text-stone-100 text-shadow-sm">{modStr}</span>
      <span className="flex items-center gap-1 text-[10px] text-stone-500">
        <span className="rounded bg-stone-800 px-1.5 py-0.5 font-bold text-stone-300">{value}</span>
        {saveStr && <span className="text-stone-500">sv {saveStr}</span>}
      </span>
    </button>
  );
}

// --- Stat Chip (CA / HP / Iniciativa) — limpo e sempre cabe em 3 colunas ---
interface StatShieldProps {
  label: string;
  value: number | string;
  sublabel?: string;
  icon?: ReactNode;
  variant?: 'default' | 'hp' | 'initiative';
}

export function StatShield({ label, value, sublabel, icon, variant = 'default' }: StatShieldProps) {
  const styles = {
    default: { bg: 'bg-stone-900/80', border: 'border-stone-600', text: 'text-stone-100', icon: 'text-stone-400' },
    hp: { bg: 'bg-red-950/30', border: 'border-red-800/70', text: 'text-red-300', icon: 'text-red-500' },
    initiative: { bg: 'bg-amber-950/30', border: 'border-amber-700/70', text: 'text-amber-300', icon: 'text-amber-500' },
  };
  const s = styles[variant];

  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border ${s.border} ${s.bg} px-2 py-2.5 shadow-lg`}>
      <span className={`mb-0.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-stone-500`}>
        {icon && <span className={s.icon}>{icon}</span>}
        {label}
      </span>
      <span className={`font-serif text-2xl font-bold leading-none ${s.text} text-shadow`}>{value}</span>
      {sublabel && <span className="mt-0.5 text-[9px] text-stone-600">{sublabel}</span>}
    </div>
  );
}

// --- Skill Row ---
interface SkillRowProps {
  name: string;
  modifier: number;
  proficient: boolean;
  ability: string;
  expertise?: boolean;
}

export function SkillRow({ name, modifier, proficient, ability, expertise }: SkillRowProps) {
  return (
    <div className={`flex items-center justify-between rounded-md px-2 py-2 ${expertise ? 'bg-emerald-900/10' : proficient ? 'bg-amber-900/10' : ''}`}>
      <div className="flex min-w-0 items-center gap-2">
        <span className={`h-2.5 w-2.5 flex-shrink-0 rotate-45 rounded-sm border ${expertise ? 'border-emerald-500 bg-emerald-400' : proficient ? 'border-amber-600 bg-amber-500' : 'border-stone-600 bg-transparent'}`} />
        <span className={`truncate text-sm ${proficient ? 'font-semibold text-stone-200' : 'text-stone-400'}`}>{name}</span>
        <span className="flex-shrink-0 font-mono text-[9px] uppercase text-stone-600">({ability})</span>
        {expertise && <span className="flex-shrink-0 rounded border border-emerald-700/50 px-1 text-[8px] font-bold uppercase text-emerald-400">Esp</span>}
      </div>
      <span className={`flex-shrink-0 pl-2 font-serif font-bold ${expertise ? 'text-emerald-400' : proficient ? 'text-amber-500' : 'text-stone-500'}`}>
        {modifier >= 0 ? `+${modifier}` : modifier}
      </span>
    </div>
  );
}
