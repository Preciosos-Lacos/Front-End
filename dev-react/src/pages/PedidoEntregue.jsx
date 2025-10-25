import React from 'react';
import Header from '../components/Header.jsx';
import '../styles/PedidoEntregue.css';

const PedidoEntregue = ({ onNavigate }) => {
  const comprarNovamente = () => {
    onNavigate && onNavigate('catalogo');
  };

  const precisoDeAjuda = () => {
    alert('Entre em contato pelo WhatsApp ou e-mail para suporte!');
  };

  return (
    <div className="pedido-entregue-page">
      <Header showOffcanvas={true} />

      <main>
        <div className="pedido-section container">
          <h2 className="titulo">Detalhe da Compra</h2>

          <div className="card pedido">
            <h4>Encomenda</h4>
            <p><strong>Quantidade:</strong> 1</p>
            <span className="status entregue">Entregue em 12 de Setembro</span>
            <p><strong>Endereço:</strong> Rua Cosenza 26, Utinga, Santo André - SP</p>
          </div>

          <div className="card resumo">
            <h4>Resumo da Compra</h4>
            <p><b>Produtos:</b></p>
            <ul>
              <li>Laço Bolinha - <span>R$ 14,99</span></li>
              <li>Laço Vermelho - <span>R$ 14,99</span></li>
              <li>Laço Azul - <span>R$ 14,99</span></li>
            </ul>
            <p><b>Subtotal:</b> R$ 44,97</p>
            <p><b>Frete:</b> R$ 15,00</p>
            <p className="total"><b>Total:</b> R$ 59,97</p>
            <p><b>Forma de pagamento:</b> Pix</p>
          </div>

          <div className="botoes">
            <button className="btn-primario" onClick={comprarNovamente}>
              Comprar novamente
            </button>
            <button className="btn-secundario" onClick={precisoDeAjuda}>
              Preciso de ajuda
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PedidoEntregue;