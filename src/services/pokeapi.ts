export interface PokemonData {
  id: number;
  name: string;
  image: string;
  types: string[];
}

// The absolute rarest and most legendary Pokemon IDs
export const RARE_POKEMON_IDS = [
  144, // Articuno
  145, // Zapdos
  146, // Moltres
  150, // Mewtwo
  151, // Mew
  249, // Lugia
  250, // Ho-Oh
  251, // Celebi
  382, // Kyogre
  383, // Groudon
  384, // Rayquaza
  386, // Deoxys
  483, // Dialga
  484, // Palkia
  487, // Giratina
  493, // Arceus
];

export const fetchPokemonData = async (id: number): Promise<PokemonData | null> => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      types: data.types.map((t: any) => t.type.name),
    };
  } catch (error) {
    console.error("Failed to fetch Pokemon:", error);
    return null;
  }
};
