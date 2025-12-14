import { Character } from '../../types/character';
import { RPGCard } from '../ui/RPGCard';
import { SkillRow } from '../ui/StatDisplay';

interface SkillsPanelProps {
  character: Character;
}

export function SkillsPanel({ character }: SkillsPanelProps) {
  return (
    <RPGCard 
      title="Perícias" 
      className="h-full"
      info="Coisas específicas que você sabe fazer bem. Se você é 'Proficiente' (bolinha pintada), soma seu bônus de proficiência ao teste."
    >
      <div className="space-y-0.5">
        {character.skills && character.skills.map(skill => (
          <SkillRow
            key={skill.name}
            name={skill.name}
            modifier={skill.value}
            proficient={skill.proficient}
            ability={skill.ability}
          />
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-stone-800">
        <div className="flex justify-between items-center text-sm text-stone-400">
          <span className="font-bold uppercase text-xs">Percepção Passiva</span>
          <span className="font-bold text-stone-200">{character.passivePerception}</span>
        </div>
      </div>
    </RPGCard>
  );
}

