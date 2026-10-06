import { Link, useParams } from 'react-router-dom';
import EmptyShop from '../components/EmptyShop';
import ProductGrid from '../components/ProductGrid';
import TypeCard from '../components/TypeCard';
import { TYPE_META, typeFromSlug, typeStyle } from '../data/types';
import { useStore } from '../context/StoreContext';
import { POKEMON_TYPES } from '../types/Product';
import { productTypes } from '../utils/product';

export default function Category() {
  const { type: slug } = useParams();
  const { activeProducts } = useStore();
  const type = typeFromSlug(slug);

  if (!type) {
    return (
      <div className="container section">
        <EmptyShop title="UNKNOWN TYPE" text="That category does not exist."
          actions={<Link to="/categories" className="btn btn--red">EXPLORE CATEGORIES</Link>} />
      </div>
    );
  }

  const items = activeProducts.filter((p) => productTypes(p).includes(type)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="container section">
      <header className="type-banner" style={typeStyle(type)}>
        <span className="type-banner__icon" aria-hidden="true">{TYPE_META[type].emoji}</span>
        <div>
          <h1>{type.toUpperCase()} TYPE</h1>
          <p>{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
      </header>

      {items.length > 0 ? (
        <ProductGrid products={items} />
      ) : (
        <EmptyShop title={`NO ${type.toUpperCase()} ITEMS YET`} text="Products of this type will appear here once they are added to the shop." />
      )}

      <h2 className="section__title section__title--sub">Other types</h2>
      <div className="tgrid">
        {POKEMON_TYPES.filter((t) => t !== type).map((t) => <TypeCard key={t} type={t} />)}
      </div>
    </div>
  );
}
