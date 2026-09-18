import { Router, Request, Response } from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Customer } from '../models/Customer.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Criar pedido (Checkout da loja)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer, shippingAddress, items, subtotal, shippingFee, discount, total, paymentMethod, paymentDetails } =
      req.body;

    if (!customer || !shippingAddress || !items || !items.length || !paymentMethod) {
      res.status(400).json({ message: 'Dados incompletos para processar o pedido.' });
      return;
    }

    // Gerar número de pedido único amigável (ex: #1094)
    const count = await Order.countDocuments();
    const orderNumber = `#${1001 + count}`;

    // Atualizar estoque e contagem de vendas dos produtos
    for (const item of items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity, salesCount: item.quantity },
        });
      }
    }

    // Atualizar ou cadastrar cliente
    if (customer.email) {
      await Customer.findOneAndUpdate(
        { email: customer.email.toLowerCase().trim() },
        {
          $set: {
            name: customer.name,
            phone: customer.phone,
            cpf: customer.cpf || '',
            address: shippingAddress,
            lastOrderDate: new Date(),
          },
          $inc: {
            totalSpent: total,
            ordersCount: 1,
          },
        },
        { upsert: true, new: true }
      );
    }

    const order = await Order.create({
      orderNumber,
      customer,
      shippingAddress,
      items,
      subtotal,
      shippingFee,
      discount: discount || 0,
      total,
      paymentMethod,
      paymentDetails,
      status: 'pending',
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Erro ao processar pedido.' });
  }
});

// Listar pedidos (Admin)
router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;
    const filter: any = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { orderNumber: new RegExp(String(search), 'i') },
        { 'customer.name': new RegExp(String(search), 'i') },
        { 'customer.email': new RegExp(String(search), 'i') },
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar pedidos.' });
  }
});

// Obter pedido por ID ou número
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Pedido não encontrado.' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedido.' });
  }
});

// Atualizar status do pedido (Admin)
router.patch('/:id/status', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'preparing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      res.status(400).json({ message: 'Status de pedido inválido.' });
      return;
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      res.status(404).json({ message: 'Pedido não encontrado.' });
      return;
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status do pedido.' });
  }
});

export default router;
