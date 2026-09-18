import React, { useState } from 'react';
import { IProduct, IColor } from '../types';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { api } from '../services/api';
import { Star, Truck, ShieldCheck, Heart, Share2, Check, ArrowLeft } from 'lucide-react';

interface ProductDetailPageProps {
  product: IProduct;
  relatedProducts: IProduct[];
  onSelectProduct: (product: IProduct) => void;
  onNavigate: (page: string, params?: any) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  relatedProducts,
  onSelectProduct,
  onNavigate,
}) => {
  const { addToCart } = useCart();
  const { settings } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'P');
  const [selectedColor, setSelectedColor] = useState<IColor>(
    product.colors?.[0] || { name: 'Padrão', hex: '#000000' }
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  // Simulação de frete
  const [cep, setCep] = useState<string>('');
  const [shippingLoading, setShippingLoading] = useState<boolean>(false);
  const [shippingResult, setShippingResult] = useState<any>(null);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800'];

  const installmentVal = (product.salePrice / 6).toFixed(2);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cep || cep.replace(/\D/g, '').length < 8) return;

    setShippingLoading(true);
    try {
      const res = await api.calculateShipping(cep, product.salePrice * quantity);
      setShippingResult(res);
    } catch {
      alert('Não foi possível calcular o frete para este CEP.');
    } finally {
      setShippingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb & Voltar */}
      <div className="flex items-center gap-2 text-xs text-[#7A706E] mb-6">
        <button
          onClick={() => onNavigate('catalog')}
          className="hover:text-black flex items-center gap-1 font-medium text-[#8A5D65]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Catálogo</span>
        </button>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="text-[#2A2626] font-semibold">{product.name}</span>
      </div>

      {/* Grid Principal do Produto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Coluna Esquerda: Miniaturas e Imagem Principal */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Miniaturas Verticais */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto no-scrollbar shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-26 rounded-xs overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-[#8A5D65]' : 'border-[#EAE3DE] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}

          {/* Imagem Principal em Destaque */}
          <div className="flex-1 bg-[#F2ECE8] rounded-xs overflow-hidden aspect-[3/4] max-h-[640px] relative">
            <img
              src={images[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 bg-[#2A2626] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-xs">
                Coleção Exclusiva
              </span>
            )}
          </div>
        </div>

        {/* Coluna Direita: Detalhes, Variações e Ações */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8A5D65]">
              {product.category} • SKU: {product.sku}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#2A2626] font-light mt-1 tracking-wide">
              {product.name}
            </h1>

            {/* Avaliações em Estrelas */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <span className="text-xs text-[#7A706E]">(4.9 • 28 avaliações de clientes)</span>
            </div>
          </div>

          {/* Preço */}
          <div className="border-y border-[#EAE3DE] py-4">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-semibold text-[#2A2626]">
                R$ {product.salePrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-xs text-[#7A706E] mt-1">
              ou <strong className="text-[#2A2626]">6x de R$ {installmentVal.replace('.', ',')}</strong> sem juros no cartão de crédito
            </p>
          </div>

          {/* Descrição */}
          <p className="text-xs sm:text-sm text-[#5C5552] leading-relaxed">
            {product.description ||
              'Peça elaborada com acabamento de alta qualidade, caimento refinado e costuras reforçadas. Desenvolvida para valorizar a silhueta com extremo conforto e elegância.'}
          </p>

          {/* Seleção de Cores */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#2A2626]">
                Cor: <span className="font-normal text-[#7A706E]">{selectedColor.name}</span>
              </span>
              <div className="flex items-center gap-3">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                      selectedColor.name === color.name
                        ? 'border-[#8A5D65] ring-2 ring-[#8A5D65]/30'
                        : 'border-[#D8CECA] hover:scale-110'
                    }`}
                    title={color.name}
                  >
                    <span
                      className="w-full h-full rounded-full block"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Seleção de Tamanhos */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="uppercase tracking-wider font-semibold text-[#2A2626]">
                  Tamanho: <span className="font-normal text-[#7A706E]">{selectedSize}</span>
                </span>
                <span className="text-[#8A5D65] hover:underline cursor-pointer">
                  Guia de Medidas
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-11 h-11 text-xs font-semibold uppercase tracking-wider rounded-xs border transition-all flex items-center justify-center ${
                      selectedSize === sz
                        ? 'bg-[#2A2626] text-white border-[#2A2626]'
                        : 'bg-white text-[#2A2626] border-[#D8CECA] hover:border-[#8A5D65]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantidade e Botão de Adicionar à Sacola */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Seletor de Quantidade */}
              <div className="flex items-center border border-[#D8CECA] rounded-xs bg-white px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-3 text-[#5C5552] hover:text-black font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-semibold text-[#2A2626]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-3 text-[#5C5552] hover:text-black font-bold"
                >
                  +
                </button>
              </div>

              {/* Botão de Compra */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-xs text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                  addedAnimation
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#8A5D65] hover:bg-[#724a51] text-white'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Adicionado à Sacola!</span>
                  </>
                ) : (
                  <span>Adicionar ao Carrinho</span>
                )}
              </button>
            </div>
          </div>

          {/* Simulador de Frete por CEP */}
          <div className="border border-[#EAE3DE] bg-[#FAF7F5] p-4 rounded-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2A2626]">
              <Truck className="w-4 h-4 text-[#8A5D65]" />
              <span>Calcular Frete e Prazos</span>
            </div>
            <form onSubmit={handleCalculateShipping} className="flex gap-2">
              <input
                type="text"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                maxLength={9}
                className="flex-1 bg-white border border-[#D8CECA] text-xs px-3 py-2 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
              />
              <button
                type="submit"
                disabled={shippingLoading}
                className="bg-[#2A2626] text-white text-xs px-4 py-2 rounded-xs uppercase tracking-wider hover:bg-[#8A5D65] transition-colors disabled:opacity-50"
              >
                {shippingLoading ? 'Calculando...' : 'Calcular'}
              </button>
            </form>

            {shippingResult && (
              <div className="mt-2 space-y-2 pt-2 border-t border-[#EAE3DE] text-xs">
                {shippingResult.address && (
                  <p className="text-[#5C5552] text-[11px]">
                    Destino: {shippingResult.address.street}, {shippingResult.address.city} - {shippingResult.address.state}
                  </p>
                )}
                {shippingResult.options.map((opt: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-[#2A2626]">
                    <span>{opt.name} ({opt.estimatedDays} dias úteis)</span>
                    <span className="font-semibold">
                      {opt.isFree ? (
                        <span className="text-emerald-700 font-bold uppercase">Grátis</span>
                      ) : (
                        `R$ ${opt.price.toFixed(2).replace('.', ',')}`
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avaliações de Clientes */}
      <section className="mt-16 pt-12 border-t border-[#EAE3DE]">
        <h3 className="font-serif text-xl sm:text-2xl text-[#2A2626] tracking-wider mb-6">
          Avaliações das Clientes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FAF7F5] p-5 rounded-xs border border-[#EAE3DE] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#2A2626]">Mariana S.</span>
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-[#5C5552] leading-relaxed">
              "Vestido maravilhoso! O tecido é de uma qualidade incrível, cai perfeitamente no corpo. Comprei o tamanho M e serviu certinho."
            </p>
          </div>

          <div className="bg-[#FAF7F5] p-5 rounded-xs border border-[#EAE3DE] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#2A2626]">Beatriz L.</span>
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-[#5C5552] leading-relaxed">
              "Lindo demais! A cor é exatamente como na foto do site. Demorou só 3 dias para entregar, mas valeu muito a pena."
            </p>
          </div>
        </div>
      </section>

      {/* Quem viu, comprou também */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#EAE3DE]">
          <h3 className="font-serif text-xl sm:text-2xl text-[#2A2626] tracking-wider mb-8">
            Quem viu, comprou também
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard
                key={rel._id}
                product={rel}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
