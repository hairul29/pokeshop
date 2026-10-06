import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PokeBall from './PokeBall';

interface Props {
  title?: string;
  text?: string;
  /** Replaces the default buttons. */
  actions?: ReactNode;
}

/** Friendly empty state used by the shop, categories, deals, cart and tables. */
export default function EmptyShop({
  title = 'YOUR COLLECTION STARTS HERE',
  text = 'Products will appear here once they are added to the shop.',
  actions,
}: Props) {
  const { isAdmin } = useAuth();
  return (
    <section className="empty">
      <div className="empty__art" aria-hidden="true">
        <PokeBall size={96} className="empty__ball" />
        <span className="empty__shadow" />
      </div>
      <h2 className="empty__title">{title}</h2>
      <p className="empty__text">{text}</p>
      <div className="empty__actions">
        {actions ?? (
          <>
            <Link to="/categories" className="btn btn--red">EXPLORE CATEGORIES</Link>
            {isAdmin && <Link to="/admin/products/add" className="btn btn--primary">+ ADD PRODUCT</Link>}
          </>
        )}
      </div>
    </section>
  );
}
