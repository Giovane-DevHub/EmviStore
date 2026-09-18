import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedInitialAdmin } from './models/User.js';
import { seedInitialData } from './config/seed.js';
import { getOrCreateSettings } from './models/Setting.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import shippingRoutes from './routes/shippingRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Rotas de API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/shipping', shippingRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', store: 'Emvi Store Backend', timestamp: new Date() });
});

async function startServer() {
  await connectDB();
  await seedInitialAdmin();
  await getOrCreateSettings();
  await seedInitialData();

  app.listen(PORT, () => {
    console.log(`[Emvi Store] Servidor rodando na porta http://localhost:${PORT}`);
  });
}

startServer();
