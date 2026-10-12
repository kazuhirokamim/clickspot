import React, { useState, useEffect } from 'react';
import { ChamadosStore } from '../../core/chamados-store.ts';
import { ChamadoMesa } from '../../types/chamado.ts';

interface PainelSalaoProps {
  restauranteId: string;
  nomeRestaurante: string;
  store: ChamadosStore;
}

export const PainelSalao: React.FC<PainelSalaoProps> = ({
  restauranteId,
  nomeRestaurante,
  store
}) => {
  const [chamados, setChamados] = useState<ChamadoMesa[]>([]);

  // Atualização reativa de chamados
  const recarregar = () => {
    setChamados(store.listarPendentes(restauranteId));
  };

  useEffect(() => {
    recarregar();
    const interval = setInterval(recarregar, 2000);
    return () => clearInterval(interval);
  }, [restauranteId]);

  const concluir = (chamadoId: string) => {
    store.marcarAtendido(restauranteId, chamadoId);
    recarregar();
  };

  const formatarTempo = (timestamp: number) => {
    const segundos = Math.floor((Date.now() - timestamp) / 1000);
    if (segundos < 60) return `${segundos}s atrás`;
    const minutos = Math.floor(segundos / 60);
    return `${minutos}min atrás`;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', width: '100%' }}>
      {/* Header do Painel */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>Painel de Atendimento</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>{nomeRestaurante} • Balcão / Garçons</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f172a', padding: '6px 14px', borderRadius: '999px', border: '1px solid #334155' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
            {chamados.length} {chamados.length === 1 ? 'chamado ativo' : 'chamados ativos'}
          </span>
        </div>
      </header>

      {/* Lista de Chamados */}
      {chamados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#131b2e', borderRadius: '16px', border: '1px dashed #334155' }}>
          <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>☕</span>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>Todas as mesas atendidas</h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Os novos chamados aparecerão aqui automaticamente.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {chamados.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: item.tipo === 'pedir_conta' ? '#1e1b4b' : '#131b2e',
                border: item.tipo === 'pedir_conta' ? '1px solid #6366f1' : '1px solid #0284c7',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
                    Mesa {item.mesaId}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {formatarTempo(item.criadoEm)}
                  </span>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '8px', backgroundColor: item.tipo === 'pedir_conta' ? '#312e81' : '#075985', color: '#ffffff', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
                  <span>{item.tipo === 'pedir_conta' ? '💳 Conta' : '🛎️ Garçom'}</span>
                  {item.metodoPagamento && <span>• {item.metodoPagamento.toUpperCase()}</span>}
                </div>
              </div>

              <button
                onClick={() => concluir(item.id)}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#10b981',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>✓</span>
                <span>Concluir Atendimento</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
