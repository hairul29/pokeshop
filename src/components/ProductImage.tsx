import { TYPE_META } from '../data/types';
import type { Product } from '../types/Product';
import PokeBall from './PokeBall';

/** Shows the first product image, or a neutral placeholder when none was uploaded. */
export default function ProductImage({ product, className = '' }: { product: Pick<Product, 'images' | 'type' | 'name'>; className?: string }) {
  const src = product.images[0];
  if (src) return <img className={`pimg ${className}`} src={src} alt={product.name} loading="lazy" />;
  return (
    <div className={`pimg pimg--empty ${className}`} aria-label="No image uploaded">
      <PokeBall size={64} className="pimg__ball" />
      <span>{TYPE_META[product.type].emoji}</span>
    </div>
  );
}
