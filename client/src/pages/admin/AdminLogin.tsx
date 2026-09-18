import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateToStore }) => {
  const { login } = useAuth();
  const { settings } = useStore();

  const [username, setUsername] = useState('1');
  const [password, setPassword] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  const fillDefaultCredentials = () => {
    setUsername('1');
    setPassword('1');
  };

  return (
    <div className="min-h-screen bg-[#F7F3F0] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xs border border-[#EAE3DE] p-8 shadow-xl space-y-6">
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#FAF5F3] text-[#8A5D65] flex items-center justify-center mx-auto border border-[#EAE3DE]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-light text-[#2A2626] tracking-wider">
            {settings.storeName} Admin
          </h1>
          <p className="text-xs text-[#7A706E]">
            Acesso restrito para funcionários e gerência
          </p>
        </div>

        {/* Dica de Acesso Rápido com Login 1 / Senha 1 */}
        <div className="bg-[#FAF5F3] border border-[#E8DFDA] p-3 rounded-xs text-xs text-[#5C5552] flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#8A5D65]">Acesso Inicial Master:</p>
            <p className="text-[11px] text-[#7A706E]">Login: <strong>1</strong> | Senha: <strong>1</strong></p>
          </div>
          <button
            type="button"
            onClick={fillDefaultCredentials}
            className="text-[11px] bg-white border border-[#D8CECA] px-2.5 py-1 rounded-xs hover:bg-[#8A5D65] hover:text-white transition-colors"
          >
            Preencher
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#5C5552] mb-1 font-medium">Usuário / Login</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Informe seu login"
                className="w-full bg-[#FAF7F5] border border-[#D8CECA] pl-9 pr-3 py-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
              />
              <User className="w-4 h-4 text-[#968986] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[#5C5552] mb-1 font-medium">Senha</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Informe sua senha"
                className="w-full bg-[#FAF7F5] border border-[#D8CECA] pl-9 pr-3 py-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
              />
              <Lock className="w-4 h-4 text-[#968986] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8A5D65] hover:bg-[#724a51] text-white py-3.5 rounded-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Acessando...' : 'Entrar no Sistema'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={onNavigateToStore}
            className="text-xs text-[#7A706E] hover:text-[#8A5D65] hover:underline"
          >
            Voltar para a Loja Online
          </button>
        </div>
      </div>
    </div>
  );
};
