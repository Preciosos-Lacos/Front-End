import React, { useEffect, useState, useMemo } from 'react';
import '../styles/Produto.css';
import Header from '../components/Header.jsx';
import imgFallback from '../assets/laco-neon-verde.webp';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import checkGif from '../assets/Success.gif';

const BASE_URL = 'http://localhost:8080';

function getAuthToken() { return localStorage.getItem('token'); }
function decodeJwt(token) { try { const payload = token.split('.')[1]; return JSON.parse(atob(payload.replace(/-/g,'+').replace(/_/g,'/'))); } catch { return {}; } }

export default function Produto() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [modelo, setModelo] = useState(null);
  const [fotoUrl, setFotoUrl] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [detalhes, setDetalhes] = useState([]); // caracteristica_detalhe filtrados pelo modelo
  const [selecionados, setSelecionados] = useState({ cor: null, tipo: null, colecao: null });
  const [precoExtra, setPrecoExtra] = useState(0);
  const [a11yEnabled, setA11yEnabled] = useState(false);
  const [colorModal, setColorModal] = useState(null); // { hex, descricao, top, left }
  const { recomputeFromItens } = useCart();
  const navigate = useNavigate();
  const [addedModal, setAddedModal] = useState(null); // { produto, pedido }
  const [validationError, setValidationError] = useState(null);

  // preço final = preço base do modelo + soma dos detalhes escolhidos
  const precoFinal = useMemo(() => {
    const base = Number(modelo?.preco || 0);
    return (base + precoExtra).toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
  }, [modelo, precoExtra]);

  // Carrega modelo + usuário + detalhes
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true); setError(null);
        const token = getAuthToken();
        if (!token) { setError('Faça login para montar seu produto.'); return; }
        const payload = decodeJwt(token); const email = payload?.sub;

        // Usuários para encontrar o logado
        const resUsers = await fetch(`${BASE_URL}/usuarios`, { method:'GET', mode:'cors', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
        if (!resUsers.ok) throw new Error('Falha ao carregar usuários');
        const listaUsuarios = await resUsers.json();
        const u = listaUsuarios.find(x => x.login === email);
        if (!u) throw new Error('Usuário não encontrado');
        if (!active) return; setUsuario(u);

        // ID do modelo: tenta ler da URL (path/query), depois localStorage, senão fallback
        const selectedModelRaw = localStorage.getItem('selected-model-id');
        const query = new URLSearchParams(window.location.search);
        const qsId = parseInt(query.get('idModelo') || query.get('id') || '', 10);
        const pathMatch = window.location.pathname.match(/(\d+)/g);
        const pathId = pathMatch ? parseInt(pathMatch[pathMatch.length - 1], 10) : NaN;
        const selectedModelId = !isNaN(qsId) ? qsId : (!isNaN(pathId) ? pathId : (selectedModelRaw ? parseInt(selectedModelRaw,10) : NaN));

        // Buscar modelos
        const resModelos = await fetch(`${BASE_URL}/modelos`, { method:'GET', mode:'cors', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
        if (!resModelos.ok) throw new Error('Falha ao carregar modelos');
        const modelos = await resModelos.json();
        let m = !isNaN(selectedModelId) ? modelos.find(x => x.idModelo === selectedModelId) : null;
        if (!m) m = modelos[0];
        if (!m) throw new Error('Nenhum modelo disponível');
        if (!active) return; setModelo(m);
        // persistir seleção para navegações futuras
        try { if (m?.idModelo) localStorage.setItem('selected-model-id', String(m.idModelo)); } catch {}

        // Foto
        try {
          const resFoto = await fetch(`${BASE_URL}/modelos/${m.idModelo}/foto`, { method:'GET', mode:'cors', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
          if (resFoto.ok) { const data = await resFoto.json(); if (active && data?.foto) setFotoUrl(`data:image/jpeg;base64,${data.foto}`); }
        } catch {}

        // Favoritos do usuário (por modelo)
        try {
          const resFav = await fetch(`${BASE_URL}/modelos/favoritos/${u.idUsuario}`, { method:'GET', mode:'cors', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
          if (resFav.ok) { const f = await resFav.json(); if (active) setFavorite(f.some(x => x.idModelo === m.idModelo)); }
        } catch {}

        // Detalhes apenas ligados ao modelo específico
        const resDetalhes = await fetch(`${BASE_URL}/caracteristica-detalhe/modelo/${m.idModelo}`, { method:'GET', mode:'cors', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
        if (resDetalhes.ok) {
          const lista = await resDetalhes.json();
          if (active) setDetalhes(lista);
        }
      } catch (e) {
        console.error(e); if (active) setError(e.message || 'Erro ao carregar');
      } finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, []);

  // Recalcula preço extra
  useEffect(() => {
    let total = 0;
    Object.values(selecionados).forEach(d => { if (d?.preco) total += Number(d.preco); });
    setPrecoExtra(total);
  }, [selecionados]);

  const canAdd = Boolean(selecionados.cor);

  useEffect(() => {
    if (canAdd) setValidationError(null);
  }, [canAdd]);

  function escolher(tipo, detalhe) {
    setSelecionados(prev => ({ ...prev, [tipo]: detalhe }));
  }

  function openColorModal(hex, descricao, el) {
    const pos = computePopoverPos(el, 180, 12);
    setColorModal({ hex, descricao, ...pos });
  }

  function closeColorModal() {
    setColorModal(null);
  }

  async function toggleFavoriteBackend() {
    try {
      if (!usuario?.idUsuario || !modelo?.idModelo) return;
      const token = getAuthToken();
      const url = `${BASE_URL}/modelos/favorito`;
      const body = { idUsuario: usuario.idUsuario, idModelo: modelo.idModelo };
      const method = favorite ? 'DELETE' : 'POST';
      const res = await fetch(url, { method, mode:'cors', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify(body) });
      if (!(res.ok || res.status === 204 || res.status === 201)) throw new Error('Falha ao atualizar favorito');
      setFavorite(f => !f);
    } catch (e) { console.error(e); alert('Não foi possível atualizar favorito'); }
  }

  async function criarProduto() {
    // validação cliente: exige ao menos a cor
    if (!selecionados.cor) {
      setValidationError('Selecione a cor antes de adicionar ao carrinho.');
      return;
    }
    try {
      if (!modelo?.idModelo) { alert('Modelo não carregado'); return; }
      const token = getAuthToken();
      if (!token) { alert('Faça login'); return; }
      // Mapeamento simples: cor -> cor, tipo -> material, colecao -> acabamento (tamanho removido da personalização)
      const dto = {
        nome: `${modelo.nomeModelo} Personalizado`,
        tamanho: 'P',
        material: selecionados.tipo?.descricao || '',
        cor: selecionados.cor?.idCaracteristicaDetalhe || null,
        acabamento: selecionados.colecao?.idCaracteristicaDetalhe || null,
        preco: Number(modelo.preco || 0) + precoExtra,
        idModelo: modelo.idModelo
      };
      const res = await fetch(`${BASE_URL}/produtos`, { method:'POST', mode:'cors', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify(dto) });
      if (!res.ok && res.status !== 201) throw new Error(await res.text() || 'Falha ao criar produto');
      const created = await res.json();
      // Vincular ao carrinho (pedido com carrinho=true)
      try {
        if (usuario?.idUsuario && created?.idProduto) {
          const cartRes = await fetch(`${BASE_URL}/pedidos/carrinho`, {
            method:'POST',
            mode:'cors',
            headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
            body: JSON.stringify({ idUsuario: usuario.idUsuario, idProduto: created.idProduto })
          });
          if (!cartRes.ok) {
            console.warn('Falha ao adicionar ao carrinho');
          } else {
            // atualiza contador global do carrinho com base nos itens retornados
            const pedido = await cartRes.json().catch(() => null);
            if (pedido && Array.isArray(pedido.itens)) {
              recomputeFromItens(pedido.itens);
            }
            // abrir modal informando que produto foi adicionado
            setAddedModal({ produto: created, pedido });
            setValidationError(null);
          }
        }
      } catch(e){ console.warn('Erro carrinho', e); }
      // substituímos o alert por um modal — caso a adição ao carrinho não tenha ocorrido, ainda informamos via modal
      if (!addedModal) setAddedModal(prev => prev ?? { produto: created, pedido: null });
    } catch (e) { console.error(e); alert(e.message || 'Erro ao criar produto'); }
  }

  // Agrupar detalhes por categoria (assumindo campo caracteristica?.descricao vindo no objeto)
  const grupos = useMemo(() => {
    const map = { Cor: [], 'Tipo de laço': [], Coleções: [] };
    detalhes.forEach(d => { const cat = d.caracteristica?.descricao; if (map[cat] !== undefined) map[cat].push(d); });
    return map;
  }, [detalhes]);

  // Fechar modal com ESC quando aberto
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setAddedModal(null); }
    if (addedModal) window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); };
  }, [addedModal]);

  return (
    <>
      <Header />
      <main className="produto-page">
        <section className="produto-container">
          <div className="produto-imagem">
            <img src={fotoUrl || imgFallback} alt={modelo?.nomeModelo || 'Modelo'} />
          </div>
          <div className="produto-info">
            <h1 className="produto-titulo">{loading ? 'Carregando…' : (modelo?.nomeModelo || 'Modelo')}</h1>
            <div className="produto-top" style={{ justifyContent:'flex-start' }}>
              <span className="produto-preco" style={{ marginRight:24 }}>{loading ? '—' : precoFinal}</span>
              <button type="button" className="btn-add-cart inline" disabled={loading||!!error||!modelo} onClick={criarProduto}>Adicionar ao carrinho</button>
              <button type="button" aria-label="Favorito" className={`btn-fav ${favorite ? 'active' : ''}`} disabled={loading||!!error||!modelo} onClick={toggleFavoriteBackend} style={{ marginLeft:12 }}>
                <i className={`bi ${favorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
              </button>
            
            </div>
            <div className="produto-bloco" style={{ marginTop:28 }}>
              {error && <p style={{ color:'red' }}>{error}</p>}
              {!error && (
                <>
                  {/* Acabamento (usando Tipo de laço) */}
                  <div className="personaliza-grupo" style={{ marginBottom:24 }}>
                    <h4 style={{ marginBottom:10 }}>Acabamento</h4>
                    <div className="opcoes-flex">
                      {grupos['Tipo de laço'].map(d => (
                        <button key={d.idCaracteristicaDetalhe} type="button" className={`tag ${selecionados.tipo?.idCaracteristicaDetalhe===d.idCaracteristicaDetalhe?'selected':''}`} onClick={()=>escolher('tipo', d)}>
                          {d.descricao}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Cor + slider acessibilidade ao lado do título */}
                  <div className="personaliza-grupo" style={{ marginBottom:24 }}>
                    <div className="cor-header" style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                      <h4 style={{ margin:0 }}>Cor</h4>
                      <label className="a11y-toggle" aria-label="Alternar padrões de acessibilidade de cores" style={{ margin:0 }}>
                        <input
                          type="checkbox"
                          role="switch"
                          aria-checked={a11yEnabled}
                          checked={a11yEnabled}
                          onChange={() => setA11yEnabled(v => !v)}
                        />
                        <span className="slider" />
                        <span className="a11y-label">Acessibilidade</span>
                      </label>
                    </div>
                    <div className="cor-dots-wrapper" role="radiogroup" aria-label="Escolha a cor">
                      {grupos.Cor.map(d => {
                        const hex = (d.hexaDecimal || '').trim();
                        const isSelected = selecionados.cor?.idCaracteristicaDetalhe === d.idCaracteristicaDetalhe;
                        if (hex) {
                          const borderColor = borderColorForHex(hex);
                          return (
                            <button
                              key={d.idCaracteristicaDetalhe}
                              type="button"
                              title={d.descricao || 'Cor'}
                              role="radio"
                              aria-checked={isSelected}
                              tabIndex={0}
                              onKeyDown={(e)=>onColorKeyDown(e,d)}
                              className={`cor-dot ${isSelected?'selected':''}`}
                              onClick={()=>escolher('cor', d)}
                              style={{ background: hex, borderColor }}
                              onMouseEnter={(e) => { if (a11yEnabled) openColorModal(hex, d.descricao || 'Cor', e.currentTarget); }}
                              onMouseLeave={() => { if (a11yEnabled) closeColorModal(); }}
                              aria-label={`${d.descricao || 'Cor'}${d.preco ? `, adicional de ${formatBRL(d.preco)}` : ''}`}
                            >
                              <span />
                            </button>
                          );
                        }
                        return (
                          <button
                            key={d.idCaracteristicaDetalhe}
                            type="button"
                            className={`tag ${isSelected?'selected':''}`}
                            onClick={()=>escolher('cor', d)}
                            aria-label={`${d.descricao || 'Cor'}${d.preco ? `, adicional de ${formatBRL(d.preco)}` : ''}`}
                          >
                            {d.descricao || 'Cor'}
                          </button>
                        );
                      })}
                    </div>
                    {validationError && <div className="validation-msg" role="alert">{validationError}</div>}
                  </div>
                  {/* Descrição */}
                  <div className="personaliza-grupo descricao-grupo">
                    <h4 style={{ marginBottom:10 }}>Descrição</h4>
                    <p style={{ fontSize:'0.95rem', lineHeight:1.5, margin:0 }}>{modelo?.descricao}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
        {a11yEnabled && colorModal && (
          <div className="color-popover" role="tooltip" aria-label={`Zoom da cor ${colorModal.descricao}`} style={{ top: colorModal.top, left: colorModal.left }}>
            <div className="color-popover-card" style={{ background: colorModal.hex, borderColor: borderColorForHex(colorModal.hex) }}>
              <div className="color-modal-pattern">
                {renderPattern(colorModal.hex)}
              </div>
              <div className="color-modal-info">
                <strong>{colorModal.descricao}</strong>
                <span>{colorModal.hex.toUpperCase()}</span>
                <span className="symbol-pill">{symbolLabel(symbolForHex(colorModal.hex))}</span>
              </div>
            </div>
          </div>
        )}
        {addedModal && (
          <div className="added-modal-overlay" role="dialog" aria-modal="true" aria-label="Produto adicionado ao carrinho" onClick={() => setAddedModal(null)}>
            <div className="added-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="added-modal-body">
                <img src={checkGif} alt="" aria-hidden="true" className="added-modal-gif" />
                <div className="added-modal-message">
                  <h3>Produto adicionado</h3>
                  <p>O item foi adicionado ao seu carrinho.</p>
                </div>
                <div className="added-modal-actions">
                  <button type="button" className="btn-continue" onClick={() => setAddedModal(null)}>Continuar comprando</button>
                  <button type="button" className="btn-finalize" onClick={() => { setAddedModal(null); navigate('/carrinho'); }}>Ir para o carrinho</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

// Fechar modal com ESC
// adiciona listener quando modal estiver aberto
// useEffect local para modal
// Note: keep this outside render to avoid lint warnings — we add a short effect here
// (Placed after component definition intentionally.)
// Acessibilidade: teclado nas bolinhas de cor (Enter/Espaço ativam)
function onColorKeyDown(e, detalhe) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    const click = e.currentTarget?.click; if (typeof click === 'function') click();
  }
}

// Determina cor de borda legível com base na luminância da cor de fundo
function borderColorForHex(hex) {
  try {
    const { r, g, b } = hexToRgb(hex);
    // luminância relativa aproximada (sRGB)
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b; // 0..255
    return lum > 180 ? '#333' : '#fff';
  } catch { return 'var(--borda)'; }
}

function hexToRgb(hex) {
  let h = hex.replace('#','');
  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('');
  }
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function formatBRL(v) {
  try { return Number(v).toLocaleString('pt-BR', { style:'currency', currency:'BRL' }); } catch { return `${v}`; }
}

// Calcula posição do popover ancorado à bolinha
function computePopoverPos(el, size = 180, margin = 12) {
  const rect = el.getBoundingClientRect();
  let left = rect.right + margin;
  if (left + size > window.innerWidth - 8) left = rect.left - margin - size;
  let top = rect.top + (rect.height - size) / 2;
  if (top < 8) top = 8;
  if (top + size > window.innerHeight - 8) top = Math.max(8, window.innerHeight - size - 8);
  return { top, left };
}

// Mapeia faixa de hex para símbolo: triângulo, quadrado, círculo
function symbolForHex(hex) {
  const { h, s, l } = hexToHsl(hex);
  if (isNaN(h)) {
    // fallback: grayscale by lightness
    if (l < 0.25) return 'cross';
    if (l < 0.5) return 'plus';
    if (l < 0.75) return 'diamond';
    return 'hex';
  }
  // baixa saturação (cinzas): variações por luz
  if (s < 0.12) {
    if (l < 0.25) return 'cross';
    if (l < 0.45) return 'plus';
    if (l < 0.65) return 'diamond';
    if (l < 0.85) return 'hex';
    return 'triangle';
  }
  // buckets de matiz (hue) em 8 símbolos
  if (h < 22.5 || h >= 337.5) return 'triangle';       // vermelhos
  if (h < 67.5) return 'square';                        // amarelos
  if (h < 112.5) return 'plus';                         // verdes
  if (h < 157.5) return 'diamond';                      // cianos
  if (h < 202.5) return 'circle';                       // azuis
  if (h < 247.5) return 'star';                         // anil
  if (h < 292.5) return 'hex';                          // roxos
  return 'cross';                                       // magentas/rosas
}

function symbolLabel(type) {
  switch (type) {
    case 'triangle': return 'Triângulo';
    case 'square': return 'Quadrado';
    case 'circle': return 'Círculo';
    case 'diamond': return 'Diamante';
    case 'cross': return 'Cruz';
    case 'plus': return 'Mais';
    case 'star': return 'Estrela';
    case 'hex': return 'Hexágono';
    default: return 'Símbolo';
  }
}

// Renderiza um padrão de símbolos com contraste sobre a cor
function renderPattern(hex) {
  const shape = symbolForHex(hex);
  const contrast = borderColorForHex(hex);
  const items = [];
  const cols = 6; const rows = 6; const size = 26;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r}-${c}`;
      items.push(
        <Shape key={key} x={c*size} y={r*size} size={18} color={contrast} type={shape} />
      );
    }
  }
  const width = cols*size, height = rows*size;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {items}
    </svg>
  );
}

function Shape({ x, y, size, color, type }) {
  const half = size/2;
  if (type === 'circle') return <circle cx={x+half} cy={y+half} r={half} fill={color} opacity="0.35" />;
  if (type === 'square') return <rect x={x} y={y} width={size} height={size} fill={color} opacity="0.28" rx="3" ry="3" />;
  if (type === 'triangle') {
    const points = `${x+half},${y} ${x+size},${y+size} ${x},${y+size}`;
    return <polygon points={points} fill={color} opacity="0.25" />;
  }
  if (type === 'diamond') {
    const points = `${x+half},${y} ${x+size},${y+half} ${x+half},${y+size} ${x},${y+half}`;
    return <polygon points={points} fill={color} opacity="0.28" />;
  }
  if (type === 'cross') {
    return (
      <g opacity="0.35" stroke={color} strokeWidth="3" strokeLinecap="round">
        <line x1={x+2} y1={y+2} x2={x+size-2} y2={y+size-2} />
        <line x1={x+size-2} y1={y+2} x2={x+2} y2={y+size-2} />
      </g>
    );
  }
  if (type === 'plus') {
    const w = Math.max(3, size/5);
    return (
      <g fill={color} opacity="0.3">
        <rect x={x+half - w/2} y={y} width={w} height={size} rx="2" />
        <rect x={x} y={y+half - w/2} width={size} height={w} rx="2" />
      </g>
    );
  }
  if (type === 'star') {
    const pts = starPoints(x+half, y+half, half, half*0.45, 5);
    return <polygon points={pts} fill={color} opacity="0.28" />;
  }
  if (type === 'hex') {
    const pts = regularPolygonPoints(x+half, y+half, half, 6);
    return <polygon points={pts} fill={color} opacity="0.28" />;
  }
  // default
  return <circle cx={x+half} cy={y+half} r={half} fill={color} opacity="0.35" />;
}

function starPoints(cx, cy, rOuter, rInner, spikes) {
  let rot = -Math.PI / 2;
  const step = Math.PI / spikes;
  const points = [];
  for (let i = 0; i < spikes; i++) {
    points.push([cx + Math.cos(rot) * rOuter, cy + Math.sin(rot) * rOuter]);
    rot += step;
    points.push([cx + Math.cos(rot) * rInner, cy + Math.sin(rot) * rInner]);
    rot += step;
  }
  return points.map(p => p.join(',')).join(' ');
}

function regularPolygonPoints(cx, cy, r, sides) {
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const a = -Math.PI/2 + i * (2*Math.PI / sides);
    pts.push([cx + Math.cos(a)*r, cy + Math.sin(a)*r]);
  }
  return pts.map(p => p.join(',')).join(' ');
}

function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  const r1 = r/255, g1 = g/255, b1 = b/255;
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break;
      case g1: h = (b1 - r1) / d + 2; break;
      case b1: h = (r1 - g1) / d + 4; break;
    }
    h *= 60;
  } else {
    h = NaN; s = 0; // achromatic
  }
  return { h, s, l };
}