import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rate } from 'antd';
import { HeartFilled, HeartOutlined, ShoppingCartOutlined, CheckOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import type { Product } from '../types/Product';
import { discountPercent, stockStatus } from '../utils/product';
import PriceTag from './PriceTag';
import ProductImage from './ProductImage';
import TypeChips from './TypeChips';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useStore();
  const [added, setAdded] = useState(false);
  const stock = stockStatus(product.stock);
  const discount = discountPercent(product);
  const favorite = isFavorite(product.id);

  const handleAdd = () => {
    addToCart(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  };

  return (
    <article className="pcard">
      <div className="pcard__media">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <ProductImage product={product} />
        </Link>
        {product.onSale && <span className="badge badge--sale">SALE{discount > 0 ? ` -${discount}%` : ''}</span>}
        <button
          type="button"
          className={`pcard__fav ${favorite ? 'is-on' : ''}`}
          onClick={() => toggleFavorite(product.id)}
          aria-label={favorite ? 'Remove from saved' : 'Save product'}
          aria-pressed={favorite}
        >
          {favorite ? <HeartFilled /> : <HeartOutlined />}
        </button>
      </div>
      <div className="pcard__body">
        <TypeChips product={product} />
        <h3 className="pcard__name"><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
        <div className="pcard__rating">
          {product.rating !== undefined ? (
            <><Rate disabled allowHalf value={product.rating} /> <span>{product.rating.toFixed(1)}</span></>
          ) : (
            <span>No ratings yet</span>
          )}
        </div>
        <PriceTag product={product} />
        <span className={`stock stock--${stock.tone}`}>{stock.label}</span>
        <div className="pcard__actions">
          <button
            type="button"
            className={`btn btn--red btn--sm ${added ? 'is-added' : ''}`}
            onClick={handleAdd}
            disabled={product.stock <= 0}
          >
            {added ? <><CheckOutlined /> ADDED</> : <><ShoppingCartOutlined /> ADD TO CART</>}
          </button>
          <Link to={`/product/${product.id}`} className="btn btn--ghost btn--sm">VIEW DETAILS</Link>
        </div>
      </div>
    </article>
  );
}
