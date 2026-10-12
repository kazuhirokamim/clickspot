import React, { useState, useEffect, useRef } from 'react';
import { ItemCardapio } from '../../types/cardapio.ts';
import { ReelNavigator } from '../../core/reel-navigator.ts';
import {
  XIcon,
  VolumeIcon,
  VolumeXIcon,
  BellIcon,
  ClockIcon
} from '../icons/Icons.tsx';

interface ShowcaseVerticalReelProps {
  itens: ItemCardapio[];
  indiceInicial: number;
  nomeRestaurante: string;
  onFechar: () => void;
  onChamarGarcom: () => void;
}

export const ShowcaseVerticalReel: React.FC<ShowcaseVerticalReelProps> = ({
  itens,
  indiceInicial,
  nomeRestaurante,
  onFechar,
  onChamarGarcom
}) => {
  const [navigator] = useState(() => new ReelNavigator(itens, indiceInicial, { thresholdSwipe: 45 }));
  const [indiceAtivo, setIndiceAtivo] = useState<number>(() => navigator.obterIndiceAtual());
  const [somVideoHabilitado, setSomVideoHabilitado] = useState<boolean>(false);
  const [toqueInicioY, setToqueInicioY] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const itemAtual = itens[indiceAtivo] || itens[0];

  // Sincroniza áudio do vídeo ao alternar item
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !somVideoHabilitado;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [indiceAtivo, somVideoHabilitado]);

  // Teclado (Seta Cima/Baixo/ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar();
      if (e.key === 'ArrowDown') navegarProximo();
      if (e.key === 'ArrowUp') navegarAnterior();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [indiceAtivo]);

  const navegarProximo = () => {
    if (navigator.proximo()) {
      setIndiceAtivo(navigator.obterIndiceAtual());
    }
  };

  const navegarAnterior = () => {
    if (navigator.anterior()) {
      setIndiceAtivo(navigator.obterIndiceAtual());
    }
  };

  // Tratamento de Gestos de Toque no Mobile (Touch Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    setToqueInicioY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (toqueInicioY === null) return;
    const deltaY = e.changedTouches[0].clientY - toqueInicioY;
    setToqueInicioY(null);

    // DeltaY negativo = arrastou para cima -> próximo
    // DeltaY positivo = arrastou para baixo -> anterior
    if (navigator.processarGestoVertical(deltaY)) {
      setIndiceAtivo(navigator.obterIndiceAtual());
    }
  };

  if (!itemAtual) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        overflow: 'hidden'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Container Vertical 9:16 (Dimensões TikTok/Reels) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          maxHeight: '94vh',
          backgroundColor: '#000000',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
          border: '1px solid #2d2f36'
        }}
      >
        {/* Camada de Mídia: Vídeo de Produção ou Foto Gastronômica */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, backgroundColor: '#090a0d' }}>
          {itemAtual.videoUrl ? (
            <video
              ref={videoRef}
              src={itemAtual.videoUrl}
              autoPlay
              loop
              playsInline
              muted={!somVideoHabilitado}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <img
              src={itemAtual.fotoUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
              alt={itemAtual.nome}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.9)'
              }}
            />
          )}

          {/* Gradientes de Leitura (Topo e Base) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.95) 100%)'
            }}
          />
        </div>

        {/* Camada Superior: Barras de Progresso de Histórias & Controles */}
        <div style={{ position: 'relative', zIndex: 10, padding: '16px 16px 8px 16px' }}>
          {/* Segmentos de Indicadores do Carrossel */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            {itens.map((it, idx) => (
              <div
                key={it.id}
                onClick={() => {
                  navigator.irPara(idx);
                  setIndiceAtivo(idx);
                }}
                style={{
                  flex: 1,
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: idx === indiceAtivo ? '#d97706' : 'rgba(255,255,255,0.25)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              />
            ))}
          </div>

          {/* Top Bar: Nome do Restaurante + Som + Fechar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#f5f5f4', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                {nomeRestaurante}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {itemAtual.videoUrl && (
                <button
                  onClick={() => setSomVideoHabilitado(!somVideoHabilitado)}
                  title={somVideoHabilitado ? 'Silenciar som' : 'Ativar som do vídeo'}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  {somVideoHabilitado ? <VolumeIcon size={16} /> : <VolumeXIcon size={16} />}
                </button>
              )}

              <button
                onClick={onFechar}
                title="Fechar (Esc)"
                style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <XIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Indicadores Visuais Laterais de Navegação Vertical (Desktop / Clique) */}
        <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', paddingRight: '12px', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'auto' }}>
            <button
              disabled={indiceAtivo === 0}
              onClick={navegarAnterior}
              title="Prato anterior (Arraste para baixo)"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: indiceAtivo === 0 ? 'rgba(255,255,255,0.3)' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: indiceAtivo === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ↑
            </button>
            <button
              disabled={indiceAtivo >= itens.length - 1}
              onClick={navegarProximo}
              title="Próximo prato (Arraste para cima)"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: indiceAtivo >= itens.length - 1 ? 'rgba(255,255,255,0.3)' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: indiceAtivo >= itens.length - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              ↓
            </button>
          </div>
        </div>

        {/* Camada Inferior: Informações do Prato & Chamada para Ação */}
        <div style={{ position: 'relative', zIndex: 10, padding: '20px 18px 24px 18px' }}>
          {/* Tempo de Preparo (se disponível) */}
          {itemAtual.tempoPreparo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', color: '#e7e5e4', fontSize: '12px' }}>
              <ClockIcon size={13} style={{ color: '#d97706' }} />
              <span>Preparo em ~{itemAtual.tempoPreparo}</span>
            </div>
          )}

          {/* Nome e Preço */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.8)', lineHeight: 1.2 }}>
              {itemAtual.nome}
            </h2>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#fbbf24', textShadow: '0 2px 4px rgba(0,0,0,0.8)', whiteSpace: 'nowrap' }}>
              {itemAtual.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

          {/* Descrição */}
          <p style={{ fontSize: '13px', color: '#e7e5e4', lineHeight: 1.45, marginBottom: '18px', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
            {itemAtual.descricao}
          </p>

          {/* Botão Unificado: Chamar Garçom */}
          <button
            onClick={onChamarGarcom}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              backgroundColor: '#1c1d22',
              border: '1px solid #363942',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
            }}
          >
            <BellIcon size={18} style={{ color: '#d97706' }} />
            <span>Chamar Garçom</span>
          </button>

          {/* Dica de Gesto no Mobile */}
          <span style={{ display: 'block', textAlign: 'center', marginTop: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
            Deslize para cima ou para baixo para ver outros pratos
          </span>
        </div>
      </div>
    </div>
  );
};
