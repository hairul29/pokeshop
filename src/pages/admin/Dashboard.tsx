import { Link } from 'react-router-dom';
import { Popconfirm, Statistic, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { AppstoreOutlined, DollarOutlined, ShoppingOutlined, TagsOutlined, TeamOutlined } from '@ant-design/icons';
import AdminPageHeader from '../../components/AdminPageHeader';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ORDER_STATUS_COLOR, type Order } from '../../types/Order';
import { formatDate, formatPeso } from '../../utils/product';

export default function Dashboard() {
  const { products, orders } = useStore();
  const { customers } = useAuth();
  const [clearedAt, setClearedAt] = useLocalStorage<string | null>('pokeshop-recent-cleared', null);
  const recent = orders.filter((o) => !clearedAt || o.createdAt > clearedAt).slice(0, 5);
  const totalSales = orders.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
  const activeDeals = products.filter((p) => p.onSale && p.status === 'active').length;

  const stats = [
    { title: 'Total Products', value: products.length, icon: <AppstoreOutlined />, tone: 'blue' },
    { title: 'Total Orders', value: orders.length, icon: <ShoppingOutlined />, tone: 'red' },
    { title: 'Total Customers', value: customers.length, icon: <TeamOutlined />, tone: 'yellow' },
    { title: 'Total Sales', value: totalSales, icon: <DollarOutlined />, tone: 'green', peso: true },
    { title: 'Active Deals', value: activeDeals, icon: <TagsOutlined />, tone: 'red' },
  ];

  const columns: TableColumnsType<Order> = [
    { title: 'Order', dataIndex: 'id' },
    { title: 'Customer', dataIndex: 'customerName' },
    { title: 'Date', dataIndex: 'createdAt', render: formatDate },
    { title: 'Total', dataIndex: 'total', render: formatPeso },
    { title: 'Status', dataIndex: 'status', render: (s: Order['status']) => <Tag color={ORDER_STATUS_COLOR[s]}>{s}</Tag> },
  ];

  return (
    <>
      <AdminPageHeader title="Dashboard" subtitle="A quick look at your store."
        action={<Link to="/admin/products/add" className="btn btn--red">+ ADD PRODUCT</Link>} />
      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.title} className={`stat stat--${s.tone}`}>
            <span className="stat__icon">{s.icon}</span>
            <Statistic title={s.title} value={s.value} formatter={s.peso ? (v) => formatPeso(Number(v)) : undefined} />
          </div>
        ))}
      </div>
      <section className="admin-card">
        <div className="admin-card__head">
          <h2>Recent orders</h2>
          {recent.length > 0 && (
            <Popconfirm title="Clear recent orders?" description="They stay in Orders and in your totals." okText="Clear all"
              onConfirm={() => setClearedAt(new Date().toISOString())}>
              <button type="button" className="btn btn--red btn--xs">CLEAR ALL</button>
            </Popconfirm>
          )}
        </div>
        <Table<Order> rowKey="id" columns={columns} dataSource={recent} pagination={false} scroll={{ x: 600 }}
          locale={{ emptyText: <div className="table-empty">No orders yet. They will show up here.</div> }} />
      </section>
    </>
  );
}