import React, { useState, useEffect } from 'react';
import { IProduct, ICategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { 
  Sparkles, 
  Truck, 
  RefreshCw, 
  CreditCard, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Check, 
  Copy, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HomePageProps {
  products: IProduct[];
  categories: ICategory[];
  onSelectProduct: (product: IProduct) => void;
  onNavigate: (page: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  onSelectProduct,
  onNavigate,
}) => {
  const { settings } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Banners do Carrossel Principal com fotos de alto impacto
  const heroSlides = [
    {
      badge: 'NOVA COLEÇÃO PRIMAVERA / VERÃO 2026',
      title: 'Realce Sua Beleza & Elegância',
      subtitle: 'Descubra peças leves, alfaiatarias modernas e tecidos nobres que abraçam suas curvas com conforto e estilo.',
      buttonText: 'Conferir Lançamentos',
      category: 'Lançamentos',
      bgImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=85',
      accentColor: 'from-pink-600 to-rose-700',
    },
    {
      badge: 'TENDÊNCIA MODA FEMININA',
      title: 'Vestidos & Conjuntos Apaixonantes',
      subtitle: 'Modelagens exclusivas para você arrasar em qualquer ocasião. Do trabalho ao happy hour com atitude.',
      buttonText: 'Ver Vestidos',
      category: 'Vestidos',
      bgImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&q=85',
      accentColor: 'from-purple-600 to-pink-600',
    },
    {
      badge: 'OFERTA ESPECIAL DE BOAS-VINDAS',
      title: '10% OFF Na Sua Primeira Compra',
      subtitle: 'Utilize o cupom BEMVINDA10 no checkout e garanta seu desconto com frete grátis para todo o Brasil.',
      buttonText: 'Aproveitar Cupom',
      category: 'Todos',
      bgImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=85',
      accentColor: 'from-rose-600 to-amber-600',
    },
  ];

  // Auto-play do slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('BEMVINDA10');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);
  const bestSellers = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 8);
  const newArrivals = [...products].reverse().slice(0, 8);

  // Categorias padrão para exibição circular com fotos de alta qualidade
  const circularCategories = [
    { name: 'Vestidos', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80' },
    { name: 'Blusas', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80' },
    { name: 'Calças', image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=400&q=80' },
    { name: 'Cropped', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80' },
    { name: 'Conjuntos', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80' },
    { name: 'Acessórios', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFD]">
      {/* 1. Hero Carousel de Banners com Vida e Movimento */}
      <section className="relative w-full overflow-hidden bg-gray-900 min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] flex items-center">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Foto de Fundo com visual e-commerce */}
            <img
              src={slide.bgImage}
              alt={slide.title}
              className="w-full h-full object-cover object-[center_30%] filter brightness-[0.88]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

            {/* Conteúdo Textual */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <div className="max-w-xl text-white space-y-4 py-16">
                <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase bg-pink-600 text-white px-3.5 py-1.5 rounded-full shadow-md animate-pulse-subtle">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  {slide.badge}
                </span>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-sm text-white">
                  {slide.title}
                </h1>

                <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
                  {slide.subtitle}
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onNavigate('catalog', { category: slide.category })}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 rounded-full shadow-lg hover:shadow-pink-500/30 flex items-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <span>{slide.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onNavigate('catalog')}
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs border border-white/40 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full transition-all"
                  >
                    Ver Toda a Loja
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Controles de Navegação do Slider */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition-all"
          title="Banner Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition-all"
          title="Próximo Banner"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicadores de Slide */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-pink-500' : 'w-2.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. Barra de Cupom de Boas-Vindas Interativo */}
      <section className="w-full bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border-y border-pink-200 py-3.5 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="bg-pink-600 text-white p-1.5 rounded-full">
              <Zap className="w-4 h-4 fill-white" />
            </span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900">
                Ganhe 10% DE DESCONTO na sua primeira compra!
              </p>
              <p className="text-[11px] text-gray-500">
                Aproveite o cupom exclusivo para novas clientes e parcele em até 6x sem juros.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white border-2 border-dashed border-pink-400 px-4 py-1.5 rounded-lg flex items-center gap-2 shadow-xs">
              <span className="text-xs font-black tracking-widest text-pink-600">BEMVINDA10</span>
              <button
                onClick={handleCopyCoupon}
                className="text-pink-600 hover:text-pink-800 transition-colors p-1"
                title="Copiar cupom"
              >
                {copiedCoupon ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            {copiedCoupon && (
              <span className="text-xs font-bold text-emerald-600 animate-fade-in">
                Copiado!
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 3. Régua de Benefícios em 4 Pilares (Ícones Vivos) */}
      <section className="w-full bg-white border-b border-gray-100 py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {/* Benefício 1 */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-pink-50/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-2.5 text-pink-600 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">
                Pague Parcelado
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Até 6x sem juros no cartão
              </p>
            </div>

            {/* Benefício 2 */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-pink-50/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-2.5 text-pink-600 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">
                Entrega Garantida
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Frete Grátis acima de R$ {settings.freeShippingThreshold.toFixed(0)}
              </p>
            </div>

            {/* Benefício 3 */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-pink-50/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2.5 text-emerald-600 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">
                5% OFF no PIX
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Desconto automático no pagamento
              </p>
            </div>

            {/* Benefício 4 */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-pink-50/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2.5 text-purple-600 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">
                Compra 100% Segura
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Seus dados protegidos por SSL
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Categorias em Destaque (Círculos Fotográficos Modernos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        <div className="text-center mb-9">
          <span className="text-[11px] uppercase tracking-[0.25em] font-black text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
            Navegue Por Categoria
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">
            Encontre o Seu Estilo Perfeito
          </h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6">
          {circularCategories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('catalog', { category: cat.name })}
              className="group cursor-pointer flex flex-col items-center text-center space-y-2.5"
            >
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 border-pink-200 group-hover:border-pink-600 transition-all duration-300 shadow-md group-hover:shadow-pink-400/30">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-pink-600 transition-colors uppercase tracking-wider">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Vitrine: Lançamentos / Start Primavera-Verão */}
      <section className="w-full bg-white py-14 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-black text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
                NOVA COLEÇÃO
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1.5">
                Lançamentos da Semana
              </h2>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="text-xs uppercase tracking-wider text-pink-600 hover:text-pink-800 font-extrabold flex items-center gap-1.5 bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-full transition-all"
            >
              <span>Ver Todos os Lançamentos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Banner Promocional Duplo (Estilo Empoderada) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Jeans Modeladoras */}
          <div
            onClick={() => onNavigate('catalog', { category: 'Calças' })}
            className="relative h-64 sm:h-80 rounded-2xl overflow-hidden cursor-pointer group shadow-md"
          >
            <img
              src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80"
              alt="Coleção Jeans Modeladora"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="bg-pink-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded">
                COLEÇÃO JEANS
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Calças Modeladoras & Wide Leg
              </h3>
              <p className="text-xs text-gray-200">
                Efeito empina bumbum e caimento sob medida para o seu corpo.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-300 group-hover:text-white uppercase tracking-wider">
                  Ver Coleção Jeans <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Banner 2: Vestidos & Tendências */}
          <div
            onClick={() => onNavigate('catalog', { category: 'Vestidos' })}
            className="relative h-64 sm:h-80 rounded-2xl overflow-hidden cursor-pointer group shadow-md"
          >
            <img
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80"
              alt="Vestidos e Conjuntos Elegantes"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded">
                VESTIDOS & CONJUNTOS
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Fluidez, Cores & Sofisticação
              </h3>
              <p className="text-xs text-gray-200">
                Peças exclusivas feitas para mulheres que gostam de se destacar.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-300 group-hover:text-white uppercase tracking-wider">
                  Ver Vestidos <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Vitrine: Mais Vendidos do Mês */}
      <section className="w-full bg-pink-50/40 py-14 border-t border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-black text-pink-600 bg-pink-100 px-2.5 py-1 rounded-full">
                QUERIDINHOS DAS CLIENTES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1.5">
                Mais Vendidos do Mês
              </h2>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="text-xs uppercase tracking-wider text-pink-600 hover:text-pink-800 font-extrabold flex items-center gap-1.5 bg-white border border-pink-200 hover:border-pink-400 px-4 py-2 rounded-full transition-all shadow-xs"
            >
              <span>Ver Todos os Mais Vendidos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Depoimentos das Clientes / Prova Social */}
      <section className="w-full bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] uppercase tracking-[0.25em] font-black text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
              QUEM USA AMA
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              Depoimentos de Mulheres Empoderadas
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Veja o que nossas clientes estão falando sobre o caimento, qualidade e rapidez da entrega.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-pink-50/40 p-6 rounded-2xl border border-pink-100 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                  "O vestido chegou muito antes do prazo e o caimento no corpo é simplesmente perfeito! O tecido tem uma qualidade surreal, veste muito bem e recebi vários elogios."
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-pink-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center text-xs">
                  CP
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Camila Pereira</h4>
                  <span className="text-[10px] text-gray-500">São Paulo, SP • Compra Verificada</span>
                </div>
              </div>
            </div>

            <div className="bg-pink-50/40 p-6 rounded-2xl border border-pink-100 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                  "A calça modeladora realmente cumpre o que promete! Modela a cintura e empina sem apertar. E ainda ganhei o desconto no PIX que facilitou muito."
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-pink-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
                  JS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Juliana Santos</h4>
                  <span className="text-[10px] text-gray-500">Belo Horizonte, MG • Compra Verificada</span>
                </div>
              </div>
            </div>

            <div className="bg-pink-50/40 p-6 rounded-2xl border border-pink-100 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                  "Atendimento impecável no WhatsApp tirando todas as dúvidas de tamanho. A embalagem veio cheirosa com um mimo especial. Já virei cliente fiel!"
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-pink-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                  RA
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Renata Almeida</h4>
                  <span className="text-[10px] text-gray-500">Curitiba, PR • Compra Verificada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Nosso Instagram Oficial (@emvistore) */}
      <section className="w-full bg-[#FAFAFA] py-14 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] uppercase tracking-[0.25em] font-black text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
            SIGA NO INSTAGRAM
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            @emvistoreoficial
          </h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-8">
            Acompanhe nossos provadores diários, lançamentos ao vivo e dicas de styling exclusivas.
          </p>

          {/* Grid de Fotos do Instagram */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="aspect-square rounded-xl overflow-hidden group relative cursor-pointer shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80"
                alt="Instagram look 1"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-pink-600/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm">
                <span>Ver no Insta</span>
              </div>
            </div>

            <div className="aspect-square rounded-xl overflow-hidden group relative cursor-pointer shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80"
                alt="Instagram look 2"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-pink-600/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm">
                <span>Ver no Insta</span>
              </div>
            </div>

            <div className="aspect-square rounded-xl overflow-hidden group relative cursor-pointer shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80"
                alt="Instagram look 3"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-pink-600/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm">
                <span>Ver no Insta</span>
              </div>
            </div>

            <div className="aspect-square rounded-xl overflow-hidden group relative cursor-pointer shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80"
                alt="Instagram look 4"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-pink-600/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm">
                <span>Ver no Insta</span>
              </div>
            </div>
          </div>

          <a
            href={settings.instagram || 'https://instagram.com'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>Seguir no Instagram</span>
          </a>
        </div>
      </section>

      {/* 10. Botão Flutuante do WhatsApp Comercial */}
      <a
        href={`https://wa.me/55${settings.phone.replace(/\D/g, '')}?text=Olá! Estava navegando na loja virtual e gostaria de tirar uma dúvida.`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        title="Falar no WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-emerald-500" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out font-bold text-xs pl-0 group-hover:pl-2">
          Atendimento WhatsApp
        </span>
      </a>
    </div>
  );
};

