import { Router, Request, Response } from 'express';
import { calculateShipping } from '../services/shippingService.js';
import { getOrCreateSettings } from '../models/Setting.js';

const router = Router();

router.post('/calculate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { cep, subtotal } = req.body;

    if (!cep) {
      res.status(400).json({ message: 'Informe o CEP para cálculo.' });
      return;
    }

    const settings = await getOrCreateSettings();
    const result = await calculateShipping(cep, Number(subtotal) || 0, settings.freeShippingThreshold);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao calcular frete.' });
  }
});

export default router;
