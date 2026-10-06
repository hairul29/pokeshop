import TypeCard from '../components/TypeCard';
import { useStore } from '../context/StoreContext';
import { POKEMON_TYPES } from '../types/Product';
import { productTypes } from '../utils/product';

export default function Categories() {
  const { activeProducts } = useStore();
  return (
    <div className="container section">
      <header className="page-head">
        <h1 className="page-head__title">CATEGORIES</h1>
        <p>Pick a Pokémon type and start exploring.</p>
      </header>
      <div className="tgrid tgrid--lg">
        {POKEMON_TYPES.map((t) => (
          <TypeCard key={t} type={t} count={activeProducts.filter((p) => productTypes(p).includes(t)).length} />
        ))}
      </div>
    </div>
  );
}
