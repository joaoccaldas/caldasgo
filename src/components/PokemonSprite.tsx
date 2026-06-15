import { useState, useEffect } from 'react';
import { getPogoSprite, getPokemonImage, getShinyPokemonImage } from '../data/pokemonDatabase';

const SPRITE_BASE = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/';
const FALLBACK_ICON = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/poke-ball.png';

interface PokemonSpriteProps {
  id: number;
  name: string;
  shiny?: boolean;
  className?: string;
  /**
   * 'icon' uses the small ~80px PoGo map-marker sprite first (authentic look for
   * grid thumbnails and map markers). 'artwork' starts with PokeAPI's 475px
   * official artwork instead, so large detail views (Pokédex, Storage, Encounter)
   * don't look blurry when scaled up. Both variants fall through the same chain.
   */
  variant?: 'icon' | 'artwork';
}

/**
 * Renders a Pokémon with a graceful fallback chain so nothing ever shows a
 * broken-image glyph. The starting point depends on `variant`, but every chain
 * ends at: PoGo sprite -> PokeAPI official artwork -> basic sprite -> Poké Ball.
 */
const PokemonSprite: React.FC<PokemonSpriteProps> = ({ id, name, shiny, className, variant = 'icon' }) => {
  const pogo = getPogoSprite(id, shiny);
  const artwork = shiny ? getShinyPokemonImage(id) : getPokemonImage(id);
  const basic = shiny ? `${SPRITE_BASE}shiny/${id}.png` : `${SPRITE_BASE}${id}.png`;

  const sources = variant === 'artwork'
    ? [artwork, pogo, basic, FALLBACK_ICON]
    : [pogo, artwork, basic, FALLBACK_ICON];

  const [srcIndex, setSrcIndex] = useState(0);

  // Reset if pokemon changes
  useEffect(() => {
    setSrcIndex(0);
  }, [id, shiny, variant]);

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
