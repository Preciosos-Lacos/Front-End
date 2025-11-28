import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { FaClock, FaCreditCard, FaTimesCircle, FaUndo, FaBox, FaCheckCircle, FaUserCog } from 'react-icons/fa';
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

const statusPagamentoIcons = {
  Pendente: <FaClock color="#F8E36B" title="Pendente" />,
  Pago: <FaCreditCard color="#4BB543" title="Pago" />,
  Cancelado: <FaTimesCircle color="#D7263D" title="Cancelado" />,
  Estornado: <FaUndo color="#207ed6" title="Estornado" />
};
const statusPedidoIcons = {
  'EM ANDAMENTO': <FaUserCog color="#B0B0B0" title="Em andamento" />,
  'ENTREGUE': <FaCheckCircle color="#7ED957" title="Entregue" />,
  'CANCELADO': <FaTimesCircle color="#D7263D" title="Cancelado" />,
  'CONCLUIDO': <FaBox color="#4BB543" title="Concluído" />
};

const Pedidos = () => {
    // Função para converter string de data em objeto Date (aceita ISO, yyyy-MM-dd, yyyy-MM-dd HH:mm:ss, dd/MM/yyyy)
    function parseDate(str) {
      if (!str) return null;
      // yyyy-MM-dd (input date) - tratar como local
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        const [year, month, day] = str.split('-');
        return new Date(Number(year), Number(month) - 1, Number(day));
      }
      // ISO ou yyyy-MM-ddTHH:mm:ss
      let d = new Date(str);
      if (!isNaN(d)) return d;
      // yyyy-MM-dd HH:mm:ss
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str)) {
        const [datePart, timePart] = str.split(' ');
        d = new Date(datePart + 'T' + timePart);
        if (!isNaN(d)) return d;
      }
      // dd/MM/yyyy
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
        const [day, month, year] = str.split('/');
        d = new Date(`${year}-${month}-${day}`);
        if (!isNaN(d)) return d;
      }
      // dd MMM. yyyy (ex: '08 nov. 2025')
      if (/^\d{2} [a-zA-Zçãéíóú.]+\. \d{4}$/.test(str)) {
        const [day, mes, year] = str.replace('.', '').split(' ');
        // Mapeia mês abreviado para número
        const meses = {
          'jan': '01', 'fev': '02', 'mar': '03', 'abr': '04', 'mai': '05', 'jun': '06',
          'jul': '07', 'ago': '08', 'set': '09', 'out': '10', 'nov': '11', 'dez': '12'
        };
        const mesNum = meses[mes.toLowerCase().replace('.', '')];
        if (mesNum) {
          d = new Date(`${year}-${mesNum}-${day}`);
          if (!isNaN(d)) return d;
        }
      }
      return null;
    }
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

  // Filtragem dos dados recebidos do backend
  const filtered = Array.isArray(orders)
    ? orders.filter((pedido) => {
        const pedidoDateRaw = pedido.dataPedido || pedido.data_pedido || pedido.data || '';
        const pedidoDate = parseDate(pedidoDateRaw);
        let match = true;
        let debugInfo = {};
        // Função para comparar apenas ano, mês e dia
        function isSameOrAfter(d1, d2) {
          if (!d1 || !d2) return false;
          return (
            d1.getFullYear() > d2.getFullYear() ||
            (d1.getFullYear() === d2.getFullYear() && d1.getMonth() > d2.getMonth()) ||
            (d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() >= d2.getDate())
          );
        }
        function isSameOrBefore(d1, d2) {
          if (!d1 || !d2) return false;
          return (
            d1.getFullYear() < d2.getFullYear() ||
            (d1.getFullYear() === d2.getFullYear() && d1.getMonth() < d2.getMonth()) ||
            (d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() <= d2.getDate())
          );
        }
        if (filters.startDate) {
          const startDate = parseDate(filters.startDate);
          debugInfo.startDate = startDate;
          debugInfo.pedidoDate = pedidoDate;
          const comp = pedidoDate && startDate && isSameOrAfter(pedidoDate, startDate);
          debugInfo.startComp = comp;
          match = match && comp;
        }
        if (filters.endDate) {
          const endDate = parseDate(filters.endDate);
          debugInfo.endDate = endDate;
          debugInfo.pedidoDate = pedidoDate;
          const comp = pedidoDate && endDate && isSameOrBefore(pedidoDate, endDate);
          debugInfo.endComp = comp;
          match = match && comp;
        }
        if (filters.statusPagamento) {
          const statusPag = mapStatusPagamentoBackendToSelect(pedido.statusPagamento || pedido.status_pagamento || pedido.pagamentoStatus || '');
          match = match && statusPag === filters.statusPagamento;
        }
        if (filters.statusPedido) {
          const statusPed = (pedido.statusPedido || pedido.status_pedido || pedido.pedidoStatus || '').toLowerCase();
          match = match && statusPed.includes(filters.statusPedido.toLowerCase());
        }
        if (searchTerm) {
          const nome = pedido.cliente?.nome?.toLowerCase() || '';
          match = match && nome.includes(searchTerm.toLowerCase());
        }
        if (filters.startDate || filters.endDate) {
          console.log('[Filtro Pedido] id:', pedido.id, 'dataPedido:', pedidoDateRaw, 'parsed:', pedidoDate, 'start:', debugInfo.startDate, 'end:', debugInfo.endDate, '>=start:', debugInfo.startComp, '<=end:', debugInfo.endComp, 'match:', match);
        }
        return match;
      })
    : [];

  // Opções dinâmicas para filtros
  const statusPagamentoPresentes = Array.from(new Set(filtered.map(p => mapStatusPagamentoBackendToSelect(p.statusPagamento || p.status_pagamento || p.pagamentoStatus || '')))).filter(Boolean);
  const statusPedidoPresentes = Array.from(new Set(filtered.map(p => (p.statusPedido || p.status_pedido || p.pedidoStatus || '').toUpperCase()))).filter(Boolean);

  // Funções mock para evitar erro
  // Mock: atualiza status localmente
  const handleUpdatePagamento = (id, novoStatus) => {
    // Atualiza status pagamento no backend
    fetch(`${API_URL}/${id}/pagamento`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statusPagamento: novoStatus })
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao atualizar status do pagamento');
        return res.json();
      })
      .then(() => {
        setOrders(prev => prev.map(p => p.id === id ? { ...p, statusPagamento: novoStatus } : p));
      })
      .catch(err => {
        alert('Erro ao atualizar status do pagamento!');
        console.error(err);
      });
  };
  const handleUpdateStatus = (id, novoStatus) => {
    // Atualiza status pedido no backend
    fetch(`${API_URL}/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statusPedido: novoStatus })
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao atualizar status do pedido');
        return res.json();
      })
      .then(() => {
        setOrders(prev => prev.map(p => p.id === id ? { ...p, statusPedido: novoStatus } : p));
      })
      .catch(err => {
        alert('Erro ao atualizar status do pedido!');
        console.error(err);
      });
  };
  const openDetails = () => {};
  const mapStatusBackendToSelect = (status) => status;
  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  // Função para tentar novamente buscar pedidos
  const fetchOrders = () => {
    setLoading(true);
    setError(null);
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar pedidos');
        return res.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Erro ao carregar pedidos');
        setLoading(false);
      });
  };

  // Buscar pedidos da API ao montar o componente
  React.useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar pedidos');
        return res.json();
      })
      .then(data => {
        console.log('Pedidos recebidos do backend:', data);
        // Ordena por dataPedido decrescente (YYYY-MM-DD ou ISO)
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => {
              const rawA = a.dataPedido || a.data_pedido || a.data || '';
              const rawB = b.dataPedido || b.data_pedido || b.data || '';
              // Se não houver data, coloca no final
              if (!rawA && !rawB) return 0;
              if (!rawA) return 1;
              if (!rawB) return -1;
              // Normaliza para Date
              const dateA = new Date(rawA);
              const dateB = new Date(rawB);
              // Se datas inválidas, coloca no final
              if (isNaN(dateA) && isNaN(dateB)) return 0;
              if (isNaN(dateA)) return 1;
              if (isNaN(dateB)) return -1;
              return dateB.getTime() - dateA.getTime();
            })
          : [];
        setOrders(sorted);
        setLoading(false);
      })
      .catch(err => {
        setError('Erro ao carregar pedidos');
        setLoading(false);
      });
  }, []);

  return (
    <div className="pedidos-root">
      <Sidebar />
      <header>Pedidos</header>
      <div className="content">
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '32px',
            fontSize: '1.05rem',
            color: '#6d2943',
            marginBottom: 8,
            marginTop: 8,
            opacity: 0.85
          }}>
            <span title="Pagamento pendente"><FaClock style={{marginRight: 4}}/>Pendente</span>
            <span title="Pagamento realizado"><FaCreditCard style={{marginRight: 4}}/>Pago</span>
            <span title="Pagamento cancelado"><FaTimesCircle style={{marginRight: 4}}/>Cancelado</span>
            <span title="Pagamento estornado"><FaUndo style={{marginRight: 4}}/>Estornado</span>
            <span title="Pedido em andamento"><FaUserCog style={{marginRight: 4}}/>Em andamento</span>
            <span title="Pedido entregue"><FaCheckCircle style={{marginRight: 4}}/>Entregue</span>
            <span title="Pedido concluído"><FaBox style={{marginRight: 4}}/>Concluído</span>
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
                {statusPagamentoOptions.filter(opt => statusPagamentoPresentes.includes(opt.value)).map(opt => (
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
                {statusPedidoPresentes.map(opt => (
                  <option key={opt} value={opt.toLowerCase()}>{opt.charAt(0) + opt.slice(1).toLowerCase()}</option>
                ))}
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
              <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: 16, background: 'transp', borderRadius: 31, tableLayout: 'fixed'}}>
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
                  <tr style={{ color: '#343434ff', fontWeight: 600, fontSize: '1.1rem', background: 'transparent' }}>
                      <th style={{color: '#343434ff', padding: '16px 8px', textAlign: 'left', minWidth: 120, borderBottom: '2px solid #e6b6c7'}}>Cliente</th>
                      <th style={{minWidth: 120, borderBottom: '2px solid #e6b6c7'}}>Telefone</th>
                      <th style={{minWidth: 120, borderBottom: '2px solid #e6b6c7'}}>Data</th>
                      <th style={{minWidth: 100, borderBottom: '2px solid #e6b6c7'}}>Valor</th>
                      <th style={{minWidth: 100, borderBottom: '2px solid #e6b6c7'}}>Forma</th>
                      <th style={{minWidth: 100, borderBottom: '2px solid #e6b6c7'}}>Pagamento</th>
                      <th style={{minWidth: 100, borderBottom: '2px solid #e6b6c7'}}>Pedido</th>
                      <th style={{minWidth: 120, borderBottom: '2px solid #e6b6c7'}}>Ações</th>
                  </tr>
                </thead>
                <tbody style={{display: 'table-row-group'}}>
                  {filtered.length > 0
                    ? filtered.map((p, idx) => (
                        <tr
                          key={p.id}
                          style={{
                            padding: '16px 8px',
                            height: '64px',
                            marginBottom: '18px',
                            display: 'table-row',
                          }}
                        >
                          <td
                            style={{ borderBottom: '1px solid #f3e0e8', textAlign: 'left', verticalAlign: 'top' , color: '#343434ff' }}
                            onClick={() => openDetails(p)}
                          >
                            {p.cliente?.nome || '-'}
                          </td>
                          <td style={{ color: '#343434ff',borderBottom: '1px solid #f3e0e8', verticalAlign: 'top', textAlign: 'left', background: 'transparent', minWidth: 120 }}>{p.cliente?.telefone || '-'}</td>
                          <td style={{ color: '#343434ff',borderBottom: '1px solid #f3e0e8', verticalAlign: 'top', textAlign: 'left', background: 'transparent', minWidth: 120 }}>{p.dataPedido || '-'}</td>
                          <td style={{ color: '#343434ff',borderBottom: '1px solid #f3e0e8', verticalAlign: 'top', textAlign: 'left', background: 'transparent', minWidth: 100 }}>R$ {typeof p.valorTotal === 'number' ? p.valorTotal.toFixed(2).replace('.', ',') : (p.valorTotal || '-')}</td>
                          <td style={{ color: '#343434ff',borderBottom: '1px solid #f3e0e8', verticalAlign: 'top', textAlign: 'left', background: 'transparent', minWidth: 100 }}>{p.formaPagamento || '-'}</td>
                          <td style={{ color: '#343434ff',borderBottom: '1px solid #f3e0e8', verticalAlign: 'top', textAlign: 'left' }}>
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
                                color: '#343434ff',
                                borderBottom: '1px solid #f3e0e8',
                              }}
                              value={mapStatusPagamentoBackendToSelect(p.statusPagamento || p.status_pagamento || p.pagamentoStatus || '-')}
                              onChange={e => handleUpdatePagamento(p.id, e.target.value)}
                              aria-label="Status do pagamento"
                            >
                              {statusPagamentoOptions.map(opt => (
                                <option key={opt.value} value={opt.value} title={opt.alt} aria-label={opt.alt}>{opt.label}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ verticalAlign: 'top', textAlign: 'left', borderBottom: '1px solid #f3e0e8' }}>
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
                                color: '#343434ff',
                              }}
                              value={mapStatusBackendToSelect(p.statusPedido || p.status_pedido || p.pedidoStatus || '-')}
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
                              verticalAlign: 'top',
                              textAlign: 'left',
                              borderBottom: '1px solid #f3e0e8',
                            }}
                          >
                            <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%' }}>
                              <button className="btn-sm btn-contato" title="WhatsApp" onClick={() => window.open(`https://wa.me/55${p.telefone.replace(/\D/g, '')}`)}><i className="bi bi-whatsapp"></i></button>
                              <button className="btn-sm btn-contato" title="E-mail" onClick={() => window.open(`mailto:${p.cliente?.email || ''}`)}><i className="bi bi-envelope"></i></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    : (
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
        </>
      </div>
      <Modal isOpen={modalState.isOpen} onClose={closeModal} type={modalState.type} viewContent={modalState.viewContent} />
    </div>
  );
}

export default Pedidos;