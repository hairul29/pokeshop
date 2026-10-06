import { useState } from 'react';
import { Modal, Popconfirm, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import AdminPageHeader from '../../components/AdminPageHeader';
import { useStore } from '../../context/StoreContext';
import type { ContactMessage, MessageStatus } from '../../types/Message';
import { formatDate } from '../../utils/product';

const COLOR: Record<MessageStatus, string> = { New: 'red', Read: 'blue', Replied: 'green' };

export default function Messages() {
  const { messages, updateMessageStatus, deleteMessage } = useStore();
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const open = (m: ContactMessage) => {
    setSelected(m);
    if (m.status === 'New') updateMessageStatus(m.id, 'Read');
  };

  const columns: TableColumnsType<ContactMessage> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Subject', dataIndex: 'subject' },
    { title: 'Date', dataIndex: 'createdAt', render: formatDate },
    { title: 'Status', dataIndex: 'status', render: (s: MessageStatus) => <Tag color={COLOR[s]}>{s}</Tag> },
    { title: 'Action', key: 'action',
      render: (_, m) => (
        <div className="row-actions">
          <button type="button" className="btn btn--ghost btn--xs" onClick={() => open(m)}>View</button>
          <Popconfirm title="Delete this message?" okText="Delete" okButtonProps={{ danger: true }} onConfirm={() => deleteMessage(m.id)}>
            <button type="button" className="btn btn--red btn--xs">Delete</button>
          </Popconfirm>
        </div>
      ) },
  ];

  return (
    <>
      <AdminPageHeader title="Messages" subtitle="Submissions from the Contact Us page." />
      <section className="admin-card">
        <Table<ContactMessage> rowKey="id" columns={columns} dataSource={messages} scroll={{ x: 700 }} pagination={{ pageSize: 10, hideOnSinglePage: true }}
          locale={{ emptyText: <div className="table-empty">No messages yet.</div> }} />
      </section>
      <Modal open={!!selected} onCancel={() => setSelected(null)} title={selected?.subject} className="poke-modal"
        footer={selected && (
          <a className="btn btn--red btn--sm" href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
            onClick={() => updateMessageStatus(selected.id, 'Replied')}>REPLY BY EMAIL</a>
        )}>
        {selected && <div className="order-detail"><p><b>{selected.name}</b> · {selected.email}</p><p style={{ whiteSpace: 'pre-wrap' }}>{selected.message}</p></div>}
      </Modal>
    </>
  );
}
