import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Store,
  CreditCard,
  Truck,
  Shield,
  Save,
  CheckCircle,
  Phone,
  Image,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, reloadSettings } = useStore();
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'store' | 'payment' | 'shipping' | 'admin'>('store');

  // Loja
  const [storeName, setStoreName] = useState(settings.storeName || 'Emvi Store');
  const [storeSlogan, setStoreSlogan] = useState(settings.storeSlogan || '');
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [phone, setPhone] = useState(settings.phone || '51 9399-7784');
  const [instagram, setInstagram] = useState(settings.instagram || 'https://www.instagram.com/emvistore_?stkn=YjR6ZmJma2JsenV2');
  const [email, setEmail] = useState(settings.email || 'contato@emvistore.com.br');
  const [address, setAddress] = useState(settings.address || 'Av. Paulista, 1000 - SP');
  const [businessHours, setBusinessHours] = useState(settings.businessHours || '');

  // Frete
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(String(settings.freeShippingThreshold || 299));
  const [defaultShippingRate, setDefaultShippingRate] = useState(String(settings.defaultShippingRate || 24.9));

  // Pagamento
  const [paymentProvider, setPaymentProvider] = useState(settings.paymentProvider || 'mercadopago');
  const [paymentPublicKey, setPaymentPublicKey] = useState(settings.paymentPublicKey || '');
  const [paymentSecretKey, setPaymentSecretKey] = useState(settings.paymentSecretKey || '');
  const [paymentSandbox, setPaymentSandbox] = useState(settings.paymentSandbox ?? true);

  // Perfil Admin
  const [adminUsername, setAdminUsername] = useState(user?.username || '1');
  const [adminName, setAdminName] = useState(user?.name || 'Administrador Principal');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sincroniza dados administrativos completos
  useEffect(() => {
    const fetchAdminSettings = async () => {
      try {
        const fullSettings = await api.getAdminSettings();
        setStoreName(fullSettings.storeName || 'Emvi Store');
        setStoreSlogan(fullSettings.storeSlogan || '');
        setLogoUrl(fullSettings.logoUrl || '');
        setPhone(fullSettings.phone || '51 9399-7784');
        setInstagram(fullSettings.instagram || 'https://www.instagram.com/emvistore_?stkn=YjR6ZmJma2JsenV2');
        setEmail(fullSettings.email || '');
        setAddress(fullSettings.address || '');
        setBusinessHours(fullSettings.businessHours || '');
        setFreeShippingThreshold(String(fullSettings.freeShippingThreshold || 299));
        setDefaultShippingRate(String(fullSettings.defaultShippingRate || 24.9));
        setPaymentProvider(fullSettings.paymentProvider || 'mercadopago');
        setPaymentPublicKey(fullSettings.paymentPublicKey || '');
        setPaymentSecretKey(fullSettings.paymentSecretKey || '');
        setPaymentSandbox(fullSettings.paymentSandbox ?? true);
      } catch (err) {
        console.error('Erro ao buscar configurações completas:', err);
      }
    };
    fetchAdminSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSavedSuccess(false);

    try {
      // Salva configurações da loja / pagamento / frete
      await api.updateSettings({
        storeName,
        storeSlogan,
        logoUrl,
        phone,
        instagram,
        email,
        address,
        businessHours,
        freeShippingThreshold: Number(freeShippingThreshold),
        defaultShippingRate: Number(defaultShippingRate),
        paymentProvider,
        paymentPublicKey,
        paymentSecretKey,
        paymentSandbox,
      });

      // Se estiver na aba admin e alterou dados de acesso
      if (activeTab === 'admin') {
        if (newPassword) {
          if (newPassword !== confirmPassword) {
            throw new Error('A nova senha e a confirmação não coincidem.');
          }
        }
        const profileRes = await api.updateProfile({
          username: adminUsername,
          name: adminName,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        });
        updateUser(profileRes.user);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

      await reloadSettings();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar configurações.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#2A2626] tracking-wide">
          Configurações da Loja
        </h1>
        <p className="text-xs text-[#7A706E] mt-0.5">
          Personalize a identidade da marca, credenciais de pagamento, frete e acesso do funcionário.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xs text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Configurações atualizadas com sucesso! As alterações já estão em vigor na loja.</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xs text-xs">
          {errorMsg}
        </div>
      )}

      {/* Abas */}
      <div className="flex border-b border-[#EAE3DE] space-x-6 text-xs font-semibold uppercase tracking-wider text-[#7A706E]">
        <button
          onClick={() => setActiveTab('store')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'store'
              ? 'border-[#8A5D65] text-[#8A5D65]'
              : 'border-transparent hover:text-black'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Identidade da Loja</span>
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'payment'
              ? 'border-[#8A5D65] text-[#8A5D65]'
              : 'border-transparent hover:text-black'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Gateway de Pagamento</span>
        </button>

        <button
          onClick={() => setActiveTab('shipping')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'shipping'
              ? 'border-[#8A5D65] text-[#8A5D65]'
              : 'border-transparent hover:text-black'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Regras de Frete</span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'admin'
              ? 'border-[#8A5D65] text-[#8A5D65]'
              : 'border-transparent hover:text-black'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Acesso do Administrador</span>
        </button>
      </div>

      {/* Formulário Principal */}
      <form onSubmit={handleSaveSettings} className="bg-white border border-[#EAE3DE] p-6 rounded-xs shadow-2xs space-y-6">
        {/* Aba 1: Identidade da Loja */}
        {activeTab === 'store' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-sm text-[#2A2626] border-b border-[#EAE3DE] pb-2">
              Informações da Loja e Contatos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#5C5552] mb-1 font-medium">Nome da Loja *</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div>
                <label className="block text-[#5C5552] mb-1 font-medium">Slogan da Loja</label>
                <input
                  type="text"
                  value={storeSlogan}
                  onChange={(e) => setStoreSlogan(e.target.value)}
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div>
                <label className="block text-[#5C5552] mb-1 font-medium">WhatsApp / Telefone da Loja *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="51 9399-7784"
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div>
                <label className="block text-[#5C5552] mb-1 font-medium">Instagram Oficial *</label>
                <input
                  type="text"
                  required
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://www.instagram.com/emvistore_?stkn=YjR6ZmJma2JsenV2"
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div>
                <label className="block text-[#5C5552] mb-1 font-medium">E-mail de Contato *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div>
                <label className="block text-[#5C5552] mb-1 font-medium">Endereço da Loja</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#5C5552] mb-1 font-medium">URL do Logotipo da Loja</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://exemplo.com/logo-emvi.png ou deixe vazio para usar o logo tipográfico refinado"
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
                <p className="text-[11px] text-[#7A706E] mt-1">
                  Se você não tiver uma imagem, o sistema exibirá automaticamente a tipografia elegante de alta costura com o nome da loja.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Aba 2: Gateway de Pagamento */}
        {activeTab === 'payment' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-sm text-[#2A2626] border-b border-[#EAE3DE] pb-2">
              Cobrança de Pagamentos (Cartão de Crédito / Pix / Boleto)
            </h3>
            <p className="text-[#7A706E]">
              Insira as chaves fornecidas pelo seu provedor de pagamento para que os pagamentos com cartão de crédito e PIX caiam diretamente na sua conta da loja.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[#5C5552] mb-1 font-medium">Provedor de Pagamento</label>
                <select
                  value={paymentProvider}
                  onChange={(e) => setPaymentProvider(e.target.value)}
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                >
                  <option value="mercadopago">Mercado Pago</option>
                  <option value="asaas">Asaas Pagamentos</option>
                  <option value="stripe">Stripe</option>
                  <option value="simulated">Ambiente Simulado / Demonstração</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSandbox}
                    onChange={(e) => setPaymentSandbox(e.target.checked)}
                    className="accent-[#8A5D65] w-4 h-4"
                  />
                  <span className="text-[#2A2626] font-medium">
                    Modo Teste / Sandbox Ativado
                  </span>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#5C5552] mb-1 font-medium">
                  Chave Pública (Public Key)
                </label>
                <input
                  type="text"
                  value={paymentPublicKey}
                  onChange={(e) => setPaymentPublicKey(e.target.value)}
                  placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#5C5552] mb-1 font-medium">
                  Chave Secreta / Token de Acesso (Access Token)
                </label>
                <input
                  type="password"
                  value={paymentSecretKey}
                  onChange={(e) => setPaymentSecretKey(e.target.value)}
                  placeholder="APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Aba 3: Regras de Frete */}
        {activeTab === 'shipping' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-sm text-[#2A2626] border-b border-[#EAE3DE] pb-2">
              Configurações de Envio e Frete Grátis
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#5C5552] mb-1 font-medium">
                  Valor Mínimo para Frete Grátis (R$) *
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
                <p className="text-[11px] text-[#7A706E] mt-1">
                  Compras com subtotal igual ou maior que este valor ganham frete grátis automaticamente na sacola.
                </p>
              </div>

              <div>
                <label className="block text-[#5C5552] mb-1 font-medium">
                  Taxa Padrão de Frete (R$)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={defaultShippingRate}
                  onChange={(e) => setDefaultShippingRate(e.target.value)}
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Aba 4: Administrador */}
        {activeTab === 'admin' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-sm text-[#2A2626] border-b border-[#EAE3DE] pb-2">
              Credenciais do Administrador (Master)
            </h3>
            <div className="bg-[#FAF5F3] border border-[#E8DFDA] p-3 rounded-xs text-[#5C5552] space-y-1">
              <p className="font-semibold text-[#8A5D65]">Acesso Protegido:</p>
              <p className="text-[11px]">
                O administrador master inicial (login <strong>1</strong> e senha <strong>1</strong>) é protegido contra exclusão acidental, mas você pode alterar o nome de usuário e a senha a qualquer momento nos campos abaixo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[#5C5552] mb-1 font-medium">Nome do Responsável *</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div>
                <label className="block text-[#5C5552] mb-1 font-medium">Login de Acesso *</label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              <div className="sm:col-span-2 border-t border-[#EAE3DE] pt-3">
                <p className="font-semibold text-[#2A2626] mb-3">Alteração de Senha (opcional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#5C5552] mb-1 font-medium">Senha Atual</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Senha atual (ex: 1)"
                      className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2 rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5C5552] mb-1 font-medium">Nova Senha</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nova senha desejada"
                      className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2 rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5C5552] mb-1 font-medium">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2 rounded-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botão de Salvar Configurações */}
        <div className="pt-4 border-t border-[#EAE3DE] flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#8A5D65] hover:bg-[#724a51] text-white py-3 px-8 rounded-xs text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
