import { Switch, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import AdminPageHeader from '../../components/AdminPageHeader';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import type { User } from '../../types/User';
import { formatDate } from '../../utils/product';

export default function Customers() {
  const { customers, setCustomerStatus } = useAuth();
  const { orders } = useStore();

  const columns: TableColumnsType<User> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Orders', key: 'orders', render: (_, c) => orders.filter((o) => o.userId === c.id || o.email === c.email).length },
    { title: 'Registration date', dataIndex: 'createdAt', render: formatDate },
    { title: 'Status', dataIndex: 'status',
      render: (s: User['status'], c) => (
        <Switch checked={s === 'active'} checkedChildren="Active" unCheckedChildren="Blocked"
          onChange={(on) => setCustomerStatus(c.id, on ? 'active' : 'blocked')} />
      ) },
  ];

  return (
    <>
      <AdminPageHeader title="Customers" subtitle={`${customers.length} registered`} />
      <section className="admin-card">
        <Table<User> rowKey="id" columns={columns} dataSource={customers} scroll={{ x: 700 }} pagination={{ pageSize: 10, hideOnSinglePage: true }}
          locale={{ emptyText: <div className="table-empty">No customers yet. Shoppers appear here after they register.</div> }} />
      </section>
    </>
  );
}
