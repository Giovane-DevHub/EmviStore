import React, { useState, useEffect } from 'react';
import { ICustomer } from '../../types';
import { api } from '../../services/api';
import { Search, Users, ShoppingBag, MapPin, Calendar, Mail, Phone } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.getCustomers({ search });
      setCustomers(res);
      if (res.length > 0 && !selectedCustomer) {
        setSelectedCustomer(res[0]);
      }
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#2A2626] tracking-wide">
          Gestão de Clientes
        </h1>
        <p className="text-xs text-[#7A706E] mt-0.5">
          Acompanhe o perfil, ticket médio e fidelidade das compradoras da Emvi Store.
        </p>
      </div>

      {/* Busca */}
      <div className="bg-white border border-[#EAE3DE] p-4 rounded-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#968986] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF7F5] border border-[#D8CECA] pl-9 pr-3 py-2 text-xs rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
          />
        </div>
      </div>

      {/* Grid de Clientes e Detalhe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabela de Clientes */}
        <div className="lg:col-span-8 bg-white border border-[#EAE3DE] rounded-xs shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#EAE3DE] font-semibold uppercase tracking-wider text-xs text-[#2A2626]">
            Clientes Cadastradas ({customers.length})
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F5] text-[#5C5552] uppercase tracking-wider text-[10px] border-b border-[#EAE3DE]">
                <tr>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Cidade / UF</th>
                  <th className="py-3 px-4">Pedidos</th>
                  <th className="py-3 px-4">Total Gasto</th>
                  <th className="py-3 px-4">Última Compra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3DE]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#7A706E]">
                      Carregando clientes...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#7A706E]">
                      Nenhuma cliente encontrada.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => {
                    const isSelected = selectedCustomer?._id === c._id;
                    return (
                      <tr
                        key={c._id}
                        onClick={() => setSelectedCustomer(c)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#FAF5F3]' : 'hover:bg-[#FAF7F5]'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#EAE3DE] text-[#8A5D65] flex items-center justify-center font-bold text-xs shrink-0">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-[#2A2626]">{c.name}</p>
                              <p className="text-[11px] text-[#7A706E]">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#5C5552]">
                          {c.address?.city ? `${c.address.city} - ${c.address.state}` : 'São Paulo - SP'}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#2A2626]">
                          {c.ordersCount || 1}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#8A5D65]">
                          R$ {c.totalSpent.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3.5 px-4 text-[#7A706E]">
                          {c.lastOrderDate
                            ? new Date(c.lastOrderDate).toLocaleDateString('pt-BR')
                            : 'Hoje'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Perfil Detalhado da Cliente */}
        <div className="lg:col-span-4">
          {selectedCustomer ? (
            <div className="bg-white border border-[#EAE3DE] p-6 rounded-xs shadow-2xs space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-[#8A5D65] text-white flex items-center justify-center text-2xl font-serif mx-auto">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <h3 className="font-serif text-lg font-medium text-[#2A2626]">
                  {selectedCustomer.name}
                </h3>
                <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Cliente VIP
                </span>
              </div>

              <div className="space-y-3 text-xs border-t border-[#EAE3DE] pt-4">
                <div className="flex items-center gap-2 text-[#5C5552]">
                  <Mail className="w-3.5 h-3.5 text-[#8A5D65]" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[#5C5552]">
                  <Phone className="w-3.5 h-3.5 text-[#8A5D65]" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[#5C5552]">
                  <MapPin className="w-3.5 h-3.5 text-[#8A5D65]" />
                  <span>
                    {selectedCustomer.address?.street
                      ? `${selectedCustomer.address.street}, ${selectedCustomer.address.city}`
                      : 'Av. Paulista, São Paulo - SP'}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#EAE3DE] pt-4 grid grid-cols-2 gap-3 text-center">
                <div className="bg-[#FAF7F5] p-3 rounded-xs border border-[#EAE3DE]">
                  <span className="text-[10px] text-[#7A706E] uppercase tracking-wider block">
                    Total Gasto
                  </span>
                  <span className="text-sm font-bold text-[#8A5D65]">
                    R$ {selectedCustomer.totalSpent.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="bg-[#FAF7F5] p-3 rounded-xs border border-[#EAE3DE]">
                  <span className="text-[10px] text-[#7A706E] uppercase tracking-wider block">
                    Pedidos
                  </span>
                  <span className="text-sm font-bold text-[#2A2626]">
                    {selectedCustomer.ordersCount || 1} compras
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#EAE3DE] p-8 text-center text-xs text-[#7A706E] rounded-xs">
              Selecione uma cliente para ver detalhes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
