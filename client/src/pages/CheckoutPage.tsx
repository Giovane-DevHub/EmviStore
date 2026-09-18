import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  FileText,
  Truck,
  CheckCircle,
  ArrowLeft,
  Lock,
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, subtotal, discount, shippingFee, setShippingFee, total, clearCart } = useCart();
  const { settings } = useStore();

  // Dados do Cliente
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');

  // Endereço de Entrega
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Método de Pagamento
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');

  // Dados do Cartão
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  // Estado do Processamento
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Consulta automática de CEP
  const handleCepBlur = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const res = await api.calculateShipping(cleanCep, subtotal);
        if (res.address) {
          setStreet(res.address.street || '');
          setNeighborhood(res.address.neighborhood || '');
          setCity(res.address.city || '');
          setState(res.address.state || '');
        }
        if (res.options && res.options.length > 0) {
          // Seleciona a opção padrão
          setShippingFee(res.options[0].price);
        }
      } catch (err) {
        console.error('Erro ao consultar CEP:', err);
      }
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Sua sacola está vazia.');
      return;
    }

    if (!name || !email || !phone || !cep || !street || !number) {
      alert('Por favor, preencha todos os campos obrigatórios de endereço e contato.');
      return;
    }

    if (paymentMethod === 'credit_card' && (!cardNumber || !cardHolder || !cardExpiry || !cardCvv)) {
      alert('Por favor, preencha os dados do cartão de crédito.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customer: { name, email, phone, cpf },
        shippingAddress: {
          cep,
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
        },
        items: cart.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.salePrice,
          costPrice: item.product.costPrice || 0,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor.name,
          image: item.product.images[0] || '',
        })),
        subtotal,
        shippingFee,
        discount,
        total,
        paymentMethod,
        paymentDetails:
          paymentMethod === 'credit_card'
            ? {
                lastFourDigits: cardNumber.slice(-4),
                installments: Number(installments),
              }
            : undefined,
      };

      const createdOrder = await api.createOrder(orderPayload);
      setCompletedOrder(createdOrder);
      clearCart();
    } catch (err: any) {
      alert(err.message || 'Erro ao processar pedido.');
    } finally {
      setLoading(false);
    }
  };

  // Se o pedido foi concluído com sucesso
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#8A5D65] font-semibold">
            Compra realizada com sucesso!
          </span>
          <h1 className="font-serif text-3xl font-light text-[#2A2626] mt-1">
            Obrigada pelo seu pedido, {completedOrder.customer.name}!
          </h1>
          <p className="text-sm text-[#7A706E] mt-2">
            Número do Pedido: <strong className="text-[#2A2626]">{completedOrder.orderNumber}</strong>
          </p>
        </div>

        <div className="bg-[#FAF7F5] border border-[#EAE3DE] p-6 rounded-xs text-left text-xs space-y-3">
          <p className="text-[#5C5552]">
            Enviamos a confirmação detalhada para o e-mail: <strong>{completedOrder.customer.email}</strong>.
          </p>
          <div className="border-t border-[#EAE3DE] pt-3 flex justify-between text-[#2A2626]">
            <span>Endereço de Entrega:</span>
            <span className="font-medium text-right">
              {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.number}
              <br />
              {completedOrder.shippingAddress.city} - {completedOrder.shippingAddress.state} (CEP {completedOrder.shippingAddress.cep})
            </span>
          </div>
          <div className="border-t border-[#EAE3DE] pt-3 flex justify-between text-[#2A2626] font-bold text-sm">
            <span>Valor Total Pago:</span>
            <span>R$ {completedOrder.total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="bg-[#2A2626] text-white text-xs px-8 py-3.5 rounded-xs uppercase tracking-widest hover:bg-[#8A5D65] transition-colors"
        >
          Continuar Comprando
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Botão Voltar */}
      <button
        onClick={() => onNavigate('home')}
        className="text-xs text-[#8A5D65] flex items-center gap-1.5 mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar à Loja</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Coluna Esquerda: Formulários de Endereço e Pagamento */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">
          {/* 1. Endereço de Entrega */}
          <div className="bg-[#FAF7F5] border border-[#EAE3DE] p-6 rounded-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#EAE3DE] pb-3">
              <Truck className="w-4 h-4 text-[#8A5D65]" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#2A2626]">
                1. Endereço de Entrega & Identificação
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-[#5C5552] mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Beatriz Lins"
                  className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div>
                <label className="block text-[#5C5552] mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div>
                <label className="block text-[#5C5552] mb-1">WhatsApp / Telefone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div>
                <label className="block text-[#5C5552] mb-1">CEP * (Preenchimento Automático)</label>
                <input
                  type="text"
                  required
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                  className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div>
                <label className="block text-[#5C5552] mb-1">CPF (opcional)</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#5C5552] mb-1">Logradouro / Rua *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Rua, Avenida..."
                  className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div>
                <label className="block text-[#5C5552] mb-1">Número *</label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="123"
                  className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div>
                <label className="block text-[#5C5552] mb-1">Complemento</label>
                <input
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Apto 42, Bloco B"
                  className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div>
                <label className="block text-[#5C5552] mb-1">Bairro *</label>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Bairro"
                  className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#5C5552] mb-1">Cidade *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Cidade"
                    className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                  />
                </div>
                <div>
                  <label className="block text-[#5C5552] mb-1">UF *</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="SP"
                    className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Método de Pagamento */}
          <div className="bg-[#FAF7F5] border border-[#EAE3DE] p-6 rounded-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#EAE3DE] pb-3">
              <CreditCard className="w-4 h-4 text-[#8A5D65]" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#2A2626]">
                2. Método de Pagamento
              </h2>
            </div>

            {/* Abas dos Métodos */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 rounded-xs border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-[#8A5D65] bg-white text-[#8A5D65] shadow-xs'
                    : 'border-[#D8CECA] bg-[#FAF7F5] text-[#7A706E]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cartão de Crédito</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3 rounded-xs border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'pix'
                    ? 'border-[#8A5D65] bg-white text-[#8A5D65] shadow-xs'
                    : 'border-[#D8CECA] bg-[#FAF7F5] text-[#7A706E]'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>PIX Instantâneo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('boleto')}
                className={`p-3 rounded-xs border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'boleto'
                    ? 'border-[#8A5D65] bg-white text-[#8A5D65] shadow-xs'
                    : 'border-[#D8CECA] bg-[#FAF7F5] text-[#7A706E]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Boleto Bancário</span>
              </button>
            </div>

            {/* Formulário Cartão de Crédito */}
            {paymentMethod === 'credit_card' && (
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block text-[#5C5552] mb-1">Número do Cartão *</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                  />
                </div>

                <div>
                  <label className="block text-[#5C5552] mb-1">Nome Impresso no Cartão *</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="COMO NO CARTÃO"
                    className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#5C5552] mb-1">Validade (MM/AA) *</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5C5552] mb-1">CVV / Código de Segurança *</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#5C5552] mb-1">Número de Parcelas *</label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    className="w-full bg-white border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                  >
                    <option value="1">1x de R$ {total.toFixed(2).replace('.', ',')} sem juros</option>
                    <option value="2">2x de R$ {(total / 2).toFixed(2).replace('.', ',')} sem juros</option>
                    <option value="3">3x de R$ {(total / 3).toFixed(2).replace('.', ',')} sem juros</option>
                    <option value="4">4x de R$ {(total / 4).toFixed(2).replace('.', ',')} sem juros</option>
                    <option value="5">5x de R$ {(total / 5).toFixed(2).replace('.', ',')} sem juros</option>
                    <option value="6">6x de R$ {(total / 6).toFixed(2).replace('.', ',')} sem juros</option>
                  </select>
                </div>
              </div>
            )}

            {/* PIX */}
            {paymentMethod === 'pix' && (
              <div className="bg-white p-4 rounded-xs border border-[#EAE3DE] text-center space-y-3">
                <p className="text-xs text-[#5C5552]">
                  O código PIX Copia e Cola será gerado instantaneamente na finalização para pagamento imediato com aprovação em segundos.
                </p>
                <div className="inline-block p-2 bg-[#FAF7F5] border border-dashed border-[#8A5D65] rounded-xs text-[11px] font-mono text-[#8A5D65]">
                  Chave Pix CNPJ: 52.876.019/0001-90
                </div>
              </div>
            )}

            {/* Boleto */}
            {paymentMethod === 'boleto' && (
              <div className="bg-white p-4 rounded-xs border border-[#EAE3DE] text-xs text-[#5C5552] space-y-1">
                <p>O boleto bancário tem prazo de vencimento em até 3 dias úteis.</p>
                <p className="text-[11px] text-[#7A706E]">
                  A confirmação pode levar até 24h úteis após o pagamento.
                </p>
              </div>
            )}
          </div>

          {/* Botão de Conclusão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8A5D65] hover:bg-[#724a51] text-white py-4 px-6 rounded-xs text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Processando Pedido...' : 'Confirmar e Finalizar Pedido'}</span>
          </button>
        </form>

        {/* Coluna Direita: Resumo do Pedido */}
        <div className="lg:col-span-5">
          <div className="bg-[#FAF7F5] border border-[#EAE3DE] p-6 rounded-xs sticky top-28 space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#2A2626] border-b border-[#EAE3DE] pb-3">
              Resumo do Pedido ({cart.length})
            </h2>

            {/* Itens */}
            <div className="divide-y divide-[#EAE3DE] max-h-72 overflow-y-auto space-y-3">
              {cart.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200'}
                    alt={item.product.name}
                    className="w-12 h-16 object-cover rounded-xs bg-[#EAE3DE] shrink-0"
                  />
                  <div className="flex-1 text-xs">
                    <p className="font-medium text-[#2A2626] line-clamp-1">{item.product.name}</p>
                    <p className="text-[#7A706E] text-[11px]">
                      Qtd: {item.quantity} • Tam: {item.selectedSize}
                    </p>
                    <p className="font-semibold text-[#2A2626] mt-0.5">
                      R$ {(item.product.salePrice * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totais */}
            <div className="border-t border-[#EAE3DE] pt-4 space-y-2 text-xs text-[#5C5552]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700 uppercase">Grátis</strong>
                  ) : (
                    `R$ ${shippingFee.toFixed(2).replace('.', ',')}`
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Desconto Aplicado</span>
                  <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-[#EAE3DE] text-base font-bold text-[#2A2626]">
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {/* Selo de Segurança */}
            <div className="pt-3 border-t border-[#EAE3DE] flex items-center justify-center gap-2 text-[11px] text-[#7A706E]">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Ambiente 100% Criptografado & Seguro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
