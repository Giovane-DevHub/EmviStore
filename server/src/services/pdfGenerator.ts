import PDFDocument from 'pdfkit';
import { Response } from 'express';

export interface IReportData {
  storeName: string;
  generatedAt: Date;
  period: string;
  logoBase64?: string;
  summary: {
    totalRevenue: number;
    totalCost: number;
    netProfit: number;
    marginPercent: number;
    totalOrders: number;
    totalCustomers: number;
  };
  topProducts: {
    name: string;
    sku: string;
    soldUnits: number;
    revenue: number;
  }[];
  recentOrders: {
    orderNumber: string;
    customerName: string;
    date: string;
    total: number;
    status: string;
  }[];
}

export function generateReportPDF(data: IReportData, res: Response) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  // Stream do PDF para a resposta HTTP
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=relatorio-emvi-${Date.now()}.pdf`);
  doc.pipe(res);

  // Paleta de cores da marca
  const primaryColor = '#8A5D65'; // Rosé luxo
  const darkColor = '#2D2D2D';
  const lightGray = '#F7F4F2';

  // Cabeçalho
  doc.rect(40, 40, 515, 60).fill(lightGray);

  doc.font('Helvetica-Bold').fillColor(primaryColor).fontSize(20).text(data.storeName.toUpperCase(), 55, 50);
  doc.font('Helvetica').fillColor(darkColor).fontSize(10).text(`Relatório Gerencial & Financeiro | Período: ${data.period}`, 55, 75);
  doc.fontSize(8).text(`Emitido em: ${data.generatedAt.toLocaleString('pt-BR')}`, 400, 75, { align: 'right' });

  doc.moveDown(3);

  // Resumo Financeiro - Cards
  const yStart = 120;
  const cardWidth = 120;
  const cardHeight = 55;
  const gap = 11;

  const metrics = [
    { label: 'RECEITA TOTAL', val: `R$ ${data.summary.totalRevenue.toFixed(2)}` },
    { label: 'CUSTO TOTAL', val: `R$ ${data.summary.totalCost.toFixed(2)}` },
    { label: 'LUCRO LÍQUIDO', val: `R$ ${data.summary.netProfit.toFixed(2)}` },
    { label: 'MARGEM COMERCIAL', val: `${data.summary.marginPercent.toFixed(1)}%` },
  ];

  metrics.forEach((m, idx) => {
    const x = 40 + idx * (cardWidth + gap);
    doc.rect(x, yStart, cardWidth, cardHeight).fill('#FDFBFB').stroke('#E8DFDA');
    doc.font('Helvetica').fillColor('#7A7A7A').fontSize(7.5).text(m.label, x + 8, yStart + 10);
    doc.font('Helvetica-Bold').fillColor(primaryColor).fontSize(12).text(m.val, x + 8, yStart + 28);
  });

  // Seção Produtos Mais Vendidos
  let currentY = 195;
  doc.font('Helvetica-Bold').fillColor(darkColor).fontSize(13).text('Produtos Mais Vendidos', 40, currentY);
  currentY += 20;

  // Cabeçalho da tabela de produtos
  doc.rect(40, currentY, 515, 20).fill('#EDE6E3');
  doc.font('Helvetica-Bold').fillColor(darkColor).fontSize(9);
  doc.text('PRODUTO', 50, currentY + 6);
  doc.text('SKU', 250, currentY + 6);
  doc.text('VENDAS (UNID)', 350, currentY + 6);
  doc.text('TOTAL FATURADO', 440, currentY + 6);
  currentY += 22;

  doc.font('Helvetica');
  data.topProducts.forEach((item, idx) => {
    const bg = idx % 2 === 0 ? '#FFFFFF' : '#FBF9F8';
    doc.rect(40, currentY, 515, 18).fill(bg);
    doc.fillColor('#333333').fontSize(8.5).text(item.name, 50, currentY + 5);
    doc.text(item.sku, 250, currentY + 5);
    doc.text(String(item.soldUnits), 350, currentY + 5);
    doc.text(`R$ ${item.revenue.toFixed(2)}`, 440, currentY + 5);
    currentY += 20;
  });

  // Seção Últimos Pedidos
  currentY += 15;
  doc.font('Helvetica-Bold').fillColor(darkColor).fontSize(13).text('Histórico Recente de Pedidos', 40, currentY);
  currentY += 20;

  // Cabeçalho da tabela de pedidos
  doc.rect(40, currentY, 515, 20).fill('#EDE6E3');
  doc.font('Helvetica-Bold').fillColor(darkColor).fontSize(9);
  doc.text('PEDIDO', 50, currentY + 6);
  doc.text('CLIENTE', 150, currentY + 6);
  doc.text('DATA', 300, currentY + 6);
  doc.text('STATUS', 400, currentY + 6);
  doc.text('VALOR', 480, currentY + 6);
  currentY += 22;

  doc.font('Helvetica');
  data.recentOrders.slice(0, 10).forEach((order, idx) => {
    const bg = idx % 2 === 0 ? '#FFFFFF' : '#FBF9F8';
    doc.rect(40, currentY, 515, 18).fill(bg);
    doc.fillColor('#333333').fontSize(8.5).text(order.orderNumber, 50, currentY + 5);
    doc.text(order.customerName, 150, currentY + 5);
    doc.text(order.date, 300, currentY + 5);
    doc.text(order.status.toUpperCase(), 400, currentY + 5);
    doc.text(`R$ ${order.total.toFixed(2)}`, 480, currentY + 5);
    currentY += 20;
  });

  // Rodapé
  doc.fontSize(7.5).fillColor('#999999').text(
    `Relatório emitido pela plataforma ${data.storeName} - Uso interno e gerencial`,
    40,
    780,
    { align: 'center', width: 515 }
  );

  doc.end();
}
