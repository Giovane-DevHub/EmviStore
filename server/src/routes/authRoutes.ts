import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Customer } from '../models/Customer.js';
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

// ==========================================
// AUTENTICAÇÃO DO CLIENTE (100% Autônomo)
// ==========================================

// Cadastro direto e instantâneo do cliente (sem aprovação necessária)
router.post('/customer/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, cpf, address } = req.body;

    if (!name || !email || !password || !phone) {
      res.status(400).json({ message: 'Preencha os campos obrigatórios (nome, e-mail, telefone e senha).' });
      return;
    }

    const cleanEmail = String(email).toLowerCase().trim();
    let customer = await Customer.findOne({ email: cleanEmail });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(String(password), salt);

    if (customer) {
      if (customer.passwordHash) {
        res.status(400).json({ message: 'Já existe uma conta com este e-mail. Por favor, faça login.' });
        return;
      }
      // Cliente já existia via checkout sem senha anterior
      customer.name = name.trim();
      customer.phone = phone.trim();
      if (cpf) customer.cpf = cpf.trim();
      if (address) customer.address = address;
      customer.passwordHash = passwordHash;
      customer.status = 'active';
      await customer.save();
    } else {
      customer = await Customer.create({
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        cpf: cpf ? cpf.trim() : '',
        address: address || {},
        passwordHash,
        status: 'active',
      });
    }

    const token = generateToken({
      id: customer._id.toString(),
      username: customer.email,
      role: 'customer',
    });

    res.status(201).json({
      message: 'Cadastro realizado com sucesso! Bem-vinda(o) à Emvi Store.',
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        cpf: customer.cpf,
        address: customer.address,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Erro ao registrar cliente.' });
  }
});

// Login do cliente
router.post('/customer/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Informe seu e-mail e senha cadastrados.' });
      return;
    }

    const customer = await Customer.findOne({ email: String(email).toLowerCase().trim() });
    if (!customer || !customer.passwordHash) {
      res.status(401).json({ message: 'E-mail ou senha incorretos. Caso ainda não tenha senha, crie seu cadastro.' });
      return;
    }

    const isMatch = await customer.comparePassword(String(password));
    if (!isMatch) {
      res.status(401).json({ message: 'E-mail ou senha incorretos.' });
      return;
    }

    const token = generateToken({
      id: customer._id.toString(),
      username: customer.email,
      role: 'customer',
    });

    res.json({
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        cpf: customer.cpf,
        address: customer.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao autenticar cliente.' });
  }
});

// Obter dados do cliente logado
router.get('/customer/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById(req.user?.id).select('-passwordHash');
    if (!customer) {
      res.status(404).json({ message: 'Cliente não encontrado.' });
      return;
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao carregar dados do cliente.' });
  }
});

// Atualizar perfil do cliente
router.put('/customer/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, cpf, address, currentPassword, newPassword } = req.body;
    const customer = await Customer.findById(req.user?.id);

    if (!customer) {
      res.status(404).json({ message: 'Cliente não encontrado.' });
      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ message: 'Informe sua senha atual para alterar a senha.' });
        return;
      }
      const isMatch = await customer.comparePassword(currentPassword);
      if (!isMatch) {
        res.status(400).json({ message: 'Senha atual incorreta.' });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      customer.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    if (name) customer.name = name.trim();
    if (phone) customer.phone = phone.trim();
    if (cpf !== undefined) customer.cpf = cpf.trim();
    if (address) customer.address = address;

    await customer.save();

    res.json({
      message: 'Seus dados foram atualizados com sucesso!',
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        cpf: customer.cpf,
        address: customer.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar dados do cliente.' });
  }
});

export default router;
