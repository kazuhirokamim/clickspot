# PLAN-001: Fundação do Call-in — PWA Cliente, Painel de Salão e Hardware NFC

## Metadados SDD
- **versao_plano:** 1.0.0
- **tipo:** feature
- **blast_radius:** baixo
- **orcamento_tokens:** 25000

---

## 1. Visão Geral e Justificativa
O **Call-in** é uma solução de mesa inteligente orientada a restaurantes de atendimento rápido, bares e cafeterias. O projeto conecta um componente de hardware físico (plaquinhas com chip NFC NTAG213/215 e QR Code gravadas via NFC Tools) a uma aplicação PWA ultraleve sem necessidade de download ou login pelo cliente da mesa.

Este plano estabelece a fundação de código do projeto no repositório `callin`, cobrindo:
1. Aplicação PWA do cliente de mesa (`/m/:restaurante/:mesa`) com os 3 botões canônicos: Cardápio, Chamar Atendente e Pedir Conta.
2. Painel em tempo real do salão/balcão para visualização dos chamados com alerta sonoro e conclusão de atendimento.
3. Especificação do fluxo de gravação NFC física com o app NFC Tools.
4. Integração da governança com a tríade de projetos ativos de Kazu: **Pulsense**, **Doc2Fill** e **Call-in**.

---

## 2. Opções Técnicas Avaliadas (Regra Tear #2)

### Opção 1: Flutter Web Monolítico
- **Descrição:** Desenvolver cliente e painel em Flutter Web compilado com CanvasKit.
- **Prós:** Base única caso seja gerado app nativo Android/iOS para garçons no futuro.
- **Contras:** Bundle inicial pesado (2MB a 4MB); tempo de carregamento de 2s a 4s em redes 4G; runtime Flutter não está instalado nativamente na máquina.

### Opção 2: Next.js 15 Fullstack
- **Descrição:** Aplicação completa em Next.js com App Router e Server Actions.
- **Prós:** Integração madura com SSR e ecossistema Vercel.
- **Contras:** Overhead de servidor Node para uma comanda simples de 3 botões; hidratação desnecessária para a tela do cliente.

### Opção 3 (RECOMENDADA): Vite + React 19 + TypeScript + Tailwind CSS + PWA Service Worker
- **Descrição:** Frontend modular ultra-rápido (< 60kB compactado) com tempo de carga inferior a 300ms no 4G de smartphones. Notificações e sincronização em tempo real via WebSockets / eventos leves.
- **Prós:** Abertura instantânea ao encostar na tag NFC; compatibilidade total com iOS Safari e Android Chrome; stack nativa no Node v24 já disponível no sistema.
- **Contras:** Requer configuração manual de rotas com biblioteca leve de roteamento.

---

## 3. Não-Objetivos / Fora de Escopo
- Não exigir download de aplicativo pela App Store ou Google Play para o cliente da mesa.
- Não exigir login ou cadastro prévio com dados pessoais do cliente da mesa (Zero Retenção).
- Não criar módulos complexos de ERP/PDV fiscal no MVP inicial (foco restrito em Cardápio, Chamar e Conta).
- Não utilizar bibliotecas pesadas de animação que inflem o bundle para mais de 100kB.

---

## 4. Requisitos EARS

| Requisito | Tipo Declarado | Especificação |
| :--- | :--- | :--- |
| REQ-001 | Ubiquitous | O sistema deve operar via PWA sem exigir download de app nativo ou login pelo cliente. |
| REQ-002 | Event | Quando o cliente encostar na tag NFC ou escanear o QR Code, o sistema deve carregar a rota `/m/:restaurante/:mesa` em menos de 500ms. |
| REQ-003 | Event | Quando o cliente clicar em "Chamar Atendente", o sistema deve emitir vibração háptica (`navigator.vibrate`) e enviar o chamado para a fila do salão. |
| REQ-004 | State-driven | Enquanto houver um chamado pendente para a mesa, o botão deve permanecer em estado "Atendente Notificado" com debounce de 30 segundos. |
| REQ-005 | Event | Quando o cliente clicar em "Pedir a Conta" com opção Pix, o sistema deve exibir a chave Pix do restaurante pronta para cópia em 1 clique. |
| REQ-006 | Event | Quando um novo chamado for registrado, o painel do salão deve emitir um sinal sonoro e reposicionar a mesa na coluna de pendentes. |

---

## 5. Orçamentos Não-Funcionais
- **Tempo de Carregamento Inicial:** < 500ms em redes 4G móveis.
- **Tamanho do Bundle de Produção:** < 100kB (Gzip/Brotli).
- **Cobertura de Testes TDD:** 80%+ com 3 cenários por teste (Happy Path, Edge Case, Error Path).
- **Teto de Linhas de Código:** Menos de 700 linhas por arquivo de produção (Regra Tear #24).
- **Privacidade & LGPD:** Zero Retenção de dados pessoais de consumidores na mesa.

---

## 6. Hotspots Compartilhados
- `src/types/chamado.ts`
- `src/core/chamados-store.ts`
- `src/components/mesa/TelaMesa.tsx`
- `src/components/painel/PainelSalao.tsx`
- `tests/chamados-store.test.ts`
- `tests/mesa-actions.test.ts`

---

## 7. Tarefas (DAG)

## T1 — Setup do Repositório e Tipagem Canônica (`src/types/chamado.ts`)
- **Requisitos:** REQ-001, REQ-002
- **Agent:** tear-frontend
- **model:** gemini-2.5-pro
- **effort:** baixo
- **tempo:** 15m
- **Depends-on:** nenhum

## T2 — Suíte TDD do Motor de Chamados e Debounce Anti-Spam (`tests/chamados-store.test.ts`)
- **Requisitos:** REQ-003, REQ-004
- **Agent:** tear-qa
- **model:** gemini-2.5-pro
- **effort:** médio
- **tempo:** 20m
- **Depends-on:** T1

## T3 — Implementação do Store Reativo e Debounce (`src/core/chamados-store.ts`)
- **Requisitos:** REQ-003, REQ-004
- **Agent:** tear-backend
- **model:** gemini-2.5-pro
- **effort:** médio
- **tempo:** 25m
- **Depends-on:** T2

## T4 — Tela do Cliente da Mesa com os 3 Botões Canônicos (`src/components/mesa/`)
- **Requisitos:** REQ-001, REQ-002, REQ-003, REQ-005
- **Agent:** tear-frontend
- **model:** gemini-2.5-pro
- **effort:** médio
- **tempo:** 30m
- **Depends-on:** T3

## T5 — Painel de Salão em Tempo Real com Alerta Sonoro (`src/components/painel/`)
- **Requisitos:** REQ-006
- **Agent:** tear-frontend
- **model:** gemini-2.5-pro
- **effort:** médio
- **tempo:** 25m
- **Depends-on:** T4

---

## 8. Matriz de Rastreabilidade

| Requisito | Tarefa | Teste |
| :--- | :--- | :--- |
| REQ-001 | T1 | tests/chamados-store.test.ts |
| REQ-002 | T1, T4 | tests/mesa-actions.test.ts |
| REQ-003 | T2, T3 | tests/chamados-store.test.ts |
| REQ-004 | T2, T3 | tests/chamados-store.test.ts |
| REQ-005 | T4 | tests/mesa-actions.test.ts |
| REQ-006 | T5 | tests/chamados-store.test.ts |
