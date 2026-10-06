import type { Product } from '../types/Product';
import { discountPercent, effectivePrice, formatPeso } from '../utils/product';

export default function PriceTag({ product, large = false }: { product: Product; large?: boolean }) {
  const discount = discountPercent(product);
  return (
    <div className={`price ${large ? 'price--lg' : ''}`}>
      <b className={discount > 0 ? 'price__now price__now--sale' : 'price__now'}>{formatPeso(effectivePrice(product))}</b>
      {discount > 0 && <s className="price__old">{formatPeso(product.price)}</s>}
      {discount > 0 && <span className="price__off">-{discount}%</span>}
    </div>
  );
}
