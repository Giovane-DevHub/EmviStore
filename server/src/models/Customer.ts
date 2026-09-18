import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  passwordHash?: string;
  status: 'active' | 'inactive';
  address?: {
    cep?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
  totalSpent: number;
  ordersCount: number;
  lastOrderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    cpf: { type: String, default: '' },
    passwordHash: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    address: {
      cep: { type: String, default: '' },
      street: { type: String, default: '' },
      number: { type: String, default: '' },
      neighborhood: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
    },
    totalSpent: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    lastOrderDate: { type: Date },
  },
  { timestamps: true }
);

CustomerSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
