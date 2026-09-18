import React, { createContext, useContext, useState, useEffect } from 'react';
import { IStoreSettings } from '../types';
import { api } from '../services/api';
import { applyThemeColor } from '../utils/theme';

interface StoreContextType {
  settings: IStoreSettings;
  reloadSettings: () => Promise<void>;
  previewColor: (hex: string) => void;
  isLoading: boolean;
}

const defaultSettings: IStoreSettings = {
  storeName: 'Emvi Store',
  storeSlogan: 'Sinta a leveza da sofisticação feminina',
  logoUrl: '',
  phone: '51 9399-7784',
  email: 'contato@emvistore.com.br',
  instagram: 'https://www.instagram.com/emvistore_?stkn=YjR6ZmJma2JsenV2',
  address: 'Av. Paulista, 1000 - SP',
  businessHours: 'Seg a Sex: 09h às 19h | Sáb: 09h às 14h',
  freeShippingThreshold: 299.0,
  defaultShippingRate: 24.9,
  paymentProvider: 'mercadopago',
  primaryColor: '#db2777',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<IStoreSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const reloadSettings = async () => {
    try {
      const data = await api.getPublicSettings();
      setSettings(data);
      if (data.primaryColor) {
        applyThemeColor(data.primaryColor);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const previewColor = (hex: string) => {
    applyThemeColor(hex);
  };

  useEffect(() => {
    reloadSettings();
  }, []);

  useEffect(() => {
    if (settings.primaryColor) {
      applyThemeColor(settings.primaryColor);
    }
  }, [settings.primaryColor]);

  return (
    <StoreContext.Provider value={{ settings, reloadSettings, previewColor, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore deve ser usado dentro de StoreProvider');
  return context;
};
