export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  Pending: 'gold',
  Processing: 'blue',
  Shipped: 'purple',
  Completed: 'green',
  Cancelled: 'red',
};

export interface OrderItem {
  productId: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  address: string;
  barangay: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  shipping: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
}
