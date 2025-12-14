import { Sword } from 'lucide-react';
import { Character } from '../../types/character';
import { RPGCard } from '../ui/RPGCard';

interface CombatPanelProps {
  character: Character;
}

export function CombatPanel({ character }: CombatPanelProps) {
  const weapons = character.equipment.filter(i => i.type === 'weapon');

  return (
    <div className="space-y-6">
      <RPGCard 
        title="Ataques & Conjuração" 
        icon={<Sword size={18} />} 
        variant="default"
        info="Tudo para a briga. 'Ataque' é o valor para acertar o inimigo, 'Dano' é quanto machuca. CA é sua Defesa (quanto é difícil te acertar)."
      >
        <div className="space-y-3">
          {weapons.length === 0 ? (
            <div className="text-center py-4 text-stone-500 italic text-sm">Nenhuma arma equipada</div>
          ) : (
            weapons.map((weapon, idx) => {
               // Logic to calculate attack bonus (simplified)
               const isFinesse = weapon.properties?.includes('Finesse') || weapon.name.includes('Rapieira') || weapon.name.includes('Adaga');
               const isRanged = weapon.properties?.includes('Range') || weapon.name.includes('Arco') || weapon.name.includes('Besta');
               
               let mod = character.attributes.STR.modifier;
               if (isRanged || (isFinesse && character.attributes.DEX.modifier > mod)) {
                   mod = character.attributes.DEX.modifier;
               }
               
               const attackBonus = mod + character.proficiencyBonus; 
               const damage = weapon.properties?.[0] || '1d8'; 

               return (
                <div key={idx} className="flex items-center justify-between bg-stone-950/50 border border-stone-800 p-3 rounded hover:border-amber-700/50 transition-colors group">
                  <div className="flex-1">
                    <div className="font-bold text-stone-200 group-hover:text-amber-500 transition-colors">{weapon.name}</div>
                    <div className="text-[10px] text-stone-500 uppercase tracking-wide">{weapon.properties?.join(', ') || 'Normal'}</div>
                  </div>
                  <div className="flex gap-4 text-right">
                     <div>
                        <div className="text-[10px] text-stone-500 uppercase font-bold">Atq</div>
                        <div className="font-serif font-bold text-amber-500">+{attackBonus}</div>
                     </div>
                     <div>
                        <div className="text-[10px] text-stone-500 uppercase font-bold">Dano</div>
                        <div className="font-serif font-bold text-stone-300">{damage} <span className="text-stone-500">+{mod}</span></div>
                     </div>
                  </div>
                </div>
               );
            })
          )}
        </div>
      </RPGCard>

      <div className="grid grid-cols-2 gap-4">
         <div className="bg-stone-900 border border-stone-700 p-3 rounded flex flex-col items-center">
             <div className="text-[10px] font-bold text-stone-500 uppercase mb-1">Hit Dice</div>
             <div className="text-xl font-bold text-stone-200">{character.hp.hitDice}</div>
             <div className="text-xs text-stone-500">Total: {character.level}</div>
         </div>
         <div className="bg-stone-900 border border-stone-700 p-3 rounded flex flex-col items-center">
             <div className="text-[10px] font-bold text-stone-500 uppercase mb-1">Deslocamento</div>
             <div className="text-xl font-bold text-stone-200">{character.speed} ft</div>
         </div>
      </div>
      
      {/* Spellcasting Quick View could go here or in MagicPanel */}
    </div>
  );
}

