import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import '../styles/MinhasCompras.css';

// Fallback de exemplo (caso a API não esteja disponível em dev)
const pedidosExemplo = [
  {
    idPedido: 8,
    data: '2025-11-19',
    statusPedido: 'Concluido',
    statusPagamento: 'Pago',
    total: 49.8,
    itens: [
      {
        idProduto: 1,
        nome: 'Laço Simples Vermelho',
        modelo: 'Laço Simples',
        quantidade: 1,
        preco: 19.9,
        imagens: [],
        caracteristicas: [
          { nome: 'Cor', detalhe: 'Vermelho' },
          { nome: 'Tamanho', detalhe: 'Pequeno' },
        ],
      },
    ],
  },
  {
    idPedido: 9,
    data: '2025-11-21',
    statusPedido: 'Em andamento',
    statusPagamento: 'Pendente',
    total: 29.9,
    itens: [
      {
        idProduto: 2,
        nome: 'Laço Glamour Azul',
        modelo: 'Laço Glamour',
        quantidade: 1,
        preco: 29.9,
        imagens: [],
        caracteristicas: [
          { nome: 'Cor', detalhe: 'Azul' },
          { nome: 'Tamanho', detalhe: 'Grande' },
        ],
      },
    ],
  },
  {
    idPedido: 11,
    data: '2025-11-12',
    statusPedido: 'Entregue',
    statusPagamento: 'Pago',
    total: 34.9,
    itens: [
      {
        idProduto: 3,
        nome: 'Laço Elegance Rosa',
        modelo: 'Laço Elegance',
        quantidade: 1,
        preco: 34.9,
        imagens: [],
        caracteristicas: [
          { nome: 'Tipo de laço', detalhe: 'Fita de Cetim' },
        ],
      },
    ],
  },
];

const BASE_API = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_PEDIDOS_MEUS = `${BASE_API}/pedidos/meus`;

const getAuthToken = () => {
  try {
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('authToken') ||
      localStorage.getItem('accessToken') ||
      null
    );
  } catch {
    return null;
  }
};

const formatDateBR = (ymd) => {
  try {
    const dt = new Date(ymd);
    return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return ymd;
  }
};

const formatMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor ?? 0);

// Normalize image source returned by backend (base64 puro -> data URL).
function getImageSrc(img) {
  if (!img) return '/src/assets/laco-kit-6.webp';
  if (typeof img !== 'string') return '/src/assets/laco-kit-6.webp';
  const s = img.trim();
  if (s.startsWith('data:')) return s;
  const idx = s.indexOf('base64,');
  if (idx >= 0) return `data:image/png;base64,${s.slice(idx + 'base64,'.length)}`;
  if (s.startsWith('iVBOR')) return `data:image/png;base64,${s}`;
  if (s.startsWith('/9j/')) return `data:image/jpeg;base64,${s}`;
  if (s.startsWith('R0lG')) return `data:image/gif;base64,${s}`;
  return `data:image/png;base64,${s}`;
}

const statusPedidoClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('andamento') || s.includes('confe')) return 'status-em-andamento';
  if (s.includes('concluido') || s.includes('concluído')) return 'status-concluido';
  if (s.includes('entregue')) return 'status-entregue';
  return 'status-neutro';
};

const statusPagamentoClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('pago')) return 'pagamento-pago';
  if (s.includes('pendente')) return 'pagamento-pendente';
  return 'pagamento-neutro';
};

