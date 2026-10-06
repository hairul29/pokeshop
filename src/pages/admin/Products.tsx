import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { App as AntApp, Input, Popconfirm, Select, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import AdminPageHeader from '../../components/AdminPageHeader';
import ProductImage from '../../components/ProductImage';
import TypeChips from '../../components/TypeChips';
import { TYPE_META } from '../../data/types';
import { useStore } from '../../context/StoreContext';
import { POKEMON_TYPES, type PokemonType, type Product } from '../../types/Product';
import { formatPeso, productTypes } from '../../utils/product';

export default function Products() {
  const { products, deleteProduct } = useStore();
  const { message } = AntApp.useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [type, setType] = useState<PokemonType | 'all'>('all');

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) =>
      (type === 'all' || productTypes(p).includes(type)) &&
      (!term || p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term)));
  }, [products, q, type]);

  const columns: TableColumnsType<Product> = [
    { title: 'Image', dataIndex: 'images', width: 84, render: (_, p) => <ProductImage product={p} className="thumb" /> },
    { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, p) => <div><b>{name}</b><div className="muted">{p.sku}</div></div> },
    { title: 'Types', key: 'types', render: (_, p) => <TypeChips product={p} /> },
    { title: 'Price', dataIndex: 'price', sorter: (a, b) => a.price - b.price, render: formatPeso },
    { title: 'Stock', dataIndex: 'stock', sorter: (a, b) => a.stock - b.stock },
    { title: 'Status', dataIndex: 'status', render: (s: Product['status']) => <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag> },
    { title: 'Sale', dataIndex: 'onSale', render: (_, p) => (p.onSale ? <Tag color="red">{formatPeso(p.salePrice ?? 0)}</Tag> : <span className="muted">—</span>) },
    { title: 'Actions', key: 'actions', width: 150,
      render: (_, p) => (
        <div className="row-actions">
          <button type="button" className="btn btn--ghost btn--xs" onClick={() => navigate(`/admin/products/edit/${p.id}`)}><EditOutlined /> Edit</button>
          <Popconfirm title="Delete this product?" description="This cannot be undone." okText="Delete" okButtonProps={{ danger: true }}
            onConfirm={() => { deleteProduct(p.id); message.success('Product deleted'); }}>
            <button type="button" className="btn btn--red btn--xs"><DeleteOutlined /> Delete</button>
          </Popconfirm>
        </div>
      ) },
  ];

  return (
    <>
      <AdminPageHeader title="Products" subtitle={`${products.length} total`}
        action={<Link to="/admin/products/add" className="btn btn--red">+ ADD PRODUCT</Link>} />
      <section className="admin-card">
        <div className="admin-filters">
          <Input allowClear prefix={<SearchOutlined />} placeholder="Search by name or SKU" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={type} onChange={setType} options={[{ value: 'all', label: 'All types' }, ...POKEMON_TYPES.map((t) => ({ value: t, label: `${TYPE_META[t].emoji} ${t}` }))]} />
        </div>
        <Table<Product> rowKey="id" columns={columns} dataSource={rows} scroll={{ x: 900 }} pagination={{ pageSize: 10, hideOnSinglePage: true }}
          locale={{ emptyText: <div className="table-empty">{products.length === 0 ? 'No products yet. Add your first product to open the shop.' : 'No products match your search.'}</div> }} />
      </section>
    </>
  );
}
