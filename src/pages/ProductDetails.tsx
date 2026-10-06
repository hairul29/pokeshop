import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Rate } from 'antd';
import { CheckOutlined, HeartFilled, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import EmptyShop from '../components/EmptyShop';
import PriceTag from '../components/PriceTag';
import ProductGrid from '../components/ProductGrid';
import ProductImage from '../components/ProductImage';
import QuantityStepper from '../components/QuantityStepper';
import TypeChips from '../components/TypeChips';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { productTypes, stockStatus } from '../utils/product';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { products, activeProducts, isFavorite, toggleFavorite } = useStore();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === id);
  if (!product || (product.status !== 'active' && !isAdmin)) {
    return (
      <div className="container section">
        <EmptyShop title="PRODUCT NOT FOUND" text="This product is no longer available."
          actions={<Link to="/shop" className="btn btn--red">BACK TO SHOP</Link>} />
      </div>
    );
  }

  const stock = stockStatus(product.stock);
  const related = activeProducts.filter((p) => p.id !== product.id && productTypes(p).some((t) => productTypes(product).includes(t))).slice(0, 4);
  const favorite = isFavorite(product.id);
  const mainImage = product.images[imageIndex] ?? product.images[0];

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  };

  return (
    <div className="container section">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/shop">Shop</Link> / <Link to={`/category/${product.type.toLowerCase()}`}>{product.type}</Link> / <span>{product.name}</span>
      </nav>

      <div className="detail">
        <div className="gallery">
          <div className="gallery__main">
            <ProductImage product={{ ...product, images: mainImage ? [mainImage] : [] }} />
            {product.onSale && <span className="badge badge--sale">SALE</span>}
          </div>
          {product.images.length > 1 && (
            <div className="gallery__thumbs">
              {product.images.map((src, i) => (
                <button key={i} type="button" className={i === imageIndex ? 'is-on' : ''} onClick={() => setImageIndex(i)} aria-label={`Show image ${i + 1}`}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail__info">
          <TypeChips product={product} />
          <h1 className="detail__name">{product.name}</h1>
          <div className="pcard__rating">
            {product.rating !== undefined ? <><Rate disabled allowHalf value={product.rating} /> <span>{product.rating.toFixed(1)}</span></> : <span>No ratings yet</span>}
          </div>
          <PriceTag product={product} large />
          <p className="detail__desc">{product.description}</p>

          <dl className="detail__meta">
            <div><dt>Availability</dt><dd><span className={`stock stock--${stock.tone}`}>{stock.label}</span></dd></div>
            <div><dt>Stock</dt><dd>{product.stock}</dd></div>
            <div><dt>SKU</dt><dd>{product.sku}</dd></div>
            <div><dt>{productTypes(product).length > 1 ? 'Types' : 'Type'}</dt><dd>{productTypes(product).join(' / ')}</dd></div>
          </dl>

          <div className="detail__buy">
            <QuantityStepper value={qty} max={Math.max(1, product.stock)}
              onDecrease={() => setQty((q) => Math.max(1, q - 1))} onIncrease={() => setQty((q) => Math.min(product.stock, q + 1))} />
            <button type="button" className={`btn btn--red ${added ? 'is-added' : ''}`} onClick={handleAdd} disabled={product.stock <= 0}>
              {added ? <><CheckOutlined /> ADDED</> : <><ShoppingCartOutlined /> ADD TO CART</>}
            </button>
            <button type="button" className="btn btn--primary" disabled={product.stock <= 0}
              onClick={() => { addToCart(product, qty); navigate('/checkout'); }}>BUY NOW</button>
            <button type="button" className={`icon-btn icon-btn--lg pcard__fav-inline ${favorite ? 'is-on' : ''}`}
              onClick={() => toggleFavorite(product.id)} aria-label={favorite ? 'Remove from saved' : 'Save product'} aria-pressed={favorite}>
              {favorite ? <HeartFilled /> : <HeartOutlined />}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section section--tight">
          <h2 className="section__title">Related products</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
