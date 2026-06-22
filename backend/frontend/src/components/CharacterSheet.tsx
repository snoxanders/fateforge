import { Character } from '../types/character';
import { SheetHeader } from './character-sheet/SheetHeader';
import { AttributesPanel } from './character-sheet/AttributesPanel';
import { CombatPanel } from './character-sheet/CombatPanel';
import { MagicPanel } from './character-sheet/MagicPanel';
import { SkillsPanel } from './character-sheet/SkillsPanel';
import { GearPanel } from './character-sheet/GearPanel';
import { BioPanel } from './character-sheet/BioPanel';

// Export Character interface for compatibility if other files import it from here
export type { Character };

interface CharacterSheetProps {
  character: Character;
  onReroll: (target: 'race' | 'class' | 'stats') => void;
  onSave: () => void;
  onExportPDF: () => void;
}

export function CharacterSheet({ character, onReroll, onSave, onExportPDF }: CharacterSheetProps) {
  return (
    <div className="animate-fade-in">
      <SheetHeader character={character} onReroll={onReroll} onSave={onSave} onExportPDF={onExportPDF} />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="space-y-4 lg:col-span-3">
          <AttributesPanel character={character} />
        </div>
        <div className="space-y-4 lg:col-span-5">
          <CombatPanel character={character} />
          <MagicPanel character={character} />
          <BioPanel character={character} />
        </div>
        <div className="space-y-4 lg:col-span-4">
          <SkillsPanel character={character} />
          <GearPanel character={character} />
        </div>
      </div>
    </div>
  );
}
