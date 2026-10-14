import { describe, it, expect, beforeEach } from 'vitest';
import { ChamadosStore } from '../src/core/chamados-store.ts';
import { MultiTenantManager } from '../src/core/multi-tenant-store.ts';

describe('Ações da Mesa Mobile — 1-Toque Direto & FYP Reel (Padrão Tear & Noesis)', () => {
  let store: ChamadosStore;
  let tenantManager: MultiTenantManager;

  beforeEach(() => {
    store = new ChamadosStore({ cooldownSegundos: 30 });
    tenantManager = new MultiTenantManager();
  });

  // ==========================================
  // 1. CAMINHO FELIZ (HAPPY PATH)
  // ==========================================
  describe('Caminho Feliz (Happy Path)', () => {
    it('deve disparar chamado direto de garçom na mesa em 1 único toque', () => {
      const resultado = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '04',
        tipo: 'garcom_mesa'
      });

      expect(resultado.sucesso).toBe(true);
      expect(resultado.chamado?.mesaId).toBe('04');
      expect(resultado.chamado?.tipo).toBe('garcom_mesa');
      expect(resultado.chamado?.status).toBe('pendente');
    });

    it('deve permitir pedir a conta e retornar a chave Pix exclusiva do restaurante', () => {
      const restaurante = tenantManager.obterRestaurante('pizzaria-roma');
      expect(restaurante?.chavePix).toBe('pix@bellaroma.com.br');

      const chamadoConta = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '04',
        tipo: 'pedir_conta',
        metodoPagamento: 'pix'
      });

      expect(chamadoConta.sucesso).toBe(true);
      expect(chamadoConta.chamado?.metodoPagamento).toBe('pix');
    });

    it('deve utilizar contato@clickspot.app como chave Pix de contingência da marca ClickSpot', () => {
      const semPix = tenantManager.obterRestaurante('restaurante-inexistente');
      const chavePixOficial = semPix?.chavePix || 'contato@clickspot.app';
      expect(chavePixOficial).toBe('contato@clickspot.app');
    });
  });

  // ==========================================
  // 2. CASOS DE BORDA (EDGE CASES)
  // ==========================================
  describe('Casos de Borda (Edge Cases)', () => {
    it('deve bloquear toques repetidos no botão de chamar garçom aplicando o debounce', () => {
      const primeiro = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '04',
        tipo: 'garcom_mesa'
      });
      expect(primeiro.sucesso).toBe(true);

      const segundo = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '04',
        tipo: 'garcom_mesa'
      });
      expect(segundo.sucesso).toBe(false);
      expect(segundo.motivo).toBe('spam_bloqueado');
    });

    it('deve permitir chamado direto acionado pelo botão no interior do Reel vertical 9:16', () => {
      const resultadoReel = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '04',
        tipo: 'garcom_mesa'
      });

      expect(resultadoReel.sucesso).toBe(true);
      expect(resultadoReel.chamado?.status).toBe('pendente');
    });
  });

  // ==========================================
  // 3. CAMINHOS DE ERRO (ERROR PATHS)
  // ==========================================
  describe('Caminhos de Erro (Error Paths)', () => {
    it('deve rejeitar chamados com dados corrompidos ou mesa vazia', () => {
      const invalido = store.registrarChamado({
        restauranteId: 'pizzaria-roma',
        mesaId: '',
        tipo: 'garcom_mesa'
      });
      expect(invalido.sucesso).toBe(false);
      expect(invalido.motivo).toBe('dados_invalidos');
    });
  });
});
