import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dice5, RefreshCw, Users, Plus, Settings2, Save, Sword, Download, Trash2 } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginButton } from './components/LoginButton';
import { CharacterSheet, Character } from './components/CharacterSheet';
import { generatePDF } from './utils/pdfExport';
import { RPGCard } from './components/ui/RPGCard';

function FateForgeApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'generator' | 'library'>('generator');
  const [name, setName] = useState('');
  const [character, setCharacter] = useState<Character | null>(null);
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedRace, setSelectedRace] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || '';

  const racesList = [
      { id: 'human', name: 'Humano' },
      { id: 'elf-high', name: 'Alto Elfo' },
      { id: 'elf-wood', name: 'Elfo da Floresta' },
      { id: 'elf-drow', name: 'Elfo Negro (Drow)' },
      { id: 'dwarf-hill', name: 'Anão da Colina' },
      { id: 'dwarf-mountain', name: 'Anão da Montanha' },
      { id: 'halfling-lightfoot', name: 'Halfling Pés-Leves' },
      { id: 'halfling-stout', name: 'Halfling Robusto' },
      { id: 'half-orc', name: 'Meio-Orc' },
      { id: 'tiefling', name: 'Tiefling' },
      { id: 'gnome-rock', name: 'Gnomo das Rochas' },
      { id: 'gnome-forest', name: 'Gnomo da Floresta' },
      { id: 'half-elf', name: 'Meio-Elfo' },
      { id: 'dragonborn', name: 'Draconato' }
  ];
  
  const classesList = [
      { id: 'fighter', name: 'Guerreiro' },
      { id: 'wizard', name: 'Mago' },
      { id: 'rogue', name: 'Ladino' },
      { id: 'cleric', name: 'Clérigo' },
      { id: 'bard', name: 'Bardo' },
      { id: 'paladin', name: 'Paladino' },
      { id: 'barbarian', name: 'Bárbaro' },
      { id: 'ranger', name: 'Patrulheiro' },
      { id: 'sorcerer', name: 'Feiticeiro' },
      { id: 'monk', name: 'Monge' },
      { id: 'warlock', name: 'Bruxo' },
      { id: 'druid', name: 'Druida' }
  ];

  useEffect(() => {
    if (user) {
        fetchLibrary();
    } else {
        setSavedCharacters([]);
    }
  }, [user]);

  const fetchLibrary = async () => {
    if (!user) return;
    try {
        const res = await axios.get(`${API_URL}/api/characters`, {
            headers: { 'user-id': user.id }
        });
        setSavedCharacters(res.data);
    } catch (error) {
        console.error("Erro ao carregar biblioteca", error);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const payload = {
        name: name || undefined,
        level: selectedLevel,
        method: 'roll',
        raceId: selectedRace || undefined,
        classId: selectedClass || undefined
      };
      const response = await axios.post(`${API_URL}/api/generate`, payload);
      setCharacter(response.data);
    } catch (error) {
      console.error("Failed to generate character", error);
      alert("Erro ao gerar personagem. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const handleReroll = async (target: 'race' | 'class' | 'stats') => {
    if (!character) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/reroll`, {
        character,
        target
      });
      setCharacter(response.data); 
    } catch (error) {
      console.error("Failed to reroll", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
      if (!character) return;
      if (!user) {
          alert("Você precisa estar logado para salvar personagens.");
          return;
      }
      try {
        await axios.post(`${API_URL}/api/characters`, { ...character, userId: user.id }, {
            headers: { 'user-id': user.id }
        });
        alert("Personagem salvo na biblioteca!");
        fetchLibrary();
      } catch (e) {
        console.error("Erro ao salvar", e);
        alert("Erro ao salvar personagem.");
      }
  };

  const handleDelete = async (id: string) => {
      if (!confirm("Tem certeza que deseja excluir este personagem?")) return;
      try {
          await axios.delete(`${API_URL}/api/characters/${id}`);
          fetchLibrary();
      } catch (e) {
          console.error("Erro ao excluir", e);
          alert("Erro ao excluir personagem.");
      }
  };

  const handleLoad = (char: Character) => {
      setCharacter(char);
      setActiveTab('generator');
  };

  const handleExportPDF = (char: Character = character!) => {
     if (char) generatePDF(char);
  };

  const getAvatarUrl = (raceName: string, charName: string) => {
    const raceMap: {[key: string]: string} = {
      'Humano': 'human',
      'Alto Elfo': 'elf',
      'Elfo da Floresta': 'wood-elf',
      'Elfo Negro (Drow)': 'drow',
      'Anão da Colina': 'dwarf',
      'Anão da Montanha': 'dwarf',
      'Halfling Pés-Leves': 'halfling-lightfoot',
      'Halfling Robusto': 'halfling-stout',
      'Halfling': 'halfling',
      'Meio-Orc': 'orc',
      'Tiefling': 'tiefling',
      'Gnomo das Rochas': 'gnome',
      'Gnomo da Floresta': 'forest-gnome',
      'Meio-Elfo': 'half-elf',
      'Draconato': 'dragonborn'
    };
    const fileName = raceMap[raceName];
    return fileName ? `/assets/races/${fileName}.png` : `https://api.dicebear.com/7.x/adventurer/svg?seed=${raceName}-${charName}`;
  };

  return (
    <div className="min-h-screen bg-rpg-950 text-stone-200 font-sans flex flex-col selection:bg-amber-900 selection:text-white">
      <nav className="bg-black/40 border-b border-stone-800 p-4 sticky top-0 z-50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 text-amber-500 font-serif font-bold text-2xl tracking-wide">
                <Dice5 className="text-amber-600" /> FateForge
            </div>
            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab('generator')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'generator' ? 'bg-amber-700/20 text-amber-500 border border-amber-700/50' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-900/50 border border-transparent'}`}
                    >
                        <Plus size={16} /> Gerador
                    </button>
                    <button 
                        onClick={() => setActiveTab('library')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'library' ? 'bg-amber-700/20 text-amber-500 border border-amber-700/50' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-900/50 border border-transparent'}`}
                    >
                        <Users size={16} /> Biblioteca ({savedCharacters.length})
                    </button>
                </div>
                <div className="h-6 w-px bg-stone-800"></div>
                <LoginButton />
            </div>
          </div>
      </nav>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
            
            {activeTab === 'generator' && (
                <>
                    <RPGCard className="mb-8" title="Configuração da Aventura" icon={<Settings2 size={18} />}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Nome do Personagem (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Valeros"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-stone-950 border border-stone-800 rounded px-4 py-3 text-stone-100 focus:ring-1 focus:ring-amber-600 focus:border-amber-600 outline-none transition placeholder-stone-700"
                                    />
                                </div>
                                <button 
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className={`p-2 rounded transition flex items-center justify-center gap-2 h-[50px] px-6 border ${showAdvanced ? 'bg-stone-800 border-amber-600 text-amber-500' : 'bg-stone-900 border-stone-700 text-stone-400 hover:bg-stone-800 hover:border-stone-500'}`}
                                >
                                    <Settings2 size={18} /> {showAdvanced ? 'Menos Opções' : 'Mais Opções'}
                                </button>
                            </div>

                            {showAdvanced && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-stone-950/30 p-6 rounded border border-stone-800/50 animate-fade-in">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Raça</label>
                                        <select 
                                            value={selectedRace}
                                            onChange={(e) => setSelectedRace(e.target.value)}
                                            className="w-full bg-stone-900 border border-stone-700 rounded px-3 py-2 text-stone-200 focus:ring-1 focus:ring-amber-600 outline-none"
                                        >
                                            <option value="">Aleatória</option>
                                            {racesList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Classe</label>
                                        <select 
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                            className="w-full bg-stone-900 border border-stone-700 rounded px-3 py-2 text-stone-200 focus:ring-1 focus:ring-amber-600 outline-none"
                                        >
                                            <option value="">Aleatória</option>
                                            {classesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Nível ({selectedLevel})</label>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="5" 
                                            value={selectedLevel}
                                            onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
                                            className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-600 mt-3"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full bg-amber-700 hover:bg-amber-600 disabled:bg-stone-800 text-stone-100 font-bold font-serif uppercase tracking-widest py-4 px-8 rounded transition flex items-center justify-center gap-3 shadow-lg hover:shadow-amber-900/30 border border-transparent hover:border-amber-400"
                            >
                                {loading ? <RefreshCw className="animate-spin" /> : 'Invocar Personagem'}
                            </button>
                        </div>
                    </RPGCard>

                    {character ? (
                        <div className="mb-10 relative animate-fade-in">
                            {loading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 rounded-lg backdrop-blur-sm">
                                    <RefreshCw className="animate-spin text-amber-500 w-12 h-12" />
                                </div>
                            )}
                            <CharacterSheet 
                                character={character} 
                                onReroll={handleReroll} 
                                onSave={handleSave} 
                                onExportPDF={() => handleExportPDF()} 
                            />
                        </div>
                    ) : (
                        <div className="text-center py-24 opacity-60 rounded-lg border-2 border-dashed border-stone-800 hover:border-stone-700 transition-colors">
                            <Dice5 size={64} className="mx-auto mb-4 text-stone-700" />
                            <h2 className="text-3xl font-serif font-bold text-stone-600 mb-2">Sua Lenda Aguarda</h2>
                            <p className="text-stone-500">Configure os parâmetros acima e invoque seu herói.</p>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'library' && (
                <div>
                    <h2 className="text-2xl font-serif font-bold text-stone-200 mb-6 flex items-center gap-2">
                        <Save className="text-amber-600" /> Grimório de Heróis
                    </h2>
                    
                    {!user ? (
                        <RPGCard className="text-center py-12">
                            <p className="text-stone-400 mb-4">Você precisa estar logado para acessar seu grimório.</p>
                            <LoginButton />
                        </RPGCard>
                    ) : savedCharacters.length === 0 ? (
                        <RPGCard className="text-center py-12">
                            <p className="text-stone-400 mb-4">Seu grimório está vazio.</p>
                            <button onClick={() => setActiveTab('generator')} className="text-amber-500 hover:text-amber-400 hover:underline font-bold">
                                Criar Novo Herói
                            </button>
                        </RPGCard>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedCharacters.map((char) => (
                                <RPGCard key={char.id} className="group cursor-pointer hover:border-amber-600/60 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-16 h-16 rounded-lg bg-stone-950 border border-stone-700 overflow-hidden flex-shrink-0 shadow-md">
                                                <img 
                                                    src={getAvatarUrl(char.race.name, char.name)} 
                                                    alt="Avatar" 
                                                    className="w-full h-full object-cover object-top"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-serif font-bold text-xl text-stone-200 group-hover:text-amber-500 transition-colors">{char.name}</h3>
                                                <div className="flex flex-col gap-0.5">
                                                    <p className="text-xs text-stone-400 uppercase tracking-wide font-bold">
                                                        {char.race.name} {char.class.name}
                                                    </p>
                                                    <p className="text-xs text-amber-700/80 font-bold">Nível {char.level}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-stone-800/50 justify-end">
                                        <button onClick={() => handleLoad(char)} className="p-2 text-stone-400 hover:text-amber-500 hover:bg-stone-800 rounded transition" title="Abrir">
                                            <Sword size={18} />
                                        </button>
                                        <button onClick={() => handleExportPDF(char)} className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded transition" title="PDF">
                                            <Download size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(char.id!)} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-950/30 rounded transition" title="Excluir">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </RPGCard>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
      </main>
    </div>
  );
}

export default function App() {
    return (
        <AuthProvider>
            <FateForgeApp />
        </AuthProvider>
    );
}
