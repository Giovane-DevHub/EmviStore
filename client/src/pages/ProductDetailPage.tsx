import React, { useState } from 'react';
import { IProduct, IColor } from '../types';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { api } from '../services/api';
import { Star, Truck, ShieldCheck, Heart, Share2, Check, ArrowLeft, Zap, MessageCircle, RefreshCw } from 'lucide-react';

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
  const { addToCart, setIsCartOpen } = useCart();
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

  const pixPrice = product.salePrice * 0.95;
  const installmentVal = (product.salePrice / 6).toFixed(2);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setIsCartOpen(true);
    }, 800);
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
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
        <button
          onClick={() => onNavigate('catalog')}
          className="hover:text-pink-600 flex items-center gap-1 text-pink-600 font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Catálogo</span>
        </button>
        <span>/</span>
        <span className="cursor-pointer hover:underline" onClick={() => onNavigate('catalog', { category: product.category })}>
          {product.category}
        </span>
        <span>/</span>
        <span className="text-gray-900 font-bold truncate max-w-xs">{product.name}</span>
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
                  className={`w-16 h-20 sm:w-20 sm:h-26 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-pink-600 ring-2 ring-pink-300' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}

          {/* Imagem Principal em Destaque */}
          <div className="flex-1 bg-gray-50 rounded-2xl overflow-hidden aspect-[3/4] max-h-[640px] relative border border-gray-100 shadow-md">
            <img
              src={images[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="bg-emerald-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" />
                5% OFF NO PIX
              </span>
              {product.isFeatured && (
                <span className="bg-pink-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-md">
                  Coleção Exclusiva
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Detalhes, Variações e Ações */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-pink-600">
              {product.category} • SKU: {product.sku}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">
              {product.name}
            </h1>

            {/* Avaliações em Estrelas */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-500">(5.0 • 42 avaliações de clientes)</span>
            </div>
          </div>

          {/* Bloco de Preço com Super Destaque PIX */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600">
                R$ {pixPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-xs font-black text-emerald-800 uppercase bg-emerald-200 px-2 py-0.5 rounded">
                no PIX
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1 font-medium">
              ou <strong>R$ {product.salePrice.toFixed(2).replace('.', ',')}</strong> em até <strong className="text-gray-900 font-bold">6x de R$ {installmentVal.replace('.', ',')} sem juros</strong> no cartão
            </p>
          </div>

          {/* Descrição */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {product.description ||
              'Peça elaborada com acabamento premium, caimento modelador impecável e tecido de alta durabilidade. Desenvolvida especialmente para valorizar o corpo feminino com conforto, beleza e segurança.'}
          </p>

          {/* Seleção de Cores */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-gray-800">
                Cor: <span className="font-normal text-gray-500">{selectedColor.name}</span>
              </span>
              <div className="flex items-center gap-3">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                      selectedColor.name === color.name
                        ? 'border-pink-600 ring-2 ring-pink-300 scale-110'
                        : 'border-gray-200 hover:scale-105'
                    }`}
                    title={color.name}
                  >
                    <span
                      className="w-full h-full rounded-full block shadow-inner"
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
                <span className="uppercase tracking-wider font-bold text-gray-800">
                  Tamanho: <span className="font-semibold text-pink-600">{selectedSize}</span>
                </span>
                <span className="text-pink-600 hover:text-pink-700 font-bold cursor-pointer">
                  Guia de Medidas
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-12 h-12 text-xs font-black uppercase tracking-wider rounded-xl border transition-all flex items-center justify-center ${
                      selectedSize === sz
                        ? 'bg-pink-600 text-white border-pink-600 shadow-md scale-105'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-pink-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantidade e Botões de Ação */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Seletor de Quantidade */}
              <div className="flex items-center border border-gray-200 rounded-xl bg-white px-2 shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-3 text-gray-500 hover:text-gray-900 font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-extrabold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-3 text-gray-500 hover:text-gray-900 font-bold"
                >
                  +
                </button>
              </div>

              {/* Botão de Compra Principal */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-lg flex items-center justify-center gap-2 transform active:scale-95 ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-pink-600 hover:bg-pink-700 text-white hover:shadow-pink-500/30'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Adicionado à Sacola!</span>
                  </>
                ) : (
                  <span>Comprar Agora</span>
                )}
              </button>
            </div>

            {/* Botão Tirar Dúvidas no WhatsApp */}
            <a
              href={`https://wa.me/55${settings.phone.replace(/\D/g, '')}?text=Olá! Gostaria de tirar dúvidas sobre o produto: ${encodeURIComponent(product.name)} (SKU: ${product.sku})`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Tirar Dúvidas no WhatsApp</span>
            </a>
          </div>

          {/* Régua de Vantagens do Produto */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl text-xs text-gray-700">
              <RefreshCw className="w-4 h-4 text-pink-600 flex-shrink-0" />
              <span>Primeira troca grátis</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl text-xs text-gray-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Garantia de 30 dias</span>
            </div>
          </div>

          {/* Simulador de Frete por CEP */}
          <div className="border border-pink-100 bg-pink-50/30 p-4 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900">
              <Truck className="w-4 h-4 text-pink-600" />
              <span>Calcular Frete e Prazos</span>
            </div>
            <form onSubmit={handleCalculateShipping} className="flex gap-2">
              <input
                type="text"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                maxLength={9}
                className="flex-1 bg-white border border-pink-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <button
                type="submit"
                disabled={shippingLoading}
                className="bg-gray-900 hover:bg-black text-white text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
              >
                {shippingLoading ? 'Calculando...' : 'Calcular'}
              </button>
            </form>

            {shippingResult && (
              <div className="mt-2 space-y-2 pt-2 border-t border-pink-100 text-xs">
                {shippingResult.address && (
                  <p className="text-gray-500 text-[11px]">
                    Destino: {shippingResult.address.street}, {shippingResult.address.city} - {shippingResult.address.state}
                  </p>
                )}
                {shippingResult.options.map((opt: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-gray-900">
                    <span>{opt.name} ({opt.estimatedDays} dias úteis)</span>
                    <span className="font-bold">
                      {opt.isFree ? (
                        <span className="text-emerald-600 font-extrabold uppercase">Grátis</span>
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
      <section className="mt-16 pt-12 border-t border-gray-100">
        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">
          Avaliações de Clientes Verificadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-pink-50/40 p-5 rounded-2xl border border-pink-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">Mariana S.</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              "Vestido maravilhoso! O tecido é de uma qualidade incrível, cai perfeitamente no corpo. Comprei o tamanho M e serviu certinho."
            </p>
          </div>

          <div className="bg-pink-50/40 p-5 rounded-2xl border border-pink-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">Beatriz L.</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              "Lindo demais! A cor é exatamente como na foto do site. Demorou só 3 dias para entregar e o cheirinho na caixa é uma delícia."
            </p>
          </div>
        </div>
      </section>

      {/* Quem viu, comprou também */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-gray-100">
          <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">
            Quem Viu Este Produto, Também Amou
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

