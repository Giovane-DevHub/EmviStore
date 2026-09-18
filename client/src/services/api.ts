const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('emvi_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('emvi_token', token);
  } else {
    localStorage.removeItem('emvi_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'Erro na requisição';
    try {
      const data = await response.json();
      errorMsg = data.message || errorMsg;
    } catch {
      // Falha ao parsear JSON
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (credentials: { username: string; password: string }) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => request<any>('/auth/me'),
  updateProfile: (data: any) =>
    request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Produtos
  getProducts: (params?: Record<string, any>) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/products${query ? `?${query}` : ''}`);
  },
  getAdminProducts: () => request<any[]>('/products/admin/all'),
  getProductById: (id: string) => request<any>(`/products/${id}`),
  createProduct: (data: any) =>
    request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (id: string, data: any) =>
    request<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProduct: (id: string) =>
    request<any>(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Categorias
  getCategories: (all?: boolean) => request<any[]>(`/categories${all ? '?all=true' : ''}`),
  createCategory: (data: any) =>
    request<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategoryStatus: (id: string, isActive: boolean) =>
    request<any>(`/categories/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    }),
  deleteCategory: (id: string) =>
    request<any>(`/categories/${id}`, {
      method: 'DELETE',
    }),

  // Pedidos
  createOrder: (data: any) =>
    request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getOrders: (params?: Record<string, any>) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/orders${query ? `?${query}` : ''}`);
  },
  getOrderById: (id: string) => request<any>(`/orders/${id}`),
  updateOrderStatus: (id: string, status: string) =>
    request<any>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Clientes
  getCustomers: (params?: Record<string, any>) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/customers${query ? `?${query}` : ''}`);
  },
  getCustomerById: (id: string) => request<any>(`/customers/${id}`),

  // Configurações
  getPublicSettings: () => request<any>('/settings'),
  getAdminSettings: () => request<any>('/settings/admin'),
  updateSettings: (data: any) =>
    request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Relatórios
  getDashboardData: () => request<any>('/reports/dashboard'),
  downloadReportPDF: async () => {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/reports/pdf`, { headers });
    if (!res.ok) throw new Error('Falha ao baixar o PDF');

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-gerencial-emvi-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  // Frete
  calculateShipping: (cep: string, subtotal: number) =>
    request<{ address?: any; options: any[] }>('/shipping/calculate', {
      method: 'POST',
      body: JSON.stringify({ cep, subtotal }),
    }),
};
