import { useState } from 'react';
import { Shield, Sword, Scroll, Heart, Zap, User, Backpack, RefreshCw, Download, Save } from 'lucide-react';

// Define the interface to match backend structure
export interface Character {
  id?: string;
  name: string;
  level: number;
  experience: number;
  race: { id: string; name: string; speed: number; size: string };
  class: { id: string; name: string; hitDie: number };
  subclass?: { id: string; name: string; description: string };
  
  attributes: {
      [key: string]: { value: number; modifier: number; save: number };
  };
  
  hp: { max: number; current: number; hitDice: string; };
  armorClass: { value: number; description: string };
  proficiencyBonus: number;
  initiative: number;
  speed: number;
  passivePerception: number;
  
  skills: { name: string; value: number; proficient: boolean; ability: string }[];
  
  proficiencies: {
    armor: string[];
    weapons: string[];
    tools: string[];
    languages: string[];
    savingThrows: string[];
  };
  
  equipment: { name: string; quantity: number; type?: string; properties?: string[]; armorClass?: number }[];
  wallet: { cp: number; sp: number; ep: number; gp: number; pp: number };
  
  spells?: {
      spellcasting?: { ability: string; saveDC: number; attackBonus: number; };
      spells: { name: string; level: number; school?: string; prepared?: boolean }[];
  };
  
  background: { name: string; description: string; feature: string };
  personality: { traits: string[]; ideals: string[]; bonds: string[]; flaws: string[] };
  bio: { age: number; height: string; weight: string; eyes: string; skin: string; hair: string; appearance: string; backstory: string; alignment: string };
}

interface CharacterSheetProps {
  character: Character;
  onReroll: (target: 'race' | 'class' | 'stats') => void;
  onSave: () => void;
  onExportPDF: () => void;
}

