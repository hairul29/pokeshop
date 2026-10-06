import { Link } from 'react-router-dom';
import PokeBall from '../components/PokeBall';

const BLOCKS = [
  { title: 'Our story', text: 'POKESHOP began with a simple idea: fans deserve one friendly place to find the toys, figures and plushies they love. We are collectors and gamers ourselves, and we built the shop we always wanted to browse.' },
  { title: 'Our mission', text: 'To make collecting fun, easy and welcoming. From a first plushie to a shelf-worthy figure, we want every trainer to find something that makes them smile.' },
  { title: 'Why POKESHOP', text: 'Shop by Pokémon type, spot real deals quickly, and check out in a few taps. Every product is added by hand, so the catalog grows with care.' },
  { title: 'A collector-focused experience', text: 'Clear photos, honest stock levels and saved favorites help collectors plan their next addition without guesswork.' },
];

export default function About() {
  return (
    <div className="container section">
      <header className="page-head"><h1 className="page-head__title">ABOUT POKESHOP</h1>
        <p>A fun online destination for Pokémon-inspired toys, collectibles, figures, plushies, and merchandise.</p></header>
      <div className="about">
        {BLOCKS.map((b) => (
          <article key={b.title} className="about__card">
            <h2>{b.title}</h2>
            <p>{b.text}</p>
          </article>
        ))}
        <aside className="about__side">
          <PokeBall size={120} className="about__ball" />
          <p>POKESHOP is an independent fan-inspired store. It is not affiliated with, endorsed by, or sponsored by Pokémon, Nintendo, or The Pokémon Company.</p>
          <Link to="/contact" className="btn btn--red">CONTACT US</Link>
        </aside>
      </div>
    </div>
  );
}
