import { useState } from 'react';
import { Modal, Select, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import AdminPageHeader from '../../components/AdminPageHeader';
import { useStore } from '../../context/StoreContext';
import { ORDER_STATUSES, ORDER_STATUS_COLOR, type Order } from '../../types/Order';
import { formatDate, formatPeso } from '../../utils/product';

export default function Orders() {
  const { orders, updateOrderStatus } = useStore();
  const [selected, setSelected] = useState<Order | null>(null);

  const columns: TableColumnsType<Order> = [
    { title: 'Order ID', dataIndex: 'id' },
    { title: 'Customer', dataIndex: 'customerName', render: (n: string, o) => <div>{n}<div className="muted">{o.email}</div></div> },
    { title: 'Date', dataIndex: 'createdAt', render: formatDate, sorter: (a, b) => a.createdAt.localeCompare(b.createdAt) },
    { title: 'Items', dataIndex: 'items', render: (_, o) => o.items.reduce((s, i) => s + i.quantity, 0) },
    { title: 'Total', dataIndex: 'total', render: formatPeso },
    { title: 'Status', dataIndex: 'status',
      render: (s: Order['status'], o) => (
        <Select value={s} size="small" style={{ width: 130 }} onChange={(next) => updateOrderStatus(o.id, next)}
          options={ORDER_STATUSES.map((v) => ({ value: v, label: <Tag color={ORDER_STATUS_COLOR[v]}>{v}</Tag> }))} />
      ) },
    { title: 'Actions', key: 'actions', render: (_, o) => <button type="button" className="btn btn--ghost btn--xs" onClick={() => setSelected(o)}>View</button> },
  ];

  return (
    <>
      <AdminPageHeader title="Orders" subtitle={`${orders.length} total`} />
      <section className="admin-card">
        <Table<Order> rowKey="id" columns={columns} dataSource={orders} scroll={{ x: 800 }} pagination={{ pageSize: 10, hideOnSinglePage: true }}
          locale={{ emptyText: <div className="table-empty">No orders yet.</div> }} />
      </section>
      <Modal open={!!selected} onCancel={() => setSelected(null)} footer={null} title={selected ? `Order ${selected.id}` : ''} className="poke-modal">
        {selected && (
          <div className="order-detail">
            <p><b>{selected.customerName}</b> · {selected.email} · {selected.phone}</p>
            <p>{selected.shipping.address}, {selected.shipping.barangay}, {selected.shipping.city}, {selected.shipping.province} {selected.shipping.postalCode}</p>
            <ul>{selected.items.map((i) => <li key={i.productId}>{i.name} × {i.quantity} <b>{formatPeso(i.price * i.quantity)}</b></li>)}</ul>
            <p>Subtotal {formatPeso(selected.subtotal)} · Shipping {formatPeso(selected.shippingFee)}</p>
            <p><b>Total {formatPeso(selected.total)}</b> · {selected.paymentMethod}</p>
          </div>
        )}
      </Modal>
    </>
  );
}
