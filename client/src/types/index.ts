export interface IColor {
  name: string;
  hex: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  sizes: string[];
  colors: IColor[];
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  salesCount: number;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  itemCount: number;
  isActive?: boolean;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
  selectedSize: string;
  selectedColor: IColor;
}

export interface IOrderCustomer {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
}

export interface IShippingAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: IOrderCustomer;
  shippingAddress: IShippingAddress;
  items: {
    productId: string;
    name: string;
    price: number;
    costPrice?: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
  paymentDetails?: {
    lastFourDigits?: string;
    installments?: number;
  };
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface ICustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate?: string;
  address?: IShippingAddress;
}

export interface IStoreSettings {
  storeName: string;
  storeSlogan: string;
  logoUrl: string;
  phone: string;
  email: string;
  instagram: string;
  address: string;
  businessHours: string;
  freeShippingThreshold: number;
  defaultShippingRate: number;
  paymentProvider: string;
  paymentPublicKey?: string;
  paymentSecretKey?: string;
  paymentSandbox?: boolean;
  primaryColor?: string;
  monthlySalesTarget?: number;
  semesterSalesTarget?: number;
}

export interface ICustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  address?: IShippingAddress;
}

export interface IUser {
  id: string;
  username: string;
  name: string;
  role: string;
  isProtected: boolean;
}
