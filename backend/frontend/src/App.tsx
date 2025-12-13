import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dice5, RefreshCw, Users, Plus, Settings2, Save, Sword, Download, Trash2 } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginButton } from './components/LoginButton';
import { CharacterSheet, Character } from './components/CharacterSheet';
import { generatePDF } from './utils/pdfExport';

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
      { id: 'dwarf-hill', name: 'Anão da Colina' },
      { id: 'dwarf-mountain', name: 'Anão da Montanha' },
      { id: 'halfling-lightfoot', name: 'Halfling' },
      { id: 'half-orc', name: 'Meio-Orc' },
      { id: 'tiefling', name: 'Tiefling' },
      { id: 'gnome-rock', name: 'Gnomo das Rochas' },
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <nav className="bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-20">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xl">
                <Dice5 /> FateForge
            </div>
            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab('generator')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${activeTab === 'generator' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Plus size={16} /> Gerador
                    </button>
                    <button 
                        onClick={() => setActiveTab('library')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${activeTab === 'library' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Users size={16} /> Biblioteca ({savedCharacters.length})
                    </button>
                </div>
                <div className="h-6 w-px bg-slate-700"></div>
                <LoginButton />
            </div>
          </div>
      </nav>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
            
            {activeTab === 'generator' && (
                <>
                    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-8 border border-slate-700">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-end gap-2">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Nome do Personagem (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Valeros"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-600 rounded px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none transition"
                                    />
                                </div>
                                <button 
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className={`p-2 rounded transition flex items-center justify-center gap-2 h-[42px] w-[42px] border ${showAdvanced ? 'bg-slate-700 border-amber-500 text-amber-500' : 'bg-slate-900 border-slate-600 text-slate-400 hover:bg-slate-700'}`}
                                    title="Opções Avançadas"
                                >
                                    <Settings2 size={20} />
                                </button>
                            </div>

                            {showAdvanced && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/50 p-4 rounded border border-slate-700 animate-fade-in">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Raça</label>
                                        <select 
                                            value={selectedRace}
                                            onChange={(e) => setSelectedRace(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:ring-1 focus:ring-amber-500 outline-none"
                                        >
                                            <option value="">Aleatória</option>
                                            {racesList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Classe</label>
                                        <select 
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:ring-1 focus:ring-amber-500 outline-none"
                                        >
                                            <option value="">Aleatória</option>
                                            {classesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nível ({selectedLevel})</label>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="5" 
                                            value={selectedLevel}
                                            onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-3"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600 text-white font-bold py-3 px-8 rounded transition flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-900/20"
                            >
                                {loading ? <RefreshCw className="animate-spin" /> : 'Gerar Personagem'}
                            </button>
                        </div>
                    </div>

                    {character ? (
                        <div className="mb-10 relative">
                            {loading && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10 rounded-lg backdrop-blur-sm">
                                    <RefreshCw className="animate-spin text-white w-12 h-12" />
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
                        <div className="text-center py-20 opacity-50 bg-slate-800/50 rounded-lg border border-slate-800">
                            <Dice5 size={64} className="mx-auto mb-4 text-slate-600" />
                            <h2 className="text-2xl font-bold text-slate-500">Sua aventura começa aqui</h2>
                            <p className="text-slate-400">Clique em "Gerar Personagem" para criar sua primeira ficha completa.</p>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'library' && (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Save className="text-amber-500" /> Meus Personagens Salvos
                    </h2>
                    
                    {!user ? (
                        <div className="bg-slate-800 p-10 rounded-lg text-center border border-slate-700 flex flex-col items-center">
                            <p className="text-slate-400 mb-4">Você precisa estar logado para acessar sua biblioteca.</p>
                            <LoginButton />
                        </div>
                    ) : savedCharacters.length === 0 ? (
                        <div className="bg-slate-800 p-10 rounded-lg text-center border border-slate-700">
                            <p className="text-slate-400 mb-4">Você ainda não salvou nenhum personagem.</p>
                            <button onClick={() => setActiveTab('generator')} className="text-amber-500 hover:underline">
                                Voltar para o Gerador
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {savedCharacters.map((char) => (
                                <div key={char.id} className="bg-slate-800 p-4 rounded border border-slate-700 hover:border-slate-500 transition group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-600 overflow-hidden flex-shrink-0">
                                                <img 
                                                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${char.race.name}-${char.name}`} 
                                                    alt="Avatar" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-white">{char.name}</h3>
                                                <div className="flex flex-col gap-0.5">
                                                    <p className="text-sm text-slate-400">
                                                        {char.race.name} {char.class.name} • Lvl {char.level}
                                                    </p>
                                                    {char.subclass && <p className="text-xs text-amber-500 font-bold">{char.subclass.name}</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleLoad(char)} className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" title="Abrir na Ficha">
                                                <Sword size={16} />
                                            </button>
                                            <button onClick={() => handleExportPDF(char)} className="p-2 bg-slate-600 text-white rounded hover:bg-slate-700" title="PDF">
                                                <Download size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(char.id!)} className="p-2 bg-red-600 text-white rounded hover:bg-red-700" title="Excluir">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 text-xs text-slate-500 mt-4 pt-2 border-t border-slate-700">
                                        <span>HP: {(char.hp as any)?.max || char.hp}</span>
                                    </div>
                                </div>
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
