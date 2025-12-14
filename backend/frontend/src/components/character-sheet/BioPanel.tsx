import { Scroll } from 'lucide-react';
import { Character } from '../../types/character';
import { RPGCard } from '../ui/RPGCard';

interface BioPanelProps {
  character: Character;
}

export function BioPanel({ character }: BioPanelProps) {
  return (
    <RPGCard 
      title="Biografia & Traços" 
      icon={<Scroll size={18} />}
      info="Quem é você. Traços de personalidade ajudam a interpretar (RP). Seu Antecedente diz o que você era antes de se aventurar."
    >
        <div className="space-y-4">
            <div>
                <h4 className="text-xs font-bold text-stone-500 uppercase mb-1">Antecedente: <span className="text-stone-300">{character.background.name}</span></h4>
                <p className="text-sm text-stone-400 italic">{character.background.feature.split(':')[0]}</p>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {[
                    { label: 'Traço', val: character.personality.traits[0] },
                    { label: 'Ideal', val: character.personality.ideals[0] },
                    { label: 'Vínculo', val: character.personality.bonds[0] },
                    { label: 'Defeito', val: character.personality.flaws[0] },
                ].map((item) => (
                    <div key={item.label} className="bg-stone-950/30 p-2 rounded border-l-2 border-stone-700">
                        <span className="text-[10px] font-bold text-amber-600 uppercase block">{item.label}</span>
                        <p className="text-xs text-stone-300">{item.val}</p>
                    </div>
                ))}
            </div>
            
            <div className="pt-2 border-t border-stone-800 mt-2">
                <h4 className="text-xs font-bold text-stone-500 uppercase mb-2">Aparência</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-400">
                    <p><span className="text-stone-600">Idade:</span> {character.bio.age}</p>
                    <p><span className="text-stone-600">Olhos:</span> {character.bio.eyes}</p>
                    <p><span className="text-stone-600">Altura:</span> {character.bio.height}</p>
                    <p><span className="text-stone-600">Pele:</span> {character.bio.skin}</p>
                </div>
            </div>
        </div>
    </RPGCard>
  );
}

