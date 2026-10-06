import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { products as initialProducts } from '../data/products';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { ContactMessage, MessageStatus } from '../types/Message';
import type { AppNotification } from '../types/Notification';
import type { Order, OrderStatus } from '../types/Order';
import type { Product } from '../types/Product';
import { uid } from '../utils/product';
import { useAuth } from './AuthContext';

export interface StoreSettings {
  shippingFee: number;
  /** Orders at or above this subtotal ship free. 0 turns it off. */
  freeShippingOver: number;
}

const DEFAULT_SETTINGS: StoreSettings = { shippingFee: 99, freeShippingOver: 2000 };

export type NewProduct = Omit<Product, 'id' | 'createdAt'>;
export type NewOrder = Omit<Order, 'id' | 'createdAt' | 'status'>;
export type NewMessage = Omit<ContactMessage, 'id' | 'createdAt' | 'status'>;

interface StoreContextValue {
  products: Product[];
  activeProducts: Product[];
  addProduct: (data: NewProduct) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  orders: Order[];
  placeOrder: (data: NewOrder) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  messages: ContactMessage[];
  addMessage: (data: NewMessage) => void;
  updateMessageStatus: (id: string, status: MessageStatus) => void;
  deleteMessage: (id: string) => void;
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  notifications: AppNotification[];
  markNotificationsRead: (audience: string) => void;
  clearNotifications: (audience: string) => void;
  settings: StoreSettings;
  updateSettings: (patch: Partial<StoreSettings>) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useLocalStorage<Product[]>('pokeshop-products', initialProducts);
  const [orders, setOrders] = useLocalStorage<Order[]>('pokeshop-orders', []);
  const [messages, setMessages] = useLocalStorage<ContactMessage[]>('pokeshop-messages', []);
  const [favMap, setFavMap] = useLocalStorage<Record<string, string[]>>('pokeshop-favorites', {});
  const [settings, setSettings] = useLocalStorage<StoreSettings>('pokeshop-settings', DEFAULT_SETTINGS);

  const [notifications, setNotifications] = useLocalStorage<AppNotification[]>('pokeshop-notifications', []);

  /** audience = "admin" or a shopper's user id */
  const notify = (audience: string, text: string, link: string) =>
    setNotifications((prev) =>
      [{ id: uid('ntf'), audience, text, link, createdAt: new Date().toISOString(), read: false }, ...prev].slice(0, 100),
    );

  const favKey = user?.id ?? 'guest';
  const favorites = favMap[favKey] ?? [];
  const activeProducts = useMemo(() => products.filter((p) => p.status === 'active'), [products]);

  const addProduct: StoreContextValue['addProduct'] = (data) => {
    const product: Product = { ...data, id: uid('prd'), createdAt: new Date().toISOString() };
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  const placeOrder: StoreContextValue['placeOrder'] = (data) => {
    const order: Order = {
      ...data,
      id: `PS-${Date.now().toString(36).toUpperCase()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    notify('admin', `New order ${order.id} from ${order.customerName}`, '/admin/orders');
    if (order.userId) notify(order.userId, `Your order ${order.id} was placed`, '/account');
    setProducts((prev) =>
      prev.map((p) => {
        const item = data.items.find((i) => i.productId === p.id);
        return item ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p;
      }),
    );
    return order;
  };

  const value: StoreContextValue = {
    products,
    activeProducts,
    addProduct,
    updateProduct: (id, patch) => setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    deleteProduct: (id) => setProducts((prev) => prev.filter((p) => p.id !== id)),
    orders,
    placeOrder,
    updateOrderStatus: (id, status) => {
      const order = orders.find((o) => o.id === id);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      if (order?.userId && order.status !== status) notify(order.userId, `Order ${order.id} is now ${status}`, '/account');
    },
    messages,
    addMessage: (data) => {
      setMessages((prev) => [{ ...data, id: uid('msg'), status: 'New', createdAt: new Date().toISOString() }, ...prev]);
      notify('admin', `New message from ${data.name}: ${data.subject}`, '/admin/messages');
    },
    updateMessageStatus: (id, status) => setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m))),
    deleteMessage: (id) => setMessages((prev) => prev.filter((m) => m.id !== id)),
    favorites,
    isFavorite: (id) => favorites.includes(id),
    toggleFavorite: (id) =>
      setFavMap((prev) => {
        const cur = prev[favKey] ?? [];
        return { ...prev, [favKey]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
      }),
    notifications,
    markNotificationsRead: (audience) =>
      setNotifications((prev) => prev.map((n) => (n.audience === audience ? { ...n, read: true } : n))),
    clearNotifications: (audience) => setNotifications((prev) => prev.filter((n) => n.audience !== audience)),
    settings,
    updateSettings: (patch) => setSettings((prev) => ({ ...prev, ...patch })),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}