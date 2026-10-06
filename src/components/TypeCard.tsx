import { Link } from 'react-router-dom';
import { TYPE_META, typeSlug, typeStyle } from '../data/types';
import type { PokemonType } from '../types/Product';

export default function TypeCard({ type, count }: { type: PokemonType; count?: number }) {
  return (
    <Link to={`/category/${typeSlug(type)}`} className="tcard" style={typeStyle(type)}>
      <span className="tcard__icon" aria-hidden="true">{TYPE_META[type].emoji}</span>
      <span className="tcard__name">{type}</span>
      {count !== undefined && <span className="tcard__count">{count} {count === 1 ? 'item' : 'items'}</span>}
    </Link>
  );
}
