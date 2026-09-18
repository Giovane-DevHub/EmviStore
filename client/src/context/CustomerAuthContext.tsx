import React, { createContext, useContext, useState, useEffect } from 'react';
import { ICustomerUser } from '../types';
import { api, getCustomerToken, setCustomerToken } from '../services/api';

interface CustomerAuthContextType {
  customer: ICustomerUser | null;
  isCustomerLoggedIn: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'orders';
  setIsAuthModalOpen: (open: boolean) => void;
  setAuthModalMode: (mode: 'login' | 'register' | 'orders') => void;
  openAuthModal: (mode?: 'login' | 'register' | 'orders') => void;
  closeAuthModal: () => void;
  loginCustomer: (email: string, pass: string) => Promise<void>;
  registerCustomer: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    cpf?: string;
    address?: any;
  }) => Promise<void>;
  logoutCustomer: () => void;
  updateCustomerProfile: (data: any) => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<ICustomerUser | null>(() => {
    const saved = localStorage.getItem('emvi_customer_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'orders'>('login');

  useEffect(() => {
    const checkCustomer = async () => {
      const token = getCustomerToken();
      if (token) {
        try {
          const data = await api.getCustomerMe();
          const userObj: ICustomerUser = {
            id: data._id || data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            cpf: data.cpf,
            address: data.address,
          };
          setCustomer(userObj);
          localStorage.setItem('emvi_customer_user', JSON.stringify(userObj));
        } catch {
          logoutCustomer();
        }
      }
      setIsLoading(false);
    };
    checkCustomer();
  }, []);

  const openAuthModal = (mode: 'login' | 'register' | 'orders' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginCustomer = async (email: string, pass: string) => {
    const res = await api.loginCustomer({ email, password: pass });
    setCustomerToken(res.token);
    const userObj: ICustomerUser = {
      id: res.customer.id || res.customer._id,
      name: res.customer.name,
      email: res.customer.email,
      phone: res.customer.phone,
      cpf: res.customer.cpf,
      address: res.customer.address,
    };
    setCustomer(userObj);
    localStorage.setItem('emvi_customer_user', JSON.stringify(userObj));
    closeAuthModal();
  };

  const registerCustomer = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    cpf?: string;
    address?: any;
  }) => {
    const res = await api.registerCustomer(data);
    setCustomerToken(res.token);
    const userObj: ICustomerUser = {
      id: res.customer.id || res.customer._id,
      name: res.customer.name,
      email: res.customer.email,
      phone: res.customer.phone,
      cpf: res.customer.cpf,
      address: res.customer.address,
    };
    setCustomer(userObj);
    localStorage.setItem('emvi_customer_user', JSON.stringify(userObj));
    closeAuthModal();
  };

  const logoutCustomer = () => {
    setCustomerToken(null);
    setCustomer(null);
    localStorage.removeItem('emvi_customer_user');
  };

  const updateCustomerProfile = async (data: any) => {
    const res = await api.updateCustomerProfile(data);
    const userObj: ICustomerUser = {
      id: res.customer.id || res.customer._id,
      name: res.customer.name,
      email: res.customer.email,
      phone: res.customer.phone,
      cpf: res.customer.cpf,
      address: res.customer.address,
    };
    setCustomer(userObj);
    localStorage.setItem('emvi_customer_user', JSON.stringify(userObj));
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isCustomerLoggedIn: !!customer,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        setIsAuthModalOpen,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        updateCustomerProfile,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth deve ser usado dentro de CustomerAuthProvider');
  }
  return context;
};
