import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="shell">
      <Navbar />
      <main key={pathname} className="page">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
