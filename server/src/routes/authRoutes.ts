import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { authMiddleware, generateToken, AuthRequest } from '../middlewares/auth.js';

const router = Router();

// Login (aceita 1 / 1 inicialmente)
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Informe o login e a senha.' });
      return;
    }

    const user = await User.findOne({ username: String(username).trim() });
    if (!user) {
      res.status(401).json({ message: 'Credenciais inválidas.' });
      return;
    }

    const isMatch = await user.comparePassword(String(password));
    if (!isMatch) {
      res.status(401).json({ message: 'Credenciais inválidas.' });
      return;
    }

    const token = generateToken({
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        isProtected: user.isProtected,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao autenticar.' });
  }
});

// Perfil atual
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter dados do usuário.' });
  }
});

// Atualizar login e senha do administrador (inclusive o master inicial '1')
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, name, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user?.id);

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    // Se forneceu nova senha, verifica senha atual
    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ message: 'A senha atual é necessária para alterar a senha.' });
        return;
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        res.status(400).json({ message: 'Senha atual incorreta.' });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    // Atualizar username se mudou
    if (username && username.trim() !== user.username) {
      const existing = await User.findOne({ username: username.trim() });
      if (existing && existing._id.toString() !== user._id.toString()) {
        res.status(400).json({ message: 'Este nome de usuário já está em uso.' });
        return;
      }
      user.username = username.trim();
    }

    if (name) {
      user.name = name.trim();
    }

    await user.save();

    res.json({
      message: 'Dados de acesso atualizados com sucesso!',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        isProtected: user.isProtected,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar dados de acesso.' });
  }
});

// Rota de exclusão de usuário (com proteção absoluta para o admin master)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    if (targetUser.isProtected) {
      res.status(403).json({ message: 'O administrador principal (master) é protegido e não pode ser excluído.' });
      return;
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuário removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir usuário.' });
  }
});

export default router;
