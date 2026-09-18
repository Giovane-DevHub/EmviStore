import React, { useState, useEffect } from 'react';
import { IProduct, ICategory } from './types';
import { api } from './services/api';

import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';

import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';

const MainContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { settings } = useStore();

  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Admin Tab
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        api.getProducts(),
        api.getCategories(true),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Erro ao carregar catálogo inicial:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeCategories = categories.filter((c) => c.isActive !== false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const navigateTo = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: IProduct) => {
    setSelectedProduct(product);
    navigateTo('product-detail', { productId: product._id });
  };

  // Se estiver navegando na área administrativa
  if (currentPage.startsWith('admin')) {
    if (!isAuthenticated && currentPage !== 'admin-login') {
      return (
        <AdminLogin
          onLoginSuccess={() => navigateTo('admin-dashboard')}
          onNavigateToStore={() => navigateTo('home')}
        />
      );
    }

    if (currentPage === 'admin-login') {
      return (
        <AdminLogin
          onLoginSuccess={() => navigateTo('admin-dashboard')}
          onNavigateToStore={() => navigateTo('home')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={(tab) => setAdminTab(tab)}
        onNavigateToStore={() => navigateTo('home')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard onSelectTab={(tab) => setAdminTab(tab)} />
        )}
        {adminTab === 'products' && (
          <AdminProducts
            categories={categories}
            onRefreshProducts={loadInitialData}
          />
        )}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'customers' && <AdminCustomers />}
        {adminTab === 'reports' && <AdminReports />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // Área da Loja Online do Cliente
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5]">
      <Header
        categories={activeCategories}
        onNavigate={navigateTo}
        activeCategory={pageParams.category}
        onSelectCategory={(cat) => navigateTo('catalog', { category: cat })}
      />

      <main className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-28 text-xs text-[#7A706E]">
            Carregando a coleção {settings.storeName}...
          </div>
        ) : (
          <>
            {currentPage === 'home' && (
              <HomePage
                products={products}
                categories={activeCategories}
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'catalog' && (
              <CatalogPage
                products={products}
                categories={activeCategories}
                initialCategory={pageParams.category || 'Todos'}
                initialSearch={pageParams.search || ''}
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'product-detail' && selectedProduct && (
              <ProductDetailPage
                product={selectedProduct}
                relatedProducts={products.filter((p) => p._id !== selectedProduct._id)}
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'checkout' && (
              <CheckoutPage onNavigate={navigateTo} />
            )}
          </>
        )}
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Gaveta de Sacola Lateral */}
      <CartDrawer onProceedToCheckout={() => navigateTo('checkout')} />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <CartProvider>
          <MainContent />
        </CartProvider>
      </AuthProvider>
    </StoreProvider>
  );
}

export default App;
