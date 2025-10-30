import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Modal from '../components/Modal';
import '../styles/PedidoEntregue.css';
import { Link, useNavigate, useParams } from 'react-router-dom';

const PedidoEntregue = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const pedidoId = 2;

  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Usuário não autenticado');

        const response = await fetch(`http://localhost:8080/pedidos/resumo/${pedidoId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Erro ao buscar o pedido');
        const data = await response.json();
        setPedido(data);
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [pedidoId]);

  const comprarNovamente = (e) => {
    e.preventDefault();
    navigate('/carrinho');
  };

  const precisoDeAjuda = (e) => {
    e.preventDefault();
    setHelpOpen(true);
  };

  if (loading) {
    return (
      <div className="pedido-entregue-page">
        <Header showOffcanvas={true} />
        <main>
          <div className="pedido-section container">
            <h2 className="titulo">Carregando pedido...</h2>
          </div>
        </main>
      </div>
    );
  }

  if (erro || !pedido) {
    return (
      <div className="pedido-entregue-page">
        <Header showOffcanvas={true} />
        <main>
          <div className="pedido-section container">
            <h2 className="titulo">Erro: {erro || 'Pedido não encontrado'}</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pedido-entregue-page">
      <Header showOffcanvas={true} />

      <main>
        <div className="pedido-section container">
          <h2 className="titulo">Detalhe da Compra</h2>

          <div className="card pedido">
            <h4>Encomenda</h4>
            <p><strong>ID do Pedido:</strong> {pedido.id}</p>
            <span className="status entregue">Entregue com sucesso!</span>
          </div>

          <div className="card resumo">
            <h4>Resumo da Compra</h4>
            <p><b>Total:</b> {pedido.total}</p>
            <p><b>Forma de pagamento:</b> {pedido.formaPagamento}</p>
            <p><b>Forma de envio:</b> {pedido.formaEnvio}</p>
            <p><b>CEP de entrega:</b> {pedido.cepEntrega}</p>
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
                  <button
                    onClick={() => setHelpOpen(false)}
                    style={{ padding: '8px 12px', borderRadius: 6 }}
                  >
                    Fechar
                  </button>
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
