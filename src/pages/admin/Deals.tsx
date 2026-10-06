import { useState } from 'react';
import { App as AntApp, InputNumber, Modal, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import AdminPageHeader from '../../components/AdminPageHeader';
import ProductImage from '../../components/ProductImage';
import { useStore } from '../../context/StoreContext';
import type { Product } from '../../types/Product';
import { discountPercent, formatPeso } from '../../utils/product';

export default function Deals() {
  const { products, updateProduct } = useStore();
  const { message } = AntApp.useApp();
  const [target, setTarget] = useState<Product | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const openModal = (p: Product) => { setTarget(p); setPrice(p.salePrice ?? null); };

  const save = () => {
    if (!target) return;
    if (price === null || price <= 0 || price >= target.price) {
      message.error('The sale price must be above 0 and lower than the regular price.');
      return;
    }
    updateProduct(target.id, { onSale: true, salePrice: price });
    message.success('Deal saved');
    setTarget(null);
  };

  const columns: TableColumnsType<Product> = [
    { title: 'Product', dataIndex: 'name', render: (n: string, p) => <div className="cell-product"><ProductImage product={p} className="thumb" /><b>{n}</b></div> },
    { title: 'Regular price', dataIndex: 'price', render: formatPeso },
    { title: 'Deal', dataIndex: 'onSale',
      render: (_, p) => p.onSale ? <Tag color="red">{formatPeso(p.salePrice ?? 0)} · -{discountPercent(p)}%</Tag> : <span className="muted">Not on deal</span> },
    { title: 'Actions', key: 'actions',
      render: (_, p) => (
        <div className="row-actions">
          <button type="button" className="btn btn--ghost btn--xs" onClick={() => openModal(p)}>{p.onSale ? 'Edit price' : 'Mark as deal'}</button>
          {p.onSale && (
            <button type="button" className="btn btn--red btn--xs" onClick={() => { updateProduct(p.id, { onSale: false, salePrice: undefined }); message.success('Removed from deals'); }}>Remove</button>
          )}
        </div>
      ) },
  ];

  return (
    <>
      <AdminPageHeader title="Deals" subtitle="Mark products as deals, set a sale price, or take them off." />
      <section className="admin-card">
        <Table<Product> rowKey="id" columns={columns} dataSource={products} scroll={{ x: 700 }} pagination={{ pageSize: 10, hideOnSinglePage: true }}
          locale={{ emptyText: <div className="table-empty">Add products first, then turn them into deals here.</div> }} />
      </section>
      <Modal open={!!target} title={target ? `Deal for ${target.name}` : ''} onCancel={() => setTarget(null)} onOk={save} okText="Save deal" className="poke-modal">
        {target && (
          <div className="deal-modal">
            <p>Regular price: <b>{formatPeso(target.price)}</b></p>
            <label htmlFor="sale-price">Sale price (₱)</label>
            <InputNumber id="sale-price" min={0} value={price} onChange={setPrice} style={{ width: '100%' }} size="large" />
          </div>
        )}
      </Modal>
    </>
  );
}
