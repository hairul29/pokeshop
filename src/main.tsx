import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/theme.css';
import './styles/globals.css';
import './styles/navbar.css';
import './styles/hero.css';
import './styles/products.css';
import './styles/categories.css';
import './styles/cart.css';
import './styles/pages.css';
import './styles/admin.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
