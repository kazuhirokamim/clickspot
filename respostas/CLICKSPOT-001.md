# 📋 TearForm: Requisitos e Especificação do ClickSpot (CLICKSPOT-001)

**Autor:** Philip Kazuhiro Kamimura (Kazu)  
**Projeto:** ClickSpot (Atendimento Inteligente de Mesas com NFC/QR Code)  
**Status:** Validado & Ratificado  
**Data:** 11/10/2026  

---

## 1. Problema de Negócio & Contexto
Restaurantes de atendimento rápido e rotação contínua (hamburguerias, pizzarias, bares, cafés) enfrentam:
- Lentidão no atendimento de mesas e perda de pedidos secundários (bebidas, sobremesas).
- Clientes gesticulando ou esperando minutos apenas para pedir a conta ou chamar o garçom.
- Soluções existentes (como Chamaii) são excessivamente complexas na contratação, não entregam o hardware físico pronto e focam em interfaces corporativas pesadas.

## 2. Visão do Produto ClickSpot
O ClickSpot é uma solução híbrida de hardware NFC e software PWA ultraleve:
- **Hardware:** Plaquinhas físicas de mesa com chip NFC NTAG213/215 e QR Code gravados via app NFC Tools.
- **Software:** Aplicação Web progressiva (PWA) sem necessidade de download ou login do cliente final.
- **Tríade de Ações da Mesa:**
  1. Cardápio Digital (Visualização limpa com Reels verticais 9:16).
  2. Chamar Garçom (Direto 1-toque, sem subopções, feedback háptico).
  3. Pedir a Conta (Débito, Crédito, Dinheiro, Pix instantâneo).

## 3. Critérios de Aceite EARS (Easy Approach to Requirements Syntax)
- **UBIQUITOUS:** O sistema ClickSpot DEVE operar 100% via navegador web sem exigir download de app pela App Store/Google Play nem cadastro prévio do cliente.
- **EVENT-DRIVEN:** QUANDO um cliente aproxima o smartphone com NFC ou escaneia o QR Code da mesa, O sistema DEVE carregar a página da mesa em menos de 800ms.
- **EVENT-DRIVEN:** QUANDO o cliente clica em "Chamar Garçom", O sistema DEVE registrar o chamado em tempo real no painel do salão/balcão e emitir feedback háptico (vibração) no celular do cliente.
- **STATE-DRIVEN:** ENQUANTO houver um chamado em aberto para aquela mesa, O botão DEVE indicar "Garçom a caminho da mesa (aguarde)".
- **EVENT-DRIVEN:** QUANDO o cliente clica em "Pedir a Conta" e seleciona "Pix", O sistema DEVE exibir a chave/QR Code Pix do estabelecimento para pagamento instantâneo.
