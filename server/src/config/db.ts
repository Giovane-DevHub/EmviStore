import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isMemoryServer = false;

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/emvistore';

  try {
    // Tenta conectar ao MongoDB configurado
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[MongoDB] Conectado com sucesso em: ${mongoUri}`);
  } catch (err) {
    console.log('[MongoDB] Servidor MongoDB local/remoto não detectado. Iniciando MongoDB em memória para desenvolvimento...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();
      await mongoose.connect(memoryUri);
      isMemoryServer = true;
      console.log(`[MongoDB] Conectado ao MongoDB em Memória com sucesso (${memoryUri})`);
    } catch (memErr) {
      console.error('[MongoDB] Erro fatal ao iniciar banco de dados:', memErr);
      process.exit(1);
    }
  }
}

export function isUsingMemoryDB() {
  return isMemoryServer;
}
