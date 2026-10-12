import React, { useState, useEffect } from 'react';
import { ChamadosStore } from '../../core/chamados-store.ts';
import { MultiTenantManager } from '../../core/multi-tenant-store.ts';
import { TipoChamado, MetodoPagamento } from '../../types/chamado.ts';
import { ItemCardapio } from '../../types/cardapio.ts';
import { ShowcaseVerticalReel } from './ShowcaseVerticalReel.tsx';
import {
  BellIcon,
  BookOpenIcon,
  CreditCardIcon,
  CheckIcon,
  CopyIcon,
  XIcon,
  SearchIcon,
  ChevronRightIcon
} from '../icons/Icons.tsx';

interface TelaMesaProps {
  restauranteId: string;
  mesaId: string;
  store: ChamadosStore;
  tenantManager: MultiTenantManager;
}

export const TelaMesa: React.FC<TelaMesaProps> = ({
  restauranteId,
  mesaId,
  store,
  tenantManager
}) => {
  const restaurante = tenantManager.obterRestaurante(restauranteId);
  const estaAtivo = tenantManager.estaAtivo(restauranteId);

  const [cooldown, setCooldown] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<{ texto: string; tipo: 'sucesso' | 'info' | 'aviso' } | null>(null);

  // Estados dos Modais
  const [modalCardapioAberto, setModalCardapioAberto] = useState<boolean>(false);
  const [modalContaAberto, setModalContaAberto] = useState<boolean>(false);

  // Estado do Showcase FYP / Reels
  const [reelAberto, setReelAberto] = useState<boolean>(false);
  const [indiceReel, setIndiceReel] = useState<number>(0);

  // Estados de navegação interna do cardápio
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas');
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [pixCopiado, setPixCopiado] = useState<boolean>(false);

  // Cooldown regressivo de 30s
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const dispararChamado = (tipo: TipoChamado, metodo?: MetodoPagamento) => {
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
      setModalContaAberto(false);
      setReelAberto(false);

      if (tipo === 'pedir_conta') {
        setStatusMsg({
          texto: `Conta solicitada (${metodo?.toUpperCase()}). O atendente está a caminho.`,
          tipo: 'sucesso'
        });
      } else {
        setStatusMsg({
          texto: `Garçom chamado para a Mesa ${mesaId}! Em instantes você será atendido.`,
          tipo: 'sucesso'
        });
      }
    } else if (resultado.motivo === 'spam_bloqueado') {
      setStatusMsg({
        texto: `Aguarde ${resultado.tempoRestanteCooldown}s para chamar novamente.`,
        tipo: 'aviso'
      });
    }
  };

  const copiarPix = () => {
    const chave = restaurante?.chavePix || 'contato@callin.app';
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(chave);
      setPixCopiado(true);
      setTimeout(() => setPixCopiado(false), 3000);
    }
  };

  if (!restaurante) {
    return (
      <div style={{ maxWidth: '440px', margin: '60px auto', padding: '24px', textAlign: 'center', backgroundColor: '#1c1d22', borderRadius: '16px', border: '1px solid #32353e', color: '#f5f5f4' }}>
        <p style={{ fontSize: '16px', color: '#a8a29e' }}>Restaurante não encontrado.</p>
      </div>
    );
  }

  if (!estaAtivo) {
    return (
      <div style={{ maxWidth: '440px', margin: '60px auto', padding: '32px 24px', textAlign: 'center', backgroundColor: '#1c1d22', borderRadius: '16px', border: '1px solid #44403c', color: '#f5f5f4' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f5f5f4', marginBottom: '8px' }}>{restaurante.nome}</h2>
        <p style={{ fontSize: '14px', color: '#a8a29e', lineHeight: 1.6 }}>
          O cardápio digital desta unidade está temporariamente em atualização. Por favor, solicite o atendimento ao garçom.
        </p>
      </div>
    );
  }

  // Todos os itens do restaurante
  const todosOsItens = restaurante.cardapio.flatMap((c) => c.itens);

  // Filtragem de itens do cardápio no modal
  const categorias = restaurante.cardapio;
  const itensExibidos = categorias
    .filter((cat) => categoriaAtiva === 'todas' || cat.id === categoriaAtiva)
    .flatMap((cat) =>
      cat.itens.filter((item) => {
        if (!termoBusca) return true;
        const busca = termoBusca.toLowerCase();
        return item.nome.toLowerCase().includes(busca) || item.descricao.toLowerCase().includes(busca);
      })
    );

  const abrirReelDoItem = (item: ItemCardapio) => {
    const idx = todosOsItens.findIndex((i) => i.id === item.id);
    setIndiceReel(idx >= 0 ? idx : 0);
    setReelAberto(true);
  };

  return (
    <div style={{ maxWidth: '460px', margin: '0 auto', padding: '24px 18px', width: '100%', color: '#f5f5f4' }}>
      {/* Topo / Header da Mesa (Foco Mobile Direto) */}
      <header style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '999px', backgroundColor: '#1c1d22', border: '1px solid #2d2f36', color: '#d97706', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '10px' }}>
          <span>Mesa {mesaId}</span>
          <span style={{ color: '#57534e' }}>•</span>
          <span style={{ color: '#a8a29e' }}>{restaurante.segmento}</span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fafaf9', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          {restaurante.nome}
        </h1>
      </header>

      {/* Alerta de Status / Notificação */}
      {statusMsg && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '14px', backgroundColor: statusMsg.tipo === 'sucesso' ? '#1c241c' : '#262016', border: `1px solid ${statusMsg.tipo === 'sucesso' ? '#2e4c2e' : '#5c4314'}`, color: statusMsg.tipo === 'sucesso' ? '#86efac' : '#fcd34d', fontSize: '13px', fontWeight: 500, marginBottom: '20px' }}>
          <span>{statusMsg.texto}</span>
          <button onClick={() => setStatusMsg(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', padding: 0 }}>
            <XIcon size={16} />
          </button>
        </div>
      )}

      {/* Grid de Ações da Mesa: Cores Coesas e Neutras com Acento Gastronômico */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* 1. Cardápio Digital */}
        <button
          onClick={() => setModalCardapioAberto(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px 18px',
            backgroundColor: '#1c1d22',
            border: '1px solid #2d2f36',
            borderRadius: '16px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
          }}
        >
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#262830', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
            <BookOpenIcon size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fafaf9' }}>Cardápio Digital</h3>
            <p style={{ fontSize: '13px', color: '#a8a29e', marginTop: '3px' }}>Pratos, porções, bebidas e preços</p>
          </div>
          <ChevronRightIcon size={18} style={{ color: '#78716c' }} />
        </button>

        {/* 2. Chamar Garçom (1 Toque Direto, sem sub-opções e com a mesma cor elegante) */}
        <button
          disabled={cooldown > 0}
          onClick={() => dispararChamado('garcom_mesa')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px 18px',
            backgroundColor: '#1c1d22',
            border: cooldown > 0 ? '1px solid #44403c' : '1px solid #2d2f36',
            borderRadius: '16px',
            cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
            textAlign: 'left',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
            opacity: cooldown > 0 ? 0.75 : 1
          }}
        >
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#262830', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
            <BellIcon size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fafaf9' }}>
              {cooldown > 0 ? `Chamado Enviado (${cooldown}s)` : 'Chamar Garçom'}
            </h3>
            <p style={{ fontSize: '13px', color: '#a8a29e', marginTop: '3px' }}>
              {cooldown > 0 ? 'Atendente já foi notificado da sua mesa' : 'Solicitar a presença do garçom na mesa'}
            </p>
          </div>
          {cooldown === 0 ? (
            <ChevronRightIcon size={18} style={{ color: '#78716c' }} />
          ) : (
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#d97706' }}>Aguarde</span>
          )}
        </button>

        {/* 3. Pedir a Conta */}
        <button
          onClick={() => setModalContaAberto(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px 18px',
            backgroundColor: '#1c1d22',
            border: '1px solid #2d2f36',
            borderRadius: '16px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
          }}
        >
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#262830', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
            <CreditCardIcon size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fafaf9' }}>Pedir a Conta</h3>
            <p style={{ fontSize: '13px', color: '#a8a29e', marginTop: '3px' }}>Pagar no cartão, dinheiro ou Pix</p>
          </div>
          <ChevronRightIcon size={18} style={{ color: '#78716c' }} />
        </button>
      </div>

      {/* MODAL 1: CARDÁPIO (Clean, sem tags que denunciam vídeo) */}
      {modalCardapioAberto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ backgroundColor: '#18191e', border: '1px solid #2d2f36', borderRadius: '20px', maxWidth: '440px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header do Cardápio */}
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #262830', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpenIcon size={20} style={{ color: '#d97706' }} />
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fafaf9' }}>Cardápio</h2>
              </div>
              <button onClick={() => setModalCardapioAberto(false)} style={{ background: 'none', border: 'none', color: '#a8a29e', cursor: 'pointer', display: 'flex', padding: '4px' }}>
                <XIcon size={20} />
              </button>
            </div>

            {/* Barra de Busca */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #262830' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#212328', border: '1px solid #2f323a', borderRadius: '10px', padding: '8px 12px' }}>
                <SearchIcon size={16} style={{ color: '#78716c' }} />
                <input
                  type="text"
                  placeholder="Buscar prato ou bebida..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  style={{ background: 'none', border: 'none', color: '#f5f5f4', fontSize: '13px', width: '100%', outline: 'none' }}
                />
                {termoBusca && (
                  <button onClick={() => setTermoBusca('')} style={{ background: 'none', border: 'none', color: '#78716c', cursor: 'pointer', padding: 0 }}>
                    <XIcon size={14} />
                  </button>
                )}
              </div>

              {/* Pílulas de Categorias */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginTop: '10px', paddingBottom: '2px' }}>
                <button
                  onClick={() => setCategoriaAtiva('todas')}
                  style={{ whiteSpace: 'nowrap', padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: categoriaAtiva === 'todas' ? '#d97706' : '#262830', color: categoriaAtiva === 'todas' ? '#ffffff' : '#a8a29e' }}
                >
                  Todas
                </button>
                {categorias.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaAtiva(cat.id)}
                    style={{ whiteSpace: 'nowrap', padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: categoriaAtiva === cat.id ? '#d97706' : '#262830', color: categoriaAtiva === cat.id ? '#ffffff' : '#a8a29e' }}
                  >
                    {cat.nome}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Itens do Cardápio (Sem box de vídeo) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {itensExibidos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: '#78716c', fontSize: '14px' }}>
                  Nenhum item encontrado para esta busca.
                </div>
              ) : (
                itensExibidos.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => abrirReelDoItem(item)}
                    style={{
                      padding: '14px 16px',
                      backgroundColor: '#212328',
                      border: '1px solid #2d2f36',
                      borderRadius: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '15px', color: '#fafaf9', display: 'block', marginBottom: '3px' }}>
                        {item.nome}
                      </strong>
                      <p style={{ fontSize: '12px', color: '#a8a29e', lineHeight: 1.4 }}>{item.descricao}</p>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#f5f5f4' }}>
                        {item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <ChevronRightIcon size={16} style={{ color: '#78716c' }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SHOWCASE REEL FYP VERTICAL 9:16 */}
      {reelAberto && (
        <ShowcaseVerticalReel
          itens={todosOsItens}
          indiceInicial={indiceReel}
          nomeRestaurante={restaurante.nome}
          onFechar={() => setReelAberto(false)}
          onChamarGarcom={() => dispararChamado('garcom_mesa')}
        />
      )}

      {/* MODAL 3: PEDIR A CONTA */}
      {modalContaAberto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ backgroundColor: '#18191e', border: '1px solid #2d2f36', borderRadius: '20px', maxWidth: '420px', width: '100%', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fafaf9' }}>Pedir a Conta</h2>
              <button onClick={() => setModalContaAberto(false)} style={{ background: 'none', border: 'none', color: '#a8a29e', cursor: 'pointer', padding: 0 }}>
                <XIcon size={20} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#a8a29e', marginBottom: '16px' }}>Selecione o método de pagamento preferido:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => dispararChamado('pedir_conta', 'pix')}
                style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: '#212328', border: '1px solid #2f323a', color: '#fafaf9', textAlign: 'left', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>Pix Instantâneo (Chave da Loja)</span>
                <span style={{ color: '#d97706', fontSize: '12px', fontWeight: 700 }}>Mais Rápido</span>
              </button>
              <button
                onClick={() => dispararChamado('pedir_conta', 'credito')}
                style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: '#212328', border: '1px solid #2f323a', color: '#fafaf9', textAlign: 'left', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
              >
                Cartão de Crédito (Trazer Máquina)
              </button>
              <button
                onClick={() => dispararChamado('pedir_conta', 'debito')}
                style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: '#212328', border: '1px solid #2f323a', color: '#fafaf9', textAlign: 'left', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
              >
                Cartão de Débito (Trazer Máquina)
              </button>
              <button
                onClick={() => dispararChamado('pedir_conta', 'dinheiro')}
                style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: '#212328', border: '1px solid #2f323a', color: '#fafaf9', textAlign: 'left', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
              >
                Dinheiro em Espécie
              </button>
            </div>

            {/* Box Chave Pix */}
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#131418', border: '1px dashed #32353e', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Chave Pix do Restaurante</span>
              <code style={{ fontSize: '13px', fontWeight: 700, color: '#d97706' }}>{restaurante.chavePix}</code>
              <button
                onClick={copiarPix}
                style={{ marginTop: '8px', width: '100%', padding: '7px', borderRadius: '8px', backgroundColor: '#262830', border: '1px solid #363942', color: '#f5f5f4', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {pixCopiado ? <CheckIcon size={14} style={{ color: '#86efac' }} /> : <CopyIcon size={14} />}
                <span>{pixCopiado ? 'Chave Copiada' : 'Copiar Chave Pix'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer sóbrio */}
      <footer style={{ marginTop: '40px', textAlign: 'center', fontSize: '11px', color: '#57534e' }}>
        Call-in Atendimento Inteligente • Padrão Tear
      </footer>
    </div>
  );
};
