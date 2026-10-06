export const POKEMON_TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy',
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  /** Primary type. */
  type: PokemonType;
  /** Optional second type for dual-type items (a product has at most two). */
  secondaryType?: PokemonType;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
  featured: boolean;
  onSale: boolean;
  createdAt: string;
  /** Optional 0-5 rating set by the admin. Never auto-generated. */
  rating?: number;
}
