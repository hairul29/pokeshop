import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge, Drawer, Dropdown, Input } from 'antd';
import type { MenuProps } from 'antd';
import {
  CloseOutlined, DashboardOutlined, LogoutOutlined, MenuOutlined, MoonOutlined,
  SearchOutlined, ShoppingCartOutlined, SunOutlined, UserOutlined,
} from '@ant-design/icons';
import { TYPE_META, typeSlug, typeStyle } from '../data/types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { POKEMON_TYPES } from '../types/Product';
import Logo from './Logo';
import NotificationBell from './NotificationBell';

interface NavLinkItem {
  to: string;
  label: string;
  mega?: boolean;
}

const NAV_LINKS: NavLinkItem[] = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Categories', mega: true },
  { to: '/deals', label: 'Deals' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/account', label: 'My Account' },
];

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const { cartCount, bumpKey, setDrawerOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`) || (to === '/categories' && pathname.startsWith('/category/'));

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(term.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const accountItems: MenuProps['items'] = [
    { key: 'account', icon: <UserOutlined />, label: <Link to="/account">My Account</Link> },
    ...(isAdmin ? [{ key: 'admin', icon: <DashboardOutlined />, label: <Link to="/admin">Admin Dashboard</Link> }] : []),
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, danger: true, label: 'Logout', onClick: handleLogout },
  ];

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link to="/" className="nav__logo" aria-label="POKESHOP home"><Logo height={42} /></Link>

        <ul className="nav__links">
          {NAV_LINKS.map((link) => (
            <li key={link.to} className="nav__item">
              <Link to={link.to} className={`nav__link ${isActive(link.to) ? 'is-active' : ''}`}>{link.label}</Link>
              {link.mega && (
                <div className="mega">
                  <div className="mega__grid">
                    {POKEMON_TYPES.map((t) => (
                      <Link key={t} to={`/category/${typeSlug(t)}`} className="mega__link" style={typeStyle(t)}>
                        <span aria-hidden="true">{TYPE_META[t].emoji}</span>{t}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="nav__actions">
          <button type="button" className="icon-btn" onClick={() => setSearchOpen((o) => !o)} aria-label="Search">
            {searchOpen ? <CloseOutlined /> : <SearchOutlined />}
          </button>
          {user && <NotificationBell audience={user.id} />}
          <button type="button" className="icon-btn theme-toggle" onClick={toggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to night mode'}>
            <span className={`theme-toggle__icon ${isDarkMode ? 'is-dark' : ''}`}>
              <SunOutlined className="sun" />
              <MoonOutlined className="moon" />
            </span>
          </button>
          <Dropdown menu={{ items: accountItems }} trigger={['click']} placement="bottomRight">
            <button type="button" className="nav__account" aria-label="Account menu">
              <UserOutlined /> <span>{user?.name.split(' ')[0]}</span>
            </button>
          </Dropdown>
          <button type="button" className="icon-btn cart-btn" onClick={() => setDrawerOpen(true)} aria-label={`Open cart, ${cartCount} items`}>
            <Badge count={cartCount} color="#EE1515" size="small" offset={[4, -4]}>
              <span key={bumpKey} className={bumpKey > 0 ? 'cart-icon bump' : 'cart-icon'}><ShoppingCartOutlined /></span>
            </Badge>
          </button>
          <button type="button" className="icon-btn nav__burger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <MenuOutlined />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="nav__search">
          <form className="container" onSubmit={submitSearch}>
            <Input size="large" autoFocus allowClear prefix={<SearchOutlined />} value={term}
              onChange={(e) => setTerm(e.target.value)} placeholder="Search toys, figures, plushies…" />
          </form>
        </div>
      )}

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} placement="right" width={300}
        className="nav-drawer" title={<Logo height={32} />} closeIcon={<CloseOutlined />}>
        <nav className="drawer-links">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={isActive(link.to) ? 'is-active' : ''}>{link.label}</Link>
          ))}
          {isAdmin && <Link to="/admin">Admin Dashboard</Link>}
          <button type="button" className="btn btn--ghost btn--block" onClick={handleLogout}>LOGOUT</button>
        </nav>
      </Drawer>
    </header>
  );
}