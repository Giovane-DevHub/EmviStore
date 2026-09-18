import React from 'react';
import { IProduct } from '../types';
import { ShoppingBag, Eye, Zap } from 'lucide-react';

interface ProductCardProps {
  product: IProduct;
  onSelect: (product: IProduct) => void;
  onQuickAdd?: (product: IProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onQuickAdd }) => {
  // Desconto de 5% no PIX
  const pixPrice = product.salePrice * 0.95;
  const installmentValue = (product.salePrice / 6).toFixed(2);
  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80';
  const hoverImage = product.images[1] || primaryImage;

  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-pink-200 hover:shadow-xl transition-all duration-300">
      {/* Imagem do Produto com Proporção Moda Feminina (3:4) */}
      <div
        onClick={() => onSelect(product)}
        className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50 cursor-pointer"
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges de Destaque & Desconto */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 fill-current" />
            5% OFF NO PIX
          </span>

          {product.isFeatured && (
            <span className="bg-pink-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              Destaque
            </span>
          )}

          {product.salesCount > 30 && (
            <span className="bg-amber-500 text-gray-900 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              Mais Vendido
            </span>
          )}
        </div>

        {/* Botão Hover no Desktop */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2.5 px-3 rounded-lg text-xs uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Comprar</span>
          </button>
        </div>
      </div>

      {/* Informações do Produto */}
      <div className="p-3.5 flex flex-col flex-grow justify-between">
        <div>
          {/* Variações de Cores */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1.5 mb-1.5">
              {product.colors.map((color, idx) => (
                <span
                  key={idx}
                  title={color.name}
                  className="w-3 h-3 rounded-full border border-gray-300 ring-1 ring-white shadow-xs"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          )}

          {/* Categoria */}
          <span className="text-[10px] uppercase tracking-wider font-bold text-pink-600">
            {product.category}
          </span>

          {/* Título */}
          <h4
            onClick={() => onSelect(product)}
            className="text-xs sm:text-sm font-semibold text-gray-800 hover:text-pink-600 transition-colors cursor-pointer mt-0.5 line-clamp-2 min-h-[36px]"
            title={product.name}
          >
            {product.name}
          </h4>
        </div>

        {/* Preço no PIX e Parcelamento */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-col">
          {/* Preço PIX com alto contraste */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-emerald-600">
              R$ {pixPrice.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              no PIX
            </span>
          </div>

          {/* Preço a Prazo */}
          <span className="text-xs text-gray-500 font-medium mt-0.5">
            ou R$ {product.salePrice.toFixed(2).replace('.', ',')} em até <strong className="text-gray-800">6x de R$ {installmentValue.replace('.', ',')}</strong> sem juros
          </span>

          {/* Botão Mobile Comprar */}
          <button
            onClick={() => onSelect(product)}
            className="mt-2.5 w-full sm:hidden bg-pink-600 active:bg-pink-700 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Comprar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

