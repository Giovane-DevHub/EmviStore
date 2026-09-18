import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNavigateToStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigateToStore,
  children,
}) => {
  const { user, logout } = useAuth();
  const { settings } = useStore();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'reports', label: 'Relatórios & Metas', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4F2] flex flex-col md:flex-row">
      {/* Sidebar Lateral */}
      <aside className="w-full md:w-64 bg-[#1F1C1C] text-[#D8CECA] flex flex-col shrink-0 border-r border-[#332E2E]">
        {/* Logo Admin */}
        <div className="p-6 border-b border-[#2E2929] flex items-center justify-between">
          <div>
            <span className="font-serif text-xl tracking-[0.2em] font-light text-white block">
              {settings.storeName.toUpperCase()}
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8A5D65] font-semibold">
              Painel de Gestão
            </span>
          </div>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xs text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#8A5D65] text-white shadow-sm'
                    : 'text-[#B8AAA6] hover:bg-[#2A2525] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Ações Inferiores */}
        <div className="p-4 border-t border-[#2E2929] space-y-3">
          <button
            onClick={onNavigateToStore}
            className="w-full flex items-center justify-center gap-2 bg-[#2E2929] hover:bg-[#3D3737] text-white py-2.5 px-3 rounded-xs text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#8A5D65]" />
            <span>Ver Loja Online</span>
          </button>

          {/* Dados do Usuário Logado */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#8A5D65] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {user?.username?.charAt(0).toUpperCase() || '1'}
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrador'}</p>
                <p className="text-[10px] text-[#A39692]">Login: {user?.username}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-[#A39692] hover:text-rose-400 transition-colors"
              title="Sair do Painel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal da Aba */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
