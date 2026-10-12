# 📋 Changelog — Call-in

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo, seguindo o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [0.1.0] - 2026-10-11
### Adicionado
- Fundação do repositório no padrão de excelência Tear e Noesis.
- Registro de Requisitos formal `respostas/001.md` (TearForm).
- Blueprint de Engenharia SDD 2.0 `docs/plans/PLAN-001-callin-foundation.md`.
- Decisão Arquitetural `docs/adr/ADR-001-stack-callin-pwa.md` aprovando Vite + React 19 + TypeScript + Tailwind CSS.
- Documentação viva em `documentation/ARCHITECTURE.md` e `documentation/REQUIREMENTS.md`.
- Especificação de gravação de hardware físico NFC com NTAG213/215 via app NFC Tools.
- `ChamadosStore` com lógica de domínio puro, debounce anti-spam de 30s e ordenação FIFO.
- Suíte TDD em `tests/chamados-store.test.ts` com 8 asserções cobrindo Happy Path, Edge Cases e Error Paths.
- Componente `TelaMesa.tsx` com visão tátil do cliente (Cardápio, Chamar Garçom com vibração háptica e Pedir Conta com chave Pix).
- Componente `PainelSalao.tsx` com visão em tempo real para equipe do restaurante e conclusão de chamados.
- Roteamento e switcher de simulação local em `src/App.tsx`.

