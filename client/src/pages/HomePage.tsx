import React from 'react';
import { IProduct, ICategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, Truck, RefreshCw, CreditCard, ArrowRight } from 'lucide-react';
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

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Editorial */}
      <section className="relative w-full bg-[#EADFD9] overflow-hidden min-h-[500px] lg:min-h-[620px] flex items-center">
        {/* Imagem de Fundo com Modelos Elegantes */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=85"
            alt="Coleção Feminina Emvi Store"
            className="w-full h-full object-cover object-[center_25%] opacity-90 filter brightness-[0.96]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>

        {/* Conteúdo Textual do Banner */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-xl text-white space-y-5">
            <span className="inline-block text-[11px] font-semibold tracking-[0.3em] uppercase bg-[#8A5D65]/90 text-white px-3 py-1 rounded-xs backdrop-blur-xs">
              COLEÇÃO OUTONO / INVERNO
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-wide leading-tight text-[#FAF7F5]">
              {settings.storeSlogan}
            </h1>
            <p className="text-sm sm:text-base text-[#E2D8D4] leading-relaxed font-light">
              Descubra alfaiatarias impecáveis, tecidos nobres e silhuetas que celebram a sua essência. Peças exclusivas criadas para mulheres autênticas.
            </p>
            <div className="pt-3 flex items-center gap-4">
              <button
                onClick={() => onNavigate('catalog')}
                className="bg-[#FAF7F5] hover:bg-[#8A5D65] text-[#2A2626] hover:text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 rounded-xs shadow-lg flex items-center gap-2"
              >
                <span>Ver Lançamentos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Faixa de Benefícios Exclusivos */}
      <section className="w-full bg-[#FAF7F5] border-b border-[#EAE3DE] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3 text-[#2A2626]">
              <CreditCard className="w-5 h-5 text-[#8A5D65]" />
              <span className="text-xs tracking-wider uppercase font-medium">
                Até 6x sem juros no cartão de crédito
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-[#2A2626] md:border-x border-[#EAE3DE]">
              <Truck className="w-5 h-5 text-[#8A5D65]" />
              <span className="text-xs tracking-wider uppercase font-medium">
                Frete grátis em compras acima de R$ {settings.freeShippingThreshold.toFixed(0)}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-[#2A2626]">
              <RefreshCw className="w-5 h-5 text-[#8A5D65]" />
              <span className="text-xs tracking-wider uppercase font-medium">
                Primeira troca totalmente grátis
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Compre por Categoria */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#8A5D65]">
            Navegue por Estilo
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#2A2626] mt-1 tracking-wider">
            Compre por Categoria
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id || cat.slug}
              onClick={() => onNavigate('catalog', { category: cat.name })}
              className="group cursor-pointer flex flex-col items-center text-center space-y-2.5"
            >
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#EAE3DE] group-hover:border-[#8A5D65] transition-all duration-500 shadow-xs">
                <img
                  src={
                    cat.image ||
                    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300'
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#2A2626] group-hover:text-[#8A5D65] transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Seção Mais Vendidos do Mês */}
      <section className="w-full bg-[#FAF7F5] py-16 border-t border-[#EAE3DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#8A5D65]">
                Destaques da Temporada
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#2A2626] tracking-wider mt-1">
                Mais Vendidos do Mês
              </h2>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="text-xs uppercase tracking-widest text-[#8A5D65] hover:text-[#58333b] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Ver Todos os Produtos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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

      {/* Banner de Newsletter */}
      <section className="w-full bg-[#F5EFEB] py-16 border-t border-[#EAE3DE]">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
          <Sparkles className="w-6 h-6 text-[#8A5D65] mx-auto" />
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#2A2626] tracking-wider">
            Fique por dentro do mundo {settings.storeName}
          </h2>
          <p className="text-xs text-[#7A706E] max-w-md mx-auto leading-relaxed">
            Inscreva-se em nossa newsletter para receber convites exclusivos para lançamentos, notícias sobre tendências e 10% de desconto na primeira compra.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Obrigada por se inscrever! Utilize o cupom BEMVINDA10 em sua primeira compra.');
            }}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
          >
            <input
              type="email"
              required
              placeholder="Seu melhor e-mail"
              className="flex-1 bg-white text-xs px-4 py-3 rounded-xs border border-[#D8CECA] focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
            />
            <button
              type="submit"
              className="bg-[#2A2626] hover:bg-[#8A5D65] text-white text-xs px-6 py-3 rounded-xs font-semibold uppercase tracking-widest transition-colors"
            >
              Inscrever
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
