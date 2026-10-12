import React, { useState } from 'react';
import { ChamadosStore } from './core/chamados-store.ts';
import { TelaMesa } from './components/mesa/TelaMesa.tsx';
import { PainelSalao } from './components/painel/PainelSalao.tsx';

// Instância compartilhada do store para demonstração local
const storeGlobal = new ChamadosStore({ cooldownSegundos: 30 });

export const App: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'mesa' | 'painel'>('mesa');
  const [mesaSelecionada, setMesaSelecionada] = useState<string>('04');
  const restauranteId = 'pizzaria-roma';
  const nomeRestaurante = 'Pizzaria Bella Roma';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Barra de Simulação Local (Dev / Teste de NFC) */}
      <nav style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🛎️</span>
          <span style={{ fontWeight: 800, fontSize: '15px', color: '#f8fafc' }}>Call-in Preview</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setAbaAtiva('mesa')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: abaAtiva === 'mesa' ? '#0284c7' : '#1e293b',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            📱 Visão da Mesa
          </button>
          <button
            onClick={() => setAbaAtiva('painel')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: abaAtiva === 'painel' ? '#0284c7' : '#1e293b',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            🔔 Visão do Balcão
          </button>
          {abaAtiva === 'mesa' && (
            <select
              value={mesaSelecionada}
              onChange={(e) => setMesaSelecionada(e.target.value)}
              style={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', padding: '6px 10px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
            >
              <option value="01">Mesa 01</option>
              <option value="02">Mesa 02</option>
              <option value="04">Mesa 04 (NFC Demo)</option>
              <option value="07">Mesa 07</option>
              <option value="12">Mesa 12</option>
            </select>
          )}
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {abaAtiva === 'mesa' ? (
          <TelaMesa
            restauranteId={restauranteId}
            nomeRestaurante={nomeRestaurante}
            mesaId={mesaSelecionada}
            store={storeGlobal}
          />
        ) : (
          <PainelSalao
            restauranteId={restauranteId}
            nomeRestaurante={nomeRestaurante}
            store={storeGlobal}
          />
        )}
      </main>
    </div>
  );
};
