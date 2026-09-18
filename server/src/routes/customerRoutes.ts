import { Router, Request, Response } from 'express';
import { Customer } from '../models/Customer.js';
import { Order } from '../models/Order.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Listar clientes (Admin)
router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: new RegExp(String(search), 'i') },
        { email: new RegExp(String(search), 'i') },
        { phone: new RegExp(String(search), 'i') },
      ];
    }

    const customers = await Customer.find(filter).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar clientes.' });
  }
});

// Detalhes do cliente com histórico de compras
router.get('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      res.status(404).json({ message: 'Cliente não encontrado.' });
      return;
    }

    const orders = await Order.find({ 'customer.email': customer.email }).sort({ createdAt: -1 });

    res.json({
      customer,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar dados do cliente.' });
  }
});

export default router;
