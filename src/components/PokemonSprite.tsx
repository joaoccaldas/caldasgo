import { useState, useEffect } from 'react';
import { getSpecies } from '../data/pokemonDatabase';

const FALLBACK_ICON = 'https://ui-avatars.com/api/?name=?&background=random&color=fff&rounded=true&size=100';

interface PokemonSpriteProps {
  id: number;
  name: string;
  shiny?: boolean;
  className?: string;
  variant?: 'icon' | 'artwork';
}

/**
 * Renders the hilariously bad Fake-Mon sprites.
 */
const PokemonSprite: React.FC<PokemonSpriteProps> = ({ id, name, className }) => {
  const species = getSpecies(id);
  const assetUrl = species?.assetUrl || FALLBACK_ICON;
  
  // No shiny variants for the bootleg cards, just a chaotic fallback.
  const sources = [assetUrl, FALLBACK_ICON];

  const [srcIndex, setSrcIndex] = useState(0);

  useEffect(() => {
    setSrcIndex(0);
  }, [id]);

  return (
    <img
      src={sources[srcIndex]}
      alt={name}
      className={className}
      onError={() => {
        if (srcIndex < sources.length - 1) {
          setSrcIndex(srcIndex + 1);
        }
      }}
    />
  );
};

export default PokemonSprite;
