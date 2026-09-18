import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Sparkles, Zap, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    couponCode,
    applyCoupon,
    removeCoupon,
    total,
  } = useCart();
  const { settings } = useStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const freeShippingLeft = Math.max(0, settings.freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / settings.freeShippingThreshold) * 100);
  const pixTotal = total * 0.95;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon.trim()) return;

    const success = applyCoupon(inputCoupon);
    if (!success) {
      setCouponError('Cupom inválido. Experimente "BEMVINDA10"');
    } else {
      setInputCoupon('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay escuro de fundo */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header da Gaveta */}
          <div className="p-4 sm:p-5 border-b border-pink-100 flex items-center justify-between bg-pink-50/50">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-pink-600" />
              <h2 className="text-sm font-black tracking-wider uppercase text-gray-900">
                Sua Sacola ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-pink-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de Progresso de Frete Grátis */}
          <div className="bg-pink-50/80 px-5 py-3.5 border-b border-pink-100">
            {freeShippingLeft > 0 ? (
              <p className="text-xs text-gray-700 text-center mb-1.5 font-medium">
                Faltam apenas <span className="font-bold text-pink-600">R$ {freeShippingLeft.toFixed(2).replace('.', ',')}</span> para você ganhar <strong className="text-gray-900">FRETE GRÁTIS!</strong>
              </p>
            ) : (
              <p className="text-xs text-emerald-800 font-extrabold text-center mb-1.5 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                Parabéns! Você ganhou Frete Grátis para todo o Brasil!
              </p>
            )}
            <div className="w-full bg-pink-200/70 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  freeShippingLeft === 0 ? 'bg-emerald-500' : 'bg-pink-600'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Lista de Itens */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-gray-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-pink-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-gray-800">Sua sacola está vazia</p>
                <p className="text-xs text-gray-500 max-w-xs">
                  Adicione seus looks favoritos e aproveite nossas promoções com 5% de desconto no PIX!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-pink-600 text-white text-xs px-6 py-2.5 rounded-full font-bold uppercase tracking-wider hover:bg-pink-700 transition-colors shadow-md"
                >
                  Começar a Comprar
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0 flex gap-3.5">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200'}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xl bg-gray-50 border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-gray-400 hover:text-rose-600 transition-colors ml-2 p-1"
                          title="Remover produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                        <span>Tam: <strong className="text-gray-800">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          Cor:
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block border border-gray-300"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <strong className="text-gray-800">{item.selectedColor.name}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantidade */}
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 shadow-xs">
                        <button
                          onClick={() => updateQuantity(idx, item.quantity - 1)}
                          className="p-1 text-gray-600 hover:bg-white rounded-l-lg transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-black text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(idx, item.quantity + 1)}
                          className="p-1 text-gray-600 hover:bg-white rounded-r-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Preço Total do Item */}
                      <span className="text-sm font-extrabold text-gray-900">
                        R$ {(item.product.salePrice * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Rodapé com Cupom, Totais e Botão de Finalizar */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-white space-y-4 shadow-lg">
              {/* Cupom de Desconto */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl text-xs text-emerald-800 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span>Cupom <strong>{couponCode}</strong> aplicado!</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-emerald-900 underline text-[11px]"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <div>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Cupom (ex: BEMVINDA10)"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        className="flex-1 bg-gray-50 border border-pink-200 text-xs px-3.5 py-2.5 rounded-xl uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-pink-500 font-semibold"
                      />
                      <button
                        type="submit"
                        className="bg-gray-900 hover:bg-black text-white text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-xs"
                      >
                        Aplicar
                      </button>
                    </form>
                    <p className="text-[10px] text-pink-600 mt-1 font-medium">
                      💡 Dica: Primeira compra? Use o cupom <strong>BEMVINDA10</strong>
                    </p>
                  </div>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1 font-bold">{couponError}</p>}
              </div>

              {/* Linhas de Valores */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Desconto ({couponCode})</span>
                    <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                
                {/* Destaque do Total no PIX */}
                <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-sm font-black text-gray-900 block">Total Cartão</span>
                    <span className="text-[11px] text-gray-500">em até 6x sem juros</span>
                  </div>
                  <span className="text-base font-black text-gray-900">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-800">
                  <span className="text-xs font-black flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current text-emerald-600" />
                    Total no PIX (-5%)
                  </span>
                  <span className="text-base font-black text-emerald-700">
                    R$ {pixTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Botão de Finalizar */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-lg hover:shadow-pink-500/30 flex items-center justify-center gap-2 transform active:scale-95"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