export default function MinhasCompras() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroPagamento, setFiltroPagamento] = useState('Todos');
  const [pedidos, setPedidos] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getAuthToken();
        if (!token) {
          if (ativo) {
            setError('Usuário não autenticado. Faça login para ver suas compras.');
            setPedidos([]);
          }
          return;
        }

        const resp = await fetch(API_PEDIDOS_MEUS, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (resp.status === 204) {
          if (ativo) setPedidos([]);
          return;
        }

        if (resp.status === 401) {
          const body = await resp.json().catch(() => ({}));
          if (ativo) {
            setError(body.erro || 'Não autenticado.');
            setPedidos([]);
          }
          return;
        }

        if (!resp.ok) {
          // Try to read server body for debugging (may be json or text)
          let bodyText = null;
          try {
            // prefer text so we don't throw on non-json responses
            bodyText = await resp.text();
          } catch (err) {
            bodyText = null;
          }
          console.error('[MinhasCompras] fetch error', { url: API_PEDIDOS_MEUS, status: resp.status, body: bodyText });
          if (ativo) {
            setError(bodyText ? `Erro no servidor: ${bodyText}` : `Falha ao carregar compras (${resp.status})`);
            setPedidos([]);
          }
          return;
        }

        const data = await resp.json();
        if (ativo) setPedidos(Array.isArray(data) ? data : []);
      } catch (e) {
        if (ativo) {
          setError('Não foi possível carregar compras.');
          setPedidos([]);
        }
      } finally {
        if (ativo) setLoading(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const pedidosOrdenados = useMemo(() => {
    // Order by idPedido descending (maior -> menor) by default
    return [...pedidos].sort((a, b) => {
      const idA = Number(a.idPedido ?? 0);
      const idB = Number(b.idPedido ?? 0);
      if (!isNaN(idA) && !isNaN(idB) && idA !== idB) return idB - idA;
      // fallback to date if ids are equal or not numeric
      return new Date(b.data) - new Date(a.data);
    });
  }, [pedidos]);

  const pedidosFiltrados = useMemo(() => {
    // Map UI filter labels to backend status values (robust to numeric codes and strings)
    const matchesStatus = (statusFromPedido, filtro) => {
      if (!filtro || filtro === 'Todos') return true;
      const f = (filtro || '').toLowerCase();
      const s = (statusFromPedido ?? '').toString().toLowerCase();
      // If backend uses numeric codes, try to coerce and map below via normalizeStatus
      if (f === 'em confecção' || f === 'em confecc\u00e7\u00e3o' || f === 'em confeccao') {
        // Em confecção should match 'Em andamento' or numeric 1
        return s.includes('andamento') || s === '1' || s.includes('confec') || s.includes('confe');
      }
      if (f === 'produto conclu\u00eddo' || f === 'produto concluido' || f === 'produto concluído') {
        // Produto concluído corresponds to backend 'Concluido' or numeric 4
        return s.includes('conclu') || s === '4';
      }
      if (f === 'entregue') {
        return s.includes('entreg') || s === '2';
      }
      return s.includes(f);
    };

    return pedidosOrdenados.filter((p) => {
      const texto = (busca || '').trim().toLowerCase();
      const matchBusca =
        !texto ||
        String(p.idPedido).includes(texto) ||
        (p.itens || []).some((it) => it.nome?.toLowerCase().includes(texto));
      const matchStatus = filtroStatus === 'Todos' || matchesStatus(p.statusPedido, filtroStatus);
      const matchPagamento = filtroPagamento === 'Todos' || p.statusPagamento === filtroPagamento;
      return matchBusca && matchStatus && matchPagamento;
    });
  }, [pedidosOrdenados, busca, filtroStatus, filtroPagamento]);

  const toggleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const copiarId = async (id) => {
    try {
      await navigator.clipboard.writeText(String(id));
    } catch (_) {
      // noop
    }
  };

  // Timeline rendering helpers
  // Normalize backend status (string or numeric) into tokens and render timeline accordingly
  const normalizeStatus = (status) => {
    if (status === null || status === undefined) return 'UNKNOWN';
    const asNumber = Number(status);
    if (!Number.isNaN(asNumber)) {
      if (asNumber === 1) return 'IN_PROGRESS';
      if (asNumber === 2) return 'DELIVERED';
      if (asNumber === 3) return 'CANCELLED';
      if (asNumber === 4) return 'COMPLETED';
    }
    const s = String(status).toLowerCase();
    if (s.includes('cancel')) return 'CANCELLED';
    if (s.includes('entreg')) return 'DELIVERED';
    if (s.includes('conclu')) return 'COMPLETED';
    if (s.includes('andamento') || s.includes('confec') || s.includes('confe')) return 'IN_PROGRESS';
    return 'UNKNOWN';
  };

  const renderTimeline = (status) => {
    const token = normalizeStatus(status);
    if (token === 'CANCELLED') {
      return (
        <div className="pedido-cancelado">
          <strong>Pedido CANCELADO</strong>
          <div className="pequeno text-muted">Este pedido foi cancelado e não está mais ativo.</div>
        </div>
      );
    }

    let completedCount = 0;
    if (token === 'DELIVERED') completedCount = 3;
    else if (token === 'COMPLETED') completedCount = 2;
    else if (token === 'IN_PROGRESS') completedCount = 0;

    const activeIndex = completedCount >= 3 ? null : completedCount + 1;
    const steps = ['Em confecção', 'Produto concluído', 'Entregue'];
    const nodes = [];
    for (let i = 0; i < steps.length; i++) {
      const label = steps[i];
      const stepNum = i + 1;
      const completed = stepNum <= completedCount;
      const active = activeIndex === stepNum;
      nodes.push(
        <div key={`step-${i}`} className={`timeline-step ${completed ? 'completed' : ''} ${active ? 'active' : ''}`}>
          <div className="timeline-icon" aria-hidden>
            {completed ? '✓' : (<span className="timeline-dot" />)}
          </div>
          <div className="timeline-text pequeno">{label}</div>
        </div>
      );
      if (i < steps.length - 1) {
        nodes.push(<div key={`conn-${i}`} className={`timeline-connector ${stepNum <= completedCount ? 'done' : ''}`} />);
      }
    }
    return <div className="timeline">{nodes}</div>;
  };



  return (
    <div>
      <Header />
      <section className="minhas-compras-section container">
        <h2 className="titulo-minhas-compras">Minhas compras</h2>
        {error && !loading && <div className="alert alert-warning pequeno" role="alert">{error}</div>}
        <div className="minhas-compras-barra">
          <div className="busca-filtros">
            <div className="filtros-grid">
              <div className="filtro-col">
                <span className="filtro-label pequeno">Buscar por ID ou produto</span>
                <div className="busca-compras">
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-search"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      aria-label="Buscar por ID ou produto"
                      value={busca}
                      onChange={e => setBusca(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="filtro-col status-pedido">
                <span className="filtro-label pequeno">Status do pedido</span>
                <div className="filtro-item">
                  <select className="form-select" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                    <option>Todos</option>
                    <option>Em confecção</option>
                    <option>Produto concluído</option>
                    <option>Entregue</option>
                  </select>
                </div>
              </div>
              <div className="filtro-col status-pagamento">
                <span className="filtro-label pequeno">Status do pagamento</span>
                <div className="filtro-item">
                  <select className="form-select" value={filtroPagamento} onChange={e => setFiltroPagamento(e.target.value)}>
                    <option>Todos</option>
                    <option>Pago</option>
                    <option>Pendente</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="info-compras">
            <span>{loading ? '...' : `${pedidosFiltrados.length} compras`}</span>
          </div>
        </div>
        <div className="compras-lista">
          {loading ? (
            <div className="text-center text-muted">Carregando compras...</div>
          ) : pedidosFiltrados.length === 0 ? (
            <div className="text-center text-muted">Nenhuma compra encontrada.</div>
          ) : (
            pedidosFiltrados.map((p) => {
              const primeiraImagem = p?.itens?.[0]?.imagens?.[0] || '/src/assets/laco-kit-6.webp';
              const itens = p?.itens || [];
              const mais = Math.max(itens.length - 1, 0);
              const tituloPrimeiro = itens[0]
                ? `${itens[0].nome}${itens[0].modelo ? ' • ' + itens[0].modelo : ''}`
                : 'Itens do pedido';
              const caracPrimeiro = (itens[0]?.caracteristicas || [])
                .map(c => `${c.nome}: ${c.detalhe}`)
                .join(' · ');

              return (
                <div key={p.idPedido} className={`compra-card d-flex mb-4 p-3 ${expanded[p.idPedido] ? 'expanded' : ''}`}>
                  <div className="compra-left">
                    <div className="compra-img">
                      <img src={getImageSrc(primeiraImagem)} alt={tituloPrimeiro} className="img-fluid rounded" />
                    </div>
                  </div>
                  <div className="compra-right compra-info flex-grow-1 w-100">
                    <div className="compra-header-block">
                      <div className="compra-header-row">
                        <span className="compra-data">Pedido #{p.idPedido} • {formatDateBR(p.data)}</span>
                        <button className="btn btn-link p-0 copiar-id" title="Copiar ID" onClick={() => copiarId(p.idPedido)}>
                          <i className="bi bi-clipboard" />
                        </button>
                      </div>
                      <div className="compra-header-row">
                        <span className={`compra-status pagamento-chip ${statusPagamentoClass(p.statusPagamento)}`}>{p.statusPagamento}</span>
                        <span className="compra-total fw-semibold">{formatMoeda(p.total)}</span>
                      </div>
                    </div>

                    <div className="compra-entrega fw-semibold mb-1">{tituloPrimeiro}{mais > 0 ? ` e +${mais} item(ns)` : ''}</div>
                    {caracPrimeiro && (
                      <div className="compra-produto mb-1 text-muted">{caracPrimeiro}</div>
                    )}

                    {/* Timeline — posicionada antes dos botões para seguir ordem desejada */}
                    <div className="compra-timeline-row mb-2">
                      {renderTimeline(p.statusPedido)}
                    </div>

                    <div className="compra-botoes d-flex gap-2 mt-2 flex-wrap">
                      <button className="btn btn-outline-secondary compra-btn" onClick={() => toggleExpand(p.idPedido)}>
                        {expanded[p.idPedido] ? 'Ocultar detalhes' : 'Ver detalhes'}
                      </button>
                      <Link to={`/pedido-entregue?Id=${p.idPedido}`} className="btn btn-outline-secondary compra-btn">Ver compra</Link>
                      <Link to="/carrinho" className="btn btn-outline-primary compra-btn">Comprar novamente</Link>
                    </div>

                    {expanded[p.idPedido] && (
                      <div className="itens-detalhes mt-3">
                        {itens.map((it) => (
                          <div key={it.idProduto} className="item-linha d-flex align-items-start justify-content-between py-2">
                            <div className="d-flex flex-column">
                              <span className="fw-semibold">{it.quantidade}x {it.nome}{it.modelo ? ` • ${it.modelo}` : ''}</span>
                              {(it.caracteristicas || []).length > 0 && (
                                <span className="text-muted pequeno">
                                  {(it.caracteristicas || []).map((c) => `${c.nome}: ${c.detalhe}`).join(' · ')}
                                </span>
                              )}
                            </div>
                            <div className="ms-3 text-nowrap">{formatMoeda(it.preco)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
