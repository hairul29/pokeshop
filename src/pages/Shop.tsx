import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Checkbox, Drawer, Input, Pagination, Select, Slider } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import EmptyShop from '../components/EmptyShop';
import ProductGrid from '../components/ProductGrid';
import { TYPE_META } from '../data/types';
import { useStore } from '../context/StoreContext';
import { POKEMON_TYPES, type PokemonType } from '../types/Product';
import { effectivePrice, formatPeso, productTypes } from '../utils/product';

type SortKey = 'newest' | 'priceAsc' | 'priceDesc' | 'name';

interface Filters {
  q: string;
  type: PokemonType | 'all';
  /** null = full price range */
  range: [number, number] | null;
  inStock: boolean;
  onSale: boolean;
  sort: SortKey;
}

const INITIAL: Filters = { q: '', type: 'all', range: null, inStock: false, onSale: false, sort: 'newest' };
const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'priceAsc', label: 'Price: low to high' },
  { value: 'priceDesc', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A to Z' },
];

interface PanelProps {
  filters: Filters;
  maxPrice: number;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
}

function FilterPanel({ filters, maxPrice, onChange, onReset }: PanelProps) {
  const range = filters.range ?? [0, maxPrice];
  return (
    <div className="filters">
      <label className="filters__label">Pokémon type</label>
      <Select
        value={filters.type}
        onChange={(type: Filters['type']) => onChange({ type })}
        options={[
          { value: 'all', label: 'All types' },
          ...POKEMON_TYPES.map((t) => ({ value: t, label: `${TYPE_META[t].emoji} ${t}` })),
        ]}
      />
      <label className="filters__label">Price range</label>
      <Slider range min={0} max={maxPrice} step={50} value={range}
        onChange={(v) => onChange({ range: [v[0], v[1]] })}
        tooltip={{ formatter: (v) => (v === undefined ? '' : formatPeso(v)) }} />
      <div className="filters__range"><span>{formatPeso(range[0])}</span><span>{formatPeso(range[1])}</span></div>
      <label className="filters__label">Availability</label>
      <Checkbox checked={filters.inStock} onChange={(e) => onChange({ inStock: e.target.checked })}>In stock only</Checkbox>
      <Checkbox checked={filters.onSale} onChange={(e) => onChange({ onSale: e.target.checked })}>On sale only</Checkbox>
      <button type="button" className="btn btn--ghost btn--sm btn--block" onClick={onReset}>RESET FILTERS</button>
    </div>
  );
}

export default function Shop() {
  const { activeProducts } = useStore();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({ ...INITIAL, q: searchParams.get('q') ?? '' });
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Keep the search box in sync when the navbar search changes the URL.
  const urlQuery = searchParams.get('q') ?? '';
  useEffect(() => {
    setFilters((f) => ({ ...f, q: urlQuery }));
    setPage(1);
  }, [urlQuery]);

  const update = (patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };
  const reset = () => update({ ...INITIAL });

  const maxPrice = useMemo(
    () => Math.max(1000, Math.ceil(Math.max(0, ...activeProducts.map(effectivePrice)) / 100) * 100),
    [activeProducts],
  );

  const results = useMemo(() => {
    const [min, max] = filters.range ?? [0, maxPrice];
    const q = filters.q.trim().toLowerCase();
    const list = activeProducts.filter((p) => {
      const price = effectivePrice(p);
      return (
        (!q || [p.name, p.description, p.sku].some((s) => s.toLowerCase().includes(q))) &&
        (filters.type === 'all' || productTypes(p).includes(filters.type)) &&
        price >= min && price <= max &&
        (!filters.inStock || p.stock > 0) &&
        (!filters.onSale || p.onSale)
      );
    });
    return list.sort((a, b) => {
      switch (filters.sort) {
        case 'priceAsc': return effectivePrice(a) - effectivePrice(b);
        case 'priceDesc': return effectivePrice(b) - effectivePrice(a);
        case 'name': return a.name.localeCompare(b.name);
        default: return b.createdAt.localeCompare(a.createdAt);
      }
    });
  }, [activeProducts, filters, maxPrice]);

  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container section">
      <header className="page-head">
        <h1 className="page-head__title">SHOP</h1>
        <p>{activeProducts.length === 0 ? 'The catalog is empty for now.' : `${results.length} ${results.length === 1 ? 'product' : 'products'} found`}</p>
      </header>

      {activeProducts.length === 0 ? (
        <EmptyShop />
      ) : (
        <div className="shop">
          <aside className="shop__side"><FilterPanel filters={filters} maxPrice={maxPrice} onChange={update} onReset={reset} /></aside>
          <div className="shop__main">
            <div className="toolbar">
              <Input allowClear size="large" prefix={<SearchOutlined />} placeholder="Search products…"
                value={filters.q} onChange={(e) => update({ q: e.target.value })} />
              <Select size="large" value={filters.sort} options={SORT_OPTIONS} onChange={(sort: SortKey) => update({ sort })} className="toolbar__sort" />
              <button type="button" className="btn btn--ghost toolbar__filter" onClick={() => setFiltersOpen(true)}>
                <FilterOutlined /> FILTERS
              </button>
            </div>
            {results.length === 0 ? (
              <EmptyShop title="NO MATCHES FOUND" text="Try a different search or clear your filters."
                actions={<button type="button" className="btn btn--red" onClick={reset}>CLEAR FILTERS</button>} />
            ) : (
              <>
                <ProductGrid products={visible} />
                <div className="pager">
                  <Pagination current={page} pageSize={PAGE_SIZE} total={results.length} onChange={setPage} hideOnSinglePage showSizeChanger={false} />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} placement="bottom" height="auto" title="FILTERS" className="filter-drawer">
        <FilterPanel filters={filters} maxPrice={maxPrice} onChange={update} onReset={reset} />
      </Drawer>
    </div>
  );
}
