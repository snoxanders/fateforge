import { useState } from 'react';
import {
  Crown, Sparkles, Leaf, Moon, Mountain, Hammer, Footprints, Beer,
  Swords, Flame, Cog, Sprout, Star, Shield, type LucideIcon,
} from 'lucide-react';

interface RaceAvatarProps {
  name: string;
  size?: 'sm' | 'lg';
  className?: string;
}

// Cada raça: gradiente + ícone temático (fallback) + nome do arquivo de imagem (se existir).
// As imagens ficam em public/assets/races/<arquivo>.png (geradas por você, ex.: ChatGPT).
// Se a imagem não existir, mostra o emblema com ícone — nada quebra.
const RACE: Record<string, { colors: [string, string]; Icon: LucideIcon; file: string }> = {
  'Humano': { colors: ['#a16207', '#713f12'], Icon: Crown, file: 'human' },
  'Alto Elfo': { colors: ['#15803d', '#14532d'], Icon: Sparkles, file: 'high-elf' },
  'Elfo da Floresta': { colors: ['#4d7c0f', '#1a2e05'], Icon: Leaf, file: 'wood-elf' },
  'Elfo Sombrio': { colors: ['#6d28d9', '#2e1065'], Icon: Moon, file: 'dark-elf' },
  'Anão da Colina': { colors: ['#b45309', '#7c2d12'], Icon: Hammer, file: 'hill-dwarf' },
  'Anão da Montanha': { colors: ['#a8a29e', '#44403c'], Icon: Mountain, file: 'mountain-dwarf' },
  'Halfling Pés-Leves': { colors: ['#ca8a04', '#854d0e'], Icon: Footprints, file: 'lightfoot-halfling' },
  'Halfling Robusto': { colors: ['#d97706', '#92400e'], Icon: Beer, file: 'stout-halfling' },
  'Meio-Orc': { colors: ['#4d7c0f', '#365314'], Icon: Swords, file: 'half-orc' },
  'Tiefling': { colors: ['#b91c1c', '#450a0a'], Icon: Flame, file: 'tiefling' },
  'Gnomo das Rochas': { colors: ['#0891b2', '#164e63'], Icon: Cog, file: 'rock-gnome' },
  'Gnomo da Floresta': { colors: ['#0d9488', '#134e4a'], Icon: Sprout, file: 'forest-gnome' },
  'Meio-Elfo': { colors: ['#0e7490', '#155e75'], Icon: Star, file: 'half-elf' },
  'Draconato': { colors: ['#b45309', '#7f1d1d'], Icon: Shield, file: 'dragonborn' },
};

const FALLBACK = { colors: ['#57534e', '#292524'] as [string, string], Icon: Shield, file: '' };

export function RaceAvatar({ name, size = 'lg', className = '' }: RaceAvatarProps) {
  const entry = RACE[name] || FALLBACK;
  const [c1, c2] = entry.colors;
  const Icon = entry.Icon;
  const iconSize = size === 'lg' ? 44 : 24;
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = !!entry.file && !imgFailed;

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(150deg, ${c1}, ${c2})` }}
    >
      {/* Emblema (fallback) */}
      <div className="pointer-events-none absolute -right-2 -top-3 h-2/3 w-2/3 rounded-full bg-white/15 blur-xl" />
      <Icon size={iconSize} className="relative text-white/90 drop-shadow" strokeWidth={1.6} />

      {/* Imagem da raça (se existir) cobre o emblema */}
      {showImg && (
        <img
          src={`/assets/races/${entry.file}.png`}
          alt={name}
          onError={() => setImgFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      )}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
    </div>
  );
}
