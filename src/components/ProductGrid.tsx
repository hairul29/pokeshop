import type { Product } from '../types/Product';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="pgrid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
