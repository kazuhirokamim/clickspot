import { describe, it, expect, beforeEach } from 'vitest';
import { ReelNavigator } from '../src/core/reel-navigator.ts';
import { ItemCardapio } from '../src/types/cardapio.ts';

describe('ReelNavigator — Navegação Vertical FYP (Padrão Tear & Noesis)', () => {
  const itensMock: ItemCardapio[] = [
    {
      id: 'item-1',
      nome: 'Bruschetta Pomodoro',
      descricao: 'Tomates confitados',
      preco: 28,
      disponivel: true,
      videoUrl: 'https://example.com/video1.mp4'
    },
    {
      id: 'item-2',
      nome: 'Pizza Margherita',
      descricao: 'Manjericão e búfala',
      preco: 62,
      disponivel: true,
      videoUrl: 'https://example.com/video2.mp4'
    },
    {
      id: 'item-3',
      nome: 'Pizza Parma',
      descricao: 'Presunto cru e rúcula',
      preco: 74,
      disponivel: true,
      fotoUrl: 'https://example.com/foto3.jpg'
    }
  ];

  let navigator: ReelNavigator;

  beforeEach(() => {
    navigator = new ReelNavigator(itensMock, 0, { thresholdSwipe: 50 });
  });

  // ==========================================
  // 1. CAMINHO FELIZ (HAPPY PATH)
  // ==========================================
  describe('Caminho Feliz (Happy Path)', () => {
    it('deve inicializar no índice solicitado e retornar o item atual', () => {
      expect(navigator.obterIndiceAtual()).toBe(0);
      expect(navigator.obterItemAtual()?.id).toBe('item-1');
      expect(navigator.obterTotal()).toBe(3);
    });

    it('deve avançar para o próximo item ao navegar para frente', () => {
      const mudou = navigator.proximo();
      expect(mudou).toBe(true);
      expect(navigator.obterIndiceAtual()).toBe(1);
      expect(navigator.obterItemAtual()?.id).toBe('item-2');
    });

    it('deve retroceder para o item anterior', () => {
      navigator.proximo(); // vai para o 1
      const mudou = navigator.anterior();
      expect(mudou).toBe(true);
      expect(navigator.obterIndiceAtual()).toBe(0);
    });

    it('deve avançar ao detectar gesto vertical de arrasto para cima (deltaY negativo)', () => {
      // Arrastar dedo para cima (scroll down no feed tipo TikTok)
      const mudou = navigator.processarGestoVertical(-80);
      expect(mudou).toBe(true);
      expect(navigator.obterIndiceAtual()).toBe(1);
    });

    it('deve retroceder ao detectar gesto vertical de arrasto para baixo (deltaY positivo)', () => {
      navigator.proximo(); // vai para 1
      const mudou = navigator.processarGestoVertical(75);
      expect(mudou).toBe(true);
      expect(navigator.obterIndiceAtual()).toBe(0);
    });
  });

  // ==========================================
  // 2. CASOS DE BORDA (EDGE CASES)
  // ==========================================
  describe('Casos de Borda (Edge Cases)', () => {
    it('não deve ultrapassar o limite final da lista (clamp no final)', () => {
      navigator.irPara(2);
      expect(navigator.obterIndiceAtual()).toBe(2);

      const tentouAvancar = navigator.proximo();
      expect(tentouAvancar).toBe(false);
      expect(navigator.obterIndiceAtual()).toBe(2);
    });

    it('não deve ultrapassar o limite inicial da lista (clamp no início)', () => {
      expect(navigator.obterIndiceAtual()).toBe(0);
      const tentouRetroceder = navigator.anterior();
      expect(tentouRetroceder).toBe(false);
      expect(navigator.obterIndiceAtual()).toBe(0);
    });

    it('deve ignorar micro-movimentos acidentais abaixo do threshold de sensibilidade', () => {
      const mudou = navigator.processarGestoVertical(-30); // threshold é 50
      expect(mudou).toBe(false);
      expect(navigator.obterIndiceAtual()).toBe(0);
    });
  });

  // ==========================================
  // 3. CAMINHOS DE ERRO (ERROR PATHS)
  // ==========================================
  describe('Caminhos de Erro (Error Paths)', () => {
    it('deve lidar graciosamente com lista vazia de itens', () => {
      const navVazio = new ReelNavigator([], 0);
      expect(navVazio.obterTotal()).toBe(0);
      expect(navVazio.obterItemAtual()).toBeUndefined();
      expect(navVazio.proximo()).toBe(false);
      expect(navVazio.anterior()).toBe(false);
      expect(navVazio.processarGestoVertical(-100)).toBe(false);
    });

    it('deve ajustar o índice inicial caso receba um valor fora dos limites', () => {
      const navFora1 = new ReelNavigator(itensMock, 999);
      expect(navFora1.obterIndiceAtual()).toBe(2);

      const navFora2 = new ReelNavigator(itensMock, -5);
      expect(navFora2.obterIndiceAtual()).toBe(0);
    });
  });
});
