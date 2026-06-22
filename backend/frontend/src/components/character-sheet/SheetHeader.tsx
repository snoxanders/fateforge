import { Shield, Heart, Zap, RefreshCw, Save, Download } from 'lucide-react';
import { Character } from '../../types/character';
import { StatShield } from '../ui/StatDisplay';

interface SheetHeaderProps {
  character: Character;
  onReroll: (target: 'race' | 'class' | 'stats') => void;
  onSave: () => void;
  onExportPDF: () => void;
}

export function SheetHeader({ character, onReroll, onSave, onExportPDF }: SheetHeaderProps) {
  const getAvatarUrl = (raceName: string) => {
    const raceMap: { [key: string]: string } = {
      'Humano': 'human', 'Alto Elfo': 'elf', 'Elfo da Floresta': 'wood-elf', 'Elfo Negro (Drow)': 'drow',
      'Anão da Colina': 'dwarf', 'Anão da Montanha': 'dwarf', 'Halfling': 'halfling',
      'Halfling Pés-Leves': 'halfling-lightfoot', 'Halfling Robusto': 'halfling-stout', 'Meio-Orc': 'orc',
      'Tiefling': 'tiefling', 'Gnomo das Rochas': 'gnome', 'Gnomo da Floresta': 'forest-gnome',
      'Meio-Elfo': 'half-elf', 'Draconato': 'dragonborn',
    };
    const fileName = raceMap[raceName];
    return fileName ? `/assets/races/${fileName}.png` : `https://api.dicebear.com/7.x/adventurer/svg?seed=${raceName}-${character.name}`;
  };

  const rerollBtn = "flex items-center gap-1 rounded-lg border border-stone-700 bg-stone-900/80 px-2.5 py-1.5 text-xs font-semibold text-stone-300 active:scale-95 active:border-amber-600 transition";

  return (
    <div className="mb-5">
      <div className="relative overflow-hidden rounded-2xl border border-stone-800 bg-gradient-to-b from-stone-900 to-stone-950 p-4 shadow-xl">
        {/* brilho decorativo */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-600/10 blur-2xl" />

        {/* Avatar + identidade */}
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="h-24 w-20 overflow-hidden rounded-xl border-2 border-stone-700 bg-stone-900 shadow-lg">
              <img src={getAvatarUrl(character.race.name)} alt={character.race.name} className="h-full w-full object-cover object-top" />
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-stone-950 bg-amber-600 text-sm font-bold text-white shadow-lg">
              {character.level}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text font-serif text-2xl font-bold leading-tight text-transparent line-clamp-2">
              {character.name}
            </h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-stone-800/80 px-2 py-0.5 text-[11px] font-medium text-stone-300">{character.race.name}</span>
              <span className="rounded-full bg-stone-800/80 px-2 py-0.5 text-[11px] font-medium text-stone-300">
                {character.class.name}{character.subclass ? ` · ${character.subclass.name}` : ''}
              </span>
              <span className="rounded-full bg-stone-800/50 px-2 py-0.5 text-[11px] italic text-stone-500">{character.bio?.alignment || 'Neutro'}</span>
            </div>
          </div>
        </div>

        {/* Stats principais */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <StatShield label="CA" value={character.armorClass?.value || 10} icon={<Shield size={12} />} />
          <StatShield label="HP" value={character.hp?.max || 10} variant="hp" icon={<Heart size={12} />} sublabel="máx" />
          <StatShield label="Inic." value={character.initiative >= 0 ? `+${character.initiative}` : character.initiative} variant="initiative" icon={<Zap size={12} />} />
        </div>

        {/* Reroll (sempre visível) */}
        <div className="mt-4 flex gap-2">
          <button onClick={() => onReroll('race')} className={rerollBtn}><RefreshCw size={12} /> Raça</button>
          <button onClick={() => onReroll('class')} className={rerollBtn}><RefreshCw size={12} /> Classe</button>
          <button onClick={() => onReroll('stats')} className={rerollBtn}><RefreshCw size={12} /> Atrib.</button>
        </div>

        {/* Ações principais */}
        <div className="mt-3 flex gap-2">
          <button onClick={onSave} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 py-2.5 text-sm font-bold text-white shadow-lg active:scale-95 active:bg-amber-500 transition">
            <Save size={16} /> Salvar
          </button>
          <button onClick={onExportPDF} className="flex items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-900 px-4 py-2.5 text-sm font-semibold text-stone-300 active:scale-95 transition">
            <Download size={16} /> PDF
          </button>
        </div>
      </div>
    </div>
  );
}
