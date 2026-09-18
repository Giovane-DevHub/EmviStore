import React, { useState, useMemo } from 'react';
import { IProduct, ICategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, X, ArrowUpDown, Sparkles, Zap } from 'lucide-react';

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
    { name: 'Rose', hex: '#E91E63' },
    { name: 'Branco/Off', hex: '#F8F6F0' },
    { name: 'Preto', hex: '#1C1C1C' },
    { name: 'Nude/Caramelo', hex: '#C68B59' },
    { name: 'Azul', hex: '#1E88E5' },
    { name: 'Verde', hex: '#43A047' },
  ];

  // Filtros aplicados em memória
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Categoria
      if (selectedCategory !== 'Todos' && selectedCategory.toLowerCase() !== 'lançamentos' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
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
      {/* Breadcrumb e Título com Banner de Destaque */}
      <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 p-6 rounded-2xl border border-pink-100 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-pink-600 font-bold flex items-center gap-1.5 mb-1.5">
            <span onClick={() => onNavigate('home')} className="hover:underline cursor-pointer">
              Home
            </span>
            <span>/</span>
            <span className="text-gray-900">{selectedCategory}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {selectedCategory === 'Todos' ? 'Coleção Completa' : selectedCategory}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center gap-2">
            <span>Mostrando <strong>{filteredProducts.length}</strong> produtos incríveis com 5% OFF no PIX</span>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
              <Zap className="w-2.5 h-2.5 fill-current" /> PIX
            </span>
          </p>
        </div>

        {/* Botão de Filtro Mobile & Ordenação */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 bg-pink-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtrar</span>
          </button>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-pink-200 shadow-xs">
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="featured">Destaques</option>
              <option value="best_sellers">Mais Vendidos</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Barra Lateral de Filtros (Desktop) */}
        <aside className="hidden md:block space-y-6 pr-4 border-r border-gray-100">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-xs font-black tracking-wider uppercase text-gray-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-pink-600" />
              Filtros
            </h3>
            {(selectedCategory !== 'Todos' || selectedSize || selectedColor || maxPrice < 500) && (
              <button
                onClick={clearFilters}
                className="text-[11px] text-pink-600 hover:text-pink-800 font-bold"
              >
                Limpar Tudo
              </button>
            )}
          </div>

          {/* Categorias */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-800">
              Categorias
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('Todos')}
                className={`block w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${
                  selectedCategory === 'Todos' 
                    ? 'bg-pink-600 text-white font-bold shadow-xs' 
                    : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                Todos os Produtos
              </button>
              {categories.map((c) => (
                <button
                  key={c._id || c.slug}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`block w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${
                    selectedCategory.toLowerCase() === c.name.toLowerCase()
                      ? 'bg-pink-600 text-white font-bold shadow-xs'
                      : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tamanhos */}
          <div className="space-y-2.5 pt-2 border-t border-gray-100">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-800">
              Tamanho
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold border transition-all flex items-center justify-center ${
                    selectedSize === sz
                      ? 'border-pink-600 bg-pink-600 text-white shadow-xs'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-pink-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Cores */}
          <div className="space-y-2.5 pt-2 border-t border-gray-100">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-800">
              Cores
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(selectedColor === col.name ? '' : col.name)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg text-[11px] font-medium transition-all ${
                    selectedColor === col.name
                      ? 'border-pink-600 bg-pink-50 text-pink-700 font-bold shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-pink-300'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Faixa de Preço */}
          <div className="space-y-2.5 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs font-bold text-gray-800">
              <span>Preço Máximo:</span>
              <span className="text-pink-600 font-black">R$ {maxPrice}</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-pink-600 cursor-pointer"
            />
          </div>
        </aside>

        {/* Grade de Produtos */}
        <main className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 space-y-4">
              <Sparkles className="w-8 h-8 text-pink-500 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">
                Nenhum produto encontrado com os filtros atuais.
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Tente ajustar a categoria, tamanho ou faixa de preço para encontrar o que procura.
              </p>
              <button
                onClick={clearFilters}
                className="bg-pink-600 text-white text-xs px-6 py-2.5 rounded-full font-bold uppercase tracking-wider hover:bg-pink-700 transition-colors shadow-md"
              >
                Limpar Filtros
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
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">
                Filtros
              </h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-gray-500 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categorias Mobile */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-gray-800">Categoria</h4>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-pink-200 p-2.5 text-xs rounded-xl bg-gray-50 font-medium"
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
              <h4 className="text-xs font-bold uppercase text-gray-800">Tamanho</h4>
              <div className="flex gap-2">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold border ${
                      selectedSize === sz ? 'bg-pink-600 text-white border-pink-600' : 'border-gray-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-pink-600 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-pink-700"
            >
              Ver {filteredProducts.length} Produtos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

