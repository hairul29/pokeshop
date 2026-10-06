import { Link } from 'react-router-dom';
import EmptyShop from '../components/EmptyShop';
import ProductGrid from '../components/ProductGrid';
import { useStore } from '../context/StoreContext';

export default function Deals() {
  const { activeProducts } = useStore();
  const deals = activeProducts.filter((p) => p.onSale === true);

  return (
    <div className="container section">
      <header className="page-head page-head--deals">
        <h1 className="page-head__title">DEALS</h1>
        <p>Limited-time prices on collector favorites.</p>
      </header>
      {deals.length > 0 ? (
        <ProductGrid products={deals} />
      ) : (
        <EmptyShop title="NO DEALS AVAILABLE YET" text="Check back soon for exciting offers!"
          actions={<Link to="/shop" className="btn btn--red">BROWSE THE SHOP</Link>} />
      )}
    </div>
  );
}
