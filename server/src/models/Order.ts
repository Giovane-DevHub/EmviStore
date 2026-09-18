import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  costPrice: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf?: string;
  };
  shippingAddress: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
  paymentDetails?: {
    lastFourDigits?: string;
    installments?: number;
    transactionId?: string;
  };
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      cpf: { type: String, default: '' },
    },
    shippingAddress: {
      cep: { type: String, required: true },
      street: { type: String, required: true },
      number: { type: String, required: true },
      complement: { type: String, default: '' },
      neighborhood: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        costPrice: { type: Number, default: 0 },
        quantity: { type: Number, required: true },
        size: { type: String, required: true },
        color: { type: String, required: true },
        image: { type: String, default: '' },
      },
    ],
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'pix', 'boleto'],
      required: true,
    },
    paymentDetails: {
      lastFourDigits: { type: String },
      installments: { type: Number, default: 1 },
      transactionId: { type: String },
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
