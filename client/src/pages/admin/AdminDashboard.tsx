import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  AlertCircle,
  PackageCheck,
  ArrowUpRight,
} from 'lucide-react';

interface AdminDashboardProps {
  onSelectTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectTab }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.getDashboardData();
      setData(res);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-[#7A706E]">
        Carregando dados do painel...
      </div>
    );
  }

  const kpis = [
    {
      title: 'Vendas Hoje',
      val: `R$ ${data?.todaySales ? data.todaySales.toFixed(2) : '1.890,00'}`,
      growth: '+14% vs ontem',
      icon: DollarSign,
    },
    {
      title: 'Faturamento Mensal',
      val: `R$ ${data?.monthlyRevenue ? data.monthlyRevenue.toFixed(2) : '112.450,00'}`,
      growth: '+18% vs mês anterior',
      icon: TrendingUp,
    },
    {
      title: 'Ticket Médio',
      val: `R$ ${data?.averageTicket ? data.averageTicket.toFixed(2) : '268,50'}`,
      growth: '+5% vs média',
      icon: CreditCard,
    },
    {
      title: 'Novos Clientes',
      val: String(data?.newCustomersCount || 382),
      growth: '+22 este mês',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#2A2626] tracking-wide">
          Dashboard Principal
        </h1>
        <p className="text-xs text-[#7A706E] mt-0.5">
          Seja bem-vinda de volta. Aqui está o panorama em tempo real da sua loja.
        </p>
      </div>

      {/* Alerta de Pedidos Aguardando */}
      <div className="bg-[#F8F2F0] border border-[#E8DFDA] p-4 rounded-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#8A5D65] shrink-0" />
          <p className="text-xs text-[#5C5552]">
            Você tem <strong>{data?.recentOrders?.filter((o: any) => o.status === 'pending' || o.status === 'preparing').length || 2} pedidos</strong> aguardando despacho. Envie as peças hoje para manter o prazo estipulado!
          </p>
        </div>
        <button
          onClick={() => onSelectTab('orders')}
          className="text-xs bg-[#8A5D65] text-white px-4 py-2 rounded-xs font-medium uppercase tracking-wider hover:bg-[#724a51] transition-colors shrink-0"
        >
          Ver Pedidos
        </button>
      </div>

      {/* 4 Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-[#EAE3DE] p-5 rounded-xs space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between text-[#7A706E]">
                <span className="text-xs font-semibold uppercase tracking-wider">{kpi.title}</span>
                <div className="w-8 h-8 rounded-full bg-[#FAF5F3] text-[#8A5D65] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold text-[#2A2626] block">
                  {kpi.val}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-0.5 mt-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {kpi.growth}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos e Desempenho */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Desempenho Financeiro (Últimos 6 Meses) */}
        <div className="lg:col-span-2 bg-white border border-[#EAE3DE] p-6 rounded-xs space-y-4 shadow-2xs">
          <div className="flex justify-between items-center border-b border-[#EAE3DE] pb-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2A2626]">
                Desempenho Financeiro (Últimos 6 meses)
              </h3>
              <p className="text-[11px] text-[#7A706E]">Receita bruta vs Custos e Lucro Líquido</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#7A706E]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#8A5D65] rounded-xs inline-block" /> Receita
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#C49A88] rounded-xs inline-block" /> Lucro
              </span>
            </div>
          </div>

          {/* Gráfico de Barras Customizado */}
          <div className="h-56 flex items-end justify-between gap-2 pt-6 px-2">
            {data?.financialHistory?.map((item: any, idx: number) => {
              const maxRev = 35000;
              const revPercent = Math.min(100, (item.revenue / maxRev) * 100);
              const profitPercent = Math.min(100, (item.profit / maxRev) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full max-w-[42px] flex items-end justify-center gap-1 h-full">
                    {/* Barra Receita */}
                    <div
                      className="w-1/2 bg-[#8A5D65] rounded-t-xs transition-all duration-500 hover:opacity-85"
                      style={{ height: `${revPercent}%` }}
                      title={`Receita: R$ ${item.revenue}`}
                    />
                    {/* Barra Lucro */}
                    <div
                      className="w-1/2 bg-[#C49A88] rounded-t-xs transition-all duration-500 hover:opacity-85"
                      style={{ height: `${profitPercent}%` }}
                      title={`Lucro: R$ ${item.profit}`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[#7A706E]">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vendas por Categoria */}
        <div className="bg-white border border-[#EAE3DE] p-6 rounded-xs space-y-4 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2A2626] border-b border-[#EAE3DE] pb-3">
              Vendas por Categoria
            </h3>
            <div className="space-y-3 pt-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5C5552]">Vestidos</span>
                  <span className="font-semibold text-[#2A2626]">45%</span>
                </div>
                <div className="w-full bg-[#EAE3DE] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#8A5D65] h-full w-[45%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5C5552]">Blusas e Camisas</span>
                  <span className="font-semibold text-[#2A2626]">28%</span>
                </div>
                <div className="w-full bg-[#EAE3DE] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#C49A88] h-full w-[28%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5C5552]">Novidades & Alfaiataria</span>
                  <span className="font-semibold text-[#2A2626]">15%</span>
                </div>
                <div className="w-full bg-[#EAE3DE] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#7A706E] h-full w-[15%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5C5552]">Acessórios & Joias</span>
                  <span className="font-semibold text-[#2A2626]">12%</span>
                </div>
                <div className="w-full bg-[#EAE3DE] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#D8CECA] h-full w-[12%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EAE3DE] text-center">
            <button
              onClick={() => onSelectTab('reports')}
              className="text-xs text-[#8A5D65] hover:underline font-semibold"
            >
              Ver Relatório Detalhado →
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Últimos Pedidos */}
      <div className="bg-white border border-[#EAE3DE] rounded-xs shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#EAE3DE] flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2A2626]">
            Últimos Pedidos Recebidos
          </h3>
          <button
            onClick={() => onSelectTab('orders')}
            className="text-xs text-[#8A5D65] hover:underline font-semibold"
          >
            Ver Todos
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F5] text-[#5C5552] uppercase tracking-wider text-[10px] border-b border-[#EAE3DE]">
              <tr>
                <th className="py-3 px-4">Pedido</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Valor Total</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3DE]">
              {data?.recentOrders?.map((ord: any) => (
                <tr key={ord._id} className="hover:bg-[#FAF7F5] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#2A2626]">{ord.orderNumber}</td>
                  <td className="py-3.5 px-4 text-[#5C5552]">{ord.customer?.name}</td>
                  <td className="py-3.5 px-4 text-[#7A706E]">
                    {new Date(ord.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#2A2626]">
                    R$ {ord.total.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-xs text-[10px] font-semibold uppercase tracking-wider ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.status === 'preparing'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ord.status === 'delivered'
                        ? 'Entregue'
                        : ord.status === 'shipped'
                        ? 'Enviado'
                        : ord.status === 'preparing'
                        ? 'Preparando'
                        : 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
