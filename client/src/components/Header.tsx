import React, { useState } from 'react';
import { ShoppingBag, Search, User, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

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
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('catalog', { search: searchQuery.trim() });
    }
  };

  return (
    <header className="w-full bg-[#FAF7F5] border-b border-[#EAE3DE] sticky top-0 z-40">
      {/* Top Banner de Frete Grátis */}
      <div className="w-full bg-[#2A2626] text-[#F3ECE8] text-[11px] font-medium tracking-widest text-center py-2 px-4 uppercase flex items-center justify-center gap-4">
        <span>✦ Frete Grátis para todo o Brasil acima de R$ {settings.freeShippingThreshold.toFixed(0)} ✦</span>
        <span className="hidden md:inline text-[#B5A5A0]">|</span>
        <span className="hidden md:inline">Até 6x sem juros no cartão</span>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer flex items-center gap-3 select-none"
          >
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.storeName} className="h-12 object-contain" />
            ) : (
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.18em] font-light text-[#2A2626]">
                  {settings.storeName.toUpperCase()}
                </span>
                <span className="text-[9px] tracking-[0.3em] uppercase text-[#8A5D65] font-semibold -mt-1">
                  Atelier Feminino
                </span>
              </div>
            )}
          </div>

          {/* Categorias Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => {
                onSelectCategory ? onSelectCategory('Todos') : onNavigate('catalog', { category: 'Todos' });
              }}
              className={`text-xs uppercase tracking-[0.15em] transition-colors font-medium ${
                activeCategory === 'Todos' || !activeCategory ? 'text-[#8A5D65] font-semibold' : 'text-[#5C5552] hover:text-[#8A5D65]'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id || cat.slug}
                onClick={() => {
                  onSelectCategory ? onSelectCategory(cat.name) : onNavigate('catalog', { category: cat.name });
                }}
                className={`text-xs uppercase tracking-[0.15em] transition-colors font-medium ${
                  activeCategory === cat.name ? 'text-[#8A5D65] font-semibold' : 'text-[#5C5552] hover:text-[#8A5D65]'
                } ${cat.name.toLowerCase() === 'sale' ? 'text-rose-700 font-bold' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </nav>

          {/* Busca e Ações da Direita */}
          <div className="flex items-center space-x-4">
            {/* Campo de Busca Rápida */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
              <input
                type="text"
                placeholder="O que você procura?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F2ECE8] text-[#2A2626] text-xs placeholder-[#9A8E8A] rounded-full pl-4 pr-9 py-2 focus:outline-none focus:ring-1 focus:ring-[#8A5D65] w-48 transition-all focus:w-60"
              />
              <button type="submit" className="absolute right-3 text-[#7B6E6A] hover:text-[#8A5D65]">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Favoritos */}
            <button
              onClick={() => onNavigate('catalog')}
              className="p-2 text-[#5C5552] hover:text-[#8A5D65] transition-colors"
              title="Favoritos"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Acesso Admin / Funcionário */}
            <button
              onClick={() => onNavigate(isAuthenticated ? 'admin-dashboard' : 'admin-login')}
              className={`p-2 transition-colors flex items-center gap-1 text-xs font-medium ${
                isAuthenticated ? 'text-[#8A5D65] bg-[#F2ECE8] rounded-full px-3' : 'text-[#5C5552] hover:text-[#8A5D65]'
              }`}
              title={isAuthenticated ? `Painel Admin (${user?.username})` : 'Acesso Funcionário / Admin'}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="hidden sm:inline">
                {isAuthenticated ? 'Admin' : 'Painel'}
              </span>
            </button>

            {/* Sacola de Compras */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#2A2626] text-[#FAF7F5] rounded-full hover:bg-[#8A5D65] transition-all"
              title="Sacola de Compras"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8A5D65] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile Categorias */}
        <div className="flex md:hidden overflow-x-auto py-2.5 space-x-5 border-t border-[#EAE3DE] no-scrollbar">
          <button
            onClick={() => {
              onSelectCategory ? onSelectCategory('Todos') : onNavigate('catalog', { category: 'Todos' });
            }}
            className="text-[11px] uppercase tracking-wider whitespace-nowrap text-[#5C5552]"
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id || cat.slug}
              onClick={() => {
                onSelectCategory ? onSelectCategory(cat.name) : onNavigate('catalog', { category: cat.name });
              }}
              className="text-[11px] uppercase tracking-wider whitespace-nowrap text-[#5C5552]"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
