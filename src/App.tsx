import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { App as AntApp, ConfigProvider, theme } from 'antd';
import EmptyShop from './components/EmptyShop';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { StoreProvider } from './context/StoreContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import AdminLayout from './layouts/AdminLayout';
import MainLayout from './layouts/MainLayout';
import About from './pages/About';
import Account from './pages/Account';
import Cart from './pages/Cart';
import Categories from './pages/Categories';
import Category from './pages/Category';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Deals from './pages/Deals';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetails from './pages/ProductDetails';
import Shop from './pages/Shop';
import AdminCategories from './pages/admin/Categories';
import AdminCustomers from './pages/admin/Customers';
import AdminDashboard from './pages/admin/Dashboard';
import AdminDeals from './pages/admin/Deals';
import AdminMessages from './pages/admin/Messages';
import AdminOrders from './pages/admin/Orders';
import AdminAddProduct from './pages/admin/AddProduct';
import AdminProducts from './pages/admin/Products';
import AdminSettings from './pages/admin/Settings';

function RedirectCategory() {
  const { type } = useParams();
  return <Navigate to={`/category/${type ?? ''}`} replace />;
}

/** Visiting "/login" while signed in sends you to your home screen. */
function LoginRoute() {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/shop'} replace />;
  return <Login />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      {/* Everything below requires a signed-in user. */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="deals" element={<Deals />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/:type" element={<RedirectCategory />} />
        <Route path="category/:type" element={<Category />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="account" element={<Account />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route
          path="*"
          element={<EmptyShop title="PAGE NOT FOUND" text="That page wandered off." actions={<Link to="/shop" className="btn btn--red">BACK TO SHOP</Link>} />}
        />
      </Route>

      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/add" element={<AdminAddProduct />} />
        <Route path="products/edit/:id" element={<AdminAddProduct />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="deals" element={<AdminDeals />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

function ThemedApp() {
  const { isDarkMode } = useTheme();
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontFamily: "'Space Grotesk', sans-serif",
          borderRadius: 12,
          colorPrimary: isDarkMode ? '#5865F2' : '#3B4CCA',
          colorError: '#EE1515',
          colorText: isDarkMode ? '#F8FAFC' : '#222222',
          colorBgLayout: isDarkMode ? '#0C1433' : '#F5F7FB',
          colorBgContainer: isDarkMode ? '#172554' : '#FFFFFF',
          colorBgElevated: isDarkMode ? '#1B2C66' : '#FFFFFF',
          colorBorder: isDarkMode ? '#2F3F85' : '#D5DAEA',
        },
      }}
    >
      <AntApp>
        <AuthProvider>
          <StoreProvider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </StoreProvider>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}
