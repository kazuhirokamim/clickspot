---
numero: 1
titulo: Seleção da Arquitetura e Stack do Call-in PWA Web
data: 2026-10-11
status: Aceito
autores:
  - Kazuhiro
  - Tear Maestro
  - Noesis Architecture Maestro
aplica_a:
  - src
  - tests
  - docs
tags:
  - call-in
  - pwa
  - react
  - vite
  - tailwind
  - nfc
  - zero-friction
---

# ADR-001: Seleção da Arquitetura e Stack do Call-in PWA Web

## Declaração de Decisão (Y-Statement)
No contexto de atendimento digital de mesas via aproximação NFC e QR Code sem fricção para restaurantes, enfrentando a necessidade de abertura instantânea em redes móveis 4G (< 500ms) sem exigir instalação de aplicativo pelo cliente, decidimos por utilizar Vite com React 19, TypeScript e Tailwind CSS para a aplicação cliente PWA e painel de salão, para alcançar tempo de resposta sub-segundo, facilidade de manutenção e zero atrito de adoção, aceitando gerenciar o roteamento dinâmico de mesas no cliente via rotas leves.

---

## Contexto
O **Call-in** é uma solução de mesa inteligente acionada por NFC e QR Code. Para o cliente da mesa, **cada segundo de carregamento importa**:
- Não pode haver tela de carregamento pesada (> 1s resulta em abandono do cliente).
- Deve funcionar em qualquer smartphone (iOS Safari, Android Chrome) sem instalação prévia.
- Deve atualizar o status em tempo real (chamados atendidos/pendentes) com WebSocket ou SSE.

---

## As 3 Opções Técnicas Avaliadas (Regra Tear #2)

### Opção A: Flutter Web (CanvasKit / HTML Renderer)
* **Prós:** Permite reutilização de código se futuramente o garçom usar um app nativo compilado para Android/iOS.
* **Contras:** 
  - Tamanho inicial do bundle elevado (CanvasKit Wasm tem 2MB a 4MB), gerando atraso perceptível de 1.5s a 3s no primeiro carregamento via 4G na mesa do restaurante.
  - Runtime do Flutter/Dart não está instalado nativamente no ambiente local da máquina.

### Opção B: Next.js 15 (React / TypeScript / Tailwind CSS)
* **Prós:** Framework maduro, excelente suporte a SSR e rotas dinâmicas (`/m/[slug]/[mesa]`), alinhado com a experiência existente no ecossistema Doc2Fill/Pulsense.
* **Contras:** Leve sobrecarga de servidor Node se hospedado fora de edge/serverless; overhead de hidratação para uma tela que é essencialmente uma comanda de 3 botões.

### Opção C (Escolhida): Vite + React 19 (TypeScript) + Tailwind CSS + WebSockets
* **Prós:**
  - **Zero Latência:** Bundle de produção minúsculo (< 60kB compactado). Carrega em menos de 300ms no 4G de qualquer smartphone.
  - **PWA Nativo:** Service Worker embutido com suporte offline e ícone na tela inicial se o garçom quiser salvar.
  - **Runtime Imediato:** Executa 100% no Node.js v24 já configurado no sistema.
  - **Manutenibilidade:** Código ultra-modular, testável via Vitest com facilidade extrema.
* **Contras:** Requer configuração manual de rotas com biblioteca leve de roteamento.

---

## Consequências

### Positivas
- Carregamento inicial em menos de 400ms em conexões móveis, garantindo satisfação imediata do cliente da mesa.
- Sem fricção de download ou permissões de loja de aplicativos.
- Fácil deploy em provedores estáticos ou Edge (Vercel, Cloudflare Pages, Netlify) com custo de infraestrutura próximo de zero no início.
- Compatibilidade universal com iOS Safari e Android Chrome ao ler a tag NFC.

### Negativas
- Notificações em segundo plano com som alto no celular do garçom dependem do navegador permanecer com a aba ativa ou de integração com canal externo (ex: Telegram Bot ou Web Push).

### Neutras/Riscos Mitigados
- Se no futuro um restaurante de grande porte exigir um tablet ou maquininha Android dedicada com impressão automática de comandas, desenvolveremos um wrapper ou app complementar nativo com Flutter, mantendo a API e o backend centralizados.
