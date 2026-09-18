import React from 'react';
import { IProduct } from '../types';
import { ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: IProduct;
  onSelect: (product: IProduct) => void;
  onQuickAdd?: (product: IProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onQuickAdd }) => {
  const installmentValue = (product.salePrice / 6).toFixed(2);
  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80';
  const hoverImage = product.images[1] || primaryImage;

  return (
    <div className="group flex flex-col bg-transparent transition-all duration-300">
      {/* Imagem do Produto com Proporção Editorial */}
      <div
        onClick={() => onSelect(product)}
        className="relative w-full aspect-[3/4] overflow-hidden bg-[#F2ECE8] rounded-sm cursor-pointer"
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges de Destaque */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="bg-[#2A2626] text-[#FAF7F5] text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-xs">
              Destaque
            </span>
          )}
          {product.salesCount > 50 && (
            <span className="bg-[#8A5D65] text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-xs">
              Mais Vendido
            </span>
          )}
        </div>

        {/* Botão Hover de Compra Rápida */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex-1 bg-white/95 text-[#2A2626] py-2.5 px-3 rounded-xs text-xs uppercase tracking-wider font-medium hover:bg-[#8A5D65] hover:text-white transition-all shadow-md flex items-center justify-center gap-1.5 backdrop-blur-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Detalhes</span>
          </button>
        </div>
      </div>

      {/* Informações do Produto */}
      <div className="pt-3 pb-2 flex flex-col flex-grow">
        {/* Variações de Cores */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center space-x-1.5 mb-1.5">
            {product.colors.map((color, idx) => (
              <span
                key={idx}
                title={color.name}
                className="w-3 h-3 rounded-full border border-black/15"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        )}

        {/* Categoria / SKU */}
        <span className="text-[10px] uppercase tracking-widest text-[#968986]">
          {product.category}
        </span>

        {/* Título */}
        <h4
          onClick={() => onSelect(product)}
          className="text-xs sm:text-sm font-normal text-[#2A2626] hover:text-[#8A5D65] transition-colors cursor-pointer mt-0.5 line-clamp-1"
        >
          {product.name}
        </h4>

        {/* Preço e Parcelas */}
        <div className="mt-1 flex flex-col">
          <span className="text-sm sm:text-base font-semibold text-[#2A2626]">
            R$ {product.salePrice.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[11px] text-[#7A706E]">
            ou 6x de R$ {installmentValue.replace('.', ',')} sem juros
          </span>
        </div>
      </div>
    </div>
  );
};
