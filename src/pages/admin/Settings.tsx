import { App as AntApp, Form, InputNumber, Popconfirm } from 'antd';
import AdminPageHeader from '../../components/AdminPageHeader';
import { useStore, type StoreSettings } from '../../context/StoreContext';

const DATA_KEYS = ['products', 'orders', 'messages', 'favorites', 'cart', 'settings', 'users'];

export default function Settings() {
  const { settings, updateSettings } = useStore();
  const { message } = AntApp.useApp();

  const resetAll = () => {
    DATA_KEYS.forEach((k) => localStorage.removeItem(`pokeshop-${k}`));
    window.location.reload();
  };

  return (
    <>
      <AdminPageHeader title="Settings" subtitle="Shipping and local data." />
      <Form<StoreSettings> layout="vertical" size="large" className="admin-card settings" initialValues={settings}
        onFinish={(v) => { updateSettings(v); message.success('Settings saved'); }}>
        <div className="form-row">
          <Form.Item name="shippingFee" label="Shipping fee (₱)" rules={[{ required: true, type: 'number', min: 0 }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="freeShippingOver" label="Free shipping over (₱, 0 = off)" rules={[{ required: true, type: 'number', min: 0 }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
        </div>
        <button type="submit" className="btn btn--red">SAVE SETTINGS</button>
      </Form>
      <section className="admin-card danger-zone">
        <h2>Reset local data</h2>
        <p>Deletes products, orders, customers, messages and carts stored in this browser. Theme preference is kept.</p>
        <Popconfirm title="Erase all store data?" description="This cannot be undone." okText="Erase" okButtonProps={{ danger: true }} onConfirm={resetAll}>
          <button type="button" className="btn btn--red">RESET STORE DATA</button>
        </Popconfirm>
      </section>
    </>
  );
}
