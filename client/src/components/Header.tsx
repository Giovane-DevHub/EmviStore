import React, { useState } from 'react';
import { ShoppingBag, Search, User, ShieldCheck, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { ICategory } from '../types';

interface HeaderProps {
  categories: ICategory[];
  onNavigate: (page: string, params?: any) => void;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  onNavigate,
  activeCategory,
  onSelectCategory,
}) => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { settings } = useStore();
  const { isAuthenticated, user } = useAuth();
  const { customer, isCustomerLoggedIn, openAuthModal } = useCustomerAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('catalog', { search: searchQuery.trim() });
    }
  };

  return (
    <header className="w-full bg-white sticky top-0 z-40 shadow-xs border-b border-pink-100">
      {/* Top Banner Promocional com Cores Vivas */}
      <div className="w-full bg-gradient-to-r from-pink-700 via-pink-600 to-rose-600 text-white text-[11px] sm:text-xs font-medium tracking-wider text-center py-2 px-3 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 mx-auto">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              FRETE GRÁTIS para todo o Brasil acima de R$ {settings.freeShippingThreshold.toFixed(0)}
            </span>
            <span className="hidden md:inline text-pink-300">|</span>
            <span className="hidden md:inline bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide">
              ⚡ 5% OFF NO PIX
            </span>
            <span className="hidden lg:inline text-pink-300">|</span>
            <span className="hidden lg:inline font-semibold">
              💳 Até 6x sem juros
            </span>
            <span className="hidden xl:inline text-pink-300">|</span>
            <span className="hidden xl:inline bg-yellow-400 text-pink-900 px-2 py-0.5 rounded-full text-[10px] font-bold">
              CUPOM: BEMVINDA10
            </span>
          </div>
        </div>
      </div>

      {/* Main Header com Alto Contraste e Vida */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Comercial Empoderado */}
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer flex items-center gap-3 select-none flex-shrink-0 group"
          >
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.storeName} className="h-12 object-contain" />
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-gray-900 group-hover:text-pink-600 transition-colors">
                    {settings.storeName || 'EMVI'}
                  </span>
                  <span className="bg-pink-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                    STORE
                  </span>
                </div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-pink-600 font-bold -mt-0.5">
                  Moda Feminina
                </span>
              </div>
            )}
          </div>

          {/* Barra de Pesquisa Centralizada & Robusta */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
              <input
                type="text"
                placeholder="O que você procura hoje? (ex: Vestido, Cropped, Jeans...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 text-gray-800 text-xs sm:text-sm placeholder-gray-400 rounded-full pl-5 pr-12 py-2.5 border border-pink-200 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-full transition-colors flex items-center justify-center shadow-xs"
                title="Buscar produtos"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Ações da Direita (Atendimento, Conta, Favoritos e Carrinho) */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* WhatsApp Atendimento Rápido */}
            <a
              href={`https://wa.me/55${settings.phone.replace(/\D/g, '')}?text=Olá! Estava navegando na loja e gostaria de tirar uma dúvida.`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              title="Atendimento via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Atendimento</span>
            </a>

            {/* Favoritos */}
            <button
              onClick={() => onNavigate('catalog')}
              className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all"
              title="Meus Favoritos"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Conta do Cliente (100% Autônomo) */}
            {isCustomerLoggedIn ? (
              <button
                onClick={() => openAuthModal('orders')}
                className="p-1.5 sm:px-3 sm:py-2 transition-all flex items-center gap-1.5 text-xs font-bold rounded-full text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 shadow-xs"
                title={`Minha Conta (${customer?.name})`}
              >
                <User className="w-4 h-4 text-pink-600" />
                <span className="max-w-[85px] truncate hidden sm:inline">
                  {customer?.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="p-2 transition-all flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-full px-2 sm:px-3"
                title="Entrar ou Cadastrar"
              >
                <User className="w-4 h-4 text-gray-600" />
                <span className="hidden sm:inline">Entrar</span>
              </button>
            )}

            {/* Painel Admin / Gestão da Loja */}
            <button
              onClick={() => onNavigate(isAuthenticated ? 'admin-dashboard' : 'admin-login')}
              className={`p-2 transition-all flex items-center gap-1 text-xs font-semibold rounded-full ${
                isAuthenticated
                  ? 'text-pink-700 bg-pink-100 px-3'
                  : 'text-gray-400 hover:text-pink-600 hover:bg-pink-50'
              }`}
              title={isAuthenticated ? `Painel Administrativo (${user?.username})` : 'Acesso da Loja / Painel Admin'}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden xl:inline">
                {isAuthenticated ? 'Admin' : 'Loja'}
              </span>
            </button>

            {/* Botão de Carrinho com Destaque Comercial */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-3.5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
              title="Meu Carrinho"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Carrinho</span>
              {totalItemsCount > 0 ? (
                <span className="bg-yellow-400 text-gray-900 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center -mr-1 shadow-xs animate-bounce">
                  {totalItemsCount}
                </span>
              ) : (
                <span className="text-pink-200 text-xs">0</span>
              )}
            </button>
          </div>
        </div>

        {/* Barra de Busca Mobile */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
            <input
              type="text"
              placeholder="O que você procura? (ex: Vestido, Cropped)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 text-xs placeholder-gray-400 rounded-full pl-4 pr-10 py-2 border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="absolute right-1 bg-pink-600 text-white p-1.5 rounded-full"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Barra Horizontal de Categorias (Desktop & Mobile) */}
        <nav className="flex items-center space-x-1 sm:space-x-2 py-2.5 border-t border-gray-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              onSelectCategory ? onSelectCategory('Todos') : onNavigate('catalog', { category: 'Todos' });
            }}
            className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
              activeCategory === 'Todos' || !activeCategory
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
            }`}
          >
            Todos os Produtos
          </button>

          <button
            onClick={() => onNavigate('catalog', { category: 'Lançamentos' })}
            className="px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 transition-all whitespace-nowrap flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-pink-600" />
            Lançamentos
          </button>

          {categories.map((cat) => {
            const isSale = cat.name.toLowerCase().includes('sale') || cat.name.toLowerCase().includes('promo');
            const isActive = activeCategory === cat.name;

            return (
              <button
                key={cat._id || cat.slug}
                onClick={() => {
                  onSelectCategory ? onSelectCategory(cat.name) : onNavigate('catalog', { category: cat.name });
                }}
                className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-xs'
                    : isSale
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 font-extrabold'
                    : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

