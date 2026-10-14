# 📋 Changelog — ClickSpot

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo, seguindo o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [0.2.0] - 2026-10-14
### Modificado
- Rebranding oficial do projeto e da marca para **ClickSpot** (*Encostou. Chamou. Pediu.*).
- Atualização do identificador do pacote `package.json` para `clickspot`.
- Atualização de títulos, metadados e rotas canônicas para o domínio `clickspot.app`.
- Renomeação e unificação do ecossistema de documentação viva, ADRs e planos de engenharia.
- Atualização do symlink de trabalho no sistema operacional para `~/Projetos/clickspot`.

---

## [0.1.0] - 2026-10-11
### Adicionado
- Fundação do repositório no padrão de excelência Tear e Noesis.
- Registro de Requisitos formal `respostas/001.md` (TearForm).
- Blueprint de Engenharia SDD 2.0 `docs/plans/PLAN-001-clickspot-foundation.md`.
- Decisão Arquitetural `docs/adr/ADR-001-stack-clickspot-pwa.md` aprovando Vite + React 19 + TypeScript + Tailwind CSS.
- Documentação viva em `documentation/ARCHITECTURE.md` e `documentation/REQUIREMENTS.md`.
- Especificação de gravação de hardware físico NFC com NTAG213/215 via app NFC Tools.
- `ChamadosStore` com lógica de domínio puro, debounce anti-spam de 30s e ordenação FIFO.
- Suíte TDD em `tests/chamados-store.test.ts` com 8 asserções cobrindo Happy Path, Edge Cases e Error Paths.
- Componente `TelaMesa.tsx` com visão tátil do cliente (Cardápio, Chamar Garçom com vibração háptica e Pedir Conta com chave Pix).
- Componente `PainelSalao.tsx` com visão em tempo real para equipe do restaurante e conclusão de chamados.
- Roteamento e switcher de simulação local em `src/App.tsx`.
- Camada Multi-Tenant em `src/core/multi-tenant-store.ts` com isolamento estrito de cardápios e status de assinatura (gating).
- Biblioteca de ícones SVG limpos e autênticos em `src/components/icons/Icons.tsx` (removendo dependência de emojis).
- Reformulação visual gastronômica sóbria (paleta carvão/pedra, toques âmbar/mostarda escura e fontes modernas).
- Alerta sonoro sintetizado em tempo real via Web Audio API no balcão sem arquivos de áudio externos.
- Suíte TDD multi-tenant com 14 testes passando 100% verdes.
- Showcase Vertical FYP em `src/components/mesa/ShowcaseVerticalReel.tsx` com proporção 9:16 estilo TikTok/Reels.
- Navegação vertical por gestos de toque (touch swipe) no mobile via `ReelNavigator` com clamp de limites e sensibilidade calibrada.
- Suporte a vídeos verticais de preparação gastronômica para os pratos mais pedidos da casa e fotos em alta resolução com badge de tempo de preparo.
- Botão de conversão direta dentro do Reel ("Chamar Garçom").
- Suíte TDD completa em `tests/reel-navigator.test.ts` e `tests/mesa-actions.test.ts` totalizando 29 testes unitários 100% verdes.
- Refinamento da experiência Mobile-First: remoção de modais intermediários no botão de garçom para acionamento direto em 1 toque.
- Unificação estética dos 3 botões da mesa em paleta sóbria de alta gastronomia, eliminando disparidade de cores.
- Higienização da lista do cardápio: remoção de sinalizações de vídeo para fluidez natural e botão "Chamar Garçom" genérico dentro do reel.
