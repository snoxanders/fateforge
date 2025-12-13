import { Zap } from 'lucide-react';
import { Character } from '../../types/character';
import { RPGCard } from '../ui/RPGCard';

interface MagicPanelProps {
  character: Character;
}

export function MagicPanel({ character }: MagicPanelProps) {
  if (!character.spells?.spells || character.spells.spells.length === 0) return null;

  return (
    <RPGCard title="Magias" icon={<Zap size={18} />} variant="magic" className="mt-6">
       <div className="grid grid-cols-3 gap-2 mb-4 bg-indigo-950/20 p-2 rounded border border-indigo-900/30">
          <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-indigo-400">Atributo</div>
              <div className="font-bold text-indigo-200">{character.spells?.spellcasting?.ability || '-'}</div>
          </div>
          <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-indigo-400">CD Resist</div>
              <div className="font-bold text-indigo-200">{character.spells?.spellcasting?.saveDC || '-'}</div>
          </div>
          <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-indigo-400">Bônus Atq</div>
              <div className="font-bold text-indigo-200">+{character.spells?.spellcasting?.attackBonus || 0}</div>
          </div>
       </div>

       <div className="space-y-4">
          {[0, 1, 2, 3].map(level => { // Limit to low levels for preview, or map all
              const spells = character.spells!.spells.filter(s => s.level === level);
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

