import React, { useState, useMemo } from 'react';
import { IProduct, ICategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

interface CatalogPageProps {
  products: IProduct[];
  categories: ICategory[];
  initialCategory?: string;
  initialSearch?: string;
  onSelectProduct: (product: IProduct) => void;
  onNavigate: (page: string, params?: any) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  categories,
  initialCategory = 'Todos',
  initialSearch = '',
  onSelectProduct,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const availableSizes = ['P', 'M', 'G', 'GG'];
  const availableColors = [
    { name: 'Rose', hex: '#D2A59F' },
    { name: 'Branco/Off', hex: '#F8F6F0' },
    { name: 'Preto', hex: '#1C1C1C' },
    { name: 'Nude/Caramelo', hex: '#C68B59' },
  ];

  // Filtros aplicados em memória
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Categoria
      if (selectedCategory !== 'Todos' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Busca
      if (initialSearch) {
        const searchLower = initialSearch.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower);
        if (!matches) return false;
      }
      // Tamanho
      if (selectedSize && (!p.sizes || !p.sizes.includes(selectedSize))) {
        return false;
      }
      // Cor
      if (selectedColor && (!p.colors || !p.colors.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase())))) {
        return false;
      }
      // Preço Máximo
      if (p.salePrice > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.salePrice - b.salePrice;
      if (sortBy === 'price_desc') return b.salePrice - a.salePrice;
      if (sortBy === 'best_sellers') return b.salesCount - a.salesCount;
      return 0;
    });
  }, [products, selectedCategory, initialSearch, selectedSize, selectedColor, maxPrice, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('Todos');
    setSelectedSize('');
    setSelectedColor('');
    setMaxPrice(500);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb e Título */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EAE3DE] gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#968986] flex items-center gap-1.5 mb-1">
            <span onClick={() => onNavigate('home')} className="hover:underline cursor-pointer">
              Home
            </span>
            <span>/</span>
            <span className="text-[#2A2626] font-medium">{selectedCategory}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#2A2626] font-light tracking-wide">
            {selectedCategory === 'Todos' ? 'Todas as Peças' : selectedCategory}
          </h1>
          <p className="text-xs text-[#7A706E] mt-0.5">
            Exibindo {filteredProducts.length} itens elegantes
          </p>
        </div>

        {/* Botão de Filtro Mobile & Ordenação Desktop */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 bg-[#F2ECE8] text-[#2A2626] text-xs font-medium px-4 py-2 rounded-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7A706E] hidden sm:inline">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#D8CECA] text-xs py-2 px-3 rounded-xs text-[#2A2626] focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
            >
              <option value="featured">Destaques</option>
              <option value="best_sellers">Mais Vendidos</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
        {/* Barra Lateral de Filtros (Desktop) */}
        <aside className="hidden md:block space-y-8 pr-4 border-r border-[#EAE3DE]">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DE]">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#2A2626]">
              Filtros
            </h3>
            {(selectedCategory !== 'Todos' || selectedSize || selectedColor || maxPrice < 500) && (
              <button
                onClick={clearFilters}
                className="text-[11px] text-[#8A5D65] hover:underline font-medium"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Categorias */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#5C5552]">
              Categorias
            </h4>
            <div className="space-y-1.5 text-xs text-[#5C5552]">
              <button
                onClick={() => setSelectedCategory('Todos')}
                className={`block w-full text-left py-1 transition-colors ${
                  selectedCategory === 'Todos' ? 'text-[#8A5D65] font-semibold' : 'hover:text-black'
                }`}
              >
                Todos os Produtos
              </button>
              {categories.map((c) => (
                <button
                  key={c._id || c.slug}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`block w-full text-left py-1 transition-colors ${
                    selectedCategory.toLowerCase() === c.name.toLowerCase()
                      ? 'text-[#8A5D65] font-semibold'
                      : 'hover:text-black'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tamanhos */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#5C5552]">
              Tamanho
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  className={`w-9 h-9 rounded-xs text-xs font-medium border transition-all flex items-center justify-center ${
                    selectedSize === sz
                      ? 'border-[#8A5D65] bg-[#8A5D65] text-white'
                      : 'border-[#D8CECA] bg-white text-[#2A2626] hover:border-[#8A5D65]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Cores */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#5C5552]">
              Cores Principais
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(selectedColor === col.name ? '' : col.name)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-xs text-[11px] transition-all ${
                    selectedColor === col.name
                      ? 'border-[#8A5D65] bg-[#FAF3F2] font-semibold'
                      : 'border-[#D8CECA] bg-white hover:border-[#8A5D65]'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/15"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Faixa de Preço */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[11px] uppercase tracking-wider font-semibold text-[#5C5552]">
              <span>Até:</span>
              <span className="text-[#8A5D65] font-bold">R$ {maxPrice}</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#8A5D65] cursor-pointer"
            />
          </div>
        </aside>

        {/* Grade de Produtos */}
        <main className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-[#7A706E] space-y-3">
              <p className="text-sm font-medium text-[#2A2626]">
                Nenhum produto encontrado com os filtros selecionados.
              </p>
              <button
                onClick={clearFilters}
                className="bg-[#2A2626] text-white text-xs px-5 py-2.5 rounded-xs uppercase tracking-wider hover:bg-[#8A5D65] transition-colors"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod._id}
                  product={prod}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Drawer de Filtros Mobile */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE3DE]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2A2626]">
                Filtros
              </h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-[#7A706E]" />
              </button>
            </div>

            {/* Categorias Mobile */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-[#5C5552]">Categoria</h4>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-[#D8CECA] p-2 text-xs rounded-xs"
              >
                <option value="Todos">Todas as Categorias</option>
                {categories.map((c) => (
                  <option key={c._id || c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tamanhos Mobile */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-[#5C5552]">Tamanho</h4>
              <div className="flex gap-2">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                    className={`w-9 h-9 rounded-xs text-xs font-medium border ${
                      selectedSize === sz ? 'bg-[#8A5D65] text-white' : 'border-[#D8CECA]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-[#8A5D65] text-white py-3 rounded-xs text-xs font-semibold uppercase tracking-wider"
            >
              Ver Resultados ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
