import React, { useState, useEffect } from 'react';
import { IOrder } from '../../types';
import { api } from '../../services/api';
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Printer,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getOrders();
      setOrders(res);
      if (res.length > 0 && !selectedOrder) {
        setSelectedOrder(res[0]);
      }
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err) {
      alert('Erro ao atualizar status do pedido.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer?.name.toLowerCase().includes(q) ||
        o.customer?.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#2A2626] tracking-wide">
          Gestão de Pedidos
        </h1>
        <p className="text-xs text-[#7A706E] mt-0.5">
          Monitore as vendas e atualize o status de entrega para o cliente.
        </p>
      </div>

      {/* Banner de Destaque / Última Venda */}
      {orders.length > 0 && (
        <div className="bg-[#FAF5F3] border border-[#E8DFDA] p-4 rounded-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#8A5D65] shrink-0" />
            <p className="text-xs text-[#5C5552]">
              Último pedido registrado: <strong>{orders[0].orderNumber}</strong> por{' '}
              <strong>{orders[0].customer?.name}</strong> (R$ {orders[0].total.toFixed(2).replace('.', ',')})
            </p>
          </div>
          <button
            onClick={() => setSelectedOrder(orders[0])}
            className="text-xs bg-[#8A5D65] text-white px-3.5 py-1.5 rounded-xs font-semibold uppercase tracking-wider hover:bg-[#724a51] transition-colors shrink-0"
          >
            Visualizar
          </button>
        </div>
      )}

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#968986] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por nº do pedido ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#D8CECA] pl-9 pr-3 py-2 text-xs rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#D8CECA] px-3 py-2 text-xs rounded-xs text-[#5C5552] focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
        >
          <option value="all">Todos os Status</option>
          <option value="pending">Pendente</option>
          <option value="preparing">Preparando Envio</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregue</option>
        </select>
      </div>

      {/* Grid Principal: Fila de Pedidos + Painel Lateral de Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabela de Pedidos (Esquerda) */}
        <div className="lg:col-span-7 bg-white border border-[#EAE3DE] rounded-xs shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#EAE3DE] font-semibold uppercase tracking-wider text-xs text-[#2A2626]">
            Fila de Processamento ({filteredOrders.length})
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F5] text-[#5C5552] uppercase tracking-wider text-[10px] border-b border-[#EAE3DE]">
                <tr>
                  <th className="py-3 px-3">Pedido</th>
                  <th className="py-3 px-3">Cliente</th>
                  <th className="py-3 px-3">Pagamento</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3DE]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#7A706E]">
                      Carregando pedidos...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#7A706E]">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const isSelected = selectedOrder?._id === ord._id;
                    return (
                      <tr
                        key={ord._id}
                        onClick={() => setSelectedOrder(ord)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#FAF5F3]' : 'hover:bg-[#FAF7F5]'
                        }`}
                      >
                        <td className="py-3 px-3 font-semibold text-[#2A2626]">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-3 text-[#5C5552] line-clamp-1">
                          {ord.customer?.name}
                        </td>
                        <td className="py-3 px-3 text-[#7A706E] uppercase text-[11px]">
                          {ord.paymentMethod === 'credit_card'
                            ? 'Cartão'
                            : ord.paymentMethod.toUpperCase()}
                        </td>
                        <td className="py-3 px-3 font-bold text-[#2A2626]">
                          R$ {ord.total.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider ${
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
                        <td className="py-3 px-2 text-right text-[#968986]">
                          <ChevronRight className="w-4 h-4 inline" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detalhes do Pedido Selecionado (Direita) */}
        <div className="lg:col-span-5">
          {selectedOrder ? (
            <div className="bg-white border border-[#EAE3DE] p-5 rounded-xs shadow-2xs space-y-5 sticky top-28">
              {/* Header do Pedido */}
              <div className="flex justify-between items-start border-b border-[#EAE3DE] pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#968986]">
                    Detalhes do Pedido
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#2A2626]">
                    {selectedOrder.orderNumber}
                  </h3>
                  <p className="text-[11px] text-[#7A706E]">
                    Realizado em {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="p-2 border border-[#D8CECA] rounded-xs text-[#5C5552] hover:bg-[#FAF7F5] transition-colors"
                  title="Imprimir Pedido"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              {/* Dados do Cliente */}
              <div className="text-xs space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8A5D65]">
                  Cliente
                </span>
                <p className="font-semibold text-[#2A2626]">{selectedOrder.customer?.name}</p>
                <p className="text-[#5C5552]">Email: {selectedOrder.customer?.email}</p>
                <p className="text-[#5C5552]">WhatsApp: {selectedOrder.customer?.phone}</p>
              </div>

              {/* Endereço de Entrega */}
              <div className="text-xs space-y-1 border-t border-[#EAE3DE] pt-3">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8A5D65]">
                  Endereço de Entrega
                </span>
                <p className="text-[#2A2626]">
                  {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.number}
                  {selectedOrder.shippingAddress.complement ? ` - ${selectedOrder.shippingAddress.complement}` : ''}
                </p>
                <p className="text-[#5C5552]">
                  {selectedOrder.shippingAddress.neighborhood} • {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.state}
                </p>
                <p className="text-[#7A706E]">CEP: {selectedOrder.shippingAddress.cep}</p>
              </div>

              {/* Itens do Pedido */}
              <div className="border-t border-[#EAE3DE] pt-3 space-y-3">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8A5D65]">
                  Itens Comprados ({selectedOrder.items.length})
                </span>
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200'}
                        alt={item.name}
                        className="w-10 h-13 object-cover rounded-xs bg-[#EAE3DE] shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-[#2A2626] line-clamp-1">{item.name}</p>
                        <p className="text-[#7A706E] text-[11px]">
                          Tam: {item.size} • Cor: {item.color} • Qtd: {item.quantity}
                        </p>
                        <p className="font-medium text-[#2A2626]">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totais */}
              <div className="border-t border-[#EAE3DE] pt-3 space-y-1 text-xs text-[#5C5552]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {selectedOrder.subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span>R$ {selectedOrder.shippingFee.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#2A2626] pt-1">
                  <span>Total do Pedido:</span>
                  <span>R$ {selectedOrder.total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Ação de Atualizar Status */}
              <div className="border-t border-[#EAE3DE] pt-4 space-y-2">
                <label className="block text-[11px] font-semibold text-[#5C5552] uppercase">
                  Alterar Status de Envio:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    disabled={updating || selectedOrder.status === 'preparing'}
                    onClick={() => handleUpdateStatus(selectedOrder._id, 'preparing')}
                    className={`py-2 px-3 rounded-xs font-semibold uppercase tracking-wider border transition-colors ${
                      selectedOrder.status === 'preparing'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'border-[#D8CECA] hover:bg-[#FAF7F5]'
                    }`}
                  >
                    Preparando
                  </button>

                  <button
                    disabled={updating || selectedOrder.status === 'shipped'}
                    onClick={() => handleUpdateStatus(selectedOrder._id, 'shipped')}
                    className={`py-2 px-3 rounded-xs font-semibold uppercase tracking-wider border transition-colors ${
                      selectedOrder.status === 'shipped'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-[#D8CECA] hover:bg-[#FAF7F5]'
                    }`}
                  >
                    Despachar
                  </button>

                  <button
                    disabled={updating || selectedOrder.status === 'delivered'}
                    onClick={() => handleUpdateStatus(selectedOrder._id, 'delivered')}
                    className={`col-span-2 py-2.5 px-3 rounded-xs font-semibold uppercase tracking-wider border transition-colors ${
                      selectedOrder.status === 'delivered'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'border-[#D8CECA] hover:bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    Marcar como Entregue
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#EAE3DE] p-8 text-center text-xs text-[#7A706E] rounded-xs">
              Selecione um pedido na fila para visualizar os detalhes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
