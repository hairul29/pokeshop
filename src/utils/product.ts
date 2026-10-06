import type { PokemonType, Product } from '../types/Product';

export const formatPeso = (amount: number): string =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });

/** Price the shopper actually pays. */
export const effectivePrice = (p: Product): number =>
  p.onSale && p.salePrice !== undefined ? p.salePrice : p.price;

export const discountPercent = (p: Product): number =>
  p.onSale && p.salePrice !== undefined && p.price > 0
    ? Math.round((1 - p.salePrice / p.price) * 100)
    : 0;

/** All types a product belongs to (1 or 2). */
export const productTypes = (p: Pick<Product, 'type' | 'secondaryType'>): PokemonType[] =>
  p.secondaryType && p.secondaryType !== p.type ? [p.type, p.secondaryType] : [p.type];

export const uid = (prefix: string): string =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export type StockTone = 'ok' | 'low' | 'out';

export function stockStatus(stock: number): { label: string; tone: StockTone } {
  if (stock <= 0) return { label: 'Sold out', tone: 'out' };
  if (stock <= 5) return { label: `Only ${stock} left`, tone: 'low' };
  return { label: 'In stock', tone: 'ok' };
}
