import { Shield, Heart, Zap, RefreshCw } from 'lucide-react';
import { Character } from '../../types/character';
import { StatShield } from '../ui/StatDisplay';

interface SheetHeaderProps {
  character: Character;
  onReroll: (target: 'race' | 'class') => void;
}

export function SheetHeader({ character, onReroll }: SheetHeaderProps) {
    const getAvatarUrl = (raceName: string) => {
    // Map race names to local asset filenames
    const raceMap: {[key: string]: string} = {
      'Humano': 'human',
      'Alto Elfo': 'elf',
      'Elfo da Floresta': 'wood-elf',
      'Elfo Negro (Drow)': 'drow',
      'Anão da Colina': 'dwarf',
      'Anão da Montanha': 'dwarf',
      'Halfling': 'halfling',
      'Halfling Pés-Leves': 'halfling-lightfoot',
      'Halfling Robusto': 'halfling-stout',
      'Meio-Orc': 'orc',
      'Tiefling': 'tiefling',
      'Gnomo das Rochas': 'gnome',
      'Gnomo da Floresta': 'forest-gnome',
      'Meio-Elfo': 'half-elf',
      'Draconato': 'dragonborn'
    };
    
    const fileName = raceMap[raceName];
    if (fileName) {
      return `/assets/races/${fileName}.png`;
    }
    
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${raceName}-${character.name}`;
  };

  return (
    <div className="relative mb-12">
      {/* Background Banner */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-900 to-gray-950 border-b border-stone-800 rounded-b-3xl -z-10" />

      <div className="flex flex-col md:flex-row items-end gap-6 px-4 md:px-8 pt-8">
        {/* Avatar - Floating effect */}
        <div className="relative group">
          <div className="w-32 h-40 md:w-48 md:h-64 bg-stone-900 rounded-xl border-4 border-stone-700 shadow-2xl overflow-hidden transform -rotate-2 hover:rotate-0 transition-all duration-300 z-10">
            <img 
              src={getAvatarUrl(character.race.name)} 
              alt={character.race.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Level Badge */}
          <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-amber-600 rounded-full border-2 border-stone-900 flex items-center justify-center font-bold text-white shadow-lg z-20">
            {character.level}
          </div>
        </div>

        {/* Character Info */}
        <div className="flex-1 pb-2">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200 tracking-wide drop-shadow-sm">
            {character.name}
          </h1>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-stone-400 font-medium mt-2">
            <span className="text-stone-300">{character.race.name}</span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-300">{character.class.name} {character.subclass ? `(${character.subclass.name})` : ''}</span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-500 italic">{character.bio?.alignment || 'Neutro'}</span>
          </div>

          <div className="flex gap-2 mt-4 opacity-60 hover:opacity-100 transition-opacity">
            <button onClick={() => onReroll('race')} className="text-xs bg-stone-900 border border-stone-700 px-3 py-1 rounded text-stone-400 hover:text-amber-500 hover:border-amber-600 transition flex items-center gap-1">
              <RefreshCw size={12} /> Raça
            </button>
            <button onClick={() => onReroll('class')} className="text-xs bg-stone-900 border border-stone-700 px-3 py-1 rounded text-stone-400 hover:text-amber-500 hover:border-amber-600 transition flex items-center gap-1">
              <RefreshCw size={12} /> Classe
            </button>
          </div>
        </div>

        {/* Quick Stats - Floating Shields */}
        <div className="flex gap-4 pb-2">
          <StatShield 
            label="CA" 
            value={character.armorClass?.value || 10} 
            icon={<Shield size={14} />} 
          />
          <StatShield 
            label="HP" 
            value={character.hp?.max || 10} 
            variant="hp"
            icon={<Heart size={14} />} 
            sublabel="Máximo"
          />
          <StatShield 
            label="Iniciativa" 
            value={character.initiative >= 0 ? `+${character.initiative}` : character.initiative} 
            variant="initiative"
            icon={<Zap size={14} />} 
          />
        </div>
      </div>
    </div>
  );
}
