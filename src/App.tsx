import React, { useState } from 'react';
import { ChamadosStore } from './core/chamados-store.ts';
import { MultiTenantManager } from './core/multi-tenant-store.ts';
import { TelaMesa } from './components/mesa/TelaMesa.tsx';
import { PainelSalao } from './components/painel/PainelSalao.tsx';
import { BellIcon, UtensilsIcon } from './components/icons/Icons.tsx';

// Instâncias globais únicas para simulação e teste de multi-tenancy
const storeGlobal = new ChamadosStore({ cooldownSegundos: 30 });
const tenantManagerGlobal = new MultiTenantManager();

export const App: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'mesa' | 'painel'>('mesa');
  const [restauranteId, setRestauranteId] = useState<string>('pizzaria-roma');
  const [mesaSelecionada, setMesaSelecionada] = useState<string>('04');

  const restaurantes = tenantManagerGlobal.listarRestaurantes();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#121316', color: '#f5f5f4' }}>
      {/* Barra de Controle e Multi-Tenancy (Modo Demonstração / Dev) */}
      <nav style={{ backgroundColor: '#18191e', borderBottom: '1px solid #262830', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <UtensilsIcon size={18} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '15px', color: '#fafaf9', letterSpacing: '-0.02em', display: 'block', lineHeight: 1 }}>Call-in</span>
            <span style={{ fontSize: '11px', color: '#78716c' }}>Atendimento Inteligente</span>
          </div>
        </div>

        {/* Controles de Simulação Multi-Tenant */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Seletor de Restaurante Tenant */}
          <select
            value={restauranteId}
            onChange={(e) => setRestauranteId(e.target.value)}
            style={{ backgroundColor: '#212328', color: '#f5f5f4', border: '1px solid #2f323a', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
          >
            {restaurantes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome} {r.statusAssinatura === 'suspenso' ? '(Suspenso)' : ''}
              </option>
            ))}
          </select>

          {/* Seletor de Mesa (quando na visão de mesa) */}
          {abaAtiva === 'mesa' && (
            <select
              value={mesaSelecionada}
              onChange={(e) => setMesaSelecionada(e.target.value)}
              style={{ backgroundColor: '#212328', color: '#f5f5f4', border: '1px solid #2f323a', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
            >
              <option value="01">Mesa 01</option>
              <option value="02">Mesa 02</option>
              <option value="04">Mesa 04 (NFC Demo)</option>
              <option value="07">Mesa 07</option>
              <option value="12">Mesa 12</option>
            </select>
          )}

          {/* Alternador de Visão */}
          <div style={{ display: 'inline-flex', backgroundColor: '#212328', padding: '3px', borderRadius: '9px', border: '1px solid #2f323a' }}>
            <button
              onClick={() => setAbaAtiva('mesa')}
              style={{
                padding: '5px 12px',
                borderRadius: '7px',
                border: 'none',
                backgroundColor: abaAtiva === 'mesa' ? '#d97706' : 'transparent',
                color: abaAtiva === 'mesa' ? '#ffffff' : '#a8a29e',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Mesa (Cliente)
            </button>
            <button
              onClick={() => setAbaAtiva('painel')}
              style={{
                padding: '5px 12px',
                borderRadius: '7px',
                border: 'none',
                backgroundColor: abaAtiva === 'painel' ? '#d97706' : 'transparent',
                color: abaAtiva === 'painel' ? '#ffffff' : '#a8a29e',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <BellIcon size={13} />
              <span>Balcão</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Área Central */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {abaAtiva === 'mesa' ? (
          <TelaMesa
            restauranteId={restauranteId}
            mesaId={mesaSelecionada}
            store={storeGlobal}
            tenantManager={tenantManagerGlobal}
          />
        ) : (
          <PainelSalao
            restauranteId={restauranteId}
            store={storeGlobal}
            tenantManager={tenantManagerGlobal}
          />
        )}
      </main>
    </div>
  );
};
