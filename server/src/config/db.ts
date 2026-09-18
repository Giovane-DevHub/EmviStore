import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Cache global de conexão para Serverless (evita estourar o limite de conexões do MongoDB Atlas)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('[MongoDB] Erro: MONGODB_URI não foi configurada nas variáveis de ambiente.');
    throw new Error('MONGODB_URI ausente nas variáveis de ambiente.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => {
      console.log('[MongoDB Atlas] Conectado ao cluster oficial com sucesso.');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('[MongoDB Atlas] Falha ao conectar ao banco:', e);
    throw e;
  }

  return cached.conn;
}

export function isUsingMemoryDB() {
  return false;
}
