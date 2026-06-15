import { getPogoSprite, getPokemonImage, getShinyPokemonImage } from '../data/pokemonDatabase';

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const FALLBACK_ICON = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';

interface PokemonSpriteProps {
  id: number;
  name: string;
  shiny?: boolean;
  className?: string;
}

/**
 * Renders a Pokémon using the authentic Pokémon GO in-game sprite, with a
 * graceful fallback chain so nothing ever shows a broken-image glyph:
 *   real PoGo sprite (PokeMiners) -> PokeAPI official artwork -> basic sprite -> Poké Ball.
 * Higher gen-8/9 dex numbers that PokeMiners doesn't host resolve via the artwork step.
 */
const PokemonSprite: React.FC<PokemonSpriteProps> = ({ id, name, shiny, className }) => {
  const pogo = getPogoSprite(id, shiny);
  const artwork = shiny ? getShinyPokemonImage(id) : getPokemonImage(id);
  const basic = shiny ? `${SPRITE_BASE}shiny/${id}.png` : `${SPRITE_BASE}${id}.png`;

  return (
    <img
      src={pogo}
      alt={name}
      className={className}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src === pogo) {
          img.src = artwork;
        } else if (img.src === artwork) {
          img.src = basic;
        } else if (img.src !== FALLBACK_ICON) {
          img.src = FALLBACK_ICON;
        }
      }}
    />
  );
};

export default PokemonSprite;
