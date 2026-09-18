import React, { useState, useEffect } from 'react';
import { IProduct, ICategory } from '../../types';
import { api } from '../../services/api';
import { Plus, Search, Edit2, Trash2, X, Image as ImageIcon, Check } from 'lucide-react';

interface AdminProductsProps {
  categories: ICategory[];
  onRefreshProducts: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ categories, onRefreshProducts }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Nova Categoria
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Vestidos');
  const [costPrice, setCostPrice] = useState('0');
  const [salePrice, setSalePrice] = useState('0');
  const [stock, setStock] = useState('10');
  const [sizes, setSizes] = useState<string[]>(['P', 'M', 'G']);
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Rose', hex: '#D2A59F' },
  ]);
  const [imageUrl, setImageUrl] = useState('');
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAdminProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminProducts();
      setProducts(res);
    } catch (err) {
      console.error('Erro ao buscar produtos admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const openNewProductModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setSku(`EMVI-${Math.floor(1000 + Math.random() * 9000)}`);
    setCategory(categories[0]?.name || 'Vestidos');
    setCostPrice('90.00');
    setSalePrice('249.90');
    setStock('25');
    setSizes(['P', 'M', 'G']);
    setColors([{ name: 'Rose Nude', hex: '#D2A59F' }]);
    setImagesList(['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800']);
    setImageUrl('');
    setIsFeatured(false);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: IProduct) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description || '');
    setSku(p.sku);
    setCategory(p.category);
    setCostPrice(String(p.costPrice || 0));
    setSalePrice(String(p.salePrice));
    setStock(String(p.stock));
    setSizes(p.sizes || ['P', 'M', 'G']);
    setColors(p.colors || [{ name: 'Rose', hex: '#D2A59F' }]);
    setImagesList(p.images || []);
    setImageUrl('');
    setIsFeatured(p.isFeatured);
    setIsActive(p.isActive);
    setIsModalOpen(true);
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImagesList([...imagesList, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImagesList(imagesList.filter((_, i) => i !== idx));
  };

  const handleToggleSize = (sz: string) => {
    if (sizes.includes(sz)) {
      setSizes(sizes.filter((s) => s !== sz));
    } else {
      setSizes([...sizes, sz]);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !salePrice) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        description,
        sku,
        category,
        costPrice: Number(costPrice),
        salePrice: Number(salePrice),
        stock: Number(stock),
        sizes,
        colors,
        images: imagesList,
        isFeatured,
        isActive,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct._id, payload);
      } else {
        await api.createProduct(payload);
      }

      setIsModalOpen(false);
      fetchAdminProducts();
      onRefreshProducts();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar produto.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza de que deseja excluir este produto?')) {
      try {
        await api.deleteProduct(id);
        fetchAdminProducts();
        onRefreshProducts();
      } catch (err: any) {
        alert(err.message || 'Erro ao excluir produto.');
      }
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setCreatingCat(true);
    try {
      await api.createCategory({
        name: newCatName.trim(),
        image: newCatImage.trim() || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300',
      });
      setNewCatName('');
      setNewCatImage('');
      onRefreshProducts();
    } catch (err: any) {
      alert(err.message || 'Erro ao criar categoria.');
    } finally {
      setCreatingCat(false);
    }
  };

  const handleToggleCategoryStatus = async (id: string, currentStatus: boolean | undefined) => {
    try {
      const newStatus = currentStatus === false ? true : false;
      await api.updateCategoryStatus(id, newStatus);
      onRefreshProducts();
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar status da categoria.');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (confirm(`Deseja realmente excluir permanentemente a categoria "${name}"? Você também pode apenas inativá-la para que ela saia do site sem ser apagada.`)) {
      try {
        await api.deleteCategory(id);
        onRefreshProducts();
      } catch (err: any) {
        alert(err.message || 'Erro ao remover categoria.');
      }
    }
  };

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#2A2626] tracking-wide">
            Gestão de Catálogo
          </h1>
          <p className="text-xs text-[#7A706E] mt-0.5">
            Cadastre peças e gerencie as categorias exibidas no site.
          </p>
        </div>

        {activeTab === 'products' && (
          <button
            onClick={openNewProductModal}
            className="bg-[#8A5D65] hover:bg-[#724a51] text-white py-2.5 px-4 rounded-xs text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Produto</span>
          </button>
        )}
      </div>

      {/* Abas: Produtos x Categorias */}
      <div className="flex border-b border-[#EAE3DE] space-x-6 text-xs font-semibold uppercase tracking-wider text-[#7A706E]">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'products'
              ? 'border-[#8A5D65] text-[#8A5D65]'
              : 'border-transparent hover:text-black'
          }`}
        >
          Produtos Cadastrados ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'categories'
              ? 'border-[#8A5D65] text-[#8A5D65]'
              : 'border-transparent hover:text-black'
          }`}
        >
          Categorias da Loja ({categories.length})
        </button>
      </div>

      {/* Aba de Categorias */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Formulário de Nova Categoria */}
          <form
            onSubmit={handleCreateCategory}
            className="bg-white border border-[#EAE3DE] p-5 rounded-xs flex flex-col sm:flex-row gap-3 items-end"
          >
            <div className="flex-1 text-xs">
              <label className="block text-[#5C5552] mb-1 font-medium">Nome da Nova Categoria</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Ex: Conjuntos, Alfaiataria, Calçados..."
                className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
              />
            </div>
            <div className="flex-1 text-xs">
              <label className="block text-[#5C5552] mb-1 font-medium">URL da Imagem de Capa (opcional)</label>
              <input
                type="text"
                value={newCatImage}
                onChange={(e) => setNewCatImage(e.target.value)}
                placeholder="https://exemplo.com/foto-categoria.jpg"
                className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
              />
            </div>
            <button
              type="submit"
              disabled={creatingCat}
              className="bg-[#8A5D65] hover:bg-[#724a51] text-white px-5 py-2.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 shrink-0"
            >
              {creatingCat ? 'Adicionando...' : 'Adicionar Categoria'}
            </button>
          </form>

          {/* Tabela de Categorias com Botão de Excluir */}
          <div className="bg-white border border-[#EAE3DE] rounded-xs shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#EAE3DE] text-xs text-[#7A706E]">
              As categorias abaixo aparecem no menu superior e na seção circular da tela inicial. Para remover uma categoria do site (como Acessórios), basta clicar no botão de lixeira.
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F5] text-[#5C5552] uppercase tracking-wider text-[10px] border-b border-[#EAE3DE]">
                  <tr>
                    <th className="py-3 px-4">Imagem</th>
                    <th className="py-3 px-4">Nome da Categoria</th>
                    <th className="py-3 px-4">Link / Identificador</th>
                    <th className="py-3 px-4 text-center">Status no Site</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE3DE]">
                  {categories.map((cat) => {
                    const isActive = cat.isActive !== false;
                    return (
                      <tr key={cat._id || cat.slug} className={`transition-colors ${isActive ? 'hover:bg-[#FAF7F5]' : 'bg-gray-50/70 opacity-75'}`}>
                        <td className="py-3 px-4">
                          <img
                            src={cat.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100'}
                            alt={cat.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#EAE3DE]"
                          />
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#2A2626]">
                          {cat.name}
                          {!isActive && (
                            <span className="ml-2 text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-xs font-normal">
                              Oculta da Loja
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#7A706E]">
                          /{cat.slug}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleCategoryStatus(cat._id, cat.isActive)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all border ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                            }`}
                            title={isActive ? 'Clique para inativar (ocultar do site)' : 'Clique para reativar (exibir no site)'}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                              }`}
                            />
                            <span>{isActive ? 'Ativa (Visível)' : 'Inativa (Oculta)'}</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteCategory(cat._id, cat.name)}
                            className="p-1.5 text-[#7A706E] hover:text-rose-600 rounded-xs hover:bg-rose-50 transition-colors"
                            title={`Excluir permanentemente a categoria ${cat.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Aba de Produtos */}
      {activeTab === 'products' && (
        <>
          {/* Barra de Filtros e Busca */}
          <div className="bg-white border border-[#EAE3DE] p-4 rounded-xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#968986] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por nome ou SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#FAF7F5] border border-[#D8CECA] pl-9 pr-3 py-2 text-xs rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#FAF7F5] border border-[#D8CECA] px-3 py-2 text-xs rounded-xs text-[#5C5552] focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.slug} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tabela de Produtos */}
          <div className="bg-white border border-[#EAE3DE] rounded-xs shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F5] text-[#5C5552] uppercase tracking-wider text-[10px] border-b border-[#EAE3DE]">
                  <tr>
                    <th className="py-3 px-4">Produto</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4">Preço Custo</th>
                    <th className="py-3 px-4">Preço Venda</th>
                    <th className="py-3 px-4">Estoque</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE3DE]">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-[#7A706E]">
                        Carregando produtos...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-[#7A706E]">
                        Nenhum produto cadastrado com esses filtros.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((prod) => (
                      <tr key={prod._id} className="hover:bg-[#FAF7F5] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200'}
                              alt={prod.name}
                              className="w-10 h-13 object-cover rounded-xs bg-[#EAE3DE]"
                            />
                            <div>
                              <p className="font-semibold text-[#2A2626] line-clamp-1">{prod.name}</p>
                              {prod.isFeatured && (
                                <span className="text-[10px] text-[#8A5D65] font-semibold">
                                  ★ Destaque
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#5C5552]">{prod.sku}</td>
                        <td className="py-3 px-4 text-[#5C5552]">{prod.category}</td>
                        <td className="py-3 px-4 text-[#7A706E]">
                          R$ {(prod.costPrice || 0).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#2A2626]">
                          R$ {prod.salePrice.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                              prod.stock > 10
                                ? 'bg-emerald-100 text-emerald-800'
                                : prod.stock > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {prod.stock} un
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                              prod.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                            }`}
                          />
                          <span className="text-[11px] text-[#5C5552]">
                            {prod.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(prod)}
                              className="p-1.5 text-[#5C5552] hover:text-[#8A5D65] rounded-xs hover:bg-[#F2ECE8] transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod._id)}
                              className="p-1.5 text-[#5C5552] hover:text-rose-600 rounded-xs hover:bg-rose-50 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal de Cadastro / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xs shadow-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#EAE3DE] pb-4">
              <h3 className="font-serif text-xl font-light text-[#2A2626]">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-[#7A706E]" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[#5C5552] mb-1 font-medium">Nome da Peça *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Vestido Midi Aurora Rose"
                    className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                  />
                </div>

                <div>
                  <label className="block text-[#5C5552] mb-1 font-medium">Código SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    placeholder="VES-ROSE-001"
                    className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                  />
                </div>

                <div>
                  <label className="block text-[#5C5552] mb-1 font-medium">Categoria *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                  >
                    {categories.map((c) => (
                      <option key={c._id || c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#5C5552] mb-1 font-medium">Preço de Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                  />
                </div>

                <div>
                  <label className="block text-[#5C5552] mb-1 font-medium">Preço de Venda (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                  />
                </div>

                <div>
                  <label className="block text-[#5C5552] mb-1 font-medium">Estoque Disponível *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                  />
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-[#8A5D65] w-4 h-4"
                    />
                    <span className="text-[#2A2626] font-medium">Destaque na Vitrine</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="accent-[#8A5D65] w-4 h-4"
                    />
                    <span className="text-[#2A2626] font-medium">Produto Ativo</span>
                  </label>
                </div>
              </div>

              {/* Tamanhos */}
              <div>
                <label className="block text-[#5C5552] mb-1.5 font-medium">Tamanhos Disponíveis</label>
                <div className="flex gap-2">
                  {['P', 'M', 'G', 'GG', 'Único'].map((sz) => (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => handleToggleSize(sz)}
                      className={`px-3 py-1.5 border rounded-xs font-semibold ${
                        sizes.includes(sz) ? 'bg-[#8A5D65] text-white border-[#8A5D65]' : 'border-[#D8CECA]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Imagens */}
              <div className="space-y-2">
                <label className="block text-[#5C5552] font-medium">Imagens do Produto (URLs)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://exemplo.com/foto-vestido.jpg"
                    className="flex-1 bg-[#FAF7F5] border border-[#D8CECA] p-2 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="bg-[#2A2626] text-white px-3 py-2 rounded-xs uppercase tracking-wider font-semibold"
                  >
                    Adicionar
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto pt-2">
                  {imagesList.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-20 rounded-xs overflow-hidden border border-[#EAE3DE] shrink-0">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-[#5C5552] mb-1 font-medium">Descrição Detalhada</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes sobre o caimento, tecido, corte e composição..."
                  className="w-full bg-[#FAF7F5] border border-[#D8CECA] p-2.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8A5D65]"
                />
              </div>

              {/* Botões do Modal */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE3DE]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-[#D8CECA] rounded-xs text-[#5C5552] hover:bg-[#FAF7F5]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#8A5D65] hover:bg-[#724a51] text-white px-6 py-2.5 rounded-xs font-semibold uppercase tracking-wider shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Salvando...' : 'Salvar e Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
