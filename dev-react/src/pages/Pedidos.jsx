import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import '../styles/Pedidos.css';

const Pedidos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, type: null, viewContent: null });

  const pedidosMock = [
    { id: '1', nome: 'Paloma Souza', telefone: '11 94115-9057', data: '23 Mar 2025', valor: 'R$ 23,00', forma: 'Débito', statusPagamento: 'atrasado', statusPedido: 'concluido', modelos: ['Laço Gravatinha'], tamanho: 'M', cores: 'Vermelho' },
    { id: '2', nome: 'Rodrigo Simões', telefone: '11 94121-9217', data: '24 Mar 2025', valor: 'R$ 27,00', forma: 'Débito', statusPagamento: 'aguardando', statusPedido: 'iniciado', modelos: ['Laço Padrão'], tamanho: 'M', cores: 'Rosa' },
    { id: '3', nome: 'Cleber Santana', telefone: '11 92143-9232', data: '23 Mar 2025', valor: 'R$ 23,00', forma: 'Crédito', statusPagamento: 'aguardando', statusPedido: 'concluido', modelos: ['Laço Padrão'], tamanho: 'M', cores: 'Azul' }
  ];

  const openDetails = (pedido) => {
    const content = (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Detalhes do Pedido</h5>
        </div>
        <div className="detalhe-item">Nome dos Modelos: {pedido.modelos.join(', ')}</div>
        <div className="detalhe-item">Tamanhos: {pedido.tamanho}</div>
        <div className="detalhe-item">Cores: {pedido.cores}</div>
        <div className="detalhe-item">Tipos dos Laços: {pedido.tipo || '—'}</div>
        <div className="detalhe-item">Valor: {pedido.valor}</div>
      </div>
    );

    setModalState({ isOpen: true, type: 'view', viewContent: content });
  };

  const closeModal = () => setModalState({ isOpen: false, type: null, viewContent: null });

  const filtered = pedidosMock.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.modelos.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pedidos-root">
      <Sidebar />

      <header>Pedidos</header>

      <div className="content">
        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nome ou modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="row filter-group">
          <div className="col-md-3 mb-2 ">
            <label>Data Início</label>
            <input type="date" className="form-control" />
          </div>
          <div className="col-md-3 mb-2 ">
            <label>Data Fim</label>
            <input type="date" className="form-control" />
          </div>
          <div className="col-md-3 mb-2 ">
            <label>Status Pagamento</label>
            <select className="form-control">
              <option>Todos</option>
              <option>Aguardando</option>
              <option>Concluído</option>
              <option>Atrasado</option>
            </select>
          </div>
          <div className="col-md-3 mb-2 ">
            <label>Status Pedido</label>
            <select className="form-control">
              <option>Todos</option>
              <option>Pendente</option>
              <option>Produção</option>
              <option>Enviado</option>
              <option>Entregue</option>
              <option>Cancelado</option>
            </select>
          </div>
        </div>

        <div className="table-pedidos mt-3">
          {filtered.map(p => (
            <div key={p.id} className="pedido-row" onClick={() => openDetails(p)}>
              <div>{p.nome}</div>
              <div>{p.telefone}</div>
              <div>{p.data}</div>
              <div>{p.valor}</div>
              <div>{p.forma}</div>
              <div className={`status-badge status-pagamento ${p.statusPagamento}`}>{p.statusPagamento === 'aguardando' ? 'Aguardando' : p.statusPagamento === 'atrasado' ? 'Atrasado' : 'Concluído'}</div>
              <div className={`status-badge status-pedido ${p.statusPedido}`}>{p.statusPedido === 'iniciado' ? 'Produção' : p.statusPedido === 'concluido' ? 'Concluído' : p.statusPedido}</div>
              <div>
                <button className="btn-sm btn-contato" title="WhatsApp"><i className="bi bi-whatsapp"></i></button>
                <button className="btn-sm btn-contato" title="E-mail"><i className="bi bi-envelope"></i></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={modalState.isOpen} onClose={closeModal} type={modalState.type} viewContent={modalState.viewContent} />
    </div>
  );
};

export default Pedidos;
