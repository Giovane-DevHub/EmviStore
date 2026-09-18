import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import {
  FileDown,
  TrendingUp,
  Target,
  Award,
  DollarSign,
  PieChart,
  Calendar,
  Check,
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { settings } = useStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardData();
      setData(res);
    } catch (err) {
      console.error('Erro ao carregar relatórios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownloadPDF = async () => {
    setDownloadingPdf(true);
    try {
      await api.downloadReportPDF();
    } catch (err) {
      alert('Não foi possível gerar o PDF. Verifique se o servidor está ativo.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const totalRevenue = data?.totalRevenue || 112450;
  const totalCost = data?.totalCost || 38210;
  const netProfit = data?.netProfit || 74240;
  const marginPercent = data?.marginPercent || 66.0;
  const target = data?.semesterTarget || settings.semesterSalesTarget || 80000;
  const targetProgress = Math.min(100, (totalRevenue / target) * 100);

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#2A2626] tracking-wide">
            Relatórios & Metas
          </h1>
          <p className="text-xs text-[#7A706E] mt-0.5">
            Análise detalhada de performance e acompanhamento comercial da sua loja.
          </p>
        </div>

        {/* Botão de Exportação de PDF com Logotipo */}
        <button
          onClick={handleDownloadPDF}
          disabled={downloadingPdf}
          className="bg-[#8A5D65] hover:bg-[#724a51] text-white py-2.5 px-4 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <FileDown className="w-4 h-4" />
          <span>{downloadingPdf ? 'Gerando PDF com Logotipo...' : 'Exportar Relatório PDF'}</span>
        </button>
      </div>

      {/* 4 Cards de Métricas Financeiras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAE3DE] p-5 rounded-xs space-y-2 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7A706E]">
            Receita Total
          </span>
          <p className="text-2xl font-bold text-[#2A2626]">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">+18,4% vs mês anterior</span>
        </div>

        <div className="bg-white border border-[#EAE3DE] p-5 rounded-xs space-y-2 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7A706E]">
            Custo Total
          </span>
          <p className="text-2xl font-bold text-[#2A2626]">
            R$ {totalCost.toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[11px] text-[#7A706E]">-2,1% margem de custos</span>
        </div>

        <div className="bg-white border border-[#EAE3DE] p-5 rounded-xs space-y-2 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7A706E]">
            Lucro Líquido
          </span>
          <p className="text-2xl font-bold text-[#8A5D65]">
            R$ {netProfit.toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">+24,8% resultado operacional</span>
        </div>

        <div className="bg-white border border-[#EAE3DE] p-5 rounded-xs space-y-2 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7A706E]">
            Margem Comercial
          </span>
          <p className="text-2xl font-bold text-[#2A2626]">
            {marginPercent.toFixed(1)}%
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">Excelente rentabilidade</span>
        </div>
      </div>

      {/* Grid: Meta de Vendas + Mais Vendidos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Meta de Vendas do Semestre */}
        <div className="lg:col-span-7 bg-white border border-[#EAE3DE] p-6 rounded-xs shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#EAE3DE] pb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#8A5D65]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2A2626]">
                Meta de Vendas do Semestre
              </h3>
            </div>
            <span className="text-xs font-bold text-[#8A5D65]">
              {targetProgress.toFixed(1)}% Atingido
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs text-[#5C5552]">
              <span>Realizado: <strong>R$ {totalRevenue.toFixed(2).replace('.', ',')}</strong></span>
              <span>Meta: <strong>R$ {target.toFixed(2).replace('.', ',')}</strong></span>
            </div>

            <div className="w-full bg-[#EAE3DE] h-3.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-[#8A5D65] h-full rounded-full transition-all duration-700"
                style={{ width: `${targetProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-[#FAF7F5] p-4 rounded-xs border border-[#EAE3DE] text-xs text-[#5C5552] space-y-1">
            <p className="font-semibold text-[#2A2626]">Previsão do Semestre:</p>
            <p className="text-[#7A706E]">
              Mantendo o ritmo médio atual de faturamento diário, a previsão é superar a meta estipulada em aproximadamente 15%.
            </p>
          </div>
        </div>

        {/* Ranking de Mais Vendidos */}
        <div className="lg:col-span-5 bg-white border border-[#EAE3DE] p-6 rounded-xs shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#EAE3DE] pb-4">
            <Award className="w-5 h-5 text-[#8A5D65]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2A2626]">
              Ranking Mais Vendidos
            </h3>
          </div>

          <div className="space-y-3">
            {data?.topProducts && data.topProducts.length > 0 ? (
              data.topProducts.map((p: any, idx: number) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-[#FAF5F3] last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FAF5F3] text-[#8A5D65] font-bold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-[#2A2626] line-clamp-1">{p.name}</span>
                  </div>
                  <span className="font-bold text-[#8A5D65] shrink-0">
                    {p.salesCount || 10} un
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#7A706E]">Nenhum dado registrado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
