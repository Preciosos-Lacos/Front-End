import React, { useState, useEffect } from 'react';
// Função para normalizar status (pagamento/pedido)
function normalizeStatus(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\s+/g, '')
    .replace(/[\u0300-\u036f]/g, '');
}
import Sidebar from '../components/Sidebar';
import StatusDropdown from '../components/StatusDropdown';
import Modal from '../components/Modal';
import '../styles/Pedidos.css';

const API_URL = 'http://localhost:8080/pedidos';

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

const mapStatusBackendToSelect = (status) => {
  switch (status?.toUpperCase()) {
    case 'EM ANDAMENTO': return 'EM ANDAMENTO';
    case 'ENTREGUE': return 'ENTREGUE';
    case 'CANCELADO': return 'CANCELADO';
    case 'CONCLUIDO': return 'CONCLUIDO';
    default: return 'EM ANDAMENTO';
  }
};

const Pedidos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    statusPagamento: '',
    statusPedido: ''
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, type: null, viewContent: null });

  const handleUpdatePagamento = async (id, statusPagamento) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const statusToSend = statusPagamento.toUpperCase();
      const res = await fetch(`http://localhost:8080/pedidos/${id}/pagamento`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ statusPagamento: statusToSend })
      });
      if (!res.ok) throw new Error('Erro ao atualizar pagamento');
      setOrders(prevOrders => prevOrders.map(order =>
        order.id === id ? { ...order, statusPagamento: statusToSend } : order
      ));
      await fetchOrders();
    } catch (err) {
      setError('Erro ao atualizar status do pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este pedido?')) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir pedido');
      fetchOrders();
    } catch (err) {
      setError('Erro ao excluir pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, statusPedido) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/pedidos/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ statusPedido })
      });
      if (!res.ok) throw new Error('Erro ao atualizar status');
      await fetchOrders();
    } catch (err) {
      setError('Erro ao atualizar status do pedido');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setModalState({ isOpen: false, type: null, viewContent: null });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      // Carrega todos os pedidos SEM filtro na URL
      const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/pedidos').replace(/\/$/, '');
      const url = `${BASE}`;
      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : (data?.content || []));
    } catch (err) {
      setError('Erro ao carregar pedidos.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatOrderData = (order) => {
    const statusPag = (order.statusPagamento || '').trim().toUpperCase();
    let statusPagamentoColor;
    switch (statusPag) {
      case 'PENDENTE':
        statusPagamentoColor = '#F8E36B';
        break;
      case 'PAGO':
        statusPagamentoColor = '#4BB543';
        break;
      case 'CANCELADO':
        statusPagamentoColor = '#D7263D';
        break;
      case 'ESTORNADO':
        statusPagamentoColor = '#207ed6';
        break;
      default:
        statusPagamentoColor = '#B0B0B0';
    }

    let statusPedidoColor = '#F8E36B';
    const mappedStatus = mapStatusBackendToSelect(order.statusPedido);
    if (mappedStatus === 'EM ANDAMENTO') statusPedidoColor = '#B0B0B0';
    if (mappedStatus === 'ENTREGUE') statusPedidoColor = '#7ED957';
    if (mappedStatus === 'CANCELADO') statusPedidoColor = '#D7263D';
    if (mappedStatus === 'CONCLUIDO') statusPedidoColor = '#4BB543';
    return {
      ...order,
      orderNumber: order.numeroPedido || `PL-${new Date(order.dataPedido).getFullYear()}-${String(order.id).padStart(3, '0')}`,
      data: new Date(order.dataPedido).toLocaleDateString('pt-BR'),
      valor: order.valorTotal || order.itens?.reduce((sum, item) => sum + (item.preco * item.quantidade), 0) || 0,
      forma: order.formaPagamento || 'Não especificado',
      statusPagamento: mapStatusPagamentoBackendToSelect(order.statusPagamento),
      statusPedido: mapStatusBackendToSelect(order.statusPedido),
      modelos: order.itens?.map(item => item.nome) || [],
      nome: order.cliente?.nome || 'Cliente não especificado',
      telefone: order.cliente?.telefone || '',
      endereco: order.enderecoEntrega || 'Endereço não especificado',
      statusPagamentoColor,
      statusPedidoColor
    };
  };

  function getDateString(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Data inválida';
    return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  }

  const filtered = orders.length > 0
    ? orders
        .filter(order => {
          const orderDateStr = getDateString(order.dataPedido);
          // Diagnóstico de datas
          console.log('[Filtro Data] Pedido:', order.dataPedido, '| Formatado:', orderDateStr, '| Início:', filters.startDate, '| Fim:', filters.endDate);
          if (filters.startDate && orderDateStr && orderDateStr < filters.startDate) {
            console.warn('[Filtro Data] Excluído por data início:', orderDateStr, '<', filters.startDate);
            return false;
          }
          // Inclui pedidos na data exata do filtro de início
          if (filters.startDate && orderDateStr && orderDateStr === filters.startDate) {
            console.log('[Filtro Data] Incluído por igualdade início:', orderDateStr, '===', filters.startDate);
          }
          if (filters.endDate && orderDateStr && orderDateStr > filters.endDate) {
            console.warn('[Filtro Data] Excluído por data fim:', orderDateStr, '>', filters.endDate);
            return false;
          }
          // Inclui pedidos na data exata do filtro de fim
          if (filters.endDate && orderDateStr && orderDateStr === filters.endDate) {
            console.log('[Filtro Data] Incluído por igualdade fim:', orderDateStr, '===', filters.endDate);
          }
          // Filtro por status do pagamento
          if (filters.statusPagamento && filters.statusPagamento !== "") {
            if (mapStatusPagamentoBackendToSelect(order.statusPagamento) !== filters.statusPagamento) {
              return false;
            }
          }
          // Filtro por status do pedido
          if (filters.statusPedido && filters.statusPedido !== "") {
            if (mapStatusBackendToSelect(order.statusPedido) !== filters.statusPedido.toUpperCase()) {
              return false;
            }
          }
          return true;
        })
        .map(formatOrderData)
    : [];

  return (
    <div className="pedidos-root">
      <Sidebar />
      <header>Pedidos</header>
      <div className="content">
        {/* Legenda minimalista dos emojis de status */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          fontSize: '0.95rem',
          color: '#6d2943',
          marginBottom: 8,
          marginTop: 8,
          opacity: 0.85,
        }}>
          <span title="Pagamento pendente">🕒 Pendente</span>
          <span title="Pagamento realizado">💳 Pago</span>
          <span title="Pagamento cancelado">❌ Cancelado</span>
          <span title="Pagamento estornado">↩️ Estornado</span>
          <span title="Pedido em andamento">🧑‍🔧 Em andamento</span>
          <span title="Pedido entregue">✅ Entregue</span>
          <span title="Pedido concluído">📦 Concluído</span>
        </div>
        <div className="filter-bar" style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 160 }}>
            <label style={{ marginBottom: 8, fontWeight: 500, marginLeft: 8 }}>Data Início</label>
            <input 
              type="date" 
              className="form-control search-input"
              style={{ background: '#f8c4d6', borderRadius: 20, border: 'none', boxShadow: '0 2px 8px #e6b6c7', fontWeight: 500, width: 160, textAlign: 'center', padding: '12px 16px', fontSize: '1.1rem' }}
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 160 }}>
            <label style={{ marginBottom: 8, fontWeight: 500, marginLeft: 8 }}>Data Fim</label>
            <input 
              type="date" 
              className="form-control search-input"
              style={{ background: '#f8c4d6', borderRadius: 20, border: 'none', boxShadow: '0 2px 8px #e6b6c7', fontWeight: 500, width: 160, textAlign: 'center', padding: '12px 16px', fontSize: '1.1rem' }}
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 160 }}>
            <label style={{ marginBottom: 8, fontWeight: 500, marginLeft: 8 }}>Status Pagamento</label>
            <select 
              className="form-control search-input"
              style={{ background: '#f8c4d6', borderRadius: 20, border: 'none', boxShadow: '0 2px 8px #e6b6c7', fontWeight: 500, width: 160, textAlign: 'center', padding: '12px 16px', fontSize: '1.1rem' }}
              value={filters.statusPagamento}
              onChange={(e) => setFilters(prev => ({ ...prev, statusPagamento: e.target.value }))}
            >
              <option value="">Todos</option>
              {statusPagamentoOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 160 }}>
            <label style={{ marginBottom: 8, fontWeight: 500, marginLeft: 8 }}>Status Pedido</label>
            <select 
              className="form-control search-input"
              style={{ background: '#f8c4d6', borderRadius: 20, border: 'none', boxShadow: '0 2px 8px #e6b6c7', fontWeight: 500, width: 160, textAlign: 'center', padding: '12px 16px', fontSize: '1.1rem' }}
              value={filters.statusPedido}
              onChange={(e) => setFilters(prev => ({ ...prev, statusPedido: e.target.value }))}
            >
              <option value="">Todos</option>
              <option value="iniciado">Iniciado</option>
              <option value="preparacao">Preparação</option>
              <option value="enviado">Enviado</option>
              <option value="entregue">Entregue</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
        {loading && (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p>Carregando pedidos...</p>
          </div>
        )}
        {error && (
          <div className="error-container">
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle"></i> {error}
            </div>
            <button className="btn btn-warning" onClick={fetchOrders}>
              Tentar Novamente
            </button>
          </div>
        )}
        {!loading && !error && (
          <div className="table-pedidos mt-3" style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 16,
              background: 'transparent',
              tableLayout: 'fixed'
            }}>
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
                <tr style={{ color: '#6d2943', fontWeight: 600, fontSize: '1.1rem', background: 'transparent' }}>
                  <th style={{padding: '16px 8px', textAlign: 'left'}}>Cliente</th>
                  <th>Telefone</th>
                  <th>Data</th>
                  <th>Valor</th>
                  <th>Forma</th>
                  <th>Pagamento</th>
                  <th>Pedido</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody style={{display: 'table-row-group'}}>
                {filtered.length > 0 ? (
                  filtered.map((p, idx) => (
                    <tr
                      key={p.id}
                      style={{
                        borderRadius: '24px',
                        height: '64px',
                        marginBottom: '18px',
                        display: 'table-row',
                      }}
                    >
                      <td
                        style={{
                          padding: '18px 8px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          borderRadius: '24px 0 0 24px',
                          textAlign: 'left',
                          verticalAlign: 'middle',
                        }}
                        onClick={() => openDetails(p)}
                      >
                        {p.nome}
                      </td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{p.telefone}</td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{p.data}</td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>R$ {p.valor.toFixed(2).replace('.', ',')}</td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{p.forma}</td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                        <select
                          className="status-badge status-pagamento"
                          style={{
                            fontWeight: 'bold',
                            fontSize: '1.15rem',
                            borderRadius: '30px',
                            boxShadow: '0 2px 8px #e6b6c7',
                            width: 80,
                            textAlign: 'center',
                            border: 'none',
                            padding: '8px 12px',
                            marginTop: 0,
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            background: '#fff',
                            color: '#222',
                          }}
                          value={mapStatusPagamentoBackendToSelect(p.statusPagamento)}
                          onChange={e => handleUpdatePagamento(p.id, e.target.value)}
                          aria-label="Status do pagamento"
                        >
                          {statusPagamentoOptions.map(opt => (
                            <option key={opt.value} value={opt.value} title={opt.alt} aria-label={opt.alt}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                        <select
                          className="status-badge status-pedido"
                          style={{
                            fontWeight: 'bold',
                            fontSize: '1.15rem',
                            borderRadius: '30px',
                            boxShadow: '0 2px 8px #e6b6c7',
                            width: 80,
                            textAlign: 'center',
                            border: 'none',
                            padding: '8px 12px',
                            marginTop: 0,
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            background: '#fff',
                            color: '#222',
                          }}
                          value={mapStatusBackendToSelect(p.statusPedido)}
                          onChange={e => handleUpdateStatus(p.id, e.target.value)}
                          aria-label="Status do pedido"
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value} title={opt.alt} aria-label={opt.alt}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td
                        style={{
                          borderRadius: '0 24px 24px 0',
                          verticalAlign: 'middle',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                          <button className="btn-sm btn-contato" title="WhatsApp" onClick={() => window.open(`https://wa.me/55${p.telefone.replace(/\D/g, '')}`)}><i className="bi bi-whatsapp"></i></button>
                          <button className="btn-sm btn-contato" title="E-mail" onClick={() => window.open(`mailto:${p.cliente?.email || ''}`)}><i className="bi bi-envelope"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '24px 0' }}>
                      <div className="no-results">
                        <i className="bi bi-inbox"></i>
                        <p>Nenhum pedido encontrado com os filtros aplicados.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal isOpen={modalState.isOpen} onClose={closeModal} type={modalState.type} viewContent={modalState.viewContent} />
    </div>
  );
};

export default Pedidos;