import React, { useState } from 'react';
import { Phone, Mail, MapPin, CreditCard, ShieldCheck, Lock, Send, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setTimeout(() => {
        setNewsletterSuccess(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  return (
    <footer className="w-full bg-[#18181B] text-gray-300 border-t border-gray-800">
      {/* Faixa de Newsletter com Cupom de Desconto */}
      <div className="w-full bg-gradient-to-r from-pink-900 via-pink-800 to-rose-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-pink-700/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1 max-w-lg">
            <span className="bg-yellow-400 text-pink-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              CUPOM EXCLUSIVO
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Receba novidades e ganhe 10% OFF
            </h3>
            <p className="text-xs text-pink-100/90 font-normal">
              Cadastre seu e-mail e receba em primeira mão lançamentos, provadores e promoções relâmpago.
            </p>
          </div>

          <form onSubmit={handleNewsletter} className="w-full md:w-auto flex flex-col sm:flex-row gap-2 max-w-md">
            <div className="relative flex-1">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Digite seu melhor e-mail"
                className="w-full bg-white/10 text-white placeholder-pink-200 text-xs sm:text-sm px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="bg-white hover:bg-pink-100 text-pink-700 font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              {newsletterSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Inscrita!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Cadastrar</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Conteúdo Principal do Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          
          {/* Coluna 1: Sobre a Loja & Redes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight text-white">
                {settings.storeName || 'EMVI'}
              </span>
              <span className="bg-pink-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                STORE
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-normal">
              {settings.storeSlogan}. Moda feminina feita para valorizar você com elegância, atitude e versatilidade em cada detalhe.
            </p>
            <div className="pt-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Acompanhe nas redes:
              </p>
              <div className="flex items-center space-x-2.5">
                <a
                  href={settings.instagram || 'https://instagram.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-pink-600 flex items-center justify-center text-white transition-all shadow-xs"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                <a
                  href={`https://wa.me/55${settings.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-emerald-600 flex items-center justify-center text-white transition-all shadow-xs"
                  title="WhatsApp"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Coluna 2: Categorias Principais */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-white">
              Compre por Categoria
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Vestidos' })} className="hover:text-pink-400 transition-colors">
                  Vestidos & Macacões
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Blusas' })} className="hover:text-pink-400 transition-colors">
                  Blusas & T-shirts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Calças' })} className="hover:text-pink-400 transition-colors">
                  Calças Jeans Modeladoras
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Cropped' })} className="hover:text-pink-400 transition-colors">
                  Croppeds & Bodys
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Conjuntos' })} className="hover:text-pink-400 transition-colors">
                  Conjuntos & Alfaiataria
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Lançamentos' })} className="text-pink-400 hover:text-pink-300 font-bold transition-colors">
                  ✦ Ver Lançamentos
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Institucional & Dúvidas */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-white">
              Ajuda & Suporte
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('catalog')}>
                Como Comprar
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('catalog')}>
                Trocas e Devoluções Grátis
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('catalog')}>
                Prazos e Entregas
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('catalog')}>
                Tabela de Medidas
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('catalog')}>
                Política de Privacidade
              </li>
            </ul>
          </div>

          {/* Coluna 4: Central de Atendimento */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-white">
              Central de Atendimento
            </h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <a
                href={`https://wa.me/55${settings.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-start space-x-2 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>WhatsApp: <strong className="text-white">{settings.phone}</strong></span>
              </a>
              <div className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="pt-2 text-[11px] text-gray-400 bg-gray-900/60 p-2.5 rounded-lg border border-gray-800">
                <strong className="text-gray-300 block mb-0.5">Horário de Atendimento:</strong>
                {settings.businessHours}
              </div>
            </div>
          </div>
        </div>

        {/* Selos de Pagamento e Segurança */}
        <div className="py-8 flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-gray-800">
          {/* Bandeiras de Pagamento */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Formas de Pagamento:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-gray-800 border border-gray-700 px-2.5 py-1 rounded text-xs font-black text-white">
                VISA
              </span>
              <span className="bg-gray-800 border border-gray-700 px-2.5 py-1 rounded text-xs font-black text-white">
                MASTERCARD
              </span>
              <span className="bg-gray-800 border border-gray-700 px-2.5 py-1 rounded text-xs font-black text-white">
                ELO
              </span>
              <span className="bg-gray-800 border border-gray-700 px-2.5 py-1 rounded text-xs font-black text-white">
                HIPERCARD
              </span>
              <span className="bg-emerald-900/80 border border-emerald-600 px-3 py-1 rounded text-xs font-black text-emerald-400 flex items-center gap-1">
                ⚡ PIX (-5%)
              </span>
              <span className="bg-gray-800 border border-gray-700 px-2.5 py-1 rounded text-xs font-bold text-gray-300">
                BOLETO
              </span>
            </div>
          </div>

          {/* Selos de Segurança */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-gray-400 uppercase leading-none">Ambiente Seguro</span>
                <span className="text-[10px] font-black text-emerald-400 leading-none mt-0.5">SSL 256 BITS</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-gray-400 uppercase leading-none">Google Safe</span>
                <span className="text-[10px] font-black text-blue-400 leading-none mt-0.5">SITE PROTEGIDO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé Direitos Autorais */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-gray-400">
          <p>
            © {new Date().getFullYear()} {settings.storeName}. Todos os direitos reservados. CNPJ: 52.876.019/0001-90.
          </p>
          <p className="text-gray-400">
            Preços e condições de pagamento exclusivos para compras realizadas no site.
          </p>
        </div>
      </div>
    </footer>
  );
};

