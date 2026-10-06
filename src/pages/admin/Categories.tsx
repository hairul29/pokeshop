import { Link } from 'react-router-dom';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import AdminPageHeader from '../../components/AdminPageHeader';
import TypeChip from '../../components/TypeChip';
import { useStore } from '../../context/StoreContext';
import { POKEMON_TYPES, type PokemonType } from '../../types/Product';
import { productTypes } from '../../utils/product';

export default function Categories() {
  const { products } = useStore();
  const rows = POKEMON_TYPES.map((type) => {
    const items = products.filter((p) => productTypes(p).includes(type));
    return { type, total: items.length, active: items.filter((p) => p.status === 'active').length };
  });
  const columns: TableColumnsType<(typeof rows)[number]> = [
    { title: 'Type', dataIndex: 'type', render: (t: PokemonType) => <TypeChip type={t} /> },
    { title: 'Products', dataIndex: 'total' },
    { title: 'Visible in shop', dataIndex: 'active' },
    { title: 'Storefront', key: 'link', render: (_, r) => <Link to={`/category/${r.type.toLowerCase()}`}>View page</Link> },
  ];
  return (
    <>
      <AdminPageHeader title="Categories" subtitle="The 18 Pokémon types are the shop categories. Pick a type when you add a product." />
      <section className="admin-card">
        <Table rowKey="type" columns={columns} dataSource={rows} pagination={false} scroll={{ x: 500 }} />
      </section>
    </>
  );
}
