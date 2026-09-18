import { Router, Request, Response } from 'express';
import { Category } from '../models/Category.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Listar categorias (por padrão somente ativas para a loja, ou todas com ?all=true para o admin)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: any = {};
    if (req.query.all !== 'true') {
      filter.isActive = { $ne: false };
    }
    const categories = await Category.find(filter).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar categorias.' });
  }
});

// Criar categoria (Admin)
router.post('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, image, isActive } = req.body;
    if (!name) {
      res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
      return;
    }

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

    const newCat = await Category.create({
      name,
      slug,
      image,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });
    res.status(201).json(newCat);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Erro ao criar categoria.' });
  }
});

// Alternar status ativo/inativo da categoria (Admin)
router.patch('/:id/status', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { isActive } = req.body;
    const cat = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: Boolean(isActive) },
      { new: true }
    );
    if (!cat) {
      res.status(404).json({ message: 'Categoria não encontrada.' });
      return;
    }
    res.json(cat);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status da categoria.' });
  }
});

// Remover categoria (Admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Categoria excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover categoria.' });
  }
});

export default router;
