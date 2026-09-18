import { Router, Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Listar produtos com filtros
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, size, minPrice, maxPrice, sort, featured } = req.query;
    const filter: any = { isActive: true };

    if (category && category !== 'Todos') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(String(search), 'i') },
        { description: new RegExp(String(search), 'i') },
        { sku: new RegExp(String(search), 'i') },
      ];
    }

    if (size) {
      filter.sizes = { $in: [String(size)] };
    }

    if (minPrice || maxPrice) {
      filter.salePrice = {};
      if (minPrice) filter.salePrice.$gte = Number(minPrice);
      if (maxPrice) filter.salePrice.$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    let query = Product.find(filter);

    if (sort === 'price_asc') query = query.sort({ salePrice: 1 });
    else if (sort === 'price_desc') query = query.sort({ salePrice: -1 });
    else if (sort === 'best_sellers') query = query.sort({ salesCount: -1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query.exec();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos.' });
  }
});

// Listar todos os produtos para o painel administrativo (inclusive inativos)
router.get('/admin/all', authMiddleware, async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar produtos para administração.' });
  }
});

// Detalhes do produto
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Produto não encontrado.' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar detalhes do produto.' });
  }
});

// Cadastrar novo produto (Admin)
router.post('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      sku,
      category,
      costPrice,
      salePrice,
      stock,
      sizes,
      colors,
      images,
      isFeatured,
      isActive,
    } = req.body;

    if (!name || !sku || !category || salePrice === undefined) {
      res.status(400).json({ message: 'Nome, SKU, categoria e preço de venda são obrigatórios.' });
      return;
    }

    const existingSku = await Product.findOne({ sku: String(sku).toUpperCase().trim() });
    if (existingSku) {
      res.status(400).json({ message: 'Já existe um produto cadastrado com este SKU.' });
      return;
    }

    const newProduct = await Product.create({
      name,
      description,
      sku: String(sku).toUpperCase().trim(),
      category,
      costPrice: Number(costPrice) || 0,
      salePrice: Number(salePrice),
      stock: Number(stock) || 0,
      sizes: sizes || ['P', 'M', 'G'],
      colors: colors || [{ name: 'Padrão', hex: '#000000' }],
      images: images || [],
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Erro ao cadastrar produto.' });
  }
});

// Atualizar produto (Admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Produto não encontrado.' });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Erro ao atualizar produto.' });
  }
});

// Excluir produto (Admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Produto não encontrado.' });
      return;
    }
    res.json({ message: 'Produto removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover produto.' });
  }
});

export default router;
