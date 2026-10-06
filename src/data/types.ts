import type { CSSProperties } from 'react';
import { POKEMON_TYPES, type PokemonType } from '../types/Product';

export interface TypeMeta {
  emoji: string;
  color: string;
}

/** Simple, original icons (emoji) and accent colors for each type. */
export const TYPE_META: Record<PokemonType, TypeMeta> = {
  Normal: { emoji: '⭐', color: '#A8A77A' },
  Fire: { emoji: '🔥', color: '#EE8130' },
  Water: { emoji: '💧', color: '#6390F0' },
  Electric: { emoji: '⚡', color: '#F7D02C' },
  Grass: { emoji: '🍃', color: '#7AC74C' },
  Ice: { emoji: '❄️', color: '#7FCFCB' },
  Fighting: { emoji: '🥊', color: '#C22E28' },
  Poison: { emoji: '☠️', color: '#A33EA1' },
  Ground: { emoji: '⛰️', color: '#E2BF65' },
  Flying: { emoji: '🕊️', color: '#A98FF3' },
  Psychic: { emoji: '🔮', color: '#F95587' },
  Bug: { emoji: '🐛', color: '#A6B91A' },
  Rock: { emoji: '🪨', color: '#B6A136' },
  Ghost: { emoji: '👻', color: '#735797' },
  Dragon: { emoji: '🐉', color: '#6F35FC' },
  Dark: { emoji: '🌙', color: '#705746' },
  Steel: { emoji: '⚙️', color: '#9FA0BE' },
  Fairy: { emoji: '✨', color: '#D685AD' },
};

export const typeSlug = (type: PokemonType): string => type.toLowerCase();

export const typeFromSlug = (slug?: string): PokemonType | undefined =>
  POKEMON_TYPES.find((t) => t.toLowerCase() === slug?.toLowerCase());

/** Exposes the type color to CSS as --type-color. */
export const typeStyle = (type: PokemonType): CSSProperties =>
  ({ '--type-color': TYPE_META[type].color }) as CSSProperties;
