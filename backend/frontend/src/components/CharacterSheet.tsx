import { Download, Save } from 'lucide-react';
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
  // We can keep tabs for mobile if needed, or just stack everything.
  // Given the "Modern D&D" brief, a dashboard/bento box layout is best for desktop.
  // For mobile, we might want to stack them or use a simple tab system if it gets too long.
  // Let's implement a responsive Grid that stacks on mobile.

  return (
    <div className="bg-rpg-950 min-h-screen text-stone-200 font-sans pb-20 animate-fade-in">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        
        {/* Header Section */}
        <SheetHeader character={character} onReroll={onReroll} onSave={onSave} onExportPDF={onExportPDF} />

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Core Stats (Attributes) - Span 2/12 on large, but maybe 3/12 is better */}
          <div className="md:col-span-3 lg:col-span-2 space-y-6">
            <AttributesPanel character={character} />
          </div>

          {/* Center Column: Combat & Action - Span 5/12 or 6/12 */}
          <div className="md:col-span-5 lg:col-span-6 space-y-6">
            <CombatPanel character={character} />
            <MagicPanel character={character} />
            <BioPanel character={character} />
          </div>

          {/* Right Column: Utility (Skills & Gear) - Span 4/12 */}
          <div className="md:col-span-4 lg:col-span-4 space-y-6">
            <SkillsPanel character={character} />
            <GearPanel character={character} />
          </div>

        </div>
      </div>
    </div>
  );
}
