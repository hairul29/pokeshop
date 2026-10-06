import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Checkbox, Form, Input } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import Logo from '../components/Logo';
import PokeBall from '../components/PokeBall';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types/User';

interface LoginValues {
  email: string;
  password: string;
  remember?: boolean;
}

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [role, setRole] = useState<Role>('shopper');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const switchRole = (next: Role) => {
    setRole(next);
    setCreating(false);
    setError('');
  };

  const onLogin = (v: LoginValues) => {
    const result = login(v.email, v.password, role, v.remember ?? false);
    if (!result.ok) return setError(result.error);
    if (role === 'admin') navigate('/admin', { replace: true });
    else navigate(from && !from.startsWith('/admin') && from !== '/' ? from : '/shop', { replace: true });
  };

  const onRegister = (v: RegisterValues) => {
    const result = register(v.name, v.email, v.password);
    if (!result.ok) return setError(result.error);
    navigate('/shop', { replace: true });
  };

  return (
    <div className="auth">
      <div className="auth__art" aria-hidden="true">
        <PokeBall size={420} className="auth__ball auth__ball--big" />
        <PokeBall size={90} className="auth__ball auth__ball--a" />
        <PokeBall size={56} className="auth__ball auth__ball--b" />
        <PokeBall size={120} className="auth__ball auth__ball--c" />
        <div className="auth__tagline">
          <h2>GOTTA SHOP 'EM ALL!</h2>
          <p>Toys, figures, plushies and collectibles for every fan.</p>
        </div>
      </div>

      <div className="auth__panel">
        <div className="auth__card">
          <Logo height={46} />
          <h1 className="auth__title">{creating ? 'JOIN THE ADVENTURE' : 'WELCOME, TRAINER!'}</h1>
          <p className="auth__sub">
            {creating ? 'Create a shopper account to start collecting.' : 'Log in to begin your POKESHOP adventure.'}
          </p>

          <div className="segmented" role="tablist" aria-label="Account type">
            {(['shopper', 'admin'] as const).map((r) => (
              <button key={r} type="button" role="tab" aria-selected={role === r}
                className={role === r ? 'is-on' : ''} onClick={() => switchRole(r)}>
                {r === 'shopper' ? 'SHOPPER' : 'ADMIN'}
              </button>
            ))}
          </div>

          {error && <Alert type="error" showIcon message={error} className="auth__alert" closable onClose={() => setError('')} />}

          {creating ? (
            <Form<RegisterValues> layout="vertical" onFinish={onRegister} requiredMark={false} size="large">
              <Form.Item name="name" label="Full name" rules={[{ required: true, message: 'Enter your name' }]}>
                <Input prefix={<UserOutlined />} autoComplete="name" />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
                <Input prefix={<MailOutlined />} autoComplete="email" />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: true, min: 6, message: 'At least 6 characters' }]}>
                <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
              </Form.Item>
              <Form.Item name="confirm" label="Confirm password" dependencies={['password']}
                rules={[
                  { required: true, message: 'Confirm your password' },
                  ({ getFieldValue }) => ({
                    validator: (_, value: string) =>
                      !value || getFieldValue('password') === value ? Promise.resolve() : Promise.reject(new Error('Passwords do not match')),
                  }),
                ]}>
                <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
              </Form.Item>
              <button type="submit" className="btn btn--red btn--block">CREATE ACCOUNT</button>
            </Form>
          ) : (
            <Form<LoginValues> layout="vertical" onFinish={onLogin} requiredMark={false} size="large" initialValues={{ remember: true }}>
              <Form.Item name="email" label={role === 'admin' ? 'Admin email' : 'Email'}
                rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
                <Input prefix={<MailOutlined />} autoComplete="email" />
              </Form.Item>
              <Form.Item name="password" label={role === 'admin' ? 'Admin password' : 'Password'}
                rules={[{ required: true, message: 'Enter your password' }]}>
                <Input.Password prefix={<LockOutlined />} autoComplete="current-password" />
              </Form.Item>
              <Form.Item name="remember" valuePropName="checked"><Checkbox>Remember me</Checkbox></Form.Item>
              <button type="submit" className="btn btn--red btn--block">{role === 'admin' ? 'ADMIN LOGIN' : 'LOGIN'}</button>
            </Form>
          )}

          {role === 'shopper' && (
            <p className="auth__switch">
              {creating ? 'Already a trainer?' : 'New here?'}{' '}
              <button type="button" onClick={() => { setCreating(!creating); setError(''); }}>
                {creating ? 'Log in' : 'Create account'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}