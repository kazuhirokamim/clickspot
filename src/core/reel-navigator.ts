/**
 * ReelNavigator — Motor de Navegação Vertical FYP (TikTok / Reels Style)
 * Padrão Tear & Noesis Domain Core
 * Orçamento estrito: < 700 linhas (Regra Tear #24)
 */

import { ItemCardapio } from '../types/cardapio.ts';

export interface ReelNavigatorOptions {
  thresholdSwipe?: number; // Distância mínima em pixels para computar o gesto
}

export class ReelNavigator {
  private readonly itens: ItemCardapio[];
  private indiceAtual: number = 0;
  private readonly thresholdSwipe: number;

  constructor(
    itens: ItemCardapio[],
    indiceInicial: number = 0,
    options: ReelNavigatorOptions = {}
  ) {
    this.itens = [...itens];
    this.thresholdSwipe = options.thresholdSwipe ?? 50;

    if (this.itens.length === 0) {
      this.indiceAtual = 0;
    } else {
      this.indiceAtual = Math.max(0, Math.min(indiceInicial, this.itens.length - 1));
    }
  }

  /**
   * Retorna o índice ativo
   */
  public obterIndiceAtual(): number {
    return this.indiceAtual;
  }

  /**
   * Retorna o item atualmente exibido
   */
  public obterItemAtual(): ItemCardapio | undefined {
    return this.itens[this.indiceAtual];
  }

  /**
   * Total de itens navegáveis no carrossel vertical
   */
  public obterTotal(): number {
    return this.itens.length;
  }

  /**
   * Avança para o próximo item
   */
  public proximo(): boolean {
    if (this.itens.length === 0 || this.indiceAtual >= this.itens.length - 1) {
      return false;
    }
    this.indiceAtual++;
    return true;
  }

  /**
   * Retrocede para o item anterior
   */
  public anterior(): boolean {
    if (this.itens.length === 0 || this.indiceAtual <= 0) {
      return false;
    }
    this.indiceAtual--;
    return true;
  }

  /**
   * Pula diretamente para um índice específico (com clamp de segurança)
   */
  public irPara(indice: number): boolean {
    if (this.itens.length === 0) return false;
    const novoIndice = Math.max(0, Math.min(indice, this.itens.length - 1));
    if (novoIndice !== this.indiceAtual) {
      this.indiceAtual = novoIndice;
      return true;
    }
    return false;
  }

  /**
   * Processa o gesto de arrasto vertical do dedo no mobile
   * - deltaY < -threshold (arrastar dedo para cima): avança para o próximo lanche
   * - deltaY > threshold (arrastar dedo para baixo): volta para o lanche anterior
   */
  public processarGestoVertical(deltaY: number): boolean {
    if (this.itens.length === 0) return false;

    if (deltaY < -this.thresholdSwipe) {
      return this.proximo();
    }
    if (deltaY > this.thresholdSwipe) {
      return this.anterior();
    }
    return false;
  }
}
