import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import '../styles/PedidoConfirmado.css';
import { useNavigate, useLocation } from 'react-router-dom';

const PedidoConfirmado = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!order) {
      setError('Nenhum pedido foi encontrado. Por favor, finalize uma compra para visualizar os detalhes do pedido.');
    }
  }, [order]);
  // Format order data for display
  const formatOrderData = (order) => {
    if (!order) return null;
    
    return {
      id: order.numeroPedido || order.id || 'N/A',
      valorTotal: order.total || order.valorTotal || 0,
      formaPagamento: order.formaPagamento || 'Não especificado',
      formaEnvio: order.formaEnvio || 'Não especificado',
      cepEntrega: order.cepEntrega || 'Não especificado',
      prazoEntrega: order.prazoEntrega || '5 a 7 dias úteis',
      dataPedido: order.dataPedido ? new Date(order.dataPedido).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')
    };
  };

  const displayOrder = order ? formatOrderData(order) : null;

  if (loading) {
    return (
      <div className="pedido-confirmado-page">
        <Header showOffcanvas={true} />
        <main data-scroll-container>
          <section className="pedido-section">
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p>Carregando informações do pedido...</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="pedido-confirmado-page">
      <Header showOffcanvas={true} />
      <main data-scroll-container>
        <section className="pedido-section">
          <h1>Pedido confirmado</h1>
          {error && (
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle"></i> {error}
            </div>
          )}
          {!error && displayOrder && (
            <>
              <div className="card-sucesso col-12 col-md-8">
                <h5>Seu pedido foi realizado com sucesso</h5>
                <p className="mb-3">Um responsável irá entrar em contato para comunicar sobre os próximos passos.</p>
                <div className="sucesso">
                  <i className="bi bi-check-circle-fill me-2"></i> Pedido confirmado
                </div>
              </div>
              <div className="informacoes mt-3">
                <h5>Informações do pedido</h5>
                <p>ID: <strong>{displayOrder.id}</strong></p>
                <p>Total: <strong>R$ {displayOrder.valorTotal.toFixed(2).replace('.', ',')}</strong></p>
                <p>Forma de Pagamento: <strong>{displayOrder.formaPagamento}</strong></p>
                <p>Forma de Envio: <strong>{displayOrder.formaEnvio}</strong></p>
                <p>CEP de Entrega: <strong>{displayOrder.cepEntrega}</strong></p>
                <p>Data do Pedido: <strong>{displayOrder.dataPedido}</strong></p>
                <small>*Os produtos têm prazo de {displayOrder.prazoEntrega} para serem enviados.</small>
              </div>
            </>
          )}
          <button className="home" onClick={() => navigate('/catalogo')}>Voltar para o Catálogo</button>
        </section>
      </main>
    </div>
  );
};

export default PedidoConfirmado;