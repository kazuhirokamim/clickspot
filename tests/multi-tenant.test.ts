import { describe, it, expect, beforeEach } from 'vitest';
import { MultiTenantManager } from '../src/core/multi-tenant-store.ts';

describe('MultiTenantManager - Isolamento de Dados e Cardápios (Padrão Tear & Noesis)', () => {
  let manager: MultiTenantManager;

  beforeEach(() => {
    manager = new MultiTenantManager();
  });

  // ==========================================
  // 1. CAMINHO FELIZ (HAPPY PATH)
  // ==========================================
  describe('Caminho Feliz (Happy Path)', () => {
    it('deve retornar dados e cardápio exclusivo do restaurante solicitado', () => {
      const roma = manager.obterRestaurante('pizzaria-roma');
      expect(roma).toBeDefined();
      expect(roma?.nome).toBe('Pizzaria Bella Roma');
      expect(roma?.segmento).toBe('Pizzaria Artesanal');
      expect(roma?.cardapio.length).toBeGreaterThan(0);

      const burger = manager.obterRestaurante('burger-spot');
      expect(burger).toBeDefined();
      expect(burger?.nome).toBe('The Burger Club');
      expect(burger?.segmento).toBe('Hamburgueria Gourmet');
    });

    it('deve garantir que os itens do cardápio não se misturem entre restaurantes', () => {
      const itensRoma = manager.buscarItensCardapio('pizzaria-roma', 'Pizza');
      expect(itensRoma.length).toBeGreaterThan(0);
      expect(itensRoma.every((item) => item.nome.toLowerCase().includes('pizza'))).toBe(true);

      // Buscar 'Pizza' no Burger Club deve retornar vazio
      const itensBurger = manager.buscarItensCardapio('burger-spot', 'Pizza');
      expect(itensBurger.length).toBe(0);
    });
  });

  // ==========================================
  // 2. CASOS DE BORDA (EDGE CASES)
  // ==========================================
  describe('Casos de Borda (Edge Cases)', () => {
    it('deve realizar busca insensível a maiúsculas/minúsculas e espaços em branco', () => {
      const resultado1 = manager.buscarItensCardapio('burger-spot', 'ANGUS');
      const resultado2 = manager.buscarItensCardapio('burger-spot', '  angus  ');
      expect(resultado1.length).toBeGreaterThan(0);
      expect(resultado1).toEqual(resultado2);
    });

    it('deve identificar restaurantes com assinatura suspensa por inadimplência', () => {
      const restauranteSuspenso = manager.obterRestaurante('cafe-central-suspenso');
      expect(restauranteSuspenso).toBeDefined();
      expect(restauranteSuspenso?.statusAssinatura).toBe('suspenso');
      expect(manager.estaAtivo('cafe-central-suspenso')).toBe(false);
    });
  });

  // ==========================================
  // 3. CAMINHOS DE ERRO (ERROR PATHS)
  // ==========================================
  describe('Caminhos de Erro (Error Paths)', () => {
    it('deve retornar undefined ao buscar restaurante com slug inexistente', () => {
      const resultado = manager.obterRestaurante('slug-fantasma-123');
      expect(resultado).toBeUndefined();
    });

    it('deve retornar lista vazia ao buscar itens em restaurante inexistente', () => {
      const resultado = manager.buscarItensCardapio('slug-fantasma-123', 'qualquer');
      expect(resultado).toEqual([]);
    });
  });
});
