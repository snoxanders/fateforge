import { RefreshCw } from 'lucide-react';
import { Character } from '../../types/character';
import { RPGCard } from '../ui/RPGCard';
import { AttributeBox } from '../ui/StatDisplay';

interface AttributesPanelProps {
  character: Character;
  onReroll: () => void;
}

export function AttributesPanel({ character, onReroll }: AttributesPanelProps) {
  const attributes = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

  return (
    <RPGCard 
      className="h-full"
      title="Atributos"
      action={
        <button onClick={onReroll} className="text-stone-500 hover:text-amber-500 transition-colors" title="Rolar Atributos">
          <RefreshCw size={14} />
        </button>
      }
    >
      <div className="flex flex-col gap-3">
        {attributes.map(attr => {
          const data = character.attributes[attr];
          if (!data) return null;
          return (
            <AttributeBox
              key={attr}
              label={attr}
              value={data.value}
              modifier={data.modifier}
              save={data.save}
            />
          );
        })}
      </div>
    </RPGCard>
  );
}

