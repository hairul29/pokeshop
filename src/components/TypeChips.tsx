import type { Product } from '../types/Product';
import { productTypes } from '../utils/product';
import TypeChip from './TypeChip';

/** Shows one chip per type (one or two). */
export default function TypeChips({ product }: { product: Pick<Product, 'type' | 'secondaryType'> }) {
  return (
    <span className="type-chips">
      {productTypes(product).map((t) => <TypeChip key={t} type={t} />)}
    </span>
  );
}
