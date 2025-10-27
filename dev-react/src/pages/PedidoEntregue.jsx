import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import Modal from '../components/Modal';
import '../styles/PedidoEntregue.css';
import { Link, useNavigate } from 'react-router-dom';

const PedidoEntregue = () => {
  const navigate = useNavigate();

  const comprarNovamente = (e) => {
    // se chamado como handler, previne comportamento padrão
    if (e && e.preventDefault) e.preventDefault();
    navigate('/catalogo');
  };

  const [helpOpen, setHelpOpen] = useState(false);

  const precisoDeAjuda = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setHelpOpen(true);
  };

  return (
    <div className="pedido-entregue-page">
      <Header showOffcanvas={true} />

  <main data-scroll-container>
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
            <Link to="/carrinho" className="btn-primario" onClick={comprarNovamente}>
              Comprar novamente
            </Link>
            <Link to="#" className="btn-secundario" onClick={precisoDeAjuda}>
              Preciso de ajuda
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
                  <button onClick={() => setHelpOpen(false)} style={{ padding: '8px 12px', borderRadius: 6 }}>Fechar</button>
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