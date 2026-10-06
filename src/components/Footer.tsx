import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo height={36} />
          <p>An online destination for Pokémon-inspired toys, figures, plushies and collectibles.</p>
        </div>
        <nav className="footer__col" aria-label="Shop">
          <h4>Shop</h4>
          <Link to="/shop">All products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/deals">Deals</Link>
        </nav>
        <nav className="footer__col" aria-label="Help">
          <h4>Help</h4>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact us</Link>
          <Link to="/account">My account</Link>
        </nav>
      </div>
      <div className="container footer__legal">
        POKESHOP is an independent fan-inspired store. It is not affiliated with, endorsed by, or sponsored by Pokémon, Nintendo, or The Pokémon Company.
      </div>
    </footer>
  );
}
