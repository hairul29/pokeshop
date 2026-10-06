# POKESHOP

Pokémon-inspired toy and collectibles store. React + TypeScript + Vite + Ant Design + custom CSS.

```bash
npm install
npm run dev
```

## First run
- The catalog, deals, orders, customers and messages all start **empty**.
- Everything except `/login` needs a signed-in user. Shoppers land on `/shop`, admins on `/admin`.
- **Demo admin:** `admin@pokeshop.com` / `admin123` (see `src/context/AuthContext.tsx`). Change it before sharing.
- Shoppers register on the login page.
- Add products at `/admin/products/add`. They show up in the shop, their type page, deals (when "On sale") and product details.

## Where things live
- `src/context` – Auth, Cart, Theme, Store (products, orders, messages, favorites, settings)
- `src/styles` – design tokens in `theme.css`; light and night values are in one place
- `src/data/types.ts` – the 18 type icons and colors
- `src/data/products.ts` – the empty `products` array

## Notes
- Data is stored in `localStorage` (keys start with `pokeshop-`). Product images are resized and saved as data URLs, so keep the catalog small until you add a backend.
- Passwords are stored in plain text in `localStorage`. This is for local development only. Replace `AuthContext` with real server auth before going live.
- Payment is a UI placeholder. Orders are saved as Pending.
- POKESHOP is an original design and is not affiliated with Pokémon, Nintendo or The Pokémon Company.
