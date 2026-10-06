import { Link, useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import EmptyShop from '../components/EmptyShop';
import ProductImage from '../components/ProductImage';
import QuantityStepper from '../components/QuantityStepper';
import TypeChips from '../components/TypeChips';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { effectivePrice, formatPeso } from '../utils/product';

export default function Cart() {
  const { lines, subtotal, shipping, total, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const { settings } = useStore();
  const navigate = useNavigate();

  if (lines.length === 0) {
    return (
      <div className="container section">
        <EmptyShop title="YOUR CART IS EMPTY" text="Looks like your collection needs a new addition!"
          actions={<Link to="/shop" className="btn btn--red">START SHOPPING</Link>} />
      </div>
    );
  }

  const remaining = settings.freeShippingOver - subtotal;

  return (
    <div className="container section">
      <header className="page-head"><h1 className="page-head__title">YOUR CART</h1></header>
      <div className="cart">
        <ul className="cart__list">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="cart__item">
              <Link to={`/product/${product.id}`}><ProductImage product={product} className="cart__img" /></Link>
              <div className="cart__info">
                <Link to={`/product/${product.id}`} className="cart__name">{product.name}</Link>
                <TypeChips product={product} />
                <span className="cart__unit">{formatPeso(effectivePrice(product))} each</span>
              </div>
              <QuantityStepper value={quantity} max={product.stock}
                onDecrease={() => decreaseQuantity(product.id)} onIncrease={() => increaseQuantity(product.id)} />
              <b className="cart__line">{formatPeso(effectivePrice(product) * quantity)}</b>
              <button type="button" className="icon-btn" onClick={() => removeFromCart(product.id)} aria-label={`Remove ${product.name}`}><DeleteOutlined /></button>
            </li>
          ))}
          <li className="cart__clear"><button type="button" className="link-btn" onClick={clearCart}>Clear cart</button></li>
        </ul>

        <aside className="summary">
          <h2>ORDER SUMMARY</h2>
          <div className="summary__row"><span>Subtotal</span><b>{formatPeso(subtotal)}</b></div>
          <div className="summary__row"><span>Shipping</span><b>{shipping === 0 ? 'FREE' : formatPeso(shipping)}</b></div>
          {settings.freeShippingOver > 0 && remaining > 0 && (
            <p className="summary__note">Add {formatPeso(remaining)} more for free shipping.</p>
          )}
          <div className="summary__row summary__row--total"><span>Total</span><b>{formatPeso(total)}</b></div>
          <button type="button" className="btn btn--red btn--block" onClick={() => navigate('/checkout')}>CHECKOUT</button>
          <Link to="/shop" className="btn btn--ghost btn--block">KEEP SHOPPING</Link>
        </aside>
      </div>
    </div>
  );
}
