
import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Modal from '../components/Modal';
import '../styles/PedidoEntregue.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Helpers reaproveitados de MinhasCompras
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

const PedidoEntregue = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('Id');
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    let ativo = true;
    (async () => {
      setLoading(true);
      setErro(null);
      // Validação do parâmetro id
      if (!id || isNaN(Number(id))) {
        setErro('ID do pedido inválido ou não informado.');
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Usuário não autenticado');
        const resp = await fetch(`http://localhost:8080/pedidos/resumo-completo/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!resp.ok) {
          let bodyText = null;
          try { bodyText = await resp.text(); } catch {}
          throw new Error(bodyText || 'Erro ao buscar pedido');
        }
        const data = await resp.json();
        if (ativo) setResumo(data);
      } catch (err) {
        if (ativo) setErro(err.message);
      } finally {
        if (ativo) setLoading(false);
      }
    })();
    return () => { ativo = false; };
  }, [id]);

  const comprarNovamente = (e) => {
    e.preventDefault();
    navigate('/carrinho');
  };
  const precisoDeAjuda = (e) => {
    e.preventDefault();
    setHelpOpen(true);
  };

  if (loading) {
    return (
      <div className="pedido-entregue-page">
        <Header showOffcanvas={true} />
        <main>
          <div className="pedido-section container">
            <div className="card shadow-lg rounded-4 p-5 my-5 text-center" style={{background: 'var(--bs-light)'}}>
              <h2 className="titulo mb-3">Carregando pedido...</h2>
              <div className="spinner-border text-primary" role="status" />
            </div>
          </div>
        </main>
      </div>
    );
  }
  if (erro || !resumo) {
    return (
      <div className="pedido-entregue-page">
        <Header showOffcanvas={true} />
        <main>
          <div className="pedido-section container">
            <div className="card shadow-lg rounded-4 p-5 my-5 text-center" style={{background: 'var(--bs-light)'}}>
              <h2 className="titulo mb-3">Pedido não encontrado</h2>
              {erro && <div className="alert alert-warning pequeno mt-3">{erro}</div>}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pedido-entregue-page">
      <Header showOffcanvas={true} />
      <main>
        <div className="pedido-section container py-4">
          <div className="cards-centralizados" style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '32px', width: '100%', maxWidth: 900, margin: '0 auto'}}>
            <div className="card shadow-lg rounded-4 p-4 mb-4" style={{background: 'var(--bs-light)', minWidth: 320, flex: '1 1 320px'}}>
              <h2 className="titulo mb-3" style={{fontSize: '2rem', fontWeight: 700}}>Resumo do Pedido</h2>
              <div className="d-flex align-items-center gap-3 mb-2">
                <span className="badge bg-primary fs-5 px-3 py-2">#{resumo.idPedido}</span>
                <span className="text-muted">{formatDateBR(resumo.dataPedido)}</span>
              </div>
              <div className="mb-2"><i className="bi bi-person-circle me-2" /> <b>{resumo.nomeCliente}</b> <span className="text-muted">({resumo.telefone})</span></div>
              <div className="mb-2"><i className="bi bi-geo-alt me-2" /> <b>CEP:</b> {resumo.cepEntrega}</div>
              <div className="mb-2"><i className="bi bi-truck me-2" /> <b>Envio:</b> {resumo.formaEnvio}</div>
              <div className="mb-2"><i className="bi bi-credit-card me-2" /> <b>Pagamento:</b> {resumo.formaPagamento} <span className={`ms-2 badge ${resumo.statusPagamento === 'Pago' ? 'bg-success' : 'bg-warning text-dark'}`}>{resumo.statusPagamento}</span></div>
              <div className="mb-2"><i className="bi bi-info-circle me-2" /> <b>Status:</b> <span className={`badge ${resumo.statusPedido === 'Entregue' ? 'bg-success' : 'bg-info text-dark'}`}>{resumo.statusPedido}</span></div>
              <div className="mb-2 fs-5"><i className="bi bi-cash-coin me-2" /> <b>Total:</b> {formatMoeda(resumo.total)}</div>
            </div>
            <div className="card produtos shadow-lg rounded-4 p-4 mb-4" style={{background: '#fff', minWidth: 320, maxHeight: 400, flex: '1 1 320px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <h3 className="mb-3" style={{fontWeight: 600}}>Produtos</h3>
              <div className="produtos-lista" style={{width: '100%'}}>
                {(resumo.produtos || []).map(prod => (
                  <div key={prod.idProduto} className="produto-item d-flex flex-column align-items-center p-3 rounded-3 border h-100 mb-3" style={{background: '#fff', width: '100%'}}>
                    <img src={getImageSrc(prod.foto)} alt={prod.nome} style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 12, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                    <div className="fw-semibold mb-1" style={{fontSize: '1.1rem'}}>{prod.nome} {prod.modelo ? `(${prod.modelo})` : ''}</div>
                    <div className="mb-1">Preço: <b>{formatMoeda(prod.preco)}</b></div>
                    <div className="text-muted pequeno text-center">{(prod.caracteristicas || []).map(c => `${c.nome}: ${c.detalhe}`).join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-3 justify-content-center my-4">
            <Link to="/carrinho" className="btn btn-lg btn-primario px-4 py-2" onClick={comprarNovamente} style={{fontWeight:600}}>
              <i className="bi bi-arrow-repeat me-2" />Comprar novamente
            </Link>
            <Link to="#" className="btn btn-lg btn-secundario px-4 py-2" onClick={precisoDeAjuda} style={{fontWeight:600}}>
              <i className="bi bi-question-circle me-2" />Preciso de ajuda
            </Link>
          </div>
          <Modal
            isOpen={helpOpen}
            onClose={() => setHelpOpen(false)}
            type="view"
            viewContent={(
              <div style={{ padding: 18, minWidth: 300 }}>
                <h3>Precisa de ajuda?</h3>
                <p>Entre em contato pelo WhatsApp ou e-mail para suporte!</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                  <button
                    onClick={() => setHelpOpen(false)}
                    style={{ padding: '8px 12px', borderRadius: 6 }}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      </main>
    </div>
  );
};

export default PedidoEntregue;
