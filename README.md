# 🛎️ Call-in — Atendimento Inteligente de Mesas com NFC & PWA

> **Encostou. Chamou. Pediu.**  
> Solução integrada de hardware físico (NFC/QR Code) e software ultraleve para atendimento ágil em restaurantes, bares e cafeterias.

---

## 🧭 Visão do Produto
O **Call-in** elimina a fricção do atendimento em estabelecimentos de rotação contínua. 
O cliente senta na mesa, encosta o smartphone na plaquinha com chip NFC (ou escaneia o QR Code) e tem acesso imediato a 3 ações essenciais sem precisar baixar aplicativo ou criar conta:
1. 📖 **Cardápio Digital:** Visualização limpa e categorizada de pratos e bebidas.
2. 🛎️ **Chamar Atendente:** Disparo instantâneo com vibração háptica no celular e alerta sonoro no balcão.
3. 💳 **Pedir a Conta:** Escolha rápida da forma de pagamento (Cartão Débito, Crédito, Dinheiro ou chave Pix imediata).

---

## 🏛️ Governança e Qualidade (Padrão Tear & Noesis)
Este projeto segue rigorosamente o cânone de engenharia de software **Tear**:
- **Test-First / TDD:** 100% das funções centrais acompanhadas por testes nos 3 cenários (Caminho Feliz, Borda e Erro).
- **Docs-First & ADRs:** Todas as decisões registradas em `docs/adr/` e planos em `docs/plans/`.
- **4 Lanes Golden & Green:** Auditoria de Código, Segurança (Zero Retenção), LGPD e Performance (< 500ms em 4G).
- **Limite por Arquivo:** Menos de 700 linhas de código por arquivo.

---

## 🛠️ Stack Tecnológica
- **Frontend / PWA:** Vite + React 19 + TypeScript + Tailwind CSS
- **Testes:** Vitest + Testing Library
- **Hardware:** Placas físicas de mesa com chip NFC NTAG213/215 (13.56 MHz, compatível universalmente com iOS e Android) programadas via app **NFC Tools**.
- **Realtime:** WebSockets / Eventos reativos leves.

---

## 📂 Estrutura do Repositório
```
callin/
├── .gitignore
├── GEMINI.md                  # Ponteiro do Cânone Tear
├── README.md                  # Este documento
├── CHANGELOG.md               # Registro cronológico de versões
├── docs/
│   ├── adr/                   # Decisões arquiteturais (ADR-001)
│   └── plans/                 # Blueprints de engenharia (PLAN-001)
├── documentation/             # Documentação viva do sistema
│   ├── ARCHITECTURE.md        # Arquitetura e fluxo de dados
│   └── REQUIREMENTS.md        # Especificação EARS
├── respostas/                 # TearForms de requisitos
├── src/                       # Código-fonte da aplicação
└── tests/                     # Bateria de testes TDD
```

---

## 🚀 Como Executar Localmente
```bash
# Instalar dependências
npm install

# Rodar testes TDD
npm test

# Executar ambiente de desenvolvimento
npm run dev
```
