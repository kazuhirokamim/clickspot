# 📋 Especificação Formal de Requisitos (EARS) — ClickSpot

## 1. Princípios Gerais (Ubiquitous)
- **REQ-UBI-01:** O sistema ClickSpot deve ser inteiramente acessível via navegador web moderno (iOS Safari, Android Chrome, Edge) sem exigir instalação de aplicativo ou permissões invasivas de hardware.
- **REQ-UBI-02:** O sistema não deve reter dados pessoais de identificação (Zero Retenção e LGPD compliance).

---

## 2. Requisitos Orientados a Eventos (Event-Driven)
- **REQ-EVT-01:** Quando a tag NFC for aproximada de um smartphone com leitor NFC ativo, o navegador deve abrir imediatamente a comanda da mesa correspondente em menos de 500ms.
- **REQ-EVT-02:** Quando o cliente acionar o botão "Chamar Garçom", o sistema deve emitir vibração háptica (`navigator.vibrate(200)`), registrar o chamado na fila do restaurante e travar reenvios por 30 segundos.
- **REQ-EVT-03:** Quando o cliente selecionar "Pedir a Conta" na opção "Pix", o sistema deve exibir a chave Pix do estabelecimento e botão "Copiar Chave".
- **REQ-EVT-04:** Quando um atendente clicar no botão "Concluir Atendimento" no painel do salão, o status da mesa deve transitar para "concluído" e desocupar a lista de pendentes.

---

## 3. Requisitos Orientados a Estado (State-Driven)
- **REQ-STA-01:** Enquanto houver um chamado não atendido para a mesa, a tela do cliente deve exibir badge informativo: *"Garçom a caminho da mesa"*.
- **REQ-STA-02:** Enquanto a conexão com o servidor estiver temporariamente indisponível, o sistema deve manter os dados em cache de memória e exibir indicador de reconexão automática.
