import React from 'react';
import Header from './Header.jsx';
import './PedidoConfirmado.css';

const PedidoConfirmado = ({ onNavigate }) => {
  return (
    <div className="pedido-confirmado-page">
      <Header showOffcanvas={true} />

      <main>
        <section className="pedido-section">
          <h1>Pedido confirmado</h1>

          <div className="card-sucesso col-12 col-md-8">
            <h5>Seu pedido foi realizado com sucesso</h5>
            <p className="mb-3">Um responsável irá entrar em contato para comunicar sobre os próximos passos.</p>
            <div className="sucesso">
              <i className="bi bi-check-circle-fill me-2"></i> Pedido confirmado
            </div>
          </div>

          <div className="informacoes mt-3">
            <h5>Informações do pedido</h5>
            <p>ID: <strong>003202</strong></p>
            <p>Total: <strong>R$144,97</strong></p>
            <p>Forma de Pagamento: <strong>Pix</strong></p>
            <p>Forma de Envio: <strong>Vendedor</strong></p>
            <p>CEP de Entrega: <strong>44019-830</strong></p>
            <small>*Os produtos têm prazo de 5 a 7 dias úteis para serem enviados.</small>
          </div>
          
          <button id="home" onClick={() => onNavigate && onNavigate('catalogo')}>
            Voltar para o catálogo
          </button>
        </section>
      </main>
    </div>
  );
};

export default PedidoConfirmado;