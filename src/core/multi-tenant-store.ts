/**
 * MultiTenantManager — Gerenciador de Isolamento de Restaurantes e Cardápios
 * Padrão Tear & Noesis Domain Core
 * Orçamento estrito: < 700 linhas (Regra Tear #24)
 */

import { RestauranteTenant, ItemCardapio } from '../types/cardapio.ts';

export class MultiTenantManager {
  private restaurantes = new Map<string, RestauranteTenant>();

  constructor() {
    this.popularRestaurantesIniciais();
  }

  /**
   * Obtém os dados e cardápio de um restaurante específico pelo seu slug
   */
  public obterRestaurante(id: string): RestauranteTenant | undefined {
    const slug = id?.trim().toLowerCase();
    const restaurante = this.restaurantes.get(slug);
    return restaurante ? JSON.parse(JSON.stringify(restaurante)) : undefined;
  }

  /**
   * Lista todos os restaurantes cadastrados no sistema
   */
  public listarRestaurantes(): RestauranteTenant[] {
    return Array.from(this.restaurantes.values()).map((r) => JSON.parse(JSON.stringify(r)));
  }

  /**
   * Verifica se o restaurante está com assinatura ativa
   */
  public estaAtivo(id: string): boolean {
    const rest = this.obterRestaurante(id);
    return rest?.statusAssinatura === 'ativo' || rest?.statusAssinatura === 'trial';
  }

  /**
   * Busca itens de cardápio isolados por restaurante
   */
  public buscarItensCardapio(restauranteId: string, termo: string): ItemCardapio[] {
    const rest = this.obterRestaurante(restauranteId);
    if (!rest || !termo) return [];

    const termoNormalizado = termo.trim().toLowerCase();
    const itensEncontrados: ItemCardapio[] = [];

    for (const categoria of rest.cardapio) {
      for (const item of categoria.itens) {
        if (
          item.nome.toLowerCase().includes(termoNormalizado) ||
          item.descricao.toLowerCase().includes(termoNormalizado)
        ) {
          itensEncontrados.push({ ...item });
        }
      }
    }

    return itensEncontrados;
  }

