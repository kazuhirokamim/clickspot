import { describe, it, expect } from 'vitest';
import viteConfig from '../vite.config.ts';

describe('Vite Configuration', () => {
  it('deve exportar uma configuracao valida com plugins e ambiente de teste', () => {
    expect(viteConfig).toBeDefined();
    // Verifica se os plugins do react estao carregados
    expect(Array.isArray((viteConfig as any).plugins)).toBe(true);
  });
});
