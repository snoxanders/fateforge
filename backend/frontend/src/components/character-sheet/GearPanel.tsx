import { Backpack } from 'lucide-react';
import { Character } from '../../types/character';
import { RPGCard } from '../ui/RPGCard';

interface GearPanelProps {
  character: Character;
}

export function GearPanel({ character }: GearPanelProps) {
  return (
    <RPGCard 
      title="Equipamento" 
      icon={<Backpack size={18} />}
      info="O que você carrega na mochila. Armas, armaduras (que mudam sua CA) e seu ouro. Cuidado com o peso!"
    >
      <div className="mb-4 flex justify-between bg-stone-950/50 p-3 rounded border border-stone-800">
          <div className="text-center">
              <div className="text-amber-600 font-bold text-lg">{character.wallet.gp}</div>
              <div className="text-[10px] text-stone-500 font-bold">PO</div>
          </div>
          <div className="text-center">
              <div className="text-stone-400 font-bold text-lg">{character.wallet.sp}</div>
              <div className="text-[10px] text-stone-500 font-bold">PP</div>
          </div>
          <div className="text-center">
              <div className="text-amber-800 font-bold text-lg">{character.wallet.cp}</div>
              <div className="text-[10px] text-stone-500 font-bold">PC</div>
          </div>
      </div>

      <ul className="space-y-1 text-sm max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
        {character.equipment.map((item, i) => (
          <li key={i} className="flex justify-between items-center py-1.5 border-b border-stone-800/50 hover:bg-stone-800/30 px-2 rounded">
            <span className="text-stone-300">
               {item.quantity > 1 && <span className="font-bold text-stone-500 mr-2">{item.quantity}x</span>}
               {item.name}
            </span>
            {item.armorClass && <span className="text-[10px] bg-stone-800 px-1.5 py-0.5 rounded text-stone-400">AC {item.armorClass}</span>}
          </li>
        ))}
      </ul>
      
      <div className="mt-4 pt-4 border-t border-stone-800">
          <h4 className="text-xs font-bold text-stone-500 uppercase mb-2">Proficiências</h4>
          <div className="text-xs text-stone-400 space-y-1">
              <p><span className="text-stone-600">Armas:</span> {character.proficiencies.weapons.join(', ')}</p>
              <p><span className="text-stone-600">Armaduras:</span> {character.proficiencies.armor.join(', ')}</p>
          </div>
      </div>
    </RPGCard>
  );
}

