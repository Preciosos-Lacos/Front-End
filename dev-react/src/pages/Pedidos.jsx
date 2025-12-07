// src/pages/Pedidos.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { FaClock, FaCreditCard, FaTimesCircle, FaUndo, FaBox, FaCheckCircle, FaUserCog } from 'react-icons/fa';
import '../styles/Pedidos.css';

const API_URL = 'http://localhost:8080/pedidos';

function getAuthToken() {
  return localStorage.getItem('token');
}

const statusPagamentoOptions = [
  { value: 'Pendente', label: '🕒', alt: 'Pagamento pendente' },
  { value: 'Pago', label: '💳', alt: 'Pagamento realizado' },
  { value: 'Cancelado', label: '❌', alt: 'Pagamento cancelado' },
  { value: 'Estornado', label: '↩️', alt: 'Pagamento estornado' }
];

const mapStatusPagamentoBackendToSelect = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'pendente': return 'Pendente';
    case 'pago': return 'Pago';
    case 'cancelado': return 'Cancelado';
    case 'estornado': return 'Estornado';
    default: return 'Pendente';
  }
};

const statusOptions = [
  { value: 'EM ANDAMENTO', label: '🧑‍🔧', alt: 'Pedido em andamento' },
  { value: 'ENTREGUE', label: '✅', alt: 'Pedido entregue' },
  { value: 'CANCELADO', label: '❌', alt: 'Pedido cancelado' },
  { value: 'CONCLUIDO', label: '📦', alt: 'Pedido concluído' }
];

