import { Link, useNavigate } from 'react-router-dom';
import { App as AntApp, Form, Input, Popconfirm, Tabs, Tag } from 'antd';
import EmptyShop from '../components/EmptyShop';
import ProductGrid from '../components/ProductGrid';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ORDER_STATUS_COLOR, type Order } from '../types/Order';
import { formatDate, formatPeso } from '../utils/product';

function OrderList({ orders, emptyTitle }: { orders: Order[]; emptyTitle: string }) {
  if (orders.length === 0) {
    return <EmptyShop title={emptyTitle} text="Orders will show up here." actions={<Link to="/shop" className="btn btn--red">START SHOPPING</Link>} />;
  }
  return (
    <ul className="orders">
      {orders.map((o) => (
        <li key={o.id} className="order">
          <div className="order__head">
            <b>{o.id}</b><span>{formatDate(o.createdAt)}</span>
            <Tag color={ORDER_STATUS_COLOR[o.status]}>{o.status}</Tag>
            <b className="order__total">{formatPeso(o.total)}</b>
          </div>
          <ul className="order__items">
            {o.items.map((i) => <li key={i.productId}>{i.name} <em>× {i.quantity}</em></li>)}
          </ul>
        </li>
      ))}
    </ul>
  );
}

interface ProfileValues { name: string; phone?: string }

export default function Account() {
  const { user, logout, updateProfile } = useAuth();
  const { orders, products, favorites } = useStore();
  const { message } = AntApp.useApp();
  const navigate = useNavigate();
  const [hidden, setHidden] = useLocalStorage<Record<string, string[]>>('pokeshop-hidden-orders', {});
  if (!user) return null;

  const mine = orders.filter((o) => o.userId === user.id || o.email === user.email.toLowerCase());
  const open = mine.filter((o) => ['Pending', 'Processing', 'Shipped'].includes(o.status));
  const hiddenIds = hidden[user.id] ?? [];
  const history = mine.filter((o) => ['Completed', 'Cancelled'].includes(o.status) && !hiddenIds.includes(o.id));

  const clearHistory = () => {
    setHidden((prev) => ({ ...prev, [user.id]: [...(prev[user.id] ?? []), ...history.map((o) => o.id)] }));
    message.success('Order history cleared');
  };
  const saved = products.filter((p) => favorites.includes(p.id) && p.status === 'active');

  return (
    <div className="container section">
      <header className="page-head account-head">
        <div><h1 className="page-head__title">MY ACCOUNT</h1><p>Signed in as {user.email}</p></div>
        <button type="button" className="btn btn--ghost" onClick={() => { logout(); navigate('/login'); }}>LOGOUT</button>
      </header>
      <Tabs className="account-tabs" items={[
        {
          key: 'profile', label: 'Profile',
          children: (
            <div className="panel profile">
              <Form<ProfileValues> layout="vertical" size="large" requiredMark={false}
                initialValues={{ name: user.name, phone: user.phone }}
                onFinish={(v) => { updateProfile({ name: v.name.trim(), phone: v.phone?.trim() }); message.success('Profile updated'); }}>
                <Form.Item name="name" label="Full name" rules={[{ required: true, message: 'Enter your name' }]}><Input /></Form.Item>
                <Form.Item label="Email"><Input value={user.email} disabled /></Form.Item>
                <Form.Item name="phone" label="Phone number"><Input /></Form.Item>
                <button type="submit" className="btn btn--red">SAVE CHANGES</button>
              </Form>
            </div>
          ),
        },
        { key: 'orders', label: `Orders (${open.length})`, children: <OrderList orders={open} emptyTitle="NO ACTIVE ORDERS" /> },
        { key: 'history', label: 'Order history', children: (
          <>
            {history.length > 0 && (
              <div className="orders__bar">
                <Popconfirm title="Clear all order history?" description="This only removes it from your account view." okText="Clear all" onConfirm={clearHistory}>
                  <button type="button" className="btn btn--red btn--sm">CLEAR ALL</button>
                </Popconfirm>
              </div>
            )}
            <OrderList orders={history} emptyTitle="NO ORDER HISTORY YET" />
          </>
        ) },
        {
          key: 'saved', label: `Saved (${saved.length})`,
          children: saved.length > 0 ? <ProductGrid products={saved} /> : <EmptyShop title="NO SAVED PRODUCTS" text="Tap the heart on a product to save it here." actions={<Link to="/shop" className="btn btn--red">BROWSE THE SHOP</Link>} />,
        },
      ]} />
    </div>
  );
}