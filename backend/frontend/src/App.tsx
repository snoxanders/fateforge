import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Sword, Scroll, Dice5, RefreshCw, Download, Save, Trash2, Users, Plus, Sparkles, Settings2, Backpack } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface Character {
  id?: string; 
  name: string;
  level: number;
  race: { id: string; name: string; speed: number; size: string };
  class: { id: string; name: string; hitDie: number };
  stats: { STR: number; DEX: number; CON: number; INT: number; WIS: number; CHA: number };
  modifiers: { STR: number; DEX: number; CON: number; INT: number; WIS: number; CHA: number };
  hp: number;
  armorClass: number;
  proficiencyBonus: number;
  initiative: number;
  background: { name: string; description: string };
  personality: { trait: string; ideal: string; bond: string; flaw: string };
  spells?: { cantrips: string[]; level1: string[] };
  createdAt?: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'library'>('generator');
  const [name, setName] = useState('');
  const [character, setCharacter] = useState<Character | null>(null);
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filtros Avançados
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedRace, setSelectedRace] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Dados estáticos para dropdowns (Idealmente viria do backend)
  const racesList = [
      { id: 'human', name: 'Humano' },
      { id: 'elf-high', name: 'Alto Elfo' },
      { id: 'dwarf-hill', name: 'Anão da Colina' },
      { id: 'halfling-lightfoot', name: 'Halfling' },
      { id: 'half-orc', name: 'Meio-Orc' },
      { id: 'tiefling', name: 'Tiefling' }
  ];
  
  const classesList = [
      { id: 'fighter', name: 'Guerreiro' },
      { id: 'wizard', name: 'Mago' },
      { id: 'rogue', name: 'Ladino' },
      { id: 'cleric', name: 'Clérigo' },
      { id: 'bard', name: 'Bardo' },
      { id: 'paladin', name: 'Paladino' }
  ];

  // Carregar salvos ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('fateforge_library');
    if (saved) {
        try {
            setSavedCharacters(JSON.parse(saved));
        } catch (e) {
            console.error("Erro ao carregar biblioteca", e);
        }
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/generate`, {
        name: name || undefined,
        level: selectedLevel,
        method: 'roll',
        raceId: selectedRace || undefined,
        classId: selectedClass || undefined
      });
      const newChar = { ...response.data, id: Date.now().toString() };
      setCharacter(newChar);
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
      setCharacter({ ...response.data, id: character.id }); 
    } catch (error) {
      console.error("Failed to reroll", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
      if (!character) return;
      
      const newLibrary = [...savedCharacters, { ...character, createdAt: new Date().toISOString() }];
      setSavedCharacters(newLibrary);
      localStorage.setItem('fateforge_library', JSON.stringify(newLibrary));
      alert("Personagem salvo na biblioteca!");
  };

  const handleDelete = (id: string) => {
      if (!confirm("Tem certeza que deseja excluir este personagem?")) return;
      const newLibrary = savedCharacters.filter(c => c.id !== id);
      setSavedCharacters(newLibrary);
      localStorage.setItem('fateforge_library', JSON.stringify(newLibrary));
  };

  const handleLoad = (char: Character) => {
      setCharacter(char);
      setActiveTab('generator');
  };

  const getAvatarUrl = (raceName: string) => {
    // Caminhos absolutos a partir da raiz pública (public folder)
    // Nota: Certifique-se que os arquivos existem em public/assets/races/
    switch (raceName) {
        case 'Humano': return "/assets/races/human.png";
        case 'Alto Elfo': return "/assets/races/elf.png";
        case 'Anão da Colina': return "/assets/races/dwarf.png";
        case 'Halfling Pés-Leves': return "/assets/races/halfling.png";
        case 'Meio-Orc': return "/assets/races/orc.png";
        case 'Tiefling': return "/assets/races/tiefling.png";
        default: return "/assets/races/human.png";
    }
  };

  const handleExportPDF = (charToExport: Character = character!) => {
    if (!charToExport) return;

    const doc = new jsPDF();
    doc.setFont("helvetica");
    
    // Header
    doc.setFontSize(24);
    doc.text(charToExport.name, 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Nível ${charToExport.level} ${charToExport.race.name} ${charToExport.class.name}`, 20, 30);
    doc.line(20, 35, 190, 35); 

    // Stats
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text(`HP: ${charToExport.hp}`, 20, 50);
    doc.text(`CA: ${charToExport.armorClass}`, 60, 50);
    doc.text(`Iniciativa: ${charToExport.initiative >= 0 ? '+' : ''}${charToExport.initiative}`, 100, 50);
    doc.text(`Deslocamento: ${charToExport.race.speed}ft`, 140, 50);

    // Atributos Box
    doc.setFontSize(16);
    doc.text("Atributos", 20, 70);
    doc.setFontSize(10);
    
    let x = 20;
    let y = 80;
    const stats = Object.entries(charToExport.stats);
    
    stats.forEach(([key, value]) => {
        const mod = charToExport.modifiers[key as keyof typeof charToExport.modifiers];
        doc.rect(x, y, 25, 25);
        doc.setFontSize(10);
        doc.text(key, x + 12.5, y + 5, { align: 'center' });
        
        // Modificador GRANDE no centro
        doc.setFontSize(16);
        doc.text(`${mod >= 0 ? '+' : ''}${mod}`, x + 12.5, y + 15, { align: 'center' });
        
        // Valor pequeno embaixo
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(value.toString(), x + 12.5, y + 22, { align: 'center' });
        doc.setTextColor(0);
        
        x += 30;
    });

    // Proficiências
    y = 120;
    doc.setFontSize(14);
    doc.text("Combate & Proficiências", 20, y);
    doc.setFontSize(10);
    doc.text(`• Bônus de Proficiência: +${charToExport.proficiencyBonus}`, 20, y + 10);
    doc.text(`• Dado de Vida: d${charToExport.class.hitDie}`, 20, y + 16);

    // Spells no PDF
    if (charToExport.spells && (charToExport.spells.cantrips.length > 0 || charToExport.spells.level1.length > 0)) {
        y = 150;
        doc.setFontSize(14);
        doc.text("Magias Conhecidas", 20, y);
        doc.setFontSize(10);
        
        let spellY = y + 10;
        if (charToExport.spells.cantrips.length > 0) {
            doc.text(`Truques: ${charToExport.spells.cantrips.join(', ')}`, 20, spellY);
            spellY += 10;
        }
        if (charToExport.spells.level1.length > 0) {
            doc.text(`Nível 1: ${charToExport.spells.level1.join(', ')}`, 20, spellY);
        }
        y = 180; // Empurra o próximo bloco pra baixo
    } else {
        y = 150; // Mantém original se não tiver magias
    }

    // Equipamentos no PDF
    if (charToExport.equipment && charToExport.equipment.length > 0) {
        doc.setFontSize(14);
        doc.text("Equipamento", 120, 120); // Coluna direita
        doc.setFontSize(10);
        charToExport.equipment.forEach((item, i) => {
            doc.text(`• ${item}`, 120, 130 + (i * 6));
        });
    }

    // Background
    // y foi ajustado acima
    doc.setFontSize(14);
    doc.text(`Antecedente: ${charToExport.background.name}`, 20, y);
    doc.setFontSize(10);
    
    const splitDesc = doc.splitTextToSize(charToExport.background.description, 170);
    doc.text(splitDesc, 20, y + 10);
    
    // Calcular altura dinâmica do texto do background para não encavalar
    const descHeight = splitDesc.length * 5; // aprox 5pts por linha
    y += 20 + descHeight; // Margem base + altura do texto

    // Personalidade
    doc.setFontSize(14);
    doc.text("Personalidade", 20, y);
    doc.setFontSize(10);
    doc.text(`Traço: ${charToExport.personality.trait}`, 20, y + 10, { maxWidth: 170 });
    doc.text(`Ideal: ${charToExport.personality.ideal}`, 20, y + 20, { maxWidth: 170 });
    doc.text(`Vínculo: ${charToExport.personality.bond}`, 20, y + 30, { maxWidth: 170 });
    doc.text(`Falha: ${charToExport.personality.flaw}`, 20, y + 40, { maxWidth: 170 });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Gerado por FateForge", 105, 280, { align: 'center' });

    doc.save(`${charToExport.name.replace(/\s+/g, '_')}_FateForge.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-20">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xl">
                <Dice5 /> FateForge
            </div>
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
          </div>
      </nav>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
            
            {/* TAB: GENERATOR */}
            {activeTab === 'generator' && (
                <>
                    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-8 border border-slate-700">
                        <div className="flex flex-col gap-4">
                            {/* Top Row: Name + Advanced Toggle */}
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

                            {/* Advanced Filters (Collapsible) */}
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

                            {/* Action Button */}
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
                    <div className="bg-slate-100 text-slate-900 rounded-lg shadow-2xl overflow-hidden animate-fade-in relative mb-10">
                        {loading && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                                <RefreshCw className="animate-spin text-white w-12 h-12" />
                            </div>
                        )}

                        <div className="bg-slate-200 p-6 border-b border-slate-300 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 bg-slate-800 rounded-lg overflow-hidden border-2 border-amber-600 shadow-lg flex-shrink-0">
                                <img 
                                    src={getAvatarUrl(character.race.name)} 
                                    alt={character.race.name}
                                    className="w-full h-full object-cover object-top transform scale-110"
                                    onError={(e) => {
                                        console.error(`Erro ao carregar imagem: ${e.currentTarget.src}`);
                                        // Tenta carregar do DiceBear apenas se a local falhar
                                        const seed = `${character.race.name}-${character.name}`;
                                        e.currentTarget.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
                                    }}
                                />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800">{character.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-slate-600 font-medium">
                                    Level {character.level} {character.race.name} {character.class.name}
                                    </p>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleReroll('race')} className="text-xs bg-slate-300 hover:bg-slate-400 px-2 py-1 rounded text-slate-700 transition" title="Trocar Raça">🎲 Raça</button>
                                        <button onClick={() => handleReroll('class')} className="text-xs bg-slate-300 hover:bg-slate-400 px-2 py-1 rounded text-slate-700 transition" title="Trocar Classe">🎲 Classe</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center text-center">
                            <div className="hidden md:flex gap-2">
                                <div className="bg-white p-2 rounded border border-slate-300 min-w-[60px]">
                                    <div className="text-xs text-slate-500 uppercase font-bold">CA</div>
                                    <div className="text-xl font-bold flex justify-center items-center gap-1"><Shield size={16} className="text-slate-400" />{character.armorClass}</div>
                                </div>
                                <div className="bg-white p-2 rounded border border-slate-300 min-w-[60px]">
                                    <div className="text-xs text-slate-500 uppercase font-bold">PV</div>
                                    <div className="text-xl font-bold text-red-600">{character.hp}</div>
                                </div>
                            </div>
                            
                            <div className="w-px h-10 bg-slate-300 mx-2"></div>

                            <button onClick={() => handleExportPDF()} className="bg-slate-700 hover:bg-slate-800 text-white p-2 rounded flex items-center gap-2 transition" title="Baixar PDF">
                                <Download size={20} /> <span className="hidden sm:inline">PDF</span>
                            </button>
                            <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded flex items-center gap-2 transition" title="Salvar na Biblioteca">
                                <Save size={20} /> <span className="hidden sm:inline">Salvar</span>
                            </button>
                        </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-300 pb-1">
                                    <h3 className="font-bold text-slate-700">Atributos</h3>
                                    <button onClick={() => handleReroll('stats')} className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"><RefreshCw size={12} /> Re-rolar</button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                {Object.entries(character.stats).map(([key, value]) => {
                                    const mod = character.modifiers[key as keyof typeof character.modifiers];
                                    return (
                                    <div key={key} className="bg-white p-2 rounded border border-slate-200 text-center flex flex-col items-center justify-center">
                                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">{key}</div>
                                        <div className="text-2xl font-bold text-slate-800 leading-none">
                                            {mod >= 0 ? `+${mod}` : mod}
                                        </div>
                                        <div className="text-xs text-slate-400 font-mono mt-1 bg-slate-100 px-2 rounded-full">
                                            {value}
                                        </div>
                                    </div>
                                    );
                                })}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-slate-700 border-b border-slate-300 pb-1 mb-2 flex items-center gap-2"><Sword size={16} /> Combate</h3>
                                    <ul className="text-sm space-y-1 text-slate-700">
                                        <li><span className="font-semibold">Proficiência:</span> +{character.proficiencyBonus}</li>
                                        <li><span className="font-semibold">Dado de Vida:</span> d{character.class.hitDie}</li>
                                        <li><span className="font-semibold">Deslocamento:</span> {character.race.speed} ft</li>
                                        <li className="md:hidden"><span className="font-semibold">HP:</span> {character.hp} | <span className="font-semibold">CA:</span> {character.armorClass}</li>
                                    </ul>
                                </div>

                                {character.spells && (character.spells.cantrips.length > 0 || character.spells.level1.length > 0) && (
                                    <div>
                                        <h3 className="font-bold text-slate-700 border-b border-slate-300 pb-1 mb-2 flex items-center gap-2">
                                            <Sparkles size={16} className="text-purple-600" /> Magias
                                        </h3>
                                        <div className="space-y-2 text-sm text-slate-700">
                                            {character.spells.cantrips.length > 0 && (
                                                <div>
                                                    <span className="font-semibold text-purple-700">Truques:</span> {character.spells.cantrips.join(', ')}
                                                </div>
                                            )}
                                            {character.spells.level1.length > 0 && (
                                                <div>
                                                    <span className="font-semibold text-purple-700">Nível 1:</span> {character.spells.level1.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Equipamentos */}
                                {character.equipment && character.equipment.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-slate-700 border-b border-slate-300 pb-1 mb-2 flex items-center gap-2">
                                            <Backpack size={16} /> Equipamento
                                        </h3>
                                        <ul className="text-sm text-slate-700 list-disc list-inside">
                                            {character.equipment.map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    <h3 className="font-bold text-slate-700 border-b border-slate-300 pb-1 mb-2">Background: {character.background.name}</h3>
                                    <p className="text-sm text-slate-600 italic mb-2">{character.background.description}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-slate-700 border-b border-slate-300 pb-1 mb-2 flex items-center gap-2"><Scroll size={16} /> Personalidade</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-semibold text-indigo-600">Traço:</span> {character.personality.trait}</p>
                                        <p><span className="font-semibold text-indigo-600">Ideal:</span> {character.personality.ideal}</p>
                                        <p><span className="font-semibold text-indigo-600">Vínculo:</span> {character.personality.bond}</p>
                                        <p><span className="font-semibold text-indigo-600">Falha:</span> {character.personality.flaw}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ) : (
                        <div className="text-center py-20 opacity-50">
                            <Dice5 size={64} className="mx-auto mb-4 text-slate-600" />
                            <h2 className="text-2xl font-bold text-slate-500">Sua aventura começa aqui</h2>
                            <p className="text-slate-400">Clique em "Gerar Personagem" para criar sua primeira ficha.</p>
                        </div>
                    )}
                </>
            )}

            {/* TAB: LIBRARY */}
            {activeTab === 'library' && (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Save className="text-amber-500" /> Meus Personagens Salvos
                    </h2>
                    
                    {savedCharacters.length === 0 ? (
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
                                                    src={getAvatarUrl(char.race.name)} 
                                                    alt="Avatar" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-white">{char.name}</h3>
                                                <p className="text-sm text-slate-400">{char.race.name} {char.class.name} • Lvl {char.level}</p>
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
                                        <span>HP: {char.hp}</span> • 
                                        <span>CA: {char.armorClass}</span> • 
                                        <span>Criado em: {char.createdAt ? new Date(char.createdAt).toLocaleDateString() : 'Hoje'}</span>
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

export default App;