export function CharacterSheet({ character, onReroll, onSave, onExportPDF }: CharacterSheetProps) {
  const [activeTab, setActiveTab] = useState<'main' | 'combat' | 'magic' | 'bio' | 'gear'>('main');

  const getAvatarUrl = (raceName: string) => {
    // Simple mapping or dicebear
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${raceName}-${character.name}`;
  };

  const ModDisplay = ({ val }: { val: number }) => (
    <span className="font-mono font-bold">{val >= 0 ? `+${val}` : val}</span>
  );

  return (
    <div className="bg-slate-100 text-slate-900 rounded-lg shadow-2xl overflow-hidden animate-fade-in flex flex-col min-h-[600px]">
      {/* Header */}
      <div className="bg-slate-900 text-slate-100 p-6 flex flex-wrap gap-6 items-center border-b-4 border-amber-600">
        <div className="w-24 h-24 bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-600 shadow-lg flex-shrink-0">
            <img 
                src={getAvatarUrl(character.race.name)} 
                alt={character.race.name}
                className="w-full h-full object-cover"
            />
        </div>
        <div className="flex-1 min-w-[200px]">
            <h1 className="text-3xl font-bold font-serif tracking-wide text-amber-500">{character.name}</h1>
            <div className="flex flex-wrap gap-x-4 text-sm text-slate-400 font-medium mt-1">
                <span>{character.race.name}</span>
                <span>•</span>
                <span>{character.class.name} {character.subclass ? `(${character.subclass.name})` : ''}</span>
                <span>•</span>
                <span>Nível {character.level}</span>
                <span>•</span>
                <span>{character.bio?.alignment || 'Neutro'}</span>
                <span>•</span>
                <span>{character.experience} XP</span>
            </div>
            <div className="flex gap-2 mt-3">
                <button onClick={() => onReroll('race')} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1 rounded text-slate-300 transition flex items-center gap-1">
                    <RefreshCw size={12} /> Raça
                </button>
                <button onClick={() => onReroll('class')} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1 rounded text-slate-300 transition flex items-center gap-1">
                    <RefreshCw size={12} /> Classe
                </button>
            </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
            <div className="text-center">
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">CA</div>
                <div className="text-2xl font-bold flex items-center justify-center gap-1 bg-slate-800 w-16 h-16 rounded-full border-2 border-slate-700 shadow-inner">
                    <Shield size={18} className="text-slate-500" />
                    {character.armorClass?.value || 10}
                </div>
            </div>
            <div className="text-center">
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">HP</div>
                <div className="text-2xl font-bold flex items-center justify-center gap-1 bg-slate-800 w-16 h-16 rounded-full border-2 border-red-900/50 shadow-inner text-red-500">
                    <Heart size={18} />
                    {character.hp?.max || 10}
                </div>
            </div>
            <div className="text-center">
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Prof</div>
                <div className="text-xl font-bold flex items-center justify-center gap-1 bg-slate-800 w-16 h-16 rounded-full border-2 border-slate-700 shadow-inner text-amber-500">
                    +{character.proficiencyBonus}
                </div>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-200 border-b border-slate-300 flex overflow-x-auto">
        <TabButton id="main" label="Principal" icon={<User size={18} />} active={activeTab} set={setActiveTab} />
        <TabButton id="combat" label="Combate" icon={<Sword size={18} />} active={activeTab} set={setActiveTab} />
        <TabButton id="magic" label="Magias" icon={<Zap size={18} />} active={activeTab} set={setActiveTab} />
        <TabButton id="gear" label="Equipamento" icon={<Backpack size={18} />} active={activeTab} set={setActiveTab} />
        <TabButton id="bio" label="Biografia" icon={<Scroll size={18} />} active={activeTab} set={setActiveTab} />
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex-1 bg-slate-50 overflow-y-auto max-h-[600px]">
        {activeTab === 'main' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Attributes Column */}
                <div className="md:col-span-1 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                         <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wide">Atributos</h3>
                         <button onClick={() => onReroll('stats')} className="text-xs text-amber-600 hover:underline flex items-center gap-1">
                            <RefreshCw size={12} /> Rolar
                         </button>
                    </div>
                    
                    <div className="space-y-3">
                        {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(attr => {
                            const data = character.attributes[attr];
                            if (!data) return null;
                            return (
                                <div key={attr} className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                                    <div className="flex flex-col items-center w-12">
                                        <span className="text-xs font-bold text-slate-400">{attr}</span>
                                        <span className="text-xs text-slate-500">{data.value}</span>
                                    </div>
                                    <div className="text-2xl font-bold text-slate-800 w-12 text-center">
                                        <ModDisplay val={data.modifier} />
                                    </div>
                                    <div className="flex flex-col text-xs text-right text-slate-500 min-w-[60px]">
                                        <span>Save: <ModDisplay val={data.save} /></span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Skills Column */}
                <div className="md:col-span-2">
                    <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wide pb-2 border-b border-slate-200 mb-4">Perícias</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {character.skills && character.skills.map(skill => (
                            <div key={skill.name} className="flex items-center justify-between py-1 border-b border-slate-100 hover:bg-slate-100 px-2 rounded transition">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${skill.proficient ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                                    <span className={`${skill.proficient ? 'font-bold text-slate-800' : 'text-slate-600'}`}>{skill.name} <span className="text-xs text-slate-400">({skill.ability})</span></span>
                                </div>
                                <span className={`font-mono ${skill.proficient ? 'font-bold text-amber-700' : 'text-slate-500'}`}>
                                    <ModDisplay val={skill.value} />
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-6">
                         <div>
                             <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Percepção Passiva</h4>
                             <div className="text-xl font-bold text-slate-700 bg-white border border-slate-200 p-2 rounded text-center shadow-sm">
                                 {character.passivePerception}
                             </div>
                         </div>
                         <div>
                             <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Proficiências</h4>
                             <div className="text-sm text-slate-600">
                                 <p><strong>Armas:</strong> {character.proficiencies?.weapons.join(', ') || 'Nenhuma'}</p>
                                 <p className="mt-1"><strong>Armaduras:</strong> {character.proficiencies?.armor.join(', ') || 'Nenhuma'}</p>
                                 <p className="mt-1"><strong>Ferramentas:</strong> {character.proficiencies?.tools.join(', ') || 'Nenhuma'}</p>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'combat' && (
            <div className="space-y-8">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <StatBox label="Iniciativa" value={character.initiative >= 0 ? `+${character.initiative}` : character.initiative} />
                     <StatBox label="Deslocamento" value={`${character.speed} ft`} />
                     <StatBox label="Hit Dice" value={`${character.hp.hitDice}`} sub={`Total: ${character.level}`} />
                     <StatBox label="Max HP" value={character.hp.max} />
                 </div>

                 <div>
                     <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wide border-b border-slate-200 pb-2 mb-4">Ataques</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {character.equipment.filter(i => i.type === 'weapon').map((weapon, idx) => {
                             // Simple assumption for attack bonus: STR/DEX + Proficiency
                             // This should ideally be pre-calculated in backend, but we can estimate or just show dmg
                             const isFinesse = weapon.properties?.includes('Finesse') || weapon.name.includes('Rapieira') || weapon.name.includes('Adaga');
                             const isRanged = weapon.properties?.includes('Range') || weapon.name.includes('Arco') || weapon.name.includes('Besta');
                             
                             let mod = character.attributes.STR.modifier;
                             if (isRanged || (isFinesse && character.attributes.DEX.modifier > mod)) {
                                 mod = character.attributes.DEX.modifier;
                             }
                             
                             const attackBonus = mod + character.proficiencyBonus; // Assume proficient
                             const damage = weapon.properties?.[0] || '1d8'; // Fallback if parsing failed
                             
                             return (
                                 <div key={idx} className="bg-white border border-slate-200 rounded p-4 flex justify-between items-center shadow-sm">
                                     <div>
                                         <div className="font-bold text-lg text-slate-800">{weapon.name}</div>
                                         <div className="text-xs text-slate-500 capitalize">{weapon.type} {weapon.properties?.join(', ')}</div>
                                     </div>
                                     <div className="text-right">
                                         <div className="font-bold text-amber-700 text-lg">+{attackBonus}</div>
                                         <div className="text-sm text-slate-600">{damage} + {mod}</div>
                                     </div>
                                 </div>
                             );
                         })}
                         {character.equipment.filter(i => i.type === 'weapon').length === 0 && (
                             <p className="text-slate-500 italic">Nenhuma arma equipada.</p>
                         )}
                     </div>
                 </div>

                 <div>
                     <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wide border-b border-slate-200 pb-2 mb-4">Defesa</h3>
                     <p className="text-slate-700"><strong>Armadura:</strong> {character.armorClass.description}</p>
                 </div>
            </div>
        )}

        {activeTab === 'magic' && (
            <div>
                {!character.spells?.spells || character.spells.spells.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                        <p>Este personagem não é um conjurador.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <StatBox label="Habilidade" value={character.spells?.spellcasting?.ability || 'INT'} />
                            <StatBox label="CD de Resistência" value={character.spells?.spellcasting?.saveDC || 10} />
                            <StatBox label="Bônus de Ataque" value={`+${character.spells?.spellcasting?.attackBonus || 0}`} />
                        </div>
                        
                        {[0, 1, 2, 3, 4, 5].map(level => {
                            const spells = character.spells!.spells.filter(s => s.level === level);
                            if (spells.length === 0) return null;
                            
                            return (
                                <div key={level}>
                                    <h3 className="font-bold text-indigo-800 border-b border-indigo-100 pb-1 mb-3">
                                        {level === 0 ? 'Truques (Cantrips)' : `Nível ${level}`}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {spells.map((spell, idx) => (
                                            <div key={idx} className="bg-white border border-indigo-50 p-3 rounded shadow-sm hover:shadow-md transition">
                                                <div className="font-bold text-slate-800">{spell.name}</div>
                                                <div className="text-xs text-slate-500 flex gap-2 mt-1">
                                                    {spell.school && <span className="bg-indigo-50 text-indigo-600 px-1 rounded">{spell.school}</span>}
                                                    {spell.prepared && <span className="bg-green-50 text-green-600 px-1 rounded">Preparada</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )}
        
        {activeTab === 'gear' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                     <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wide border-b border-slate-200 pb-2 mb-4">Equipamento</h3>
                     <ul className="space-y-2">
                         {character.equipment.map((item, i) => (
                             <li key={i} className="flex justify-between items-center border-b border-slate-50 py-2">
                                 <span>{item.quantity > 1 ? `${item.quantity}x ` : ''} {item.name}</span>
                                 {item.armorClass && <span className="text-xs bg-slate-100 px-2 py-1 rounded">AC {item.armorClass}</span>}
                             </li>
                         ))}
                     </ul>
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wide border-b border-slate-200 pb-2 mb-4">Tesouro</h3>
                    <div className="flex gap-4">
                        <Coin value={character.wallet.gp} label="PO" color="bg-yellow-400" />
                        <Coin value={character.wallet.sp} label="PP" color="bg-slate-300" />
                        <Coin value={character.wallet.cp} label="PC" color="bg-amber-700" />
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'bio' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wide border-b border-slate-200 pb-2 mb-4">Aparência</h3>
                        <p className="text-slate-700 mb-4">{character.bio.appearance}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                             <p><strong>Idade:</strong> {character.bio.age} anos</p>
                             <p><strong>Altura:</strong> {character.bio.height}</p>
                             <p><strong>Peso:</strong> {character.bio.weight}</p>
                             <p><strong>Olhos:</strong> {character.bio.eyes}</p>
                             <p><strong>Pele:</strong> {character.bio.skin}</p>
                             <p><strong>Cabelo:</strong> {character.bio.hair}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wide border-b border-slate-200 pb-2 mb-4">Personalidade</h3>
                        <div className="space-y-3">
                             <Trait label="Traço" text={character.personality.traits[0]} />
                             <Trait label="Ideal" text={character.personality.ideals[0]} />
                             <Trait label="Vínculo" text={character.personality.bonds[0]} />
                             <Trait label="Defeito" text={character.personality.flaws[0]} />
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wide border-b border-slate-200 pb-2 mb-4">Antecedente: {character.background.name}</h3>
                    <p className="text-slate-700 italic mb-4">{character.background.description}</p>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded">
                        <h4 className="font-bold text-sm text-slate-800 mb-1">Característica: {character.background.feature.split(':')[0]}</h4>
                        <p className="text-sm text-slate-600">{character.background.feature.split(':')[1] || character.background.feature}</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wide border-b border-slate-200 pb-2 mb-4">História</h3>
                    <p className="text-slate-700 leading-relaxed">{character.bio.backstory}</p>
                </div>
            </div>
        )}
      </div>
      
      {/* Footer Actions */}
      <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end gap-4">
          <button onClick={onExportPDF} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 transition">
              <Download size={16} /> Exportar PDF
          </button>
          <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              <Save size={16} /> Salvar Personagem
          </button>
      </div>
    </div>
  );
}

const TabButton = ({ id, label, icon, active, set }: any) => (
    <button 
        onClick={() => set(id)}
        className={`px-6 py-4 flex items-center gap-2 font-bold text-sm transition border-b-2 ${active === id ? 'border-amber-500 text-amber-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
    >
        {icon} {label}
    </button>
);

const StatBox = ({ label, value, sub }: any) => (
    <div className="bg-white border border-slate-200 rounded p-3 text-center shadow-sm">
        <div className="text-xs text-slate-500 uppercase font-bold">{label}</div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
);

const Coin = ({ value, label, color }: any) => (
    <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full ${color} shadow-inner flex items-center justify-center font-bold text-white border-2 border-white ring-1 ring-slate-200`}>
            {label}
        </div>
        <span className="font-bold text-slate-700 mt-1">{value}</span>
    </div>
);

const Trait = ({ label, text }: any) => (
    <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
        <span className="text-xs font-bold text-indigo-600 uppercase block mb-1">{label}</span>
        <p className="text-sm text-slate-700">{text}</p>
    </div>
);

