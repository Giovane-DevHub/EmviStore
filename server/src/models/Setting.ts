import mongoose, { Document, Schema } from 'mongoose';

export interface ISetting extends Document {
  storeName: string;
  storeSlogan: string;
  logoUrl: string;
  phone: string;
  email: string;
  instagram: string;
  address: string;
  businessHours: string;
  
  // Frete
  freeShippingThreshold: number;
  defaultShippingRate: number;
  shippingApiToken?: string;
  shippingProvider?: string;

  // Pagamento
  paymentProvider: 'mercadopago' | 'asaas' | 'stripe' | 'simulated';
  paymentPublicKey?: string;
  paymentSecretKey?: string;
  paymentSandbox: boolean;

  // Metas do negócio
  monthlySalesTarget: number;
  semesterSalesTarget: number;
}

const SettingSchema = new Schema<ISetting>(
  {
    storeName: { type: String, default: 'Emvi Store' },
    storeSlogan: { type: String, default: 'Sinta a leveza da sofisticação feminina' },
    logoUrl: { type: String, default: '' },
    phone: { type: String, default: '51 9399-7784' },
    email: { type: String, default: 'contato@emvistore.com.br' },
    instagram: { type: String, default: 'https://www.instagram.com/emvistore_?stkn=YjR6ZmJma2JsenV2' },
    address: { type: String, default: 'Av. Paulista, 1000 - SP' },
    businessHours: { type: String, default: 'Seg a Sex: 09h às 19h | Sáb: 09h às 14h' },

    freeShippingThreshold: { type: Number, default: 299.0 },
    defaultShippingRate: { type: Number, default: 24.9 },
    shippingApiToken: { type: String, default: '' },
    shippingProvider: { type: String, default: 'correios' },

    paymentProvider: { type: String, default: 'mercadopago' },
    paymentPublicKey: { type: String, default: '' },
    paymentSecretKey: { type: String, default: '' },
    paymentSandbox: { type: Boolean, default: true },

    monthlySalesTarget: { type: Number, default: 15000 },
    semesterSalesTarget: { type: Number, default: 80000 },
  },
  { timestamps: true }
);

export const Setting = mongoose.model<ISetting>('Setting', SettingSchema);

export async function getOrCreateSettings(): Promise<ISetting> {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({
      storeName: 'Emvi Store',
      storeSlogan: 'Sinta a leveza da sofisticação feminina',
      phone: '51 9399-7784',
      email: 'contato@emvistore.com.br',
      instagram: 'https://www.instagram.com/emvistore_?stkn=YjR6ZmJma2JsenV2',
      address: 'Av. Paulista, 1000 - SP',
      businessHours: 'Seg a Sex: 09h às 19h | Sáb: 09h às 14h',
      freeShippingThreshold: 299.0,
      defaultShippingRate: 24.9,
      semesterSalesTarget: 80000,
    });
    console.log('[Seed] Configurações padrão da loja inicializadas.');
  }
  return settings;
}
