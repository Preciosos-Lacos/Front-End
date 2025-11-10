import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import '../styles/Pedidos.css';

const Pedidos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, type: null, viewContent: null });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    statusPagamento: '',
    statusPedido: ''
  });

  const pedidosMock = [
    {
      id: '1',
      orderNumber: 'PL-2025-001',
      nome: 'Paloma Souza',
      telefone: '+55 (11) 94115-9057',
      data: '23 Mar 2025',
      itens: [
        { sku: 'LX-GRV-01', nome: 'Laço Gravatinha', qtd: 2, preco: 19.95 },
      ],
      endereco: 'R. das Flores, 123 - Pinheiros, SP',
      valor: 53.89,
      forma: 'Débito',
      statusPagamento: 'atrasado',
      statusPedido: 'concluido',
      modelos: ['Laço Gravatinha'],
      tamanho: 'M',
      cores: 'Vermelho'
    },
    {
      id: '2',
      orderNumber: 'PL-2025-002',
      nome: 'Gabriela Simões',
      telefone: '+55 (11) 94121-9217',
      data: '24 Mar 2025',
      itens: [
        { sku: 'LX-PAD-02', nome: 'Laço Padrão', qtd: 1, preco: 18.9 },
        { sku: 'LX-KIT-06', nome: 'Kit 6 laços', qtd: 1, preco: 33.3 }
      ],
      endereco: 'Av. Paulista, 2000 - Bela Vista, SP',
      valor: 52.2,
      forma: 'Débito',
      statusPagamento: 'aguardando',
      statusPedido: 'iniciado',
      modelos: ['Laço Padrão'],
      tamanho: 'M',
      cores: 'Rosa'
    },
    {
      id: '3',
      orderNumber: 'PL-2025-003',
      nome: 'Janete Santana',
      telefone: '+55 (11) 92143-9232',
      data: '02 Apr 2025',
      itens: [
        { sku: 'LX-FST-03', nome: 'Laço Festa', qtd: 3, preco: 23.0 }
      ],
      endereco: 'R. das Acácias, 45 - Moema, SP',
      valor: 69.0,
      forma: 'Crédito',
      statusPagamento: 'aguardando',
      statusPedido: 'concluido',
      modelos: ['Laço Padrão'],
      tamanho: 'M',
      cores: 'Azul'
    },
    {
      id: '4',
      orderNumber: 'PL-2025-004',
      nome: 'Julia Antunes',
      telefone: '+55 (11) 99332-0923',
      data: '20 Apr 2025',
      itens: [
        { sku: 'LX-ARN-04', nome: 'Laço Aramado', qtd: 1, preco: 20.0 }
      ],
      endereco: 'Rua Bela, 78 - Centro, RJ',
      valor: 20.0,
      forma: 'Crédito',
      statusPagamento: 'aguardando',
      statusPedido: 'concluido',
      modelos: ['Laço Padrão'],
      tamanho: 'M',
      cores: 'Azul'
    },
    {
      id: '5',
      orderNumber: 'PL-2025-005',
      nome: 'Maria Eduarda',
      telefone: '+55 (11) 98283-2398',
      data: '29 Apr 2025',
      itens: [
        { sku: 'LX-ESC-05', nome: 'Laço Escolar Pompom', qtd: 5, preco: 3.99 }
      ],
      endereco: 'Av. Brasil, 1000 - Centro, SP',
      valor: 19.95,
      forma: 'Crédito',
      statusPagamento: 'aguardando',
      statusPedido: 'concluido',
      modelos: ['Laço Padrão'],
      tamanho: 'M',
      cores: 'Azul'
    },
    {
      id: '6',
      orderNumber: 'PL-2025-006',
      nome: 'Paola Santos',
      telefone: '+55 (11) 93483-2093',
      data: '01 May 2025',
      itens: [
        { sku: 'LX-PRN-06', nome: 'Laço Princesa', qtd: 2, preco: 14.5 }
      ],
      endereco: 'R. das Orquídeas, 9 - Jardim América, SP',
      valor: 29.0,
      forma: 'Crédito',
      statusPagamento: 'aguardando',
      statusPedido: 'concluido',
      modelos: ['Laço Padrão'],
      tamanho: 'M',
      cores: 'Azul'
    }
  ];

  const openDetails = (pedido) => {
    const content = (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Detalhes do Pedido — {pedido.orderNumber}</h5>
          <small>{pedido.data} • {pedido.forma}</small>
        </div>

        <div className="detalhe-item"><strong>Cliente:</strong> {pedido.nome} — {pedido.telefone}</div>
        <div className="detalhe-item"><strong>Endereço:</strong> {pedido.endereco}</div>

        <div style={{ marginTop: 12 }}>
          <strong>Itens</strong>
          <ul>
            {pedido.itens.map((it, idx) => (
              <li key={idx}>{it.qtd}× {it.nome} • R$ {it.preco.toFixed(2).replace('.', ',')}</li>
            ))}
          </ul>
        </div>

        <div className="detalhe-item"><strong>Total:</strong> R$ {pedido.valor.toFixed(2).replace('.', ',')}</div>
        <div className="detalhe-item"><strong>Status pagamento:</strong> {pedido.statusPagamento}</div>
        <div className="detalhe-item"><strong>Status pedido:</strong> {pedido.statusPedido}</div>
      </div>
    );

    setModalState({ isOpen: true, type: 'view', viewContent: content });
  };

  const closeModal = () => setModalState({ isOpen: false, type: null, viewContent: null });

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const searchFilters = {
        searchTerm: searchTerm || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        statusPagamento: filters.statusPagamento || undefined,
        statusPedido: filters.statusPedido || undefined
      };
      const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const url = params.toString() ? `${BASE}/pedidos/search?${params.toString()}` : `${BASE}/pedidos`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : (data?.content || []));
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Erro ao carregar pedidos. Usando dados locais.');
      // Fallback to mock data
      setOrders(pedidosMock);
    } finally {
      setLoading(false);
    }
  };

  // Load orders on component mount and when filters change
  useEffect(() => {
    fetchOrders();
  }, [searchTerm, filters]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Format order data for display
  const formatOrderData = (order) => {
    return {
      ...order,
      orderNumber: order.numeroPedido || `PL-${new Date(order.dataPedido).getFullYear()}-${String(order.id).padStart(3, '0')}`,
      data: new Date(order.dataPedido).toLocaleDateString('pt-BR'),
      valor: order.valorTotal || order.itens?.reduce((sum, item) => sum + (item.preco * item.quantidade), 0) || 0,
      forma: order.formaPagamento || 'Não especificado',
      statusPagamento: order.statusPagamento?.toLowerCase() || 'aguardando',
      statusPedido: order.statusPedido?.toLowerCase() || 'iniciado',
      modelos: order.itens?.map(item => item.nome) || [],
      nome: order.cliente?.nome || 'Cliente não especificado',
      telefone: order.cliente?.telefone || '',
      endereco: order.enderecoEntrega || 'Endereço não especificado'
    };
  };

  const filtered = orders.length > 0 ? orders.map(formatOrderData) : pedidosMock;

  return (
    <div className="pedidos-root">
      <Sidebar />

      <header>Pedidos</header>

      <div className="content">
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Buscar por nome ou modelo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar pedidos"
              />
              <i className="bi bi-search search-icon" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div className="row filter-group">
          <div className="col-md-3 mb-2 ">
            <label>Data Início</label>
            <input 
              type="date" 
              className="form-control" 
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          <div className="col-md-3 mb-2 ">
            <label>Data Fim</label>
            <input 
              type="date" 
              className="form-control" 
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
          <div className="col-md-3 mb-2 ">
            <label>Status Pagamento</label>
            <select 
              className="form-control"
              value={filters.statusPagamento}
              onChange={(e) => handleFilterChange('statusPagamento', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="aguardando">Aguardando</option>
              <option value="pago">Pago</option>
              <option value="atrasado">Atrasado</option>
            </select>
          </div>
          <div className="col-md-3 mb-2 ">
            <label>Status Pedido</label>
            <select 
              className="form-control"
              value={filters.statusPedido}
              onChange={(e) => handleFilterChange('statusPedido', e.target.value)}
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

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p>Carregando pedidos...</p>
          </div>
        )}

        {/* Error State */}
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

        {/* Orders Table */}
        {!loading && !error && (
          <div className="table-pedidos mt-3">
            <div className="table-header">
              <div>Cliente</div>
              <div>Telefone</div>
              <div>Data</div>
              <div>Valor</div>
              <div>Forma</div>
              <div>Pagamento</div>
              <div>Pedido</div>
              <div>Ações</div>
            </div>

            {filtered.length > 0 ? (
              filtered.map(p => (
                <div key={p.id} className="pedido-row" onClick={() => openDetails(p)}>
                  <div>{p.nome}</div>
                  <div>{p.telefone}</div>
                  <div>{p.data}</div>
                  <div>R$ {p.valor.toFixed(2).replace('.', ',')}</div>
                  <div>{p.forma}</div>
                  <div className={`status-badge status-pagamento ${p.statusPagamento}`}>{p.statusPagamento === 'aguardando' ? 'Aguardando' : p.statusPagamento === 'atrasado' ? 'Atrasado' : 'Concluído'}</div>
                  <div className={`status-badge status-pedido ${p.statusPedido}`}>{p.statusPedido === 'iniciado' ? 'Produção' : p.statusPedido === 'concluido' ? 'Concluído' : p.statusPedido}</div>
                  <div>
                    <button className="btn-sm btn-contato" title="WhatsApp"><i className="bi bi-whatsapp"></i></button>
                    <button className="btn-sm btn-contato" title="E-mail"><i className="bi bi-envelope"></i></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <i className="bi bi-inbox"></i>
                <p>Nenhum pedido encontrado com os filtros aplicados.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={modalState.isOpen} onClose={closeModal} type={modalState.type} viewContent={modalState.viewContent} />
    </div>
  );
};

export default Pedidos;
