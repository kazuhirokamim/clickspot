/**
 * Tipagens Canônicas do Domínio ClickSpot
 * Padrão Tear & Noesis Domain Core
 */

export type TipoChamado =
  | 'garcom_mesa'
  | 'gelo_talher_guardanapo'
  | 'pedir_conta';

export type MetodoPagamento =
  | 'debito'
  | 'credito'
  | 'dinheiro'
  | 'pix';

export type StatusChamado =
  | 'pendente'
  | 'em_atendimento'
  | 'atendido';

export interface ChamadoMesa {
  id: string;
  restauranteId: string;
  mesaId: string;
  tipo: TipoChamado;
  metodoPagamento?: MetodoPagamento;
  criadoEm: number;
  atualizadoEm: number;
  status: StatusChamado;
}

export interface CriarChamadoPayload {
  restauranteId: string;
  mesaId: string;
  tipo: TipoChamado;
  metodoPagamento?: MetodoPagamento;
}

export interface ResultadoCriacaoChamado {
  sucesso: boolean;
  chamado?: ChamadoMesa;
  motivo?: 'spam_bloqueado' | 'dados_invalidos' | 'erro_interno';
  tempoRestanteCooldown?: number;
}
