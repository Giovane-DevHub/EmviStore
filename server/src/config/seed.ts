import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Customer } from '../models/Customer.js';
import { Order } from '../models/Order.js';

export async function seedInitialData() {
  // Categorias
  const existingCategories = await Category.countDocuments();
  if (existingCategories === 0) {
    await Category.insertMany([
      { name: 'Novidades', slug: 'novidades', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80', itemCount: 12 },
      { name: 'Vestidos', slug: 'vestidos', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80', itemCount: 24 },
      { name: 'Blusas', slug: 'blusas', image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&q=80', itemCount: 18 },
      { name: 'Saias', slug: 'saias', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80', itemCount: 15 },
      { name: 'Acessórios', slug: 'acessorios', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80', itemCount: 30 },
      { name: 'Sale', slug: 'sale', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80', itemCount: 8 },
    ]);
    console.log('[Seed] Categorias iniciais cadastradas com sucesso.');
  }

  // Produtos
  const existingProducts = await Product.countDocuments();
  if (existingProducts === 0) {
    await Product.insertMany([
      {
        name: 'Vestido Midi Aurora Rose',
        description: 'Vestido midi em crepe acetinado de alta qualidade, caimento impecável e detalhes delicados em renda francesa nas costas. Perfeito para ocasiões que pedem sofisticação.',
        sku: 'VES-ROSE-001',
        category: 'Vestidos',
        costPrice: 110.0,
        salePrice: 289.9,
        stock: 35,
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [
          { name: 'Aurora Rose', hex: '#C99E98' },
          { name: 'Off White', hex: '#FDFBF7' },
          { name: 'Preto Clássico', hex: '#1C1C1C' },
        ],
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
        ],
        isFeatured: true,
        isActive: true,
        salesCount: 124,
      },
      {
        name: 'Blusa Sophia Cetim Branca',
        description: 'Blusa manga longa com botões forrados em crepe e caimento fluido com gola sutilmente estruturada.',
        sku: 'BLU-SOPH-002',
        category: 'Blusas',
        costPrice: 65.0,
        salePrice: 159.9,
        stock: 42,
        sizes: ['P', 'M', 'G'],
        colors: [
          { name: 'Branco Pérola', hex: '#F8F6F0' },
          { name: 'Nude Suave', hex: '#E2D1C3' },
        ],
        images: [
          'https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&q=80',
          'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80',
        ],
        isFeatured: true,
        isActive: true,
        salesCount: 98,
      },
      {
        name: 'Blazer Rose Alfaiataria',
        description: 'Blazer estruturado com ombreiras sutis e corte moderno. Peça atemporal que transita do corporativo ao evento noturno.',
        sku: 'BLA-ALFA-003',
        category: 'Novidades',
        costPrice: 140.0,
        salePrice: 349.9,
        stock: 18,
        sizes: ['P', 'M', 'G'],
        colors: [
          { name: 'Rose Nude', hex: '#D2A59F' },
          { name: 'Preto', hex: '#1C1C1C' },
        ],
        images: [
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
        ],
        isFeatured: true,
        isActive: true,
        salesCount: 76,
      },
      {
        name: 'Bolsa Corrente de Couro',
        description: 'Bolsa estruturada em couro legítimo vegetal com alça de corrente dourada italiana e fecho magnético luxuoso.',
        sku: 'BOL-COUR-004',
        category: 'Acessórios',
        costPrice: 95.0,
        salePrice: 219.9,
        stock: 22,
        sizes: ['Único'],
        colors: [
          { name: 'Caramelo Nude', hex: '#C68B59' },
          { name: 'Off White', hex: '#FDFBF7' },
        ],
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
          'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
        ],
        isFeatured: true,
        isActive: true,
        salesCount: 65,
      },
      {
        name: 'Vestido Floral Silhueta',
        description: 'Vestido fluido longo com estampa floral exclusiva em tons pastéis e faixa para amarração delicada na cintura.',
        sku: 'VES-FLOR-005',
        category: 'Vestidos',
        costPrice: 105.0,
        salePrice: 269.9,
        stock: 28,
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [
          { name: 'Floral Rosa', hex: '#E8B4B8' },
        ],
        images: [
          'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&q=80',
        ],
        isFeatured: false,
        isActive: true,
        salesCount: 45,
      },
      {
        name: 'Calça Linho Pantalona',
        description: 'Pantalona em linho misto de alto padrão com pregas frontais e bolsos laterais alfaiatados.',
        sku: 'CAL-LINH-006',
        category: 'Novidades',
        costPrice: 85.0,
        salePrice: 189.9,
        stock: 30,
        sizes: ['36', '38', '40', '42'],
        colors: [
          { name: 'Linho Cru', hex: '#EAE5D9' },
          { name: 'Terracota', hex: '#C07D58' },
        ],
        images: [
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
        ],
        isFeatured: false,
        isActive: true,
        salesCount: 54,
      },
      {
        name: 'Saia Plissada Midi Acetinada',
        description: 'Saia plissada comprimento midi em crepe acetinado nobre com elástico embutido no cós. Leveza, movimento e sofisticação em cada detalhe.',
        sku: 'SAI-PLIS-007',
        category: 'Saias',
        costPrice: 75.0,
        salePrice: 219.9,
        stock: 30,
        sizes: ['P', 'M', 'G'],
        colors: [
          { name: 'Champagne Perolado', hex: '#E6D7C3' },
          { name: 'Rose Nude', hex: '#D2A59F' },
          { name: 'Preto Clássico', hex: '#1C1C1C' },
        ],
        images: [
          'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80',
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
        ],
        isFeatured: true,
        isActive: true,
        salesCount: 41,
      },
      {
        name: 'Vestido Slip Dress Seda Elegance',
        description: 'Vestido slip dress com toque acetinado suave de seda e alças finas reguláveis. Oferta imperdível da coleção promocional.',
        sku: 'SAL-SLIP-008',
        category: 'Sale',
        costPrice: 60.0,
        salePrice: 139.9,
        stock: 25,
        sizes: ['P', 'M', 'G'],
        colors: [
          { name: 'Terracota Rose', hex: '#B86B64' },
          { name: 'Preto', hex: '#1C1C1C' },
        ],
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
        ],
        isFeatured: true,
        isActive: true,
        salesCount: 89,
      },
    ]);
    console.log('[Seed] Produtos luxuosos iniciais cadastrados com sucesso.');
  }

  // Garantir que CADA categoria existente no banco possua ao menos um produto ativo para teste
  const allCategories = await Category.find();
  for (const cat of allCategories) {
    const hasProduct = await Product.findOne({ category: cat.name, isActive: true });
    if (!hasProduct) {
      await Product.create({
        name: `Peça Exclusiva ${cat.name}`,
        description: `Produto de alta sofisticação e acabamento impecável confeccionado para a categoria ${cat.name}.`,
        sku: `PRD-${cat.slug.toUpperCase().slice(0, 4)}-001`,
        category: cat.name,
        costPrice: 70.0,
        salePrice: 199.9,
        stock: 20,
        sizes: ['P', 'M', 'G'],
        colors: [
          { name: 'Rose Nude', hex: '#D2A59F' },
          { name: 'Preto Clássico', hex: '#1C1C1C' },
        ],
        images: [
          cat.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
        ],
        isFeatured: true,
        isActive: true,
        salesCount: 15,
      });
      console.log(`[Seed] Produto criado para a categoria sem produto: ${cat.name}`);
    }
  }

  // Clientes de exemplo
  const existingCustomers = await Customer.countDocuments();
  if (existingCustomers === 0) {
    await Customer.insertMany([
      {
        name: 'Beatriz Lins',
        email: 'beatriz.lins@gmail.com',
        phone: '(11) 98765-4321',
        totalSpent: 1482.5,
        ordersCount: 4,
        lastOrderDate: new Date(),
        address: {
          cep: '01310-100',
          street: 'Av. Paulista',
          number: '1450',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
        },
      },
      {
        name: 'Mariana Sampaio',
        email: 'mariana.sampaio@uol.com.br',
        phone: '(11) 97123-8890',
        totalSpent: 639.8,
        ordersCount: 2,
        lastOrderDate: new Date(),
        address: {
          cep: '04538-133',
          street: 'Rua Amauri',
          number: '230',
          neighborhood: 'Itaim Bibi',
          city: 'São Paulo',
          state: 'SP',
        },
      },
      {
        name: 'Carla Albuquerque',
        email: 'carla.albuquerque@hotmail.com',
        phone: '(21) 99887-1122',
        totalSpent: 919.7,
        ordersCount: 3,
        lastOrderDate: new Date(),
        address: {
          cep: '22410-003',
          street: 'Rua Garcia d Avila',
          number: '88',
          neighborhood: 'Ipanema',
          city: 'Rio de Janeiro',
          state: 'RJ',
        },
      },
    ]);
    console.log('[Seed] Clientes de exemplo cadastrados.');
  }

  // Pedidos de exemplo para alimentar os gráficos e a fila de processamento
  const existingOrders = await Order.countDocuments();
  if (existingOrders === 0) {
    await Order.insertMany([
      {
        orderNumber: '#1094',
        customer: {
          name: 'Beatriz Lins',
          email: 'beatriz.lins@gmail.com',
          phone: '(11) 98765-4321',
        },
        shippingAddress: {
          cep: '01310-100',
          street: 'Av. Paulista',
          number: '1450',
          complement: 'Apto 62',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
        },
        items: [
          {
            productId: 'temp-1',
            name: 'Vestido Midi Aurora Rose',
            price: 289.9,
            costPrice: 110.0,
            quantity: 1,
            size: 'M',
            color: 'Aurora Rose',
            image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
          },
        ],
        subtotal: 289.9,
        shippingFee: 0,
        discount: 0,
        total: 289.9,
        paymentMethod: 'credit_card',
        paymentDetails: { lastFourDigits: '4242', installments: 3 },
        status: 'preparing',
        createdAt: new Date(),
      },
      {
        orderNumber: '#1093',
        customer: {
          name: 'Mariana Sampaio',
          email: 'mariana.sampaio@uol.com.br',
          phone: '(11) 97123-8890',
        },
        shippingAddress: {
          cep: '04538-133',
          street: 'Rua Amauri',
          number: '230',
          neighborhood: 'Itaim Bibi',
          city: 'São Paulo',
          state: 'SP',
        },
        items: [
          {
            productId: 'temp-2',
            name: 'Blusa Sophia Cetim Branca',
            price: 159.9,
            costPrice: 65.0,
            quantity: 1,
            size: 'P',
            color: 'Branco Pérola',
            image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&q=80',
          },
        ],
        subtotal: 159.9,
        shippingFee: 19.9,
        discount: 0,
        total: 179.8,
        paymentMethod: 'pix',
        status: 'shipped',
        createdAt: new Date(Date.now() - 3600000 * 24),
      },
      {
        orderNumber: '#1092',
        customer: {
          name: 'Carla Albuquerque',
          email: 'carla.albuquerque@hotmail.com',
          phone: '(21) 99887-1122',
        },
        shippingAddress: {
          cep: '22410-003',
          street: 'Rua Garcia d Avila',
          number: '88',
          neighborhood: 'Ipanema',
          city: 'Rio de Janeiro',
          state: 'RJ',
        },
        items: [
          {
            productId: 'temp-3',
            name: 'Bolsa Corrente de Couro',
            price: 219.9,
            costPrice: 95.0,
            quantity: 1,
            size: 'Único',
            color: 'Caramelo Nude',
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
          },
        ],
        subtotal: 219.9,
        shippingFee: 24.9,
        discount: 0,
        total: 244.8,
        paymentMethod: 'boleto',
        status: 'delivered',
        createdAt: new Date(Date.now() - 3600000 * 48),
      },
    ]);
    console.log('[Seed] Pedidos iniciais de exemplo cadastrados.');
  }
}
