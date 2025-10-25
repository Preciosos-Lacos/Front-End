import React, { useState } from 'react';
import Header from '../components/Header';
import '../styles/MinhasCompras.css';

const comprasMock = [
  {
    id: 1,
    data: '21 de Abril',
    status: 'Em confecção',
    statusClass: 'status-em-confeccao',
    entrega: 'Chegará no dia 9 de Maio',
    produto: 'Laço bolinha - COLEÇÃO TRADICIONAIS (Tam M, Bico de pato)',
    imagem: '/src/assets/laco_bolinha.jpg',
  },
  {
    id: 2,
    data: '17 de Março',
    status: 'Entregue',
    statusClass: 'status-entregue',
    entrega: 'Chegou no dia 4 de Abril',
    produto: 'Laço vermelho - COLEÇÃO TRADICIONAIS (Tam M, Bico de pato)',
    imagem: '/src/assets/laco_vermelho.jpg',
  },
];

export default function MinhasCompras() {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todas');

  const comprasFiltradas = comprasMock.filter(compra => {
    const matchBusca = compra.produto.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = filtro === 'Todas' || compra.status === filtro;
    return matchBusca && matchFiltro;
  });

  return (
    <div>
      <Header />
      <section className="minhas-compras-section container">
        <h2 className="titulo-minhas-compras">Minhas compras</h2>
        <div className="minhas-compras-barra d-flex align-items-center justify-content-between mb-4">
          <div className="busca-filtros d-flex align-items-center gap-3">
            <div className="input-group busca-compras">
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar"
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
            <div className="filtro-compras d-flex align-items-center gap-2">
              <i className="bi bi-filter"></i>
              <select
                className="form-select"
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
              >
                <option>Todas</option>
                <option>Em confecção</option>
                <option>Entregue</option>
              </select>
            </div>
          </div>
          <div className="info-compras">
            <span>{comprasFiltradas.length} compras</span>
          </div>
        </div>
        <div className="compras-lista">
          {comprasFiltradas.map(compra => (
            <div key={compra.id} className="compra-card d-flex align-items-center mb-4 p-3">
              <div className="compra-img me-3">
                <img src={compra.imagem} alt={compra.produto} className="img-fluid rounded" style={{ width: 90, height: 90, objectFit: 'cover' }} />
              </div>
              <div className="compra-info flex-grow-1">
                <div className="compra-data-status d-flex align-items-center justify-content-between mb-1">
                  <span className="compra-data">{compra.data}</span>
                  <span className={`compra-status ${compra.statusClass}`}>{compra.status}</span>
                </div>
                <div className="compra-entrega fw-semibold mb-1">{compra.entrega}</div>
                <div className="compra-produto mb-1">{compra.produto}</div>
                <div className="compra-botoes d-flex gap-2 mt-2">
                  <button className="btn btn-outline-secondary btn-sm">Ver compra</button>
                  <button className="btn btn-outline-primary btn-sm">Comprar novamente</button>
                </div>
              </div>
            </div>
          ))}
          {comprasFiltradas.length === 0 && (
            <div className="text-center text-muted">Nenhuma compra encontrada.</div>
          )}
        </div>
      </section>
    </div>
  );
}
