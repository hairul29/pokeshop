import { useNavigate, useParams } from 'react-router-dom';
import { App as AntApp, Form, Input, InputNumber, Rate, Select, Switch } from 'antd';
import AdminPageHeader from '../../components/AdminPageHeader';
import EmptyShop from '../../components/EmptyShop';
import ImageUploader from '../../components/ImageUploader';
import { TYPE_META } from '../../data/types';
import { useStore } from '../../context/StoreContext';
import { POKEMON_TYPES, type PokemonType, type Product } from '../../types/Product';

interface FormValues {
  name: string;
  description: string;
  mainImage: string[];
  extraImages: string[];
  price: number;
  salePrice?: number;
  stock: number;
  sku: string;
  type: PokemonType;
  secondaryType?: PokemonType;
  status: Product['status'];
  featured: boolean;
  onSale: boolean;
  rating?: number;
}

/** Used for both "Add product" and "Edit product" (when the URL has an :id). */
export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const { products, addProduct, updateProduct } = useStore();
  const [form] = Form.useForm<FormValues>();
  const onSale = Form.useWatch('onSale', form);
  const editing = id ? products.find((p) => p.id === id) : undefined;

  if (id && !editing) return <EmptyShop title="PRODUCT NOT FOUND" text="It may have been deleted." actions={<button type="button" className="btn btn--red" onClick={() => navigate('/admin/products')}>BACK TO PRODUCTS</button>} />;

  const initial: Partial<FormValues> = editing
    ? { ...editing, mainImage: editing.images.slice(0, 1), extraImages: editing.images.slice(1) }
    : { mainImage: [], extraImages: [], status: 'active', featured: false, onSale: false, stock: 0 };

  const onFinish = (v: FormValues) => {
    const data = {
      name: v.name.trim(),
      description: v.description.trim(),
      price: v.price,
      salePrice: v.onSale ? v.salePrice : undefined,
      images: [...v.mainImage, ...v.extraImages],
      type: v.type,
      secondaryType: v.secondaryType && v.secondaryType !== v.type ? v.secondaryType : undefined,
      stock: v.stock,
      sku: v.sku.trim(),
      status: v.status,
      featured: v.featured,
      onSale: v.onSale,
      rating: v.rating || undefined,
    };
    if (editing) updateProduct(editing.id, data);
    else addProduct(data);
    message.success(editing ? 'Product updated' : 'Product added. It is now live in the shop.');
    navigate('/admin/products');
  };

  return (
    <>
      <AdminPageHeader title={editing ? 'Edit product' : 'Add product'} subtitle="New products appear in the shop, their type category and deals (if on sale) right away." />
      <Form<FormValues> key={editing?.id ?? 'new'} form={form} layout="vertical" size="large" requiredMark="optional" initialValues={initial} onFinish={onFinish} className="admin-card product-form">
        <div className="form-row">
          <Form.Item name="name" label="Product name" rules={[{ required: true, message: 'Enter a product name' }]}><Input /></Form.Item>
          <Form.Item name="sku" label="SKU" rules={[
            { required: true, message: 'Enter a SKU' },
            { validator: (_, value: string) => products.some((p) => p.id !== editing?.id && p.sku.toLowerCase() === value?.trim().toLowerCase())
                ? Promise.reject(new Error('This SKU is already used')) : Promise.resolve() },
          ]}><Input /></Form.Item>
        </div>
        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Enter a description' }]}><Input.TextArea rows={4} /></Form.Item>
        <div className="form-row">
          <Form.Item name="mainImage" label="Product image" valuePropName="value"
            rules={[{ validator: (_, v: string[]) => (v?.length ? Promise.resolve() : Promise.reject(new Error('Upload a main product image'))) }]}>
            <ImageUploader max={1} />
          </Form.Item>
          <Form.Item name="extraImages" label="Additional images (up to 4)"><ImageUploader max={4} /></Form.Item>
        </div>
        <div className="form-row form-row--3">
          <Form.Item name="price" label="Price (₱)" rules={[{ required: true, type: 'number', min: 0.01, message: 'Enter a price above 0' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true, type: 'number', min: 0, message: 'Enter the stock' }]}>
            <InputNumber min={0} precision={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="type" label="Primary type" rules={[{ required: true, message: 'Choose a type' }]}>
            <Select placeholder="Choose a type" options={POKEMON_TYPES.map((t) => ({ value: t, label: `${TYPE_META[t].emoji} ${t}` }))} />
          </Form.Item>
        </div>
        <div className="form-row form-row--3">
          <Form.Item name="secondaryType" label="Second type (optional)" dependencies={['type']} rules={[
            ({ getFieldValue }) => ({
              validator: (_, value: PokemonType | undefined) =>
                value && value === getFieldValue('type') ? Promise.reject(new Error('Pick a different type than the primary one')) : Promise.resolve(),
            }),
          ]}>
            <Select allowClear placeholder="None" options={POKEMON_TYPES.map((t) => ({ value: t, label: `${TYPE_META[t].emoji} ${t}` }))} />
          </Form.Item>
          <div />
          <div />
        </div>
        <div className="form-row form-row--3">
          <Form.Item name="status" label="Status">
            <Select options={[{ value: 'active', label: 'Active (visible)' }, { value: 'inactive', label: 'Inactive (hidden)' }]} />
          </Form.Item>
          <Form.Item name="rating" label="Rating (optional)"><Rate allowHalf /></Form.Item>
          <Form.Item label="Options">
            <div className="switches">
              <Form.Item name="featured" valuePropName="checked" noStyle><Switch /></Form.Item><span>Featured</span>
              <Form.Item name="onSale" valuePropName="checked" noStyle><Switch /></Form.Item><span>On sale</span>
            </div>
          </Form.Item>
        </div>
        {onSale && (
          <Form.Item name="salePrice" label="Sale price (₱)" dependencies={['price']} rules={[
            { required: true, message: 'Enter the sale price' },
            ({ getFieldValue }) => ({
              validator: (_, value: number | undefined) =>
                value !== undefined && value > 0 && value < Number(getFieldValue('price')) ? Promise.resolve() : Promise.reject(new Error('Must be above 0 and lower than the price')),
            }),
          ]}>
            <InputNumber min={0} style={{ width: 240 }} />
          </Form.Item>
        )}
        <div className="form-actions">
          <button type="submit" className="btn btn--red">{editing ? 'SAVE CHANGES' : 'ADD PRODUCT'}</button>
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/admin/products')}>CANCEL</button>
        </div>
      </Form>
    </>
  );
}
