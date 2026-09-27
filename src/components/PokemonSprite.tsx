import { useState } from 'react';
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
 * Renders the intentionally rough Fake-Mon sprites with a stable fallback.
 */
const PokemonSprite: React.FC<PokemonSpriteProps> = ({ id, name, className }) => {
  const species = getSpecies(id);
  const assetUrl = species?.assetUrl || FALLBACK_ICON;
  const [failedAssetUrl, setFailedAssetUrl] = useState<string | null>(null);
  const src = failedAssetUrl === assetUrl ? FALLBACK_ICON : assetUrl;

  return (
    <img
      key={assetUrl}
      src={src}
      alt={name}
      className={className}
      onError={() => {
        if (src !== FALLBACK_ICON) {
          setFailedAssetUrl(assetUrl);
        }
      }}
    />
  );
};

export default PokemonSprite;
