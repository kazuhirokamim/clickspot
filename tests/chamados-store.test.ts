import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChamadosStore } from '../src/core/chamados-store.ts';

describe('ChamadosStore - TDD Canônico (Padrão Tear & Noesis)', () => {
  let store: ChamadosStore;

  beforeEach(() => {
    store = new ChamadosStore({ cooldownSegundos: 30 });
    vi.useRealTimers();
  });

  // ==========================================
  // 1. CAMINHO FELIZ (HAPPY PATH)
  // ==========================================
  describe('Caminho Feliz (Happy Path)', () => {
    it('deve registrar um chamado de garçom válido com status pendente e timestamp', () => {
      const resultado = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '04',
        tipo: 'garcom_mesa'
      });

      expect(resultado.sucesso).toBe(true);
      expect(resultado.chamado).toBeDefined();
      expect(resultado.chamado?.mesaId).toBe('04');
      expect(resultado.chamado?.tipo).toBe('garcom_mesa');
      expect(resultado.chamado?.status).toBe('pendente');
      expect(resultado.chamado?.id).toMatch(/^ch_/);
    });

    it('deve permitir pedir a conta especificando método de pagamento pix', () => {
      const resultado = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '07',
        tipo: 'pedir_conta',
        metodoPagamento: 'pix'
      });

      expect(resultado.sucesso).toBe(true);
      expect(resultado.chamado?.tipo).toBe('pedir_conta');
      expect(resultado.chamado?.metodoPagamento).toBe('pix');
      expect(resultado.chamado?.status).toBe('pendente');
    });

    it('deve permitir que o balcão marque um chamado pendente como atendido', () => {
      const criacao = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '02',
        tipo: 'gelo_talher_guardanapo'
      });

      const chamadoId = criacao.chamado!.id;
      const concluido = store.marcarAtendido('pizzaria-roma', chamadoId);

      expect(concluido).toBe(true);
      const chamadoAtualizado = store.obterPorId('pizzaria-roma', chamadoId);
      expect(chamadoAtualizado?.status).toBe('atendido');
    });
  });

  // ==========================================
  // 2. CASOS DE BORDA (EDGE CASES)
  // ==========================================
  describe('Casos de Borda (Edge Cases)', () => {
    it('deve bloquear múltiplos chamados rápidos na mesma mesa respeitando o debounce de 30s', () => {
      vi.useFakeTimers();
      const agora = Date.now();
      vi.setSystemTime(agora);

      const primeiro = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '10',
        tipo: 'garcom_mesa'
      });
      expect(primeiro.sucesso).toBe(true);

      // 5 segundos depois, novo clique acidental
      vi.setSystemTime(agora + 5000);
      const segundo = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '10',
        tipo: 'garcom_mesa'
      });

      expect(segundo.sucesso).toBe(false);
      expect(segundo.motivo).toBe('spam_bloqueado');
      expect(segundo.tempoRestanteCooldown).toBe(25);

      // 31 segundos depois, chamado deve ser liberado
      vi.setSystemTime(agora + 31000);
      const terceiro = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '10',
        tipo: 'garcom_mesa'
      });
      expect(terceiro.sucesso).toBe(true);
    });

    it('não deve bloquear chamados de mesas diferentes criados no mesmo instante', () => {
      const chamadoMesa1 = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '01',
        tipo: 'garcom_mesa'
      });
      const chamadoMesa2 = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '02',
        tipo: 'garcom_mesa'
      });

      expect(chamadoMesa1.sucesso).toBe(true);
      expect(chamadoMesa2.sucesso).toBe(true);
      expect(chamadoMesa1.chamado?.id).not.toBe(chamadoMesa2.chamado?.id);
    });

    it('deve ser idempotente ao tentar marcar como atendido um chamado inexistente', () => {
      const resultado = store.marcarAtendido('pizzaria-roma', 'ch_nao_existe_123');
      expect(resultado).toBe(false);
    });
  });

  // ==========================================
  // 3. CAMINHOS DE ERRO (ERROR PATHS)
  // ==========================================
  describe('Caminhos de Erro (Error Paths)', () => {
    it('deve rejeitar chamados com mesaId ou restauranteId vazios', () => {
      const semMesa = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '   ',
        tipo: 'garcom_mesa'
      });
      expect(semMesa.sucesso).toBe(false);
      expect(semMesa.motivo).toBe('dados_invalidos');

      const semRestaurante = store.registrarChamado({
        restauranteId: '',
        mesaId: '05',
        tipo: 'garcom_mesa'
      });
      expect(semRestaurante.sucesso).toBe(false);
      expect(semRestaurante.motivo).toBe('dados_invalidos');
    });

    it('deve rejeitar pedidos de conta sem método de pagamento válido', () => {
      const contaSemMetodo = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '05',
        tipo: 'pedir_conta',
        metodoPagamento: 'bitcoin' as any
      });
      expect(contaSemMetodo.sucesso).toBe(false);
      expect(contaSemMetodo.motivo).toBe('dados_invalidos');
    });
  });
});
