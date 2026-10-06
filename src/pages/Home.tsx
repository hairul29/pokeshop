import { Link } from 'react-router-dom';
import { CustomerServiceOutlined, GiftOutlined, HeartOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import EmptyShop from '../components/EmptyShop';
import PokeBall from '../components/PokeBall';
import ProductGrid from '../components/ProductGrid';
import TypeCard from '../components/TypeCard';
import { useStore } from '../context/StoreContext';
import { POKEMON_TYPES } from '../types/Product';

const PERKS = [
  { icon: <HeartOutlined />, title: 'Made for fans', text: 'Toys, plushies and collectibles picked for collectors.' },
  { icon: <SafetyCertificateOutlined />, title: 'Easy checkout', text: 'Review your order and ship it to your door.' },
  { icon: <GiftOutlined />, title: 'Gift-ready', text: 'Find something for every trainer on your list.' },
  { icon: <CustomerServiceOutlined />, title: 'Friendly help', text: 'Questions? Our contact page is one click away.' },
];

export default function Home() {
  const { activeProducts } = useStore();
  const featured = activeProducts.filter((p) => p.featured).slice(0, 8);

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">GOTTA SHOP <br />'EM ALL!</h1>
            <p className="hero__text">Discover toys, figures, collectibles, plushies, and more for every Pokémon fan.</p>
            <div className="hero__actions">
              <Link to="/shop" className="btn btn--red btn--lg">SHOP NOW</Link>
              <Link to="/deals" className="btn btn--primary btn--lg">VIEW DEALS</Link>
            </div>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <div className="hero__disc" />
            <PokeBall size={300} className="hero__ball" />
            <PokeBall size={64} className="hero__mini hero__mini--a" />
            <PokeBall size={40} className="hero__mini hero__mini--b" />
            <div className="hero__chip hero__chip--a">⚡ ELECTRIC</div>
            <div className="hero__chip hero__chip--b">🔥 FIRE</div>
            <div className="hero__chip hero__chip--c">💧 WATER</div>
            <div className="hero__chip hero__chip--d">🍃 GRASS</div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2 className="section__title">Choose your type</h2>
          <Link to="/categories" className="link-more">All categories</Link>
        </div>
        <div className="tgrid">
          {POKEMON_TYPES.map((t) => <TypeCard key={t} type={t} />)}
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2 className="section__title">Featured collection</h2>
          <Link to="/shop" className="link-more">Shop everything</Link>
        </div>
        {featured.length > 0 ? <ProductGrid products={featured} /> : <EmptyShop />}
      </section>

      <section className="container perks">
        {PERKS.map((p) => (
          <div key={p.title} className="perk">
            <span className="perk__icon">{p.icon}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </div>
        ))}
      </section>
    </>
  );
}
