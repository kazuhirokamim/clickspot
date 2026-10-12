/**
 * Tipagens do Modelo Multi-Tenant e Cardápio
 * Padrão Tear & Noesis Domain Core
 */

export interface ItemCardapio {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  disponivel: boolean;
  destaque?: boolean;
}

export interface CategoriaCardapio {
  id: string;
  nome: string;
  itens: ItemCardapio[];
}

export type StatusAssinatura = 'ativo' | 'suspenso' | 'trial';

export interface RestauranteTenant {
  id: string; // slug único
  nome: string;
  segmento: string;
  chavePix: string;
  statusAssinatura: StatusAssinatura;
  tempoMedioAtendimento: string;
  cardapio: CategoriaCardapio[];
}
