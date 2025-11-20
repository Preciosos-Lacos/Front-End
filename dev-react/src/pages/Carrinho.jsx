import '../styles/Carrinho.css';
import Header from '../components/Header.jsx';
import { Link } from 'react-router-dom';
import React, { useEffect, useState, useMemo } from 'react';

const BASE_URL = 'http://localhost:8080';

function getAuthToken(){ try { return localStorage.getItem('token'); } catch { return null; } }
function decodeJwt(token){ try { const payload = token.split('.')[1]; return JSON.parse(atob(payload.replace(/-/g,'+').replace(/_/g,'/'))); } catch { return {}; } }
function formatBRL(v){ try { return Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); } catch { return v; } }

export default function Carrinho() {
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const [usuario,setUsuario] = useState(null);
  const [itens,setItens] = useState([]); // itens simples (ItemPedidoDTO)
  const [produtos,setProdutos] = useState([]); // detalhes ProdutoDTO
  const [pedido,setPedido] = useState(null); // PedidoDTO
  const [removing,setRemoving] = useState(null); // idProduto em remoção

  const subtotal = useMemo(()=>{
    // prioriza lista detalhada se disponível
    const fonte = produtos.length ? produtos : itens;
    return fonte.reduce((acc,i)=> acc + Number(i.preco||0),0);
  },[itens,produtos]);

  useEffect(()=>{
    let active = true;
    async function load(){
      try {
        setLoading(true); setError(null);
        const token = getAuthToken();
        if(!token){ setError('Faça login para visualizar o carrinho.'); return; }
        const payload = decodeJwt(token); const email = payload?.sub;
        // Buscar usuários para achar ID do usuário logado
        const resUsers = await fetch(`${BASE_URL}/usuarios`,{ headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
        if(!resUsers.ok) throw new Error('Falha ao carregar usuários');
        const listaUsuarios = await resUsers.json();
        const u = listaUsuarios.find(x=> x.login === email);
        if(!u) throw new Error('Usuário não encontrado');
        if(!active) return; setUsuario(u);
        // Buscar carrinho básico (PedidoDTO)
        const resCarrinho = await fetch(`${BASE_URL}/pedidos/carrinho/${u.idUsuario}`, { headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
        if(resCarrinho.status === 204){ if(active){ setPedido(null); setItens([]);} return; }
        if(!resCarrinho.ok) throw new Error('Falha ao buscar carrinho');
        const carrinho = await resCarrinho.json();
        if(active){ setPedido(carrinho); setItens(carrinho.itens || []); }

        // Buscar detalhes dos produtos do carrinho
        const resDetalhes = await fetch(`${BASE_URL}/pedidos/carrinho/${u.idUsuario}/produtos`, { headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
        if(resDetalhes.ok && resDetalhes.status !== 204) {
          const lista = await resDetalhes.json();
          if(active) setProdutos(lista);
        }
      } catch(e){ console.error(e); if(active) setError(e.message || 'Erro ao carregar carrinho'); }
      finally { if(active) setLoading(false); }
    }
    load();
    return ()=>{ active=false; };
  },[]);

  async function removerItem(idProduto){
    if(!usuario?.idUsuario) return;
    const token = getAuthToken(); if(!token) return;
    setRemoving(idProduto);
    try {
      const res = await fetch(`${BASE_URL}/pedidos/carrinho/${idProduto}/usuario/${usuario.idUsuario}`,{ method:'DELETE', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
      if(res.status === 204){ // carrinho vazio
        setItens([]); setPedido(null); return;
      }
      if(!res.ok) throw new Error('Falha ao remover item');
      const novo = await res.json();
      setPedido(novo); setItens(novo.itens || []);
      // atualizar lista detalhada
      try {
        const token2 = getAuthToken();
        if(token2 && usuario?.idUsuario){
          const r = await fetch(`${BASE_URL}/pedidos/carrinho/${usuario.idUsuario}/produtos`, { headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token2}` }});
          if(r.ok && r.status !== 204){ setProdutos(await r.json()); } else { setProdutos([]); }
        }
      } catch {}
    } catch(e){ console.error(e); alert(e.message || 'Erro ao remover item'); }
    finally { setRemoving(null); }
  }

  return (
    <>
      <Header />
      <main data-scroll-container className="cart-page">
        <section className="container-carrinho">
          <div className="cart-left">
            <h1 className="title">Carrinho de compras</h1>
            {loading && <p>Carregando…</p>}
            {error && !loading && <p className="erro" style={{color:'red'}}>{error}</p>}
            {!loading && !error && itens.length === 0 && <p>Seu carrinho está vazio.</p>}
            <div className="cart-items">
              {(produtos.length ? produtos : itens).map(p => (
                <article key={p.idProduto || p.sku} className="cart-item">
                  <div className="item-image">
                    {p.foto ? (
                      <img src={`data:image/jpeg;base64,${p.foto}`} alt={p.nome} />
                    ) : (
                      <div className="img-placeholder" aria-hidden="true">🎀</div>
                    )}
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">
                      {p.idModelo ? (
                        <Link to={`/produto?idModelo=${p.idModelo}`} className="link-produto" title="Ver produto">{p.nome}</Link>
                      ) : p.nome}
                    </h3>
                    {/* Removido colecao e tamanho conforme solicitação */}
                    <p className="item-extra">
                      {p.material && <span className="pill">{p.material}</span>}
                      {p.corDescricao ? (
                        <span className="pill">Cor: {p.corDescricao}</span>
                      ) : (p.cor !== undefined && p.cor !== null ? (
                        <span className="pill">Cor #{p.cor}</span>
                      ) : null)}
                      {p.acabamentoDescricao ? (
                        <span className="pill">Acabamento: {p.acabamentoDescricao}</span>
                      ) : (p.acabamento !== undefined && p.acabamento !== null ? (
                        <span className="pill">Acabamento #{p.acabamento}</span>
                      ) : null)}
                    </p>
                    <div className="item-bottom">
                      <div className="item-price">{formatBRL(p.preco)}</div>
                      <div className="item-controls">
                        <button
                          className="remove-btn"
                          type="button"
                          title="Remover"
                          disabled={removing === Number(p.idProduto || p.sku)}
                          onClick={()=>removerItem(Number(p.idProduto || p.sku))}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <aside className="cart-summary">
            <div className="cart-summary-list">
              {(produtos.length ? produtos : itens).map(i => (
                <div key={i.idProduto || i.sku} className="cart-summary-list-item">
                  <span>{i.nome}</span>
                  <span>{formatBRL(i.preco)}</span>
                </div>
              ))}
              {(produtos.length === 0 && itens.length === 0) && <div className="cart-summary-list-item"><span>Nenhum item</span><span>—</span></div>}
            </div>
            <hr />
            <div className="subtotal-row">
              <span>Subtotal (Sem frete)</span>
              <span className="subtotal-price">{formatBRL(subtotal)}</span>
            </div>
            <div className="action-buttons">
              <Link to="/catalogo" className="btn-continue">Continuar comprando</Link>
              <Link to="/finalizar-compra" className="btn-finalize" aria-disabled={itens.length===0} onClick={(e)=>{ if(itens.length===0){ e.preventDefault(); } }}>Finalizar pedido</Link>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}