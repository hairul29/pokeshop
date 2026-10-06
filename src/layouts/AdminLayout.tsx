import { useEffect, useState, type ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Badge } from 'antd';
import {
  ApartmentOutlined, AppstoreOutlined, DashboardOutlined, LogoutOutlined, MenuOutlined, MessageOutlined,
  MoonOutlined, PlusSquareOutlined, SettingOutlined, ShoppingOutlined, SunOutlined, TagsOutlined, TeamOutlined,
} from '@ant-design/icons';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';

interface AdminLink {
  to: string;
  label: string;
  icon: ReactNode;
  isActive: (path: string) => boolean;
}

const exact = (to: string) => (path: string) => path === to;
const LINKS: AdminLink[] = [
  { to: '/admin', label: 'Dashboard', icon: <DashboardOutlined />, isActive: exact('/admin') },
  { to: '/admin/products', label: 'Products', icon: <AppstoreOutlined />, isActive: (p) => p === '/admin/products' || p.startsWith('/admin/products/edit') },
  { to: '/admin/products/add', label: 'Add Product', icon: <PlusSquareOutlined />, isActive: exact('/admin/products/add') },
  { to: '/admin/orders', label: 'Orders', icon: <ShoppingOutlined />, isActive: exact('/admin/orders') },
  { to: '/admin/customers', label: 'Customers', icon: <TeamOutlined />, isActive: exact('/admin/customers') },
  { to: '/admin/deals', label: 'Deals', icon: <TagsOutlined />, isActive: exact('/admin/deals') },
  { to: '/admin/categories', label: 'Categories', icon: <ApartmentOutlined />, isActive: exact('/admin/categories') },
  { to: '/admin/messages', label: 'Messages', icon: <MessageOutlined />, isActive: exact('/admin/messages') },
  { to: '/admin/settings', label: 'Settings', icon: <SettingOutlined />, isActive: exact('/admin/settings') },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { messages } = useStore();
  const { isDarkMode, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const newMessages = messages.filter((m) => m.status === 'New').length;

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="admin">
      <aside className={`admin__side ${open ? 'is-open' : ''}`}>
        <Link to="/admin" className="admin__logo"><Logo height={36} /></Link>
        <span className="admin__tag">ADMIN</span>
        <nav className="admin__nav">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={l.isActive(pathname) ? 'is-active' : ''}>
              {l.icon}<span>{l.label}</span>
              {l.label === 'Messages' && <Badge count={newMessages} color="#EE1515" size="small" />}
            </Link>
          ))}
          <button type="button" onClick={() => { logout(); navigate('/login'); }}>
            <LogoutOutlined /><span>Logout</span>
          </button>
        </nav>
        <Link to="/shop" className="admin__back">← View store</Link>
      </aside>
      {open && <div className="admin__scrim" onClick={() => setOpen(false)} />}

      <div className="admin__main">
        <div className="admin__top">
          <button type="button" className="icon-btn admin__burger" onClick={() => setOpen(true)} aria-label="Open admin menu"><MenuOutlined /></button>
          <span className="admin__user">{user?.email}</span>
          <button type="button" className="icon-btn theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className={`theme-toggle__icon ${isDarkMode ? 'is-dark' : ''}`}>
              <SunOutlined className="sun" /><MoonOutlined className="moon" />
            </span>
          </button>
        </div>
        <div key={pathname} className="admin__content page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
