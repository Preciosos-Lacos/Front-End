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
  const [changingQty, setChangingQty] = useState(null); // idProduto sendo alterado (+/-)

  const subtotal = useMemo(()=>{
    // prioriza lista detalhada se disponível
    const fonte = produtos.length ? produtos : itens;
    return fonte.reduce((acc,i)=> acc + Number(i.preco||0),0);
  },[itens,produtos]);

  useEffect(()=>{
    let active = true;
    // Verifica se há produtos para recompra no localStorage
    const recomprar = localStorage.getItem('carrinho_recomprar');
    if (recomprar) {
      try {
        const produtosRecomprar = JSON.parse(recomprar);
        if (Array.isArray(produtosRecomprar) && produtosRecomprar.length > 0) {
          setProdutos(produtosRecomprar);
          setItens(produtosRecomprar.map(p => ({
            idProduto: p.idProduto,
            quantidade: p.quantidade,
            preco: p.precoUnitario,
            nome: p.nome,
            modelo: p.modelo,
            imagemPrincipal: p.imagemPrincipal,
            caracteristicas: p.caracteristicas || []
          })));
          localStorage.removeItem('carrinho_recomprar');
          setLoading(false);
          return;
        }
      } catch {}
    }
    async function load(){
      try {
        setLoading(true); setError(null);
        const token = getAuthToken();
        if(!token){ setError('Faça login para visualizar o carrinho.'); return; }
        const payload = decodeJwt(token); const email = payload?.sub;
        // Buscar usuários para achar ID do usuário logado
        const resUsers = await fetch(`${BASE_URL}/usuarios`,{ headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` } });
        if(!resUsers.ok) throw new Error('Falha ao carregar usuários');
        const listaUsuarios = await resUsers.json();
        const u = listaUsuarios.find(x=> x.login === email);
        if(!u) throw new Error('Usuário não encontrado');
        if(!active) return; setUsuario(u);
        // Buscar carrinho básico (PedidoDTO)
        const resCarrinho = await fetch(`${BASE_URL}/pedidos/carrinho/${u.idUsuario}`, { headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` } });
        if(resCarrinho.status === 204){ if(active){ setPedido(null); setItens([]);} return; }
        if(!resCarrinho.ok) throw new Error('Falha ao buscar carrinho');
        const carrinho = await resCarrinho.json();
        if(active){ setPedido(carrinho); setItens(carrinho.itens || []); }

        // Buscar detalhes dos produtos do carrinho
        const resDetalhes = await fetch(`${BASE_URL}/pedidos/carrinho/${u.idUsuario}/produtos`, { headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` } });
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

  // Remove um grupo de produtos (todos os ids passados)
  async function removerGrupo(ids = []){
    if(!usuario?.idUsuario) return;
    const token = getAuthToken(); if(!token) return;
    // marcar o primeiro id como removing to disable UI
    const firstId = Number(ids[0]);
    setRemoving(firstId);
    try {
      for (const id of ids) {
        // chamar DELETE para cada id
        await fetch(`${BASE_URL}/pedidos/carrinho/${id}/usuario/${usuario.idUsuario}`,{ method:'DELETE', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
      }
      // Recarregar carrinho
      const resCarrinho = await fetch(`${BASE_URL}/pedidos/carrinho/${usuario.idUsuario}`, { headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
      if(resCarrinho.status === 204){ setItens([]); setPedido(null); setProdutos([]); return; }
      const carrinho = await resCarrinho.json(); setPedido(carrinho); setItens(carrinho.itens || []);
      const r = await fetch(`${BASE_URL}/pedidos/carrinho/${usuario.idUsuario}/produtos`, { headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
      if(r.ok && r.status !== 204){ setProdutos(await r.json()); } else { setProdutos([]); }
    } catch(e){ console.error(e); alert('Erro ao remover item(s)'); }
    finally { setRemoving(null); }
  }

  async function incrementarQuantidade(idProduto) {
    if(!usuario?.idUsuario) return;
    const token = getAuthToken(); if(!token) return;
    setChangingQty(idProduto);
    try {
      const res = await fetch(`${BASE_URL}/pedidos/carrinho`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ idUsuario: usuario.idUsuario, idProduto })
      });
      if (!res.ok) throw new Error('Falha ao adicionar item');
      const novo = await res.json();
      setPedido(novo); setItens(novo.itens || []);
      // atualizar lista detalhada
      try {
        const r = await fetch(`${BASE_URL}/pedidos/carrinho/${usuario.idUsuario}/produtos`, { headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
        if(r.ok && r.status !== 204){ setProdutos(await r.json()); } else { setProdutos([]); }
      } catch {}
    } catch(e){ console.error(e); alert(e.message || 'Erro ao adicionar item'); }
    finally { setChangingQty(null); }
  }

  async function decrementarQuantidade(idProduto) {
    if(!usuario?.idUsuario) return;
    const token = getAuthToken(); if(!token) return;
    setChangingQty(idProduto);
    try {
      const res = await fetch(`${BASE_URL}/pedidos/carrinho/decrement`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ idUsuario: usuario.idUsuario, idProduto })
      });
      if (res.status === 204) { // carrinho vazio ou não encontrado
        setItens([]); setPedido(null); setProdutos([]); return;
      }
      if (!res.ok) {
        // Fallback: se der 404/erro, tenta remover uma ocorrência via DELETE
        try {
          const del = await fetch(`${BASE_URL}/pedidos/carrinho/${idProduto}/usuario/${usuario.idUsuario}` ,{
            method: 'DELETE',
            headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` }
          });
          if (del.status === 204) { setItens([]); setPedido(null); setProdutos([]); return; }
          if (!del.ok) throw new Error('Falha ao remover item');
          const novoDel = await del.json();
          setPedido(novoDel); setItens(novoDel.itens || []);
          try {
            const r2 = await fetch(`${BASE_URL}/pedidos/carrinho/${usuario.idUsuario}/produtos`, { headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
            if(r2.ok && r2.status !== 204){ setProdutos(await r2.json()); } else { setProdutos([]); }
          } catch {}
          return;
        } catch (fallbackErr) {
          throw new Error('Falha ao remover item');
        }
      }
      const novo = await res.json();
      setPedido(novo); setItens(novo.itens || []);
      // atualizar lista detalhada
      try {
        const r = await fetch(`${BASE_URL}/pedidos/carrinho/${usuario.idUsuario}/produtos`, { headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
        if(r.ok && r.status !== 204){ setProdutos(await r.json()); } else { setProdutos([]); }
      } catch {}
    } catch(e){ console.error(e); alert(e.message || 'Erro ao remover item'); }
    finally { setChangingQty(null); }
  }

  // Workaround: decrementar usando DELETE por id específico (remove uma ocorrência)
  async function decrementarQuantidadeComDelete(idProduto) {
    if(!usuario?.idUsuario) return;
    const token = getAuthToken(); if(!token) return;
    setChangingQty(idProduto);
    try {
      const res = await fetch(`${BASE_URL}/pedidos/carrinho/${idProduto}/usuario/${usuario.idUsuario}`, {
        method: 'DELETE',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` }
      });
      if (res.status === 204) { // carrinho vazio ou não encontrado
        setItens([]); setPedido(null); setProdutos([]); return;
      }
      if (!res.ok) throw new Error('Falha ao remover item');
      const novo = await res.json();
      setPedido(novo); setItens(novo.itens || []);
      // atualizar lista detalhada
      try {
        const r = await fetch(`${BASE_URL}/pedidos/carrinho/${usuario.idUsuario}/produtos`, { headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }});
        if(r.ok && r.status !== 204){ setProdutos(await r.json()); } else { setProdutos([]); }
      } catch {}
    } catch(e){ console.error(e); alert(e.message || 'Erro ao remover item'); }
    finally { setChangingQty(null); }
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
              {(() => {
                // Agrupa produtos por igualdade de atributos relevantes
                const fonte = produtos.length ? produtos : itens;
                const map = new Map();
                for (const p of fonte) {
                  // chave de agrupamento: idProduto quando disponível, senão atributos que definem igualdade
                  const baseId = p.idProduto ?? p.sku ?? null;
                  let key;
                  if (baseId) {
                    key = `id:${baseId}`;
                  } else {
                    // fallback de igualdade baseado em campos que compõem o produto
                    const modelo = p.idModelo ?? p.modelo ?? '';
                    const nome = (p.nome || '').trim();
                    const material = p.material ?? '';
                    const cor = p.corDescricao ?? p.cor ?? '';
                    const acabamento = p.acabamentoDescricao ?? p.acabamento ?? '';
                    key = `k:${modelo}|${nome}|${material}|${cor}|${acabamento}`;
                  }
                  if (map.has(key)) {
                    const ex = map.get(key);
                    ex.produtos.push(p);
                    ex.total += Number(p.preco || 0);
                  } else {
                    map.set(key, { produtos: [p], representante: p, total: Number(p.preco || 0) });
                  }
                }
                return Array.from(map.values()).map(group => {
                  const produto = group.representante;
                  const quantidade = group.produtos.length;
                  const firstId = Number(group.produtos[0]?.idProduto ?? group.produtos[0]?.sku ?? 0);
                  const groupIds = group.produtos.map(x => Number(x.idProduto ?? x.sku ?? 0)).filter(Boolean);
                  return (
                    <article key={group.representante.idProduto || group.representante.sku || JSON.stringify(group.representante)} className="cart-item">
                      <div className="item-image">
                        {produto.foto ? (
                          <img src={`data:image/jpeg;base64,${produto.foto}`} alt={produto.nome} />
                        ) : (
                          <div className="img-placeholder" aria-hidden="true">🎀</div>
                        )}
                      </div>
                      <div className="item-details">
                        <h3 className="item-name">
                          {produto.idModelo ? (
                            <Link to={`/produto?idModelo=${produto.idModelo}`} className="link-produto" title="Ver produto">{produto.nome}</Link>
                          ) : produto.nome}
                        </h3>
                        <p className="item-extra">
                          {produto.material && <span className="pill">{produto.material}</span>}
                          {produto.corDescricao ? (
                            <span className="pill">Cor: {produto.corDescricao}</span>
                          ) : (produto.cor !== undefined && produto.cor !== null ? (
                            <span className="pill">Cor #{produto.cor}</span>
                          ) : null)}
                          {produto.acabamentoDescricao ? (
                            <span className="pill">Acabamento: {produto.acabamentoDescricao}</span>
                          ) : (produto.acabamento !== undefined && produto.acabamento !== null ? (
                            <span className="pill">Acabamento #{produto.acabamento}</span>
                          ) : null)}
                        </p>
                        <div className="item-bottom">
                          <div className="item-price">{formatBRL(group.total / quantidade)}</div>
                          <div className="item-controls">
                            <div className="quantity-control">
                              <button
                                className="quantity-btn minus"
                                type="button"
                                title="Diminuir quantidade"
                                disabled={changingQty === firstId}
                                onClick={() => decrementarQuantidade(Number(group.produtos[group.produtos.length-1]?.idProduto ?? group.produtos[group.produtos.length-1]?.sku ?? firstId))}
                              >−</button>
                              <div className="quantity">{quantidade}</div>
                              <button
                                className="quantity-btn plus"
                                type="button"
                                title="Aumentar quantidade"
                                disabled={changingQty === firstId}
                                onClick={() => incrementarQuantidade(firstId)}
                              >+</button>
                            </div>
                            <button
                              className="remove-btn"
                              type="button"
                              title="Remover"
                              disabled={removing === firstId}
                              onClick={()=>removerGrupo(groupIds)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                });
              })()}
            </div>
          </div>
          <aside className="cart-summary">
            <div className="cart-summary-list">
              {(() => {
                const fonte = produtos.length ? produtos : itens;
                const map = new Map();
                for (const p of fonte) {
                  const baseId = p.idProduto ?? p.sku ?? null;
                  let key;
                  if (baseId) {
                    key = `id:${baseId}`;
                  } else {
                    const modelo = p.idModelo ?? p.modelo ?? '';
                    const nome = (p.nome || '').trim();
                    const material = p.material ?? '';
                    const cor = p.corDescricao ?? p.cor ?? '';
                    const acabamento = p.acabamentoDescricao ?? p.acabamento ?? '';
                    key = `k:${modelo}|${nome}|${material}|${cor}|${acabamento}`;
                  }
                  if (map.has(key)) {
                    const ex = map.get(key);
                    ex.produtos.push(p);
                    ex.total += Number(p.preco || 0);
                  } else {
                    map.set(key, { produtos: [p], representante: p, total: Number(p.preco || 0) });
                  }
                }
                return Array.from(map.values()).map((group, idx) => (
                  <div key={(group.representante.nome||'item') + idx} className="cart-summary-list-item">
                    <span>{group.representante.nome} {group.produtos.length > 1 ? `×${group.produtos.length}` : ''}</span>
                    <span>{formatBRL(group.total)}</span>
                  </div>
                ));
              })()}
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