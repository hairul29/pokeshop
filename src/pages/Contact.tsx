import { App as AntApp, Form, Input } from 'antd';
import { useStore } from '../context/StoreContext';
import type { NewMessage } from '../context/StoreContext';

export default function Contact() {
  const { message } = AntApp.useApp();
  const { addMessage } = useStore();
  const [form] = Form.useForm<NewMessage>();

  const onFinish = (values: NewMessage) => {
    addMessage({ ...values, name: values.name.trim(), email: values.email.trim(), subject: values.subject.trim(), message: values.message.trim() });
    message.success('Message sent! We will get back to you soon.');
    form.resetFields();
  };

  return (
    <div className="container section">
      <header className="page-head"><h1 className="page-head__title">CONTACT US</h1>
        <p>Questions, ideas or a missing Pokémon type? Send us a message.</p></header>
      <div className="panel contact">
        <Form<NewMessage> form={form} layout="vertical" size="large" requiredMark={false} onFinish={onFinish}>
          <div className="form-row">
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Enter your name' }]}><Input autoComplete="name" /></Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}><Input autoComplete="email" /></Form.Item>
          </div>
          <Form.Item name="subject" label="Subject" rules={[{ required: true, message: 'Enter a subject' }]}><Input /></Form.Item>
          <Form.Item name="message" label="Message" rules={[{ required: true, message: 'Write your message' }]}><Input.TextArea rows={6} /></Form.Item>
          <button type="submit" className="btn btn--red">SEND MESSAGE</button>
        </Form>
      </div>
    </div>
  );
}
