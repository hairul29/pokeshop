import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Product } from '../types/Product';
import { effectivePrice } from '../utils/product';
import { useStore } from './StoreContext';

interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  /** Increments on every add so the navbar icon can replay its bounce animation. */
  bumpKey: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { activeProducts, settings } = useStore();
  const [items, setItems] = useLocalStorage<CartItem[]>('pokeshop-cart', []);
  const [bumpKey, setBumpKey] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Cart lines always use the latest product data; deleted/inactive products drop out.
  const lines = useMemo<CartLine[]>(
    () =>
      items.flatMap((item) => {
        const product = activeProducts.find((p) => p.id === item.productId);
        return product && product.stock > 0
          ? [{ product, quantity: Math.min(item.quantity, product.stock) }]
          : [];
      }),
    [items, activeProducts],
  );

  const cartCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + effectivePrice(l.product) * l.quantity, 0);
  const freeShipping = settings.freeShippingOver > 0 && subtotal >= settings.freeShippingOver;
  const shipping = lines.length === 0 || freeShipping ? 0 : settings.shippingFee;

  const addToCart: CartContextValue['addToCart'] = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      const next = Math.min((existing?.quantity ?? 0) + quantity, product.stock);
      if (next <= 0) return prev;
      return existing
        ? prev.map((i) => (i.productId === product.id ? { ...i, quantity: next } : i))
        : [...prev, { productId: product.id, quantity: next }];
    });
    setBumpKey((k) => k + 1);
  };

  const changeQuantity = (productId: string, delta: number) => {
    const stock = activeProducts.find((p) => p.id === productId)?.stock ?? 0;
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(i.quantity + delta, stock)) } : i,
      ),
    );
  };

  const value: CartContextValue = {
    lines, cartCount, subtotal, shipping, total: subtotal + shipping,
    bumpKey, drawerOpen, setDrawerOpen,
    addToCart,
    removeFromCart: (id) => setItems((prev) => prev.filter((i) => i.productId !== id)),
    increaseQuantity: (id) => changeQuantity(id, 1),
    decreaseQuantity: (id) => changeQuantity(id, -1),
    clearCart: () => setItems([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
