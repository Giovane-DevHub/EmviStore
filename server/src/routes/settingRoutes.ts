import { Router, Request, Response } from 'express';
import { Setting, getOrCreateSettings } from '../models/Setting.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Configurações públicas (nome, logo, contato, regras de frete)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await getOrCreateSettings();
    res.json({
      storeName: settings.storeName,
      storeSlogan: settings.storeSlogan,
      logoUrl: settings.logoUrl,
      phone: settings.phone,
      email: settings.email,
      instagram: settings.instagram,
      address: settings.address,
      businessHours: settings.businessHours,
      freeShippingThreshold: settings.freeShippingThreshold,
      defaultShippingRate: settings.defaultShippingRate,
      paymentProvider: settings.paymentProvider,
      paymentPublicKey: settings.paymentPublicKey,
      paymentSandbox: settings.paymentSandbox,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar configurações da loja.' });
  }
});

// Configurações administrativas completas (com chaves de API e metas)
router.get('/admin', authMiddleware, async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao carregar configurações administrativas.' });
  }
});

// Atualizar configurações da loja
router.put('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({
      message: 'Configurações atualizadas com sucesso!',
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao salvar configurações.' });
  }
});

export default router;
