import { Link } from 'react-router-dom';
import { Drawer } from 'antd';
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { effectivePrice, formatPeso } from '../utils/product';
import EmptyShop from './EmptyShop';
import ProductImage from './ProductImage';
import QuantityStepper from './QuantityStepper';

/** Quick-view cart that slides in from the navbar. */
export default function CartDrawer() {
  const { lines, subtotal, drawerOpen, setDrawerOpen, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const close = () => setDrawerOpen(false);

  return (
    <Drawer
      open={drawerOpen}
      onClose={close}
      width={400}
      className="cart-drawer"
      title="YOUR CART"
      closeIcon={<CloseOutlined />}
      footer={
        lines.length > 0 && (
          <div className="cart-drawer__foot">
            <div className="cart-drawer__sub"><span>Subtotal</span><b>{formatPeso(subtotal)}</b></div>
            <Link to="/cart" className="btn btn--ghost btn--block" onClick={close}>VIEW CART</Link>
            <Link to="/checkout" className="btn btn--red btn--block" onClick={close}>CHECKOUT</Link>
          </div>
        )
      }
    >
      {lines.length === 0 ? (
        <EmptyShop
          title="YOUR CART IS EMPTY"
          text="Looks like your collection needs a new addition!"
          actions={<Link to="/shop" className="btn btn--red" onClick={close}>START SHOPPING</Link>}
        />
      ) : (
        <ul className="mini-cart">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="mini-cart__item">
              <ProductImage product={product} className="mini-cart__img" />
              <div className="mini-cart__info">
                <Link to={`/product/${product.id}`} onClick={close}>{product.name}</Link>
                <span>{formatPeso(effectivePrice(product))}</span>
                <QuantityStepper value={quantity} max={product.stock}
                  onDecrease={() => decreaseQuantity(product.id)} onIncrease={() => increaseQuantity(product.id)} />
              </div>
              <button type="button" className="icon-btn icon-btn--sm" onClick={() => removeFromCart(product.id)} aria-label={`Remove ${product.name}`}>
                <DeleteOutlined />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
