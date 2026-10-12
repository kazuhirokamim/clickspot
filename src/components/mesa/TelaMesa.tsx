import React, { useState, useEffect } from 'react';
import { ChamadosStore } from '../../core/chamados-store.ts';
import { TipoChamado, MetodoPagamento } from '../../types/chamado.ts';

interface TelaMesaProps {
  restauranteId: string;
  nomeRestaurante: string;
  mesaId: string;
  store: ChamadosStore;
}

export const TelaMesa: React.FC<TelaMesaProps> = ({
  restauranteId,
  nomeRestaurante,
  mesaId,
  store
}) => {
  const [cooldown, setCooldown] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [mostrarCardapio, setMostrarCardapio] = useState<boolean>(false);
  const [mostrarModalConta, setMostrarModalConta] = useState<boolean>(false);
  const [pixCopiado, setPixCopiado] = useState<boolean>(false);

  // Timer regressivo de cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const dispararChamado = (tipo: TipoChamado, metodo?: MetodoPagamento) => {
    // Feedback tátil háptico no celular
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }

    const resultado = store.registrarChamado({
      restauranteId,
      mesaId,
      tipo,
      metodoPagamento: metodo
    });

    if (resultado.sucesso) {
      setCooldown(30);
      if (tipo === 'pedir_conta') {
        setStatusMsg('Conta solicitada! O garçom trará a maquininha ou comprovante.');
        setMostrarModalConta(false);
      } else {
        setStatusMsg('Atendente notificado! Aguarde na mesa.');
      }
    } else if (resultado.motivo === 'spam_bloqueado') {
      setStatusMsg(`Aguarde ${resultado.tempoRestanteCooldown}s para chamar novamente.`);
    }
  };

  const copiarPix = () => {
    const chavePix = 'contato@callin.app';
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(chavePix);
      setPixCopiado(true);
      setTimeout(() => setPixCopiado(false), 3000);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', width: '100%' }}>
      {/* Header da Mesa */}
      <header style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#38bdf8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Atendimento Digital
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>{nomeRestaurante}</h1>
        <p style={{ fontSize: '16px', color: '#94a3b8', marginTop: '4px' }}>
          Você está na <strong style={{ color: '#f8fafc' }}>Mesa {mesaId}</strong>
        </p>
      </header>

      {/* Alerta de Status / Notificação */}
      {statusMsg && (
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #0284c7', color: '#38bdf8', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔔</span>
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Grid Bento de Ações da Mesa */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Card 1: Cardápio */}
        <button
          onClick={() => setMostrarCardapio(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', backgroundColor: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', cursor: 'pointer', textAlign: 'left', transition: 'transform 0.1s' }}
        >
          <span style={{ fontSize: '32px' }}>📖</span>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>Ver Cardápio</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>Pratos, porções, bebidas e preços</p>
          </div>
          <span style={{ color: '#64748b', fontSize: '20px' }}>→</span>
        </button>

        {/* Card 2: Chamar Garçom */}
        <button
          disabled={cooldown > 0}
          onClick={() => dispararChamado('garcom_mesa')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px',
            backgroundColor: cooldown > 0 ? '#1e293b' : '#0284c7',
            border: 'none',
            borderRadius: '16px',
            cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
            textAlign: 'left',
            boxShadow: cooldown > 0 ? 'none' : '0 10px 25px -5px rgba(2, 132, 199, 0.4)'
          }}
        >
          <span style={{ fontSize: '32px' }}>🛎️</span>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
              {cooldown > 0 ? `Chamado Enviado (${cooldown}s)` : 'Chamar Garçom'}
            </h3>
            <p style={{ fontSize: '13px', color: cooldown > 0 ? '#94a3b8' : '#e0f2fe', marginTop: '2px' }}>
              {cooldown > 0 ? 'Atendente já foi notificado' : 'Notificar garçom para vir até a mesa'}
            </p>
          </div>
        </button>

        {/* Card 3: Pedir a Conta */}
        <button
          onClick={() => setMostrarModalConta(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', backgroundColor: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', cursor: 'pointer', textAlign: 'left' }}
        >
          <span style={{ fontSize: '32px' }}>💳</span>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>Pedir a Conta</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>Pagar no cartão, dinheiro ou chave Pix</p>
          </div>
          <span style={{ color: '#64748b', fontSize: '20px' }}>→</span>
        </button>
      </div>

      {/* Modal do Cardápio */}
      {mostrarCardapio && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 50 }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '20px', maxWidth: '420px', width: '100%', padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>Cardápio Digital</h2>
              <button onClick={() => setMostrarCardapio(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#1e293b' }}>
                <strong style={{ color: '#f8fafc', display: 'block' }}>Burger Artesanal Clássico</strong>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Pão brioche, 180g blend Angus, queijo cheddar e bacon.</span>
                <span style={{ color: '#38bdf8', fontWeight: 700, display: 'block', marginTop: '6px' }}>R$ 38,90</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#1e293b' }}>
                <strong style={{ color: '#f8fafc', display: 'block' }}>Batata Rústica com Alecrim</strong>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Porção crocante com maionese da casa.</span>
                <span style={{ color: '#38bdf8', fontWeight: 700, display: 'block', marginTop: '6px' }}>R$ 24,00</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#1e293b' }}>
                <strong style={{ color: '#f8fafc', display: 'block' }}>Refrigerante / Suco Natural</strong>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Lata 350ml / Copo 400ml.</span>
                <span style={{ color: '#38bdf8', fontWeight: 700, display: 'block', marginTop: '6px' }}>R$ 8,00</span>
              </div>
            </div>
            <button onClick={() => setMostrarCardapio(false)} style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#334155', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
              Fechar Cardápio
            </button>
          </div>
        </div>
      )}

      {/* Modal de Pedir a Conta */}
      {mostrarModalConta && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 50 }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '20px', maxWidth: '420px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>Como deseja pagar?</h2>
              <button onClick={() => setMostrarModalConta(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>Escolha a forma de pagamento para avisarmos o atendente:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => dispararChamado('pedir_conta', 'pix')} style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#10b981', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>✨ Pix (Chave Imediata)</span>
                <span>→</span>
              </button>
              <button onClick={() => dispararChamado('pedir_conta', 'credito')} style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                💳 Cartão de Crédito
              </button>
              <button onClick={() => dispararChamado('pedir_conta', 'debito')} style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                💳 Cartão de Débito
              </button>
              <button onClick={() => dispararChamado('pedir_conta', 'dinheiro')} style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                💵 Dinheiro
              </button>
            </div>

            {/* Chave Pix Rápida */}
            <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#0b0f19', borderRadius: '12px', border: '1px dashed #334155', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Chave Pix do Restaurante:</span>
              <code style={{ color: '#38bdf8', fontWeight: 700 }}>contato@callin.app</code>
              <button onClick={copiarPix} style={{ marginTop: '8px', display: 'block', width: '100%', padding: '6px', backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #475569', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
                {pixCopiado ? '✅ Chave Copiada!' : '📋 Copiar Chave Pix'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer minimalista */}
      <footer style={{ marginTop: '40px', textAlign: 'center', fontSize: '11px', color: '#475569' }}>
        Call-in Atendimento Inteligente • Padrão Tear
      </footer>
    </div>
  );
};
