import { Character } from '../../types/character';
import { RPGCard } from '../ui/RPGCard';
import { AttributeBox } from '../ui/StatDisplay';

interface AttributesPanelProps {
  character: Character;
}

export function AttributesPanel({ character }: AttributesPanelProps) {
  const attributes = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

  return (
    <RPGCard 
      className="h-full"
      title="Atributos"
      info="São seus dados base. Força, Destreza, etc. Eles definem seus modificadores (+1, +2) que são somados em quase tudo que você faz."
    >
      <div className="grid grid-cols-3 gap-2">
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

