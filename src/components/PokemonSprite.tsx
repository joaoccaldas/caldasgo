import { getPokemonImage, getShinyPokemonImage } from '../data/pokemonDatabase';

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const FALLBACK_ICON = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';

interface PokemonSpriteProps {
  id: number;
  name: string;
  shiny?: boolean;
  className?: string;
}

/**
 * Renders a Pokémon's official artwork with a fallback chain, since the
 * official-artwork CDN occasionally fails to load on slow connections:
 * official artwork -> basic sprite -> Poké Ball icon.
 */
const PokemonSprite: React.FC<PokemonSpriteProps> = ({ id, name, shiny, className }) => {
  const primary = shiny ? getShinyPokemonImage(id) : getPokemonImage(id);
  const secondary = shiny ? `${SPRITE_BASE}shiny/${id}.png` : `${SPRITE_BASE}${id}.png`;

  return (
    <img
      src={primary}
      alt={name}
      className={className}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src === primary) {
          img.src = secondary;
        } else if (img.src !== FALLBACK_ICON) {
          img.src = FALLBACK_ICON;
        }
      }}
    />
  );
};

export default PokemonSprite;
