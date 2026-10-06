import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Alert, Form, Input, Radio } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import PokeBall from '../components/PokeBall';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { effectivePrice, formatPeso, productTypes } from '../utils/product';

type PaymentMethod = 'cod' | 'ewallet' | 'card';

interface CheckoutValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  barangay: string;
  city: string;
  province: string;
  postalCode: string;
  payment: PaymentMethod;
}

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cod: 'Cash on Delivery',
  ewallet: 'E-Wallet',
  card: 'Credit / Debit Card',
};

export default function Checkout() {
  const { user } = useAuth();
  const { placeOrder } = useStore();
  const { lines, subtotal, shipping, total, clearCart } = useCart();
  const [placedId, setPlacedId] = useState<string | null>(null);

  if (placedId) {
    return (
      <div className="container section">
        <section className="empty">
          <CheckCircleFilled className="success-icon" />
          <h2 className="empty__title">ORDER PLACED!</h2>
          <p className="empty__text">Thanks, trainer. Your order <b>{placedId}</b> is pending. You can follow it from your account.</p>
          <div className="empty__actions">
            <Link to="/account" className="btn btn--red">VIEW MY ORDERS</Link>
            <Link to="/shop" className="btn btn--ghost">KEEP SHOPPING</Link>
          </div>
        </section>
      </div>
    );
  }
  if (lines.length === 0) return <Navigate to="/cart" replace />;

  const onFinish = (v: CheckoutValues) => {
    const order = placeOrder({
      userId: user?.role === 'shopper' ? user.id : undefined,
      customerName: v.fullName.trim(),
      email: v.email.trim().toLowerCase(),
      phone: v.phone.trim(),
      shipping: {
        address: v.address.trim(), barangay: v.barangay.trim(), city: v.city.trim(),
        province: v.province.trim(), postalCode: v.postalCode.trim(),
      },
      items: lines.map(({ product, quantity }) => ({
        productId: product.id, name: product.name, type: productTypes(product).join(' / '),
        price: effectivePrice(product), quantity, image: product.images[0],
      })),
      subtotal, shippingFee: shipping, total,
      paymentMethod: PAYMENT_LABEL[v.payment],
    });
    clearCart();
    setPlacedId(order.id);
  };

  return (
    <div className="container section">
      <header className="page-head"><h1 className="page-head__title">CHECKOUT</h1></header>
      <Form<CheckoutValues> layout="vertical" requiredMark={false} size="large" onFinish={onFinish}
        initialValues={{ fullName: user?.role === 'shopper' ? user.name : '', email: user?.role === 'shopper' ? user.email : '', phone: user?.phone, payment: 'cod' }}>
        <div className="checkout">
          <div className="checkout__forms">
            <section className="panel">
              <h2 className="panel__title">1. Customer information</h2>
              <Form.Item name="fullName" label="Full name" rules={[{ required: true, message: 'Enter your full name' }]}><Input autoComplete="name" /></Form.Item>
              <div className="form-row">
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}><Input autoComplete="email" /></Form.Item>
                <Form.Item name="phone" label="Phone number" rules={[{ required: true, message: 'Enter your phone number' }]}><Input autoComplete="tel" /></Form.Item>
              </div>
            </section>

            <section className="panel">
              <h2 className="panel__title">2. Shipping address</h2>
              <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Enter street, building or house number' }]}><Input autoComplete="street-address" /></Form.Item>
              <div className="form-row">
                <Form.Item name="barangay" label="Barangay" rules={[{ required: true, message: 'Enter your barangay' }]}><Input /></Form.Item>
                <Form.Item name="city" label="City / Municipality" rules={[{ required: true, message: 'Enter your city or municipality' }]}><Input /></Form.Item>
              </div>
              <div className="form-row">
                <Form.Item name="province" label="Province" rules={[{ required: true, message: 'Enter your province' }]}><Input /></Form.Item>
                <Form.Item name="postalCode" label="Postal code" rules={[{ required: true, message: 'Enter your postal code' }]}><Input inputMode="numeric" /></Form.Item>
              </div>
            </section>

            <section className="panel">
              <h2 className="panel__title">3. Payment method</h2>
              <Form.Item name="payment" noStyle>
                <Radio.Group className="pay-group">
                  {(Object.keys(PAYMENT_LABEL) as PaymentMethod[]).map((key) => (
                    <Radio.Button key={key} value={key}>{PAYMENT_LABEL[key]}</Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Alert className="panel__note" type="info" showIcon
                message="Payments are not connected yet. Your order is saved as Pending and no money is charged." />
            </section>
          </div>

          <aside className="summary">
            <h2>ORDER SUMMARY</h2>
            <ul className="summary__items">
              {lines.map(({ product, quantity }) => (
                <li key={product.id}>
                  <span>{product.name} <em>× {quantity}</em></span>
                  <b>{formatPeso(effectivePrice(product) * quantity)}</b>
                </li>
              ))}
            </ul>
            <div className="summary__row"><span>Subtotal</span><b>{formatPeso(subtotal)}</b></div>
            <div className="summary__row"><span>Shipping</span><b>{shipping === 0 ? 'FREE' : formatPeso(shipping)}</b></div>
            <div className="summary__row summary__row--total"><span>Total</span><b>{formatPeso(total)}</b></div>
            <button type="submit" className="btn btn--red btn--block"><PokeBall size={20} /> PLACE ORDER</button>
          </aside>
        </div>
      </Form>
    </div>
  );
}
