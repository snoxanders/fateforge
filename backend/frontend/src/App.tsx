import { useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { Dice5, RefreshCw, Users, Plus, SlidersHorizontal, Download, Trash2, ScrollText } from 'lucide-react';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginButton } from './components/LoginButton';
import { CharacterSheet, Character } from './components/CharacterSheet';
import { generatePDF } from './utils/pdfExport';

function CharvoApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'generator' | 'library'>('generator');
  const [name, setName] = useState('');
  const [character, setCharacter] = useState<Character | null>(null);
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<'roll' | 'standard' | 'point-buy'>('roll');

  const API_URL = import.meta.env.VITE_API_URL || '';

  const racesList = [
    { id: 'human', name: 'Humano' }, { id: 'elf-high', name: 'Alto Elfo' },
    { id: 'elf-wood', name: 'Elfo da Floresta' }, { id: 'elf-drow', name: 'Elfo Negro (Drow)' },
    { id: 'dwarf-hill', name: 'Anão da Colina' }, { id: 'dwarf-mountain', name: 'Anão da Montanha' },
    { id: 'halfling-lightfoot', name: 'Halfling Pés-Leves' }, { id: 'halfling-stout', name: 'Halfling Robusto' },
    { id: 'half-orc', name: 'Meio-Orc' }, { id: 'tiefling', name: 'Tiefling' },
    { id: 'gnome-rock', name: 'Gnomo das Rochas' }, { id: 'gnome-forest', name: 'Gnomo da Floresta' },
    { id: 'half-elf', name: 'Meio-Elfo' }, { id: 'dragonborn', name: 'Draconato' },
  ];
  const classesList = [
    { id: 'fighter', name: 'Guerreiro' }, { id: 'wizard', name: 'Mago' }, { id: 'rogue', name: 'Ladino' },
    { id: 'cleric', name: 'Clérigo' }, { id: 'bard', name: 'Bardo' }, { id: 'paladin', name: 'Paladino' },
    { id: 'barbarian', name: 'Bárbaro' }, { id: 'ranger', name: 'Patrulheiro' }, { id: 'sorcerer', name: 'Feiticeiro' },
    { id: 'monk', name: 'Monge' }, { id: 'warlock', name: 'Bruxo' }, { id: 'druid', name: 'Druida' },
  ];

  useEffect(() => {
    if (user) fetchLibrary();
    else setSavedCharacters([]);
  }, [user]);

  // Botão/gesto "voltar" do Android: do Grimório volta pro Gerador; no Gerador, sai do app.
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const handle = CapApp.addListener('backButton', () => {
      if (activeTab === 'library') setActiveTab('generator');
      else CapApp.exitApp();
    });
    return () => { handle.then((h) => h.remove()); };
  }, [activeTab]);

  const fetchLibrary = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_URL}/api/characters`, { headers: { 'user-id': user.id } });
      setSavedCharacters(res.data);
    } catch (e) { console.error('Erro ao carregar biblioteca', e); }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const payload = {
        name: name || undefined, level: selectedLevel, method: selectedMethod,
        raceId: selectedRace || undefined, classId: selectedClass || undefined,
      };
      const res = await axios.post(`${API_URL}/api/generate`, payload);
      setCharacter(res.data);
    } catch (e) {
      console.error('Failed to generate character', e);
      alert('Erro ao gerar personagem. Tente novamente.');
    } finally { setLoading(false); }
  };

  const handleReroll = async (target: 'race' | 'class' | 'stats') => {
    if (!character) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/reroll`, { character, target });
      setCharacter(res.data);
    } catch (e) { console.error('Failed to reroll', e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!character) return;
    if (!user) { alert('Você precisa estar logado para salvar personagens.'); return; }
    try {
      await axios.post(`${API_URL}/api/characters`, { ...character, userId: user.id }, { headers: { 'user-id': user.id } });
      alert('Personagem salvo na biblioteca!');
      fetchLibrary();
    } catch (e) { console.error('Erro ao salvar', e); alert('Erro ao salvar personagem.'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este personagem?')) return;
    try {
      await axios.delete(`${API_URL}/api/characters/${id}`, { headers: user ? { 'user-id': user.id } : undefined });
      fetchLibrary();
    } catch (e) { console.error('Erro ao excluir', e); alert('Erro ao excluir personagem.'); }
  };

  const handleLoad = (char: Character) => { setCharacter(char); setActiveTab('generator'); };
  const handleExportPDF = (char: Character = character!) => { if (char) generatePDF(char); };

  const getAvatarUrl = (raceName: string, charName: string) => {
    const raceMap: { [key: string]: string } = {
      'Humano': 'human', 'Alto Elfo': 'elf', 'Elfo da Floresta': 'wood-elf', 'Elfo Negro (Drow)': 'drow',
      'Anão da Colina': 'dwarf', 'Anão da Montanha': 'dwarf', 'Halfling Pés-Leves': 'halfling-lightfoot',
      'Halfling Robusto': 'halfling-stout', 'Halfling': 'halfling', 'Meio-Orc': 'orc', 'Tiefling': 'tiefling',
      'Gnomo das Rochas': 'gnome', 'Gnomo da Floresta': 'forest-gnome', 'Meio-Elfo': 'half-elf', 'Draconato': 'dragonborn',
    };
    const f = raceMap[raceName];
    return f ? `/assets/races/${f}.png` : `https://api.dicebear.com/7.x/adventurer/svg?seed=${raceName}-${charName}`;
  };

  const selectCls = "w-full rounded-xl border border-stone-700 bg-stone-900 px-3 py-3 text-stone-200 outline-none focus:border-amber-600";

  return (
    <div className="flex min-h-screen flex-col text-stone-200">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-stone-800/80 bg-stone-950/85 pt-safe backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <button
            onClick={() => setActiveTab('generator')}
            className="flex items-center gap-2 font-serif text-xl font-bold tracking-wide text-amber-500 active:opacity-70"
          >
            <Dice5 size={22} className="text-amber-600" /> Charvo
          </button>
          <LoginButton />
        </div>
      </header>

      {/* Conteúdo */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-4">
        {activeTab === 'generator' && (
          <>
            {/* Painel de configuração */}
            <div className="mb-5 rounded-2xl border border-stone-800 bg-stone-900/70 p-4 shadow-lg">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-stone-500">Nome (opcional)</label>
              <input
                type="text" placeholder="Ex: Valeros" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none placeholder-stone-600 focus:border-amber-600"
              />

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition ${showAdvanced ? 'border-amber-600/60 bg-stone-800 text-amber-500' : 'border-stone-700 bg-stone-900 text-stone-400'}`}
              >
                <SlidersHorizontal size={16} /> {showAdvanced ? 'Menos opções' : 'Mais opções'}
              </button>

              {showAdvanced && (
                <div className="mt-3 grid grid-cols-1 gap-3 rounded-xl border border-stone-800/60 bg-stone-950/40 p-3 animate-fade-in sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-stone-500">Raça</label>
                    <select value={selectedRace} onChange={(e) => setSelectedRace(e.target.value)} className={selectCls}>
                      <option value="">Aleatória</option>
                      {racesList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-stone-500">Classe</label>
                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className={selectCls}>
                      <option value="">Aleatória</option>
                      {classesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-stone-500">Atributos</label>
                    <select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value as 'roll' | 'standard' | 'point-buy')} className={selectCls}>
                      <option value="roll">Rolar (4d6)</option>
                      <option value="standard">Array Padrão</option>
                      <option value="point-buy">Compra de Pontos</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-stone-500">Nível: {selectedLevel}</label>
                    <input
                      type="range" min={1} max={5} value={selectedLevel}
                      onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
                      className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-800 accent-amber-600"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerate} disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3.5 font-serif text-base font-bold uppercase tracking-wider text-white shadow-lg shadow-amber-900/30 transition active:scale-[0.98] active:bg-amber-500 disabled:bg-stone-700 disabled:text-stone-500"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <><Dice5 size={20} /> Invocar Personagem</>}
              </button>
            </div>

            {/* Resultado */}
            {character ? (
              <div className="relative">
                {loading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                    <RefreshCw className="h-10 w-10 animate-spin text-amber-500" />
                  </div>
                )}
                <CharacterSheet character={character} onReroll={handleReroll} onSave={handleSave} onExportPDF={() => handleExportPDF()} />
              </div>
            ) : (
              <div className="mt-10 flex flex-col items-center rounded-2xl border-2 border-dashed border-stone-800 py-16 text-center">
                <Dice5 size={52} className="mb-3 text-stone-700" />
                <h2 className="font-serif text-2xl font-bold text-stone-600">Sua lenda aguarda</h2>
                <p className="mt-1 px-8 text-sm text-stone-500">Toque em "Invocar Personagem" para forjar seu herói.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'library' && (
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-bold text-stone-200">
              <ScrollText className="text-amber-600" size={22} /> Grimório de Heróis
            </h2>

            {!user ? (
              <div className="rounded-2xl border border-stone-800 bg-stone-900/60 px-6 py-10 text-center">
                <p className="mb-4 text-stone-400">Entre para acessar seu grimório.</p>
                <LoginButton />
              </div>
            ) : savedCharacters.length === 0 ? (
              <div className="rounded-2xl border border-stone-800 bg-stone-900/60 px-6 py-10 text-center">
                <p className="mb-4 text-stone-400">Seu grimório está vazio.</p>
                <button onClick={() => setActiveTab('generator')} className="font-bold text-amber-500">Criar novo herói</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {savedCharacters.map((char) => (
                  <div
                    key={char.id}
                    onClick={() => handleLoad(char)}
                    className="cursor-pointer rounded-2xl border border-stone-800 bg-stone-900/70 p-3 transition active:border-amber-600/60 active:bg-stone-900"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-stone-700 bg-stone-950">
                        <img src={getAvatarUrl(char.race.name, char.name)} alt="" className="h-full w-full object-cover object-top" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-serif text-lg font-bold text-stone-200">{char.name}</h3>
                        <p className="truncate text-xs font-medium uppercase tracking-wide text-stone-400">{char.race.name} {char.class.name}</p>
                        <p className="text-xs font-bold text-amber-700/90">Nível {char.level}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-stone-800/60 pt-3">
                      <span className="text-[11px] text-stone-600">Toque para abrir</span>
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); handleExportPDF(char); }} className="rounded-lg p-2 text-stone-400 active:bg-stone-800 active:text-stone-200" title="PDF"><Download size={18} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(char.id!); }} className="rounded-lg p-2 text-stone-400 active:bg-red-950/40 active:text-red-500" title="Excluir"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Tab bar inferior */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-800 bg-stone-950/95 pb-safe backdrop-blur-md">
        <div className="mx-auto flex max-w-md">
          <TabButton active={activeTab === 'generator'} onClick={() => setActiveTab('generator')} icon={<Plus size={22} />} label="Gerador" />
          <TabButton active={activeTab === 'library'} onClick={() => setActiveTab('library')} icon={<Users size={22} />} label="Grimório" badge={savedCharacters.length} />
        </div>
      </nav>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, badge }: { active: boolean; onClick: () => void; icon: ReactNode; label: string; badge?: number }) {
  return (
    <button onClick={onClick} className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition ${active ? 'text-amber-500' : 'text-stone-500'}`}>
      {active && <span className="absolute top-0 h-0.5 w-10 rounded-full bg-amber-500" />}
      <span className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-600 px-1 text-[9px] font-bold text-white">{badge}</span>
        )}
      </span>
      {label}
    </button>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CharvoApp />
    </AuthProvider>
  );
}
