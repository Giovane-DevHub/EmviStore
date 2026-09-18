import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
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

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon.trim()) return;

    const success = applyCoupon(inputCoupon);
    if (!success) {
      setCouponError('Cupom inválido. Tente "EMVI10"');
    } else {
      setInputCoupon('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay escuro de fundo */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F5] shadow-2xl flex flex-col">
          {/* Header da Gaveta */}
          <div className="p-5 border-b border-[#EAE3DE] flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#8A5D65]" />
              <h2 className="text-sm font-semibold tracking-wider uppercase text-[#2A2626]">
                Sua Sacola ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#7A706E] hover:text-black rounded-full hover:bg-[#F2ECE8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de Progresso de Frete Grátis */}
          <div className="bg-[#F2ECE8] px-5 py-3 border-b border-[#EAE3DE]">
            {freeShippingLeft > 0 ? (
              <p className="text-xs text-[#5C5552] text-center mb-1.5">
                Faltam <span className="font-semibold text-[#8A5D65]">R$ {freeShippingLeft.toFixed(2)}</span> para ganhar <span className="font-bold">Frete Grátis</span>!
              </p>
            ) : (
              <p className="text-xs text-emerald-800 font-semibold text-center mb-1.5">
                ✦ Parabéns! Você ganhou Frete Grátis! ✦
              </p>
            )}
            <div className="w-full bg-[#DCD4D0] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#8A5D65] h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Lista de Itens */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#EAE3DE] space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-[#7A706E]">
                <ShoppingBag className="w-12 h-12 stroke-[1] text-[#B8AAA6] mb-3" />
                <p className="text-sm font-medium text-[#2A2626]">Sua sacola está vazia</p>
                <p className="text-xs text-[#968986] mt-1 max-w-xs">
                  Explore nossa coleção de roupas femininas elegantes e adicione suas peças favoritas.
                </p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0 flex gap-4">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200'}
                    alt={item.product.name}
                    className="w-20 h-26 object-cover rounded-xs bg-[#EAE3DE] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-medium text-[#2A2626] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-[#968986] hover:text-rose-600 transition-colors ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#7A706E] mt-1">
                        <span>Tam: <strong className="text-[#2A2626]">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          Cor:
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantidade */}
                      <div className="flex items-center border border-[#D8CECA] rounded-xs bg-white">
                        <button
                          onClick={() => updateQuantity(idx, item.quantity - 1)}
                          className="p-1 text-[#5C5552] hover:bg-[#F2ECE8]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-[#2A2626]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(idx, item.quantity + 1)}
                          className="p-1 text-[#5C5552] hover:bg-[#F2ECE8]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Preço Total do Item */}
                      <span className="text-xs font-bold text-[#2A2626]">
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
            <div className="p-5 border-t border-[#EAE3DE] bg-white space-y-4">
              {/* Cupom de Desconto */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xs text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cupom <strong>{couponCode}</strong> aplicado!</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 text-[11px]"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cupom de desconto (ex: EMVI10)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="flex-1 bg-[#F5EFEB] text-xs px-3 py-2 rounded-xs uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                    />
                    <button
                      type="submit"
                      className="bg-[#2A2626] text-white text-xs px-4 py-2 rounded-xs font-medium uppercase tracking-wider hover:bg-[#8A5D65] transition-colors"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              </div>

              {/* Linhas de Valores */}
              <div className="space-y-1.5 text-xs text-[#5C5552]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Desconto ({couponCode})</span>
                    <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#EAE3DE] text-sm font-bold text-[#2A2626]">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Botão de Finalizar */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full bg-[#8A5D65] hover:bg-[#724a51] text-white py-3.5 px-4 rounded-xs text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
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
