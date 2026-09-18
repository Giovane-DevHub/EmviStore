import React, { useState, useEffect } from 'react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { api } from '../services/api';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const CustomerAuthModal: React.FC = () => {
  const {
    customer,
    isCustomerLoggedIn,
    isAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuthModal,
    loginCustomer,
    registerCustomer,
    logoutCustomer,
  } = useCustomerAuth();

  // Estados do formulário de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados do formulário de Cadastro
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Estados de feedback e loading
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Pedidos do cliente
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen && isCustomerLoggedIn && authModalMode === 'orders') {
      fetchOrders();
    }
  }, [isAuthModalOpen, isCustomerLoggedIn, authModalMode]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const orders = await api.getMyOrders();
      setMyOrders(orders);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCepBlur = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const res = await api.calculateShipping(cleanCep, 100);
        if (res.address) {
          setStreet(res.address.street || '');
          setNeighborhood(res.address.neighborhood || '');
          setCity(res.address.city || '');
          setState(res.address.state || '');
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err);
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await loginCustomer(loginEmail, loginPassword);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await registerCustomer({
        name,
        email,
        phone,
        cpf,
        password,
        address: {
          cep,
          street,
          number,
          neighborhood,
          city,
          state,
        },
      });
      setSuccessMsg('Cadastro realizado com sucesso! Você já está logada(o).');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Em Separação pela Loja
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            Enviado / A Caminho
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Entregue
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
            Aguardando Pagamento
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-pink-100 flex flex-col max-h-[90vh]">
        {/* Header do Modal */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-5 text-white flex items-center justify-between relative">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <h2 className="text-lg font-bold">
                {isCustomerLoggedIn
                  ? `Olá, ${customer?.name.split(' ')[0]}`
                  : authModalMode === 'login'
                  ? 'Acesse sua Conta'
                  : 'Criar Minha Conta'}
              </h2>
            </div>
            <p className="text-xs text-pink-100 mt-0.5">
              {isCustomerLoggedIn
                ? 'Acompanhe seus pedidos e dados de entrega'
                : 'Compre com facilidade, rapidez e segurança'}
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-pink-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 text-xs font-semibold">
          {isCustomerLoggedIn ? (
            <>
              <button
                onClick={() => setAuthModalMode('orders')}
                className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 ${
                  authModalMode === 'orders'
                    ? 'border-b-2 border-pink-600 text-pink-700 bg-white font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Package className="w-4 h-4" />
                Meus Pedidos ({myOrders.length})
              </button>
              <button
                onClick={() => setAuthModalMode('register')}
                className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 ${
                  authModalMode === 'register'
                    ? 'border-b-2 border-pink-600 text-pink-700 bg-white font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <User className="w-4 h-4" />
                Meus Dados
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-3 text-center transition-colors ${
                  authModalMode === 'login'
                    ? 'border-b-2 border-pink-600 text-pink-700 bg-white font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Já sou Cliente (Entrar)
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setErrorMsg('');
                }}
                className={`flex-1 py-3 text-center transition-colors ${
                  authModalMode === 'register'
                    ? 'border-b-2 border-pink-600 text-pink-700 bg-white font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Criar Nova Conta (Instantâneo)
              </button>
            </>
          )}
        </div>

        {/* Corpo com Scroll */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* VISUALIZAÇÃO DE PEDIDOS (Cliente Logado) */}
          {isCustomerLoggedIn && authModalMode === 'orders' && (
            <div className="space-y-4">
              {loadingOrders ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  Carregando seus pedidos...
                </div>
              ) : myOrders.length === 0 ? (
                <div className="text-center py-10">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3 stroke-[1.5]" />
                  <p className="text-sm font-semibold text-gray-700">Você ainda não possui pedidos</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                    Assim que finalizar uma compra no site, você poderá acompanhar todo o processo de separação e envio por aqui!
                  </p>
                </div>
              ) : (
                myOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-100 bg-gray-50/50 rounded-xl p-4 hover:border-pink-200 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                      <div>
                        <span className="text-xs font-bold text-gray-900">{order.orderNumber}</span>
                        <p className="text-[11px] text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    {/* Itens do Pedido */}
                    <div className="space-y-2">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded-md border border-gray-100"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">{item.name}</p>
                            <p className="text-[11px] text-gray-500">
                              Tam: {item.size} | Cor: {item.color} | Qtd: {item.quantity}x
                            </p>
                          </div>
                          <span className="font-semibold text-gray-900">
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs font-bold text-gray-900">
                      <span>Total do Pedido:</span>
                      <span className="text-sm text-pink-600">
                        R$ {order.total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                ))
              )}

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={logoutCustomer}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold p-2 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair da Minha Conta
                </button>
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="px-4 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors shadow-xs"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          )}

          {/* FORMULÁRIO DE LOGIN */}
          {!isCustomerLoggedIn && authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail Cadastrado</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sua Senha</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-pink-600/20 disabled:opacity-50 active:scale-98"
              >
                {loading ? 'Acessando...' : 'Entrar na Minha Conta'}
              </button>

              <p className="text-center text-xs text-gray-500 pt-2">
                Ainda não tem conta?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className="text-pink-600 hover:underline font-bold"
                >
                  Cadastre-se grátis em 1 minuto
                </button>
              </p>
            </form>
          )}

          {/* FORMULÁRIO DE CADASTRO (OU DADOS DO CLIENTE) */}
          {(!isCustomerLoggedIn && authModalMode === 'register') && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nome Completo *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Amanda Silva"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:border-pink-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:border-pink-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Celular / WhatsApp *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:border-pink-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">CPF (Opcional)</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2.5 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:border-pink-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Crie uma Senha *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 4 dígitos"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 text-xs rounded-xl border border-gray-200 focus:border-pink-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço pré-cadastrado */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Endereço de Entrega (Opcional - pode preencher no checkout)
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">CEP</label>
                    <input
                      type="text"
                      value={cep}
                      onBlur={handleCepBlur}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="00000-000"
                      className="w-full px-2.5 py-2 bg-gray-50 text-xs rounded-lg border border-gray-200 focus:border-pink-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] text-gray-600 mb-1">Rua</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Rua / Avenida"
                      className="w-full px-2.5 py-2 bg-gray-50 text-xs rounded-lg border border-gray-200 focus:border-pink-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">Número</label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="123"
                      className="w-full px-2.5 py-2 bg-gray-50 text-xs rounded-lg border border-gray-200 focus:border-pink-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">Bairro</label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Bairro"
                      className="w-full px-2.5 py-2 bg-gray-50 text-xs rounded-lg border border-gray-200 focus:border-pink-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">Cidade / UF</label>
                    <input
                      type="text"
                      value={city ? `${city} - ${state}` : ''}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Cidade - UF"
                      className="w-full px-2.5 py-2 bg-gray-50 text-xs rounded-lg border border-gray-200 focus:border-pink-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-pink-600/20 disabled:opacity-50 active:scale-98 mt-2"
              >
                {loading ? 'Cadastrando...' : 'Concluir Cadastro e Comprar'}
              </button>

              <p className="text-center text-xs text-gray-500 pt-1">
                Já possui conta?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="text-pink-600 hover:underline font-bold"
                >
                  Fazer login
                </button>
              </p>
            </form>
          )}

          {/* DADOS DO CLIENTE LOGADO (Edição rápida) */}
          {isCustomerLoggedIn && authModalMode === 'register' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Nome:</span>
                  <span className="font-bold text-gray-900">{customer?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">E-mail:</span>
                  <span className="font-bold text-gray-900">{customer?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Telefone:</span>
                  <span className="font-bold text-gray-900">{customer?.phone || 'Não informado'}</span>
                </div>
                {customer?.cpf && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">CPF:</span>
                    <span className="font-bold text-gray-900">{customer?.cpf}</span>
                  </div>
                )}
                {customer?.address?.street && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Endereço Padrão:</span>
                    <span className="font-bold text-gray-900 text-right">
                      {customer.address.street}, {customer.address.number} - {customer.address.city}/{customer.address.state}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={logoutCustomer}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold p-2 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair da Conta
                </button>
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="px-4 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