const Pedidos = () => {
  // utilitários
  const parseDate = (str) => {
    if (!str) return null;
    // ISO format
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const [y, m, d] = str.split('-');
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
    // DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      const [day, month, year] = str.split('/');
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
    // DD MMM YYYY (ex: '30 nov. 2025')
    if (/^\d{2} [a-zA-Zçãé.]+\. \d{4}$/.test(str)) {
      const meses = {
        'jan.': 0, 'fev.': 1, 'mar.': 2, 'abr.': 3, 'mai.': 4, 'jun.': 5,
        'jul.': 6, 'ago.': 7, 'set.': 8, 'out.': 9, 'nov.': 10, 'dez.': 11
      };
      const [dia, mesAbv, ano] = str.split(' ');
      const mesNum = meses[mesAbv.toLowerCase()] ?? 0;
      return new Date(Number(ano), mesNum, Number(dia));
    }
    // Tenta converter direto
    const d = new Date(str);
    if (!isNaN(d)) return d;
    return null;
  };

  const normalize = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase();

  // states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ startDate: '', endDate: '', statusPagamento: '', statusPedido: '' });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, pedido: null });

  // fetchOrders consolidado (usado por useEffect e após updates)
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Usuário não autenticado. Faça login.');
        setOrders([]);
        setLoading(false);
        return;
      }
      // DEBUG: ver token no console (remova em prod se quiser)
      console.log('[Pedidos] token presente:', !!token);

      const res = await fetch(API_URL, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        throw new Error('Não autorizado (401). Verifique o token.');
      }
      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || 'Erro ao buscar pedidos');
      }

      const data = await res.json();
      // Log para conferir os valores das datas recebidas
      console.log('Pedidos recebidos (datas):', data.map(p => p.dataPedido));
      // ordena por dataPedido (prioritário)
      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) => {
            const da = parseDate(a.dataPedido) || new Date(0);
            const db = parseDate(b.dataPedido) || new Date(0);
            return db.getTime() - da.getTime();
          })
        : [];
      setOrders(sorted);
      setLoading(false);
    } catch (e) {
      console.error('[fetchOrders] ', e);
      setError(e.message || 'Erro ao carregar pedidos');
      setLoading(false);
    }
  };

  // atualiza status do pagamento
  const handleUpdatePagamento = async (id, novoStatus) => {
    try {
      const token = getAuthToken();
      if (!token) return alert('Usuário não autenticado.');
      const res = await fetch(`${API_URL}/${id}/pagamento`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ statusPagamento: novoStatus })
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || 'Erro ao atualizar pagamento');
      }
      await fetchOrders();
    } catch (e) {
      console.error('[handleUpdatePagamento]', e);
      alert(e.message || 'Erro ao atualizar status do pagamento');
    }
  };

  // atualiza status do pedido
  const handleUpdateStatus = async (id, novoStatus) => {
    try {
      const token = getAuthToken();
      if (!token) return alert('Usuário não autenticado.');
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ statusPedido: novoStatus })
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || 'Erro ao atualizar status do pedido');
      }
      await fetchOrders();
    } catch (e) {
      console.error('[handleUpdateStatus]', e);
      alert(e.message || 'Erro ao atualizar status do pedido');
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // filtragem (igual à sua lógica)
  const filtered = Array.isArray(orders)
    ? orders.filter((pedido) => {
        const raw = pedido.dataPedido || pedido.data_pedido || pedido.data || '';
        const pedidoDate = parseDate(raw);
        let match = true;

        if (filters.startDate) {
          const s = parseDate(filters.startDate);
          if (s) match = match && pedidoDate && pedidoDate >= s;
        }
        if (filters.endDate) {
          const e = parseDate(filters.endDate);
          if (e) match = match && pedidoDate && pedidoDate <= e;
        }
        if (filters.statusPagamento) {
          const sp = mapStatusPagamentoBackendToSelect(pedido.statusPagamento || pedido.status_pagamento || pedido.pagamentoStatus || '');
          match = match && sp === filters.statusPagamento;
        }
        if (filters.statusPedido) {
          const st = (pedido.statusPedido || pedido.status_pedido || pedido.pedidoStatus || '').toLowerCase();
          match = match && st === (filters.statusPedido || '').toLowerCase();
        }
        if (searchTerm) {
          const nome = pedido.cliente?.nome || '';
          match = match && nome.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return match;
      })
    : [];

  const statusPagamentoPresentes = Array.from(new Set(filtered.map(p => mapStatusPagamentoBackendToSelect(p.statusPagamento || p.status_pagamento || p.pagamentoStatus || '')))).filter(Boolean);
  const statusPedidoPresentes = Array.from(new Set(filtered.map(p => (p.statusPedido || p.status_pedido || p.pedidoStatus || '').toUpperCase()))).filter(Boolean);

  const openDetails = (pedido) => setModalState({ isOpen: true, pedido });
  const closeModal = () => setModalState({ isOpen: false, pedido: null });

  const mapStatusPedidoBackendToSelect = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'em andamento': return 'EM ANDAMENTO';
      case 'entregue': return 'ENTREGUE';
      case 'cancelado': return 'CANCELADO';
      case 'concluido': return 'CONCLUIDO';
      default: return (status || '').toUpperCase() || 'EM ANDAMENTO';
    }
  };

  return (
    <div className="pedidos-root">
      <Sidebar />
      <header>Pedidos</header>
      <div className="content">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, fontSize: '1.05rem', color: '#6d2943', marginBottom: 8, marginTop: 8, opacity: 0.85 }}>
          <span title="Pagamento pendente"><FaClock style={{marginRight: 4}}/>Pendente</span>
          <span title="Pagamento realizado"><FaCreditCard style={{marginRight: 4}}/>Pago</span>
          <span title="Pagamento cancelado"><FaTimesCircle style={{marginRight: 4}}/>Cancelado</span>
          <span title="Pagamento estornado"><FaUndo style={{marginRight: 4}}/>Estornado</span>
          <span title="Pedido em andamento"><FaUserCog style={{marginRight: 4}}/>Em andamento</span>
          <span title="Pedido entregue"><FaCheckCircle style={{marginRight: 4}}/>Entregue</span>
          <span title="Pedido concluído"><FaBox style={{marginRight: 4}}/>Concluído</span>
        </div>

        <div className="filter-bar" style={{ display: 'flex', gap: 32, justifyContent: 'center', marginBottom: 24 }}>
          {/* Data Início */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 160 }}>
            <label style={{ marginBottom: 8, fontWeight: 500, marginLeft: 8 }}>Data Início</label>
            <input type="date" className="form-control search-input" style={{ background: '#f8c4d6', borderRadius: 20, border: 'none', boxShadow: '0 2px 8px #e6b6c7', fontWeight: 500, width: 160, textAlign: 'center', padding: '12px 16px', fontSize: '1.1rem' }} value={filters.startDate} onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))} />
          </div>

          {/* Data Fim */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 160 }}>
            <label style={{ marginBottom: 8, fontWeight: 500, marginLeft: 8 }}>Data Fim</label>
            <input type="date" className="form-control search-input" style={{ background: '#f8c4d6', borderRadius: 20, border: 'none', boxShadow: '0 2px 8px #e6b6c7', fontWeight: 500, width: 160, textAlign: 'center', padding: '12px 16px', fontSize: '1.1rem' }} value={filters.endDate} onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))} />
          </div>

          {/* Status Pagamento */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 160 }}>
            <label style={{ marginBottom: 8, fontWeight: 500, marginLeft: 8 }}>Status Pagamento</label>
            <select className="form-control search-input" style={{ background: '#f8c4d6', borderRadius: 20, border: 'none', boxShadow: '0 2px 8px #e6b6c7', fontWeight: 500, width: 160, textAlign: 'center', padding: '12px 16px', fontSize: '1.1rem' }} value={filters.statusPagamento} onChange={(e) => setFilters(prev => ({ ...prev, statusPagamento: e.target.value }))}>
              <option value="">Todos</option>
              {statusPagamentoOptions.filter(opt => statusPagamentoPresentes.includes(opt.value)).map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Status Pedido */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 160 }}>
            <label style={{ marginBottom: 8, fontWeight: 500, marginLeft: 8 }}>Status Pedido</label>
            <select className="form-control search-input" style={{ background: '#f8c4d6', borderRadius: 20, border: 'none', boxShadow: '0 2px 8px #e6b6c7', fontWeight: 500, width: 160, textAlign: 'center', padding: '12px 16px', fontSize: '1.1rem' }} value={filters.statusPedido} onChange={(e) => setFilters(prev => ({ ...prev, statusPedido: e.target.value }))}>
              <option value="">Todos</option>
              {statusPedidoPresentes.map(opt => (
                <option key={opt} value={opt.toLowerCase()}>{opt.charAt(0) + opt.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <div className="loading-container"><p>Carregando pedidos...</p></div>}
        {error && <div className="error-container"><div className="alert alert-warning">{error}</div><button className="btn btn-warning" onClick={fetchOrders}>Tentar Novamente</button></div>}

        {!loading && !error && (
          <div className="table-pedidos mt-3" style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 16, borderRadius: 31, tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '15%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '17%' }} />
              </colgroup>
              <thead>
                <tr style={{ color: '#343434ff', fontWeight: 600, fontSize: '1.1rem' }}>
                  <th style={{ padding: '16px 8px', textAlign: 'left', minWidth: 120, borderBottom: '2px solid #e6b6c7' }}>Cliente</th>
                  <th style={{ minWidth: 120, borderBottom: '2px solid #e6b6c7' }}>Telefone</th>
                  <th style={{ minWidth: 120, borderBottom: '2px solid #e6b6c7' }}>Data</th>
                  <th style={{ minWidth: 100, borderBottom: '2px solid #e6b6c7' }}>Valor</th>
                  <th style={{ minWidth: 100, borderBottom: '2px solid #e6b6c7' }}>Forma</th>
                  <th style={{ minWidth: 100, borderBottom: '2px solid #e6b6c7' }}>Pagamento</th>
                  <th style={{ minWidth: 100, borderBottom: '2px solid #e6b6c7' }}>Pedido</th>
                  <th style={{ minWidth: 120, borderBottom: '2px solid #e6b6c7' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((p) => (
                  <tr key={p.id} style={{ height: 64 }}>
                    <td onClick={() => openDetails(p)} style={{ cursor: 'pointer', borderBottom: '1px solid #f3e0e8' }}>{p.cliente?.nome || '-'}</td>
                    <td style={{ borderBottom: '1px solid #f3e0e8' }}>{p.cliente?.telefone || '-'}</td>
                    <td style={{ borderBottom: '1px solid #f3e0e8' }}>{p.dataPedido || p.data_pedido || '-'}</td>
                    <td style={{ borderBottom: '1px solid #f3e0e8' }}>{typeof p.valorTotal === 'number' ? `R$ ${p.valorTotal.toFixed(2).replace('.', ',')}` : (p.valorTotal || '-')}</td>
                    <td style={{ borderBottom: '1px solid #f3e0e8' }}>{p.formaPagamento || '-'}</td>
                    <td style={{ borderBottom: '1px solid #f3e0e8' }}>
                      <select className="status-badge status-pagamento" value={mapStatusPagamentoBackendToSelect(p.statusPagamento || p.status_pagamento || p.pagamentoStatus || '')} onChange={(e) => handleUpdatePagamento(p.id, e.target.value)} aria-label="Status do pagamento" style={{ fontWeight: 'bold', fontSize: '1.05rem', borderRadius: 30 }}>
                        {statusPagamentoOptions.map(opt => <option key={opt.value} value={opt.value} title={opt.alt} aria-label={opt.alt}>{opt.label}</option>)}
                      </select>
                    </td>
                    <td style={{ borderBottom: '1px solid #f3e0e8' }}>
                      <select className="status-badge status-pedido" value={mapStatusPedidoBackendToSelect(p.statusPedido || p.status_pedido || p.pedidoStatus || '')} onChange={(e) => handleUpdateStatus(p.id, e.target.value)} aria-label="Status do pedido" style={{ fontWeight: 'bold', fontSize: '1.05rem', borderRadius: 30 }}>
                        {statusOptions.map(opt => <option key={opt.value} value={opt.value} title={opt.alt} aria-label={opt.alt}>{opt.label}</option>)}
                      </select>
                    </td>
                    <td style={{ borderBottom: '1px solid #f3e0e8' }}>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn-sm btn-contato" title="WhatsApp" onClick={() => {
                          const tel = p.cliente?.telefone || p.telefone || '';
                          if (tel) {
                            const numero = tel.replace(/\D/g, '');
                            window.open(`https://wa.me/55${numero}`);
                          } else alert('Telefone não disponível para WhatsApp');
                        }}><i className="bi bi-whatsapp"></i></button>

                        <button className="btn-sm btn-contato" title="E-mail" onClick={() => window.open(`mailto:${p.cliente?.email || ''}`)}><i className="bi bi-envelope"></i></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '24px 0' }}>
                      <div className="no-results"><i className="bi bi-inbox"></i><p>Nenhum pedido encontrado com os filtros aplicados.</p></div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={modalState.isOpen} onClose={closeModal} type={modalState.type} viewContent={modalState.viewContent} />
        {modalState.isOpen && modalState.pedido && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={closeModal}>
            <div style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 320, maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
              <h2>Detalhes do Pedido</h2>
              <div><strong>Cliente:</strong> {modalState.pedido.cliente?.nome}</div>
              <div><strong>Telefone:</strong> {modalState.pedido.cliente?.telefone}</div>
              <div><strong>E-mail:</strong> {modalState.pedido.cliente?.email}</div>
              <div><strong>Valor Total:</strong> R$ {typeof modalState.pedido.valorTotal === 'number' ? modalState.pedido.valorTotal.toFixed(2).replace('.', ',') : modalState.pedido.valorTotal}</div>
              <div><strong>Forma de Pagamento:</strong> {modalState.pedido.formaPagamento}</div>
              <div><strong>Status Pagamento:</strong> {modalState.pedido.statusPagamento}</div>
              <div><strong>Status Pedido:</strong> {modalState.pedido.statusPedido}</div>
              <div><strong>Data do Pedido:</strong> {modalState.pedido.dataPedido}</div>
              <div style={{ marginTop: 16 }}>
                <strong>Itens:</strong>
                <ul style={{ paddingLeft: 18 }}>
                  {Array.isArray(modalState.pedido.itens) && modalState.pedido.itens.length > 0 ? modalState.pedido.itens.map((item, idx) => (
                    <li key={idx}>{item.nome} (Qtd: {item.quantidade}) - R$ {typeof item.preco === 'number' ? item.preco.toFixed(2).replace('.', ',') : item.preco}</li>
                  )) : <li>Nenhum item</li>}
                </ul>
              </div>
              <button onClick={closeModal} style={{ marginTop: 24, padding: '8px 24px', borderRadius: 8, background: '#e6b6c7', color: '#333', border: 'none', fontWeight: 600 }}>Fechar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pedidos;
