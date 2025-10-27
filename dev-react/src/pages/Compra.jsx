import React, { useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import '../styles/Compra.css';
import { Link, useNavigate } from 'react-router-dom';

const sampleItems = [
  { id: 1, name: 'Laço Bolinha - COLEÇÃO TRADICIONAIS (Tam M, Bico de pato)', qty: 1, price: 44.97 },
  { id: 2, name: 'Laço Preciosos Neon - COLEÇÃO NEON (Tam M | Bico de pato)', qty: 1, price: 16.70 },
  // { id: 3, name: 'Laço vermelho - COLEÇÃO TRADICIONAIS (Tam M, Bico de pato)', qty: 1, price: 14.99 },
];

function formatCurrency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const Compra = () => {
  const [payment, setPayment] = useState('PIX');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const subtotal = sampleItems.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = 15.0;
  const total = subtotal + shipping;

  return (
    <div className="compra-page">
      <Header />

  <main data-scroll-container className="finalizar-compra">
        <div className="hub">
          <div className="itens">
            <div className="cabecalho-lista">
              <div className="produto">Produto</div>
              <div className="quantidade">Quantidade</div>
              <div className="preco">Preço</div>
            </div>

            {sampleItems.map((item) => (
              <div key={item.id} className="item-produto">
                <div className="produto">{item.name}</div>
                <div className="quantidade">{item.qty}</div>
                <div className="preco">{formatCurrency(item.price)}</div>
              </div>
            ))}
          </div>

          <div className="coluna-lateral">
            <div className="endereco">
              <div className="cabecalho-endereco">
                <span>Endereço</span>
                <Link to="/cadastro-endereco" className="editar-endereco">Editar</Link>
              </div>
              <div className="info-endereco">
                Rua: Morubixaba, 2299 <br />
                Complemento: Torre 3 Apto 06 <br />
                Bairro: Cidade Líder <br />
                Cidade: São Paulo/SP <br />
                CEP: 08280-630
              </div>
            </div>

                    <div className="pagamento">
                      <div className="titulo-pagamento">Formato de pagamento</div>
                      <div className="botoes-pagamento">
                        {['PIX', 'Cartão de crédito', 'Cartão de débito'].map((p) => (
                          <button
                            key={p}
                            className={payment === p ? 'selected' : ''}
                            onClick={() => setPayment(p)}
                            type="button"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="resumo">
                      <div className="titulo-resumo">Resumo</div>
                      <div className="linha-resumo">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="linha-resumo">
                        <span>Custo de frete</span>
                        <span>{formatCurrency(shipping)}</span>
                      </div>
                      <div className="linha-total">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>

                    <button className="btn-finalizar" onClick={() => setConfirmOpen(true)}>
                      Finalizar Pedido
                    </button>
                    <Modal
                      isOpen={confirmOpen}
                      onClose={() => setConfirmOpen(false)}
                      type="view"
                      viewContent={(
                        <div style={{ padding: 20, minWidth: 320 }}>
                          <h2>Confirmar Pedido</h2>
                          <p>Forma de pagamento selecionada: <strong>{payment}</strong></p>
                          <div style={{ marginTop: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <span>Subtotal</span>
                              <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <span>Frete</span>
                              <span>{formatCurrency(shipping)}</span>
                            </div>
                            <hr />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                              <span>Total</span>
                              <span>{formatCurrency(total)}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'flex-end' }}>
                            <button onClick={() => { setConfirmOpen(false); }} style={{ padding: '8px 14px', borderRadius: 8 }}>Não</button>
                            <button onClick={() => { setConfirmOpen(false); navigate('/pedido-confirmado'); }} style={{ padding: '8px 14px', borderRadius: 8, background: '#4caf50', color: '#fff', border: 'none' }}>Confirmar</button>
                          </div>
                        </div>
                      )}
                    />
                  </div>
              </div>
            </main>
          </div>
          );
};

          export default Compra;
