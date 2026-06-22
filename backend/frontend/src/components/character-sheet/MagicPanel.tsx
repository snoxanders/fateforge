import { Zap } from 'lucide-react';
import { Character } from '../../types/character';
import { RPGCard } from '../ui/RPGCard';

interface MagicPanelProps {
  character: Character;
}

export function MagicPanel({ character }: MagicPanelProps) {
  const sc = character.spellcasting;
  if (!sc?.spells || sc.spells.length === 0) return null;

  const slots = (sc.slots || []).filter(s => s.total > 0).sort((a, b) => a.level - b.level);

  return (
    <RPGCard
      title="Magias"
      icon={<Zap size={18} />}
      variant="magic"
      className="mt-6"
      info="Seus poderes mágicos. 'Truques' são infinitos. Magias de nível gastam 'espaços' (slots) e precisam de descanso para voltar."
    >
       <div className="grid grid-cols-3 gap-2 mb-4 bg-indigo-950/20 p-2 rounded border border-indigo-900/30">
          <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-indigo-400">Atributo</div>
              <div className="font-bold text-indigo-200">{sc.ability || '-'}</div>
          </div>
          <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-indigo-400">CD Resist</div>
              <div className="font-bold text-indigo-200">{sc.saveDC || '-'}</div>
          </div>
          <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-indigo-400">Bônus Atq</div>
              <div className="font-bold text-indigo-200">+{sc.attackBonus || 0}</div>
          </div>
       </div>

       {slots.length > 0 && (
          <div className="mb-4">
             <div className="text-[10px] uppercase font-bold text-indigo-400 mb-2">Espaços de Magia</div>
             <div className="flex flex-wrap gap-2">
                {slots.map(slot => (
                    <div key={slot.level} className="flex items-center gap-1.5 bg-indigo-950/30 border border-indigo-900/40 rounded px-2 py-1">
                        <span className="text-[11px] font-bold text-indigo-300">Nv {slot.level}</span>
                        <span className="text-sm font-bold text-indigo-100">{slot.total}</span>
                    </div>
                ))}
             </div>
          </div>
       )}

       <div className="space-y-4">
          {[0, 1, 2, 3, 4, 5].map(level => {
              const spells = sc.spells.filter(s => s.level === level);
              if (spells.length === 0) return null;

              return (
                  <div key={level}>
                      <h4 className="text-xs font-serif font-bold text-indigo-400 border-b border-indigo-900/50 pb-1 mb-2">
                          {level === 0 ? 'Truques' : `Nível ${level}`}
                      </h4>
                      <div className="grid grid-cols-1 gap-1">
                          {spells.map((spell, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm py-1 px-2 bg-indigo-950/10 rounded hover:bg-indigo-900/20 transition-colors">
                                  <span className="text-stone-300">{spell.name}</span>
                                  {spell.prepared && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.8)]" title="Preparada"></span>}
                              </div>
                          ))}
                      </div>
                  </div>
              )
          })}
       </div>
    </RPGCard>
  );
}