  /**
   * Popula dados iniciais de demonstração com vídeos 9:16 e fotos gastronômicas
   */
  private popularRestaurantesIniciais(): void {
    // 1. Pizzaria Bella Roma
    this.restaurantes.set('pizzaria-roma', {
      id: 'pizzaria-roma',
      nome: 'Pizzaria Bella Roma',
      segmento: 'Pizzaria Artesanal',
      chavePix: 'pix@bellaroma.com.br',
      statusAssinatura: 'ativo',
      tempoMedioAtendimento: '4 min',
      cardapio: [
        {
          id: 'cat-entradas-roma',
          nome: 'Entradas & Antepastos',
          itens: [
            {
              id: 'ent-1',
              nome: 'Bruschetta Pomodoro Clássica',
              descricao: 'Pão italiano rústico tostado, tomates confitados, azeite extravirgem e manjericão fresco.',
              preco: 28.0,
              disponivel: true,
              destaque: true,
              tempoPreparo: '8 min',
              videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-chef-preparing-a-salad-41315-large.mp4',
              fotoUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80'
            },
            {
              id: 'ent-2',
              nome: 'Burrata ao Pesto com Focaccia',
              descricao: 'Burrata artesanal cremosa, molho pesto genovês de manjericão e fatias de focaccia da casa.',
              preco: 46.0,
              disponivel: true,
              destaque: true,
              tempoPreparo: '10 min',
              videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cutting-a-burrata-cheese-over-a-dish-43391-large.mp4',
              fotoUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=800&q=80'
            }
          ]
        },
        {
          id: 'cat-pizzas-roma',
          nome: 'Pizzas Artesanais (Fermentação Natural)',
          itens: [
            {
              id: 'piz-1',
              nome: 'Pizza Margherita Verace',
              descricao: 'Molho pelati San Marzano, mozzarella de búfala, parmesão reggiano e manjericão fresco.',
              preco: 62.0,
              disponivel: true,
              destaque: true,
              tempoPreparo: '12 min',
              videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-putting-cheese-on-a-raw-pizza-43389-large.mp4',
              fotoUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80'
            },
            {
              id: 'piz-2',
              nome: 'Pizza Calabresa Curada com Cebola Roxa',
              descricao: 'Calabresa artesanal defumada, mozzarella, cebola roxa caramelizada e azeitonas pretas.',
              preco: 58.0,
              disponivel: true,
              tempoPreparo: '14 min',
              fotoUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80'
            },
            {
              id: 'piz-3',
              nome: 'Pizza Parma com Rúcula Selvagem',
              descricao: 'Presunto Parma curado 18 meses, lâminas de Grana Padano, rúcula e azeite trufado.',
              preco: 74.0,
              disponivel: true,
              destaque: true,
              tempoPreparo: '15 min',
              videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-plating-a-pizza-with-fresh-herbs-41319-large.mp4',
              fotoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
            }
          ]
        },
        {
          id: 'cat-bebidas-roma',
          nome: 'Bebidas & Vinhos',
          itens: [
            {
              id: 'beb-1',
              nome: 'Vinho Tinto Chianti Classico (Taça)',
              descricao: 'Vinho italiano encorpado com notas de frutas vermelhas e carvalho.',
              preco: 32.0,
              disponivel: true,
              tempoPreparo: '2 min',
              fotoUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'
            },
            {
              id: 'beb-2',
              nome: 'Soda Italiana de Maçã Verde',
              descricao: 'Refrescante, preparada com xarope artesanal e folhas de hortelã.',
              preco: 14.0,
              disponivel: true,
              tempoPreparo: '3 min',
              fotoUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
            }
          ]
        }
      ]
    });

    // 2. The Burger Club
    this.restaurantes.set('burger-spot', {
      id: 'burger-spot',
      nome: 'The Burger Club',
      segmento: 'Hamburgueria Gourmet',
      chavePix: 'financeiro@burgerclub.com.br',
      statusAssinatura: 'ativo',
      tempoMedioAtendimento: '3 min',
      cardapio: [
        {
          id: 'cat-burgers-spot',
          nome: 'Burgers Especiais Angus',
          itens: [
            {
              id: 'bsp-1',
              nome: 'Smash Angus Duplo Bacon',
              descricao: '2x 90g ultra-smash Angus, cheddar inglês maturado, bacon artesanal em tiras e maionese defumada.',
              preco: 39.9,
              disponivel: true,
              destaque: true,
              tempoPreparo: '10 min',
              videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-frying-burgers-in-a-kitchen-41484-large.mp4',
              fotoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
            },
            {
              id: 'bsp-2',
              nome: 'Truffle Burger 180g',
              descricao: 'Blend 180g grelhado no fogo, queijo brie maçaricado, cogumelos salteados e azeite trufado.',
              preco: 48.0,
              disponivel: true,
              destaque: true,
              tempoPreparo: '12 min',
              videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-assembling-a-delicious-hamburger-41485-large.mp4',
              fotoUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80'
            }
          ]
        },
        {
          id: 'cat-sides-spot',
          nome: 'Acompanhamentos',
          itens: [
            {
              id: 'side-1',
              nome: 'Batata Rústica com Páprica e Alecrim',
              descricao: 'Crocantes por fora e macias por dentro, servidas com dip de alho assado.',
              preco: 22.0,
              disponivel: true,
              tempoPreparo: '8 min',
              fotoUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80'
            }
          ]
        }
      ]
    });

    // 3. Bistrô San Marco
    this.restaurantes.set('bistro-san-marco', {
      id: 'bistro-san-marco',
      nome: 'Bistrô San Marco',
      segmento: 'Gastronomia Contemporânea',
      chavePix: 'contato@bistrosanmarco.com',
      statusAssinatura: 'trial',
      tempoMedioAtendimento: '5 min',
      cardapio: [
        {
          id: 'cat-pratos-marco',
          nome: 'Pratos Principais',
          itens: [
            {
              id: 'bsm-1',
              nome: 'Risoto de Funghi com Ragu de Ossobuco',
              descricao: 'Arroz arbóreo mantecado com Grana Padano, cogumelos frescos e ossobuco cozido lentamente.',
              preco: 78.0,
              disponivel: true,
              destaque: true,
              tempoPreparo: '20 min',
              videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-plating-a-risotto-dish-43393-large.mp4',
              fotoUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80'
            }
          ]
        }
      ]
    });

    // 4. Café Central (Inadimplente / Suspenso para teste de Gating)
    this.restaurantes.set('cafe-central-suspenso', {
      id: 'cafe-central-suspenso',
      nome: 'Café Central',
      segmento: 'Cafeteria & Doceria',
      chavePix: 'financeiro@cafecentral.com',
      statusAssinatura: 'suspenso',
      tempoMedioAtendimento: '10 min',
      cardapio: []
    });
  }
}
