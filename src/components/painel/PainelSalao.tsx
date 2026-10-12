import React, { useState, useEffect, useRef } from 'react';
import { ChamadosStore } from '../../core/chamados-store.ts';
import { MultiTenantManager } from '../../core/multi-tenant-store.ts';
import { ChamadoMesa } from '../../types/chamado.ts';
import {
  BellIcon,
  CreditCardIcon,
  UtensilsIcon,
  CheckIcon,
  ClockIcon,
  VolumeIcon,
  VolumeXIcon
} from '../icons/Icons.tsx';

interface PainelSalaoProps {
  restauranteId: string;
  store: ChamadosStore;
  tenantManager: MultiTenantManager;
}

export const PainelSalao: React.FC<PainelSalaoProps> = ({
  restauranteId,
  store,
  tenantManager
}) => {
  const restaurante = tenantManager.obterRestaurante(restauranteId);
  const [chamados, setChamados] = useState<ChamadoMesa[]>([]);
  const [filtro, setFiltro] = useState<'pendentes' | 'atendidos' | 'todos'>('pendentes');
  const [somHabilitado, setSomHabilitado] = useState<boolean>(true);
  const contagemAnteriorRef = useRef<number>(0);

  // Reproduz um sinal sonoro suave via Web Audio API (Chime de bistrô)
  const tocarSinalSonoro = () => {
    if (!somHabilitado || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Oscilador 1: Tom C5 (523Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.5);

      // Oscilador 2: Tom E5 (659Hz) em harmonia
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.6);
    } catch {
      // Ignora silenciosamente se o navegador bloquear autoplay
    }
  };

  const recarregar = () => {
    const pendentes = store.listarPendentes(restauranteId);
    const todos = store.listarTodos(restauranteId);

    // Se houver novos chamados pendentes, toca o sino
    if (pendentes.length > contagemAnteriorRef.current) {
      tocarSinalSonoro();
    }
    contagemAnteriorRef.current = pendentes.length;

    if (filtro === 'pendentes') {
      setChamados(pendentes);
    } else if (filtro === 'atendidos') {
      setChamados(todos.filter((c) => c.status === 'atendido'));
    } else {
      setChamados(todos);
    }
  };

  useEffect(() => {
    recarregar();
    const interval = setInterval(recarregar, 1500);
    return () => clearInterval(interval);
  }, [restauranteId, filtro]);

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

  const totalPendentes = store.listarPendentes(restauranteId).length;

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '24px 16px', width: '100%', color: '#f5f5f4' }}>
      {/* Header do Balcão */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #262830', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Painel do Salão
          </span>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#fafaf9' }}>{restaurante?.nome || 'Restaurante'}</h1>
          <p style={{ color: '#a8a29e', fontSize: '13px', marginTop: '2px' }}>
            Tempo médio: <strong style={{ color: '#f5f5f4' }}>{restaurante?.tempoMedioAtendimento || '4 min'}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Botão de Som */}
          <button
            onClick={() => setSomHabilitado(!somHabilitado)}
            title={somHabilitado ? 'Silenciar avisos sonoros' : 'Ativar avisos sonoros'}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '10px', backgroundColor: '#1c1d22', border: '1px solid #2d2f36', color: somHabilitado ? '#d97706' : '#78716c', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
          >
            {somHabilitado ? <VolumeIcon size={16} /> : <VolumeXIcon size={16} />}
            <span>{somHabilitado ? 'Som Ativo' : 'Mudo'}</span>
          </button>

          {/* Badge de Chamados Pendentes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: totalPendentes > 0 ? '#331d06' : '#18191e', border: `1px solid ${totalPendentes > 0 ? '#78350f' : '#2d2f36'}`, color: totalPendentes > 0 ? '#fbbf24' : '#a8a29e', padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 700 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: totalPendentes > 0 ? '#d97706' : '#57534e' }}></span>
            <span>{totalPendentes} {totalPendentes === 1 ? 'pendente' : 'pendentes'}</span>
          </div>
        </div>
      </header>

      {/* Barra de Filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['pendentes', 'atendidos', 'todos'] as const).map((modo) => (
          <button
            key={modo}
            onClick={() => setFiltro(modo)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: filtro === modo ? '#d97706' : '#1c1d22',
              color: filtro === modo ? '#ffffff' : '#a8a29e'
            }}
          >
            {modo === 'pendentes' ? 'Pendentes' : modo === 'atendidos' ? 'Atendidos' : 'Todos os Chamados'}
          </button>
        ))}
      </div>

      {/* Lista de Chamados */}
      {chamados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#18191e', borderRadius: '16px', border: '1px dashed #2d2f36' }}>
          <div style={{ width: '48px', height: '48px', margin: '0 auto 12px auto', borderRadius: '50%', backgroundColor: '#212328', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#78716c' }}>
            <CheckIcon size={24} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fafaf9' }}>Nenhum chamado neste filtro</h3>
          <p style={{ color: '#a8a29e', fontSize: '13px', marginTop: '4px' }}>Quando uma mesa aproximar o celular e solicitar atendimento, aparecerá aqui.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {chamados.map((item) => {
            const ehConta = item.tipo === 'pedir_conta';
            const pendente = item.status === 'pendente';

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#1c1d22',
                  border: pendente ? (ehConta ? '1px solid #d97706' : '1px solid #451a03') : '1px solid #2d2f36',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: pendente ? 1 : 0.6
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#fafaf9' }}>
                      Mesa {item.mesaId}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#a8a29e' }}>
                      <ClockIcon size={12} />
                      <span>{formatarTempo(item.criadoEm)}</span>
                    </span>
                  </div>

                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', backgroundColor: ehConta ? '#331d06' : '#262830', color: ehConta ? '#fbbf24' : '#e7e5e4', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
                    {ehConta ? <CreditCardIcon size={14} /> : item.tipo === 'gelo_talher_guardanapo' ? <UtensilsIcon size={14} /> : <BellIcon size={14} />}
                    <span>{ehConta ? 'Pedir Conta' : item.tipo === 'gelo_talher_guardanapo' ? 'Gelo / Talher' : 'Garçom na Mesa'}</span>
                    {item.metodoPagamento && <span>• {item.metodoPagamento.toUpperCase()}</span>}
                  </div>
                </div>

                {pendente ? (
                  <button
                    onClick={() => concluir(item.id)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      backgroundColor: '#262830',
                      border: '1px solid #363942',
                      color: '#fafaf9',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <CheckIcon size={16} style={{ color: '#86efac' }} />
                    <span>Concluir Atendimento</span>
                  </button>
                ) : (
                  <div style={{ textAlign: 'center', padding: '6px', color: '#78716c', fontSize: '12px', fontWeight: 500 }}>
                    Atendido
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
