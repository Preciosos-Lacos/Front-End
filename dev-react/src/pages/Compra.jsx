import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import '../styles/Compra.css';
import { Link, useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080';

function getAuthToken() { return localStorage.getItem('token'); }
function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g,'+').replace(/_/g,'/')))||{};
  } catch { return {}; }
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const Compra = () => {
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payment, setPayment] = useState('Pix');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const token = getAuthToken();
        if (!token) {
          setError('Você precisa estar logado para finalizar compra.');
          setLoading(false);
          return;
        }

        const payload = decodeJwt(token);
        const email = payload?.sub;
        if (!email) throw new Error('Token inválido');

        const resUser = await fetch(`${BASE_URL}/usuarios/login/${encodeURIComponent(email)}`, {
          headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }
        });
        if (!resUser.ok) {
          const txt = await resUser.text();
          throw new Error(txt || 'Erro ao buscar usuário');
        }
        const u = await resUser.json();
        if (!u?.idUsuario) throw new Error('Usuário não encontrado');

        const res = await fetch(`${BASE_URL}/checkout/${u.idUsuario}`, {
          headers: { 'Content-Type':'application/json', ...(token?{ Authorization:`Bearer ${token}` }: {}) }
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || 'Erro ao obter checkout');
        }
        const data = await res.json();
        if (!active) return;
        setCheckout({ ...data, idUsuario: u.idUsuario });
      } catch (e) {
        setError(e.message || 'Erro ao carregar checkout');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  function formatCurrency(v) { return currency.format(v || 0); }

  function paymentToCode(p) {
    if (!p) return null;
    const low = p.toLowerCase();
    if (low.includes('débito') || low.includes('debito')) return 1;
    if (low.includes('crédito') || low.includes('credito') || low.includes('cartão de crédito')) return 2;
    if (low.includes('pix')) return 3;
    return null;
  }

  async function handleFinalize() {
    if (!checkout || !checkout.idUsuario) {
      setError('Usuário inválido');
      return;
    }
    const code = paymentToCode(payment);
    if (!code) { setError('Selecione uma forma de pagamento válida.'); return; }

    setFinalizing(true);
    setError(null);
    try {
      const body = { idUsuario: checkout.idUsuario, formaPagamento: code, frete: checkout.frete ?? 15.0 };
      const token = getAuthToken();
      const headers = { 'Content-Type':'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const res = await fetch(`${BASE_URL}/checkout/finalizar`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      const txt = await res.text();
      let json = null;
      try { json = txt ? JSON.parse(txt) : null; } catch (_) { json = null; }
      if (!res.ok) {
        const msg = (json && (json.erro || json.message)) ? (json.erro || json.message) : (txt || 'Erro ao finalizar pedido');
        throw new Error(msg);
      }

      // Sucesso: redireciona para página de pedido confirmato
      navigate('/pedido-confirmado');

      // Após sucesso, recarrega o checkout (novo carrinho vazio criado pelo backend)
      setTimeout(() => {
        // força recarregar a página atual ou reconsultar o checkout
        window.location.reload();
      }, 600);
    } catch (e) {
      setError(e.message || 'Erro ao finalizar pedido');
    } finally {
      setFinalizing(false);
      setConfirmOpen(false);
    }
  }

  if (loading) return <div><Header /><main style={{padding:20}}>Carregando checkout...</main></div>;
  if (error) return <div><Header /><main style={{padding:20,color:'red'}}>Erro: {error}</main></div>;

  const produtos = checkout?.produtos || [];
  const endereco = checkout?.endereco;
  // Deduplicar produtos defensivamente: agrupa por idProduto e soma quantidades/precoTotal
  const produtosUnicos = (() => {
    const map = new Map();
    for (const p of produtos) {
      const id = p.idProduto ?? p.sku ?? JSON.stringify(p);
      if (map.has(id)) {
        const ex = map.get(id);
        ex.quantidade = (Number(ex.quantidade) || 0) + (Number(p.quantidade) || 0);
        ex.precoTotal = (Number(ex.precoTotal) || 0) + (Number(p.precoTotal) || 0);
      } else {
        map.set(id, { ...p });
      }
    }
    return Array.from(map.values());
  })();

  const subtotal = checkout?.subtotal ?? produtosUnicos.reduce((s,p)=>s+(Number(p.precoUnitario||0)*Number(p.quantidade||0)),0);
  const shipping = checkout?.frete ?? 15.0;
  const total = checkout?.total ?? (subtotal + shipping);

  // diagnóstico rápido
  // eslint-disable-next-line no-console
  console.debug('checkout raw:', checkout);
  // eslint-disable-next-line no-console
  console.debug('produtos.length =', produtos.length, 'produtosUnicos.length =', produtosUnicos.length);

  return (
    <div className="compra-page">
      <Header />
      <main data-scroll-container className="finalizar-compra">
        <div className="hub">
          <div className="itens">
            <div className="cabecalho-lista">
              <div className="produto">Produto</div>
              <div className="quantidade">Quantidade</div>
              <div className="preco">Preço</div>
            </div>

            {produtosUnicos.length === 0 ? (
              <div style={{padding:20}}>Seu carrinho está vazio.</div>
            ) : produtosUnicos.map((item) => (
              <div key={item.idProduto} className="item-produto">
                <div className="produto" style={{display:'flex',gap:12,alignItems:'center'}}>
                  <img src={item.imagemPrincipal || '/placeholder-200.png'} alt={item.nome} style={{width:64,height:64,objectFit:'cover',borderRadius:6}} />
                  <div>
                    <div style={{fontWeight:600}}>{item.nome}</div>
                    <div style={{fontSize:12,color:'#666'}}>{item.modelo}</div>
                    {Array.isArray(item.caracteristicas) && item.caracteristicas.length>0 && (
                      <div style={{fontSize:12,color:'#444',marginTop:6}}>
                        {item.caracteristicas.map((c,idx)=> (<span key={idx} style={{marginRight:8}}>{c.nome}: {c.detalhe}</span>))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="quantidade">{item.quantidade}</div>
                <div className="preco">{formatCurrency(item.precoUnitario)}</div>
              </div>
            ))}
          </div>

          <div className="coluna-lateral">
            <div className="endereco">
              <div className="cabecalho-endereco">
                <span>Endereço</span>
                <Link to="/cadastro-endereco" className="editar-endereco">Editar</Link>
              </div>
              <div className="info-endereco">
                {endereco ? (
                  <>
                    {endereco.logradouro}, {endereco.numero} <br />
                    {endereco.complemento ? `Complemento: ${endereco.complemento} ` : ''} <br />
                    {endereco.bairro} <br />
                    {endereco.localidade}/{endereco.uf} <br />
                    CEP: {endereco.cep}
                  </>
                ) : (
                  <div>Nenhum endereço cadastrado.</div>
                )}
              </div>
            </div>

            <div className="pagamento">
              <div className="titulo-pagamento">Formato de pagamento</div>
              <div className="botoes-pagamento">
                {checkout?.formasPagamento?.map((p) => (
                  <button
                    key={p}
                    className={payment === p ? 'selected' : ''}
                    onClick={() => setPayment(p)}
                    type="button"
                  >{p}</button>
                ))}
              </div>
            </div>

            <div className="resumo">
              <div className="titulo-resumo">Resumo</div>
              <div className="linha-resumo">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="linha-resumo">
                <span>Custo de frete</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="linha-total">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button className="btn-finalizar" onClick={() => setConfirmOpen(true)} disabled={produtosUnicos.length===0 || finalizing}>
              {finalizing ? 'Finalizando...' : 'Finalizar Pedido'}
            </button>

            {confirmOpen && (
              <div className="compra-modal-overlay" onClick={() => setConfirmOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1600}}>
                <div className="compra-modal" onClick={(e)=>e.stopPropagation()} style={{background:'#fff',borderRadius:8,padding:20,minWidth:320,maxWidth:'90%',boxShadow:'0 10px 30px rgba(0,0,0,0.3)'}}>
                  <h2 style={{marginTop:0}}>Confirmar Pedido</h2>
                  <p>Forma de pagamento selecionada: <strong>{payment}</strong></p>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>Frete</span>
                      <span>{formatCurrency(shipping)}</span>
                    </div>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {error && <div style={{color:'red',marginTop:12}}>{error}</div>}

                  <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'flex-end' }}>
                    <button onClick={() => { setConfirmOpen(false); }} style={{ padding: '8px 14px', borderRadius: 8 }}>Não</button>
                    <button onClick={handleFinalize} disabled={finalizing} style={{ padding: '8px 14px', borderRadius: 8, background: '#4caf50', color: '#fff', border: 'none' }}>{finalizing ? 'Enviando...' : 'Confirmar'}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Compra;
