import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
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
  User,
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, subtotal, discount, shippingFee, setShippingFee, total, clearCart } = useCart();
  const { settings } = useStore();
  const { customer, isCustomerLoggedIn, openAuthModal } = useCustomerAuth();

  // Dados do Cliente
  const [name, setName] = useState(customer?.name || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [cpf, setCpf] = useState(customer?.cpf || '');

  // Endereço de Entrega
  const [cep, setCep] = useState(customer?.address?.cep || '');
  const [street, setStreet] = useState(customer?.address?.street || '');
  const [number, setNumber] = useState(customer?.address?.number || '');
  const [complement, setComplement] = useState(customer?.address?.complement || '');
  const [neighborhood, setNeighborhood] = useState(customer?.address?.neighborhood || '');
  const [city, setCity] = useState(customer?.address?.city || '');
  const [state, setState] = useState(customer?.address?.state || '');

  // Preenchimento automático quando o cliente logar
  useEffect(() => {
    if (customer) {
      if (customer.name) setName(customer.name);
      if (customer.email) setEmail(customer.email);
      if (customer.phone) setPhone(customer.phone);
      if (customer.cpf) setCpf(customer.cpf);
      if (customer.address) {
        if (customer.address.cep) setCep(customer.address.cep);
        if (customer.address.street) setStreet(customer.address.street);
        if (customer.address.number) setNumber(customer.address.number);
        if (customer.address.neighborhood) setNeighborhood(customer.address.neighborhood);
        if (customer.address.city) setCity(customer.address.city);
        if (customer.address.state) setState(customer.address.state);
      }
    }
  }, [customer]);

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
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50/50">
          <CheckCircle className="w-12 h-12" />
        </div>
        <div>
          <span className="inline-block px-3 py-1 bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider rounded-full mb-2">
            Compra realizada com sucesso! 🎉
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Obrigada pelo seu pedido, {completedOrder.customer.name}!
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Número do Pedido: <strong className="text-gray-900 font-mono font-bold">#{completedOrder.orderNumber}</strong>
          </p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl text-left text-xs space-y-4 shadow-sm">
          <p className="text-gray-600 leading-relaxed">
            Enviamos todos os detalhes da confirmação e rastreamento para o e-mail: <strong className="text-gray-900">{completedOrder.customer.email}</strong>.
          </p>
          <div className="border-t border-gray-100 pt-3 flex justify-between text-gray-700">
            <span>Endereço de Entrega:</span>
            <span className="font-semibold text-right text-gray-900">
              {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.number}
              <br />
              {completedOrder.shippingAddress.city} - {completedOrder.shippingAddress.state} (CEP {completedOrder.shippingAddress.cep})
            </span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between text-gray-900 font-bold text-sm">
            <span>Valor Total Pago:</span>
            <span className="text-emerald-600 text-base">R$ {completedOrder.total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-8 py-4 rounded-xl uppercase tracking-wider transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
        >
          <span>Continuar Comprando</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Botão Voltar */}
      <button
        onClick={() => onNavigate('home')}
        className="text-xs font-semibold text-gray-600 hover:text-pink-600 flex items-center gap-2 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Voltar à Loja</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Coluna Esquerda: Formulários de Endereço e Pagamento */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
          {/* 1. Endereço de Entrega */}
          <div className="bg-white border border-gray-100 p-6 sm:p-7 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-pink-600" />
                Endereço de Entrega & Identificação
              </h2>
            </div>

            {/* Banner de Identificação do Cliente */}
            {isCustomerLoggedIn ? (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Comprando como <strong>{customer?.name}</strong> ({customer?.email})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal('orders')}
                  className="text-emerald-700 hover:underline font-bold text-[11px]"
                >
                  Ver meus pedidos
                </button>
              </div>
            ) : (
              <div className="bg-pink-50/70 border border-pink-200 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4 text-pink-600 flex-shrink-0" />
                  <span>Já possui cadastro na Emvi Store?</span>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-pink-600 font-bold hover:underline"
                >
                  Entrar na conta
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Beatriz Lins"
                  className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">WhatsApp / Telefone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">CEP * (Busca Automática)</label>
                <input
                  type="text"
                  required
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                  className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">CPF (para nota fiscal)</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-900 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">Logradouro / Rua *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Rua, Avenida..."
                  className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Número *</label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="123"
                  className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Complemento</label>
                <input
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Apto 42, Bloco B"
                  className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Bairro *</label>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Bairro"
                  className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Cidade *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Cidade"
                    className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">UF *</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="SP"
                    className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-900 uppercase font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Método de Pagamento */}
          <div className="bg-white border border-gray-100 p-6 sm:p-7 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-pink-600" />
                Forma de Pagamento
              </h2>
            </div>

            {/* Abas dos Métodos */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'credit_card'
                    ? 'border-pink-600 bg-pink-50/50 text-pink-700 ring-2 ring-pink-500/20 shadow-xs'
                    : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Cartão de Crédito</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all relative cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-emerald-600 bg-emerald-50/60 text-emerald-800 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300'
                }`}
              >
                <span className="absolute -top-2.5 right-2 bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                  -5% OFF
                </span>
                <QrCode className="w-5 h-5 text-emerald-600" />
                <span>PIX Instantâneo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('boleto')}
                className={`p-3.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'boleto'
                    ? 'border-pink-600 bg-pink-50/50 text-pink-700 ring-2 ring-pink-500/20 shadow-xs'
                    : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Boleto Bancário</span>
              </button>
            </div>

            {/* Formulário Cartão de Crédito */}
            {paymentMethod === 'credit_card' && (
              <div className="space-y-3.5 pt-2 text-xs">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Número do Cartão *</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nome Impresso no Cartão *</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="COMO NO CARTÃO"
                    className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Validade (MM/AA) *</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">CVV / Segurança *</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Parcelamento *</label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium text-gray-900"
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
              <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-200/80 text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold">
                  <span>Economia de R$ {(total * 0.05).toFixed(2).replace('.', ',')}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  O código PIX Copia e Cola será gerado instantaneamente na finalização com aprovação imediata em segundos.
                </p>
                <div className="inline-block p-2.5 bg-white border border-dashed border-emerald-400 rounded-lg text-xs font-mono text-emerald-800 shadow-2xs">
                  Total no PIX: <strong className="text-sm font-bold text-emerald-700">R$ {(total * 0.95).toFixed(2).replace('.', ',')}</strong>
                </div>
              </div>
            )}

            {/* Boleto */}
            {paymentMethod === 'boleto' && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">O boleto bancário tem prazo de vencimento em até 3 dias úteis.</p>
                <p className="text-[11px] text-gray-500">
                  A compensação bancária pode levar até 24h a 48h úteis após o pagamento.
                </p>
              </div>
            )}
          </div>

          {/* Botão de Conclusão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Processando Pedido...' : 'Confirmar e Finalizar Pedido'}</span>
          </button>
        </form>

        {/* Coluna Direita: Resumo do Pedido */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl sticky top-28 space-y-5 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>Resumo do Pedido</span>
              <span className="text-pink-600 font-semibold">{cart.length} {cart.length === 1 ? 'item' : 'itens'}</span>
            </h2>

            {/* Itens */}
            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto space-y-3 pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200'}
                    alt={item.product.name}
                    className="w-14 h-18 object-cover rounded-lg bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 text-xs">
                    <p className="font-semibold text-gray-900 line-clamp-1">{item.product.name}</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      Qtd: {item.quantity} • Tam: <strong className="text-gray-700">{item.selectedSize}</strong>
                    </p>
                    <p className="font-bold text-gray-900 mt-1">
                      R$ {(item.product.salePrice * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totais */}
            <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-600 font-bold uppercase">Grátis</strong>
                  ) : (
                    <span className="font-medium text-gray-900">R$ {shippingFee.toFixed(2).replace('.', ',')}</span>
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Cupom Aplicado</span>
                  <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-100 text-base font-bold text-gray-900">
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-lg flex items-center justify-between text-[11px] text-emerald-800">
                <span className="font-medium">No PIX com 5% de desconto:</span>
                <strong className="text-xs font-bold text-emerald-700">
                  R$ {(total * 0.95).toFixed(2).replace('.', ',')}
                </strong>
              </div>
            </div>

            {/* Selo de Segurança */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ambiente 100% Criptografado & Seguro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
