import React from 'react';
import { Phone, Mail, MapPin, CreditCard } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useStore();

  return (
    <footer className="w-full bg-[#1C1A1A] text-[#D4C8C5] pt-16 pb-10 border-t border-[#332E2E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2E2A2A]">
          {/* Coluna 1: Sobre e Logo */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl tracking-[0.2em] text-[#F3ECE8] font-light">
              {settings.storeName.toUpperCase()}
            </h3>
            <p className="text-xs text-[#A89C99] leading-relaxed">
              {settings.storeSlogan}. Moda feminina elegante, moderna e autêntica. Vista-se com a sofisticação que você merece todos os dias.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#2E2A2A] flex items-center justify-center text-[#E2D5D1] hover:bg-[#8A5D65] hover:text-white transition-all"
                title="Instagram Oficial"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={`https://wa.me/55${settings.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#2E2A2A] flex items-center justify-center text-[#E2D5D1] hover:bg-[#8A5D65] hover:text-white transition-all"
                title="WhatsApp Loja"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Categorias */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#F3ECE8]">
              Categorias
            </h4>
            <ul className="space-y-2 text-xs text-[#A89C99]">
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Vestidos' })} className="hover:text-white transition-colors">
                  Vestidos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Blusas' })} className="hover:text-white transition-colors">
                  Blusas e Camisas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Saias' })} className="hover:text-white transition-colors">
                  Saias e Shorts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Acessórios' })} className="hover:text-white transition-colors">
                  Acessórios e Joias
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Novidades' })} className="hover:text-white transition-colors">
                  Novidades da Coleção
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Sale' })} className="text-rose-400 hover:text-rose-300 transition-colors">
                  Sale & Ofertas
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Ajuda & Suporte */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#F3ECE8]">
              Ajuda & Suporte
            </h4>
            <ul className="space-y-2 text-xs text-[#A89C99]">
              <li className="hover:text-white transition-colors cursor-pointer">Fale Conosco</li>
              <li className="hover:text-white transition-colors cursor-pointer">Trocas e Devoluções</li>
              <li className="hover:text-white transition-colors cursor-pointer">Prazos de Entrega</li>
              <li className="hover:text-white transition-colors cursor-pointer">Guia de Tamanhos</li>
              <li className="hover:text-white transition-colors cursor-pointer">Políticas de Privacidade</li>
            </ul>
          </div>

          {/* Coluna 4: Contato & Informações */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#F3ECE8]">
              Contato
            </h4>
            <div className="space-y-2.5 text-xs text-[#A89C99]">
              <div className="flex items-start space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#8A5D65] mt-0.5" />
                <span>WhatsApp: {settings.phone}</span>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#8A5D65] mt-0.5" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#8A5D65] mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="pt-2 text-[11px] text-[#7A706E]">
                {settings.businessHours}
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé Inferior */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7A706E]">
          <p>© {new Date().getFullYear()} {settings.storeName}. Todos os direitos reservados. CNPJ: 52.876.019/0001-90</p>
          
          <div className="flex items-center space-x-4">
            <span className="text-[10px] tracking-wider uppercase text-[#968986]">Pagamento Seguro:</span>
            <div className="flex items-center space-x-2 text-[10px] bg-[#292525] px-2.5 py-1 rounded text-[#D4C8C5]">
              <CreditCard className="w-3.5 h-3.5 text-[#8A5D65]" />
              <span>Cartão de Crédito</span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] bg-[#292525] px-2.5 py-1 rounded text-[#D4C8C5]">
              <span>PIX</span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] bg-[#292525] px-2.5 py-1 rounded text-[#D4C8C5]">
              <span>Boleto</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
