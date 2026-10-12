/**
 * ChamadosStore — Motor de Domínio Puro do Call-in
 * Padrão Tear & Noesis Domain Core
 * Orçamento estrito: < 700 linhas (Regra Tear #24)
 */

import {
  ChamadoMesa,
  CriarChamadoPayload,
  ResultadoCriacaoChamado,
  MetodoPagamento
} from '../types/chamado.ts';

export interface ChamadosStoreOptions {
  cooldownSegundos?: number;
}

export class ChamadosStore {
  private chamadosPorRestaurante = new Map<string, Map<string, ChamadoMesa>>();
  private ultimoChamadoPorMesa = new Map<string, number>();
  private readonly cooldownSegundos: number;

  constructor(options: ChamadosStoreOptions = {}) {
    this.cooldownSegundos = options.cooldownSegundos ?? 30;
  }

  /**
   * Registra um novo chamado para a mesa, aplicando debounce anti-spam
   */
  public registrarChamado(payload: CriarChamadoPayload): ResultadoCriacaoChamado {
    const restauranteId = payload.restauranteId?.trim();
    const mesaId = payload.mesaId?.trim();

    // Validação estrita de entrada
    if (!restauranteId || !mesaId || !payload.tipo) {
      return { sucesso: false, motivo: 'dados_invalidos' };
    }

    // Se for pedido de conta, método de pagamento é obrigatório e validado
    if (payload.tipo === 'pedir_conta') {
      const metodosValidos: MetodoPagamento[] = ['debito', 'credito', 'dinheiro', 'pix'];
      if (!payload.metodoPagamento || !metodosValidos.includes(payload.metodoPagamento)) {
        return { sucesso: false, motivo: 'dados_invalidos' };
      }
    }

    const chaveMesa = `${restauranteId}:${mesaId}`;
    const agora = Date.now();
    const ultimoTimestamp = this.ultimoChamadoPorMesa.get(chaveMesa);

    // Validação de Debounce / Cooldown Anti-Spam
    if (ultimoTimestamp !== undefined) {
      const diferencaMs = agora - ultimoTimestamp;
      const cooldownMs = this.cooldownSegundos * 1000;
      if (diferencaMs < cooldownMs) {
        const restanteSegundos = Math.ceil((cooldownMs - diferencaMs) / 1000);
        return {
          sucesso: false,
          motivo: 'spam_bloqueado',
          tempoRestanteCooldown: restanteSegundos
        };
      }
    }

    // Gerar ID seguro e unívoco
    const sufixoAleatorio = Math.random().toString(36).substring(2, 7);
    const novoChamado: ChamadoMesa = {
      id: `ch_${agora}_${sufixoAleatorio}`,
      restauranteId,
      mesaId,
      tipo: payload.tipo,
      metodoPagamento: payload.metodoPagamento,
      criadoEm: agora,
      atualizadoEm: agora,
      status: 'pendente'
    };

    // Armazenar chamado no restaurante
    if (!this.chamadosPorRestaurante.has(restauranteId)) {
      this.chamadosPorRestaurante.set(restauranteId, new Map());
    }
    this.chamadosPorRestaurante.get(restauranteId)!.set(novoChamado.id, novoChamado);

    // Atualizar registro de cooldown da mesa
    this.ultimoChamadoPorMesa.set(chaveMesa, agora);

    return {
      sucesso: true,
      chamado: { ...novoChamado }
    };
  }

  /**
   * Marca um chamado existente como atendido pelo balcão (operação idempotente)
   */
  public marcarAtendido(restauranteId: string, chamadoId: string): boolean {
    const chamados = this.chamadosPorRestaurante.get(restauranteId);
    if (!chamados || !chamados.has(chamadoId)) {
      return false;
    }

    const chamado = chamados.get(chamadoId)!;
    chamado.status = 'atendido';
    chamado.atualizadoEm = Date.now();
    return true;
  }

  /**
   * Obtém um chamado por ID
   */
  public obterPorId(restauranteId: string, chamadoId: string): ChamadoMesa | undefined {
    const chamado = this.chamadosPorRestaurante.get(restauranteId)?.get(chamadoId);
    return chamado ? { ...chamado } : undefined;
  }

  /**
   * Lista chamados pendentes de um restaurante ordenados por antiguidade (FIFO)
   */
  public listarPendentes(restauranteId: string): ChamadoMesa[] {
    const chamados = this.chamadosPorRestaurante.get(restauranteId);
    if (!chamados) return [];

    return Array.from(chamados.values())
      .filter((c) => c.status === 'pendente')
      .sort((a, b) => a.criadoEm - b.criadoEm);
  }

  /**
   * Lista todos os chamados de um restaurante
   */
  public listarTodos(restauranteId: string): ChamadoMesa[] {
    const chamados = this.chamadosPorRestaurante.get(restauranteId);
    if (!chamados) return [];
    return Array.from(chamados.values()).sort((a, b) => b.criadoEm - a.criadoEm);
  }
}
