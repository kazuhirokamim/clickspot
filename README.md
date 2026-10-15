# 🛎️ ClickSpot — Atendimento Inteligente de Mesas com NFC & PWA Ultraleve

[![React](https://img.shields.io/badge/React-19.0-blue.svg?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-FCC72B.svg?logo=vitest&logoColor=black)](https://vitest.dev)
[![Hardware](https://img.shields.io/badge/NFC-NTAG213_%2F_215-orange.svg)]()
[![Privacy](https://img.shields.io/badge/LGPD-Privacy_by_Design-green.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status: Showcase](https://img.shields.io/badge/Status-Audited_&_Certified-orange.svg)]()

> **Encostou. Chamou. Pediu.**  
> Solução integrada de hardware físico (NFC NTAG213/215 + QR Code) e software ultraleve (< 45 KB) para atendimento instantâneo em restaurantes, bares e cafeterias, sem downloads de lojas ou cadastros.

---

## ⚡ Quickstart

```bash
# 1. Clonar o repositório
git clone https://github.com/kazuhirokamim/clickspot.git
cd clickspot

# 2. Instalar dependências
npm install

# 3. Rodar suíte de testes (30 testes TDD verdes)
npm test

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse em seu navegador móvel em `http://localhost:5173`.

---

## 🏛️ Fluxo Operacional Ciberfísico

```mermaid
graph LR
    Mesa["Placa Física de Mesa<br/>(Chip NFC NTAG213)"] -->|Tap do Celular| PWA["ClickSpot PWA<br/>(React 19 / < 45 KB)"]
    PWA --> Acoes["Ações em 1 Toque"]
    Acoes --> C1["Chamar Garçom<br/>(Vibração Háptica 40ms)"]
    Acoes --> C2["Cardápio Reels<br/>(Showcase FYP 9:16)"]
    Acoes --> C3["Pedir a Conta<br/>(Cartão / Dinheiro / Pix)"]
    Acoes --> Painel["Painel de Salão<br/>(Notificação Instantânea)"]
```

---

## 🚀 Diferenciais de Engenharia

- **Zero Instalação & Zero Cadastro:** O cliente não baixa aplicativos da App Store/Google Play nem cria senhas. A URL é disparada instantaneamente via chip NFC.
- **Showcase FYP 9:16:** Feed vertical de vídeos curtos dos pratos para elevar o ticket médio e o apetite do consumidor.
- **Feedback Háptico Imediato:** Confirmação de chamada de mesa via `navigator.vibrate` com fallback inteligente para dispositivos sem suporte.
- **Privacy by Design:** Nenhum dado pessoal do cliente é coletado ou armazenado (100% LGPD compliant).
- **Test-First Rigor:** 30 testes unitários automatizados com Vitest cobrindo fluxos de chamada, navegação de mídia e multi-inquilino.

---

## 📁 Estrutura de Diretórios

```
clickspot/
├── docs/                           # Planos SDD 2.0 e Decisões de Arquitetura (MADR)
├── documentation/                  # Acervo Técnico e Laudos Forenses
│   ├── academico/                  # Artigo IEEE/SBC e Dossiê 90/10
│   ├── auditorias/                 # Laudo Pericial Forense
│   └── showcase/                   # Vitrine GitHub e Post LinkedIn
├── src/                            # Código da aplicação React 19 PWA
└── tests/                          # 30 testes unitários com Vitest
```

---

## 📜 Licença

Distribuído sob a licença **MIT**.
