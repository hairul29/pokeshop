import { TYPE_META, typeStyle } from '../data/types';
import type { PokemonType } from '../types/Product';

export default function TypeChip({ type }: { type: PokemonType }) {
  return (
    <span className="type-chip" style={typeStyle(type)}>
      <span aria-hidden="true">{TYPE_META[type].emoji}</span> {type}
    </span>
  );
}
