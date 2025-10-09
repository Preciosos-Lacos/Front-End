import React, { useState } from 'react';
import Header from './Header';
import './Compra.css';

const sampleItems = [
  { id: 1, name: 'Laço Bolinha - COLEÇÃO TRADICIONAIS (Tam M, Bico de pato)', qty: 1, price: 14.99 },
  { id: 2, name: 'Laço vermelho - COLEÇÃO TRADICIONAIS (Tam M, Bico de pato)', qty: 1, price: 14.99 },
  { id: 3, name: 'Laço vermelho - COLEÇÃO TRADICIONAIS (Tam M, Bico de pato)', qty: 1, price: 14.99 },
];

function formatCurrency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const Compra = () => {
  const [payment, setPayment] = useState('PIX');

  const subtotal = sampleItems.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = 15.0;
  const total = subtotal + shipping;

  return (
    <div className="compra-page">
      <Header />

      <main className="finalizar-compra">
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
                <button className="editar-endereco">Editar</button>
              </div>
              <div className="info-endereco">
                Rentlum: Lemo<br />
                Rza Frez|52-6330<br />
                Nova Esperançho: Cha-a<br />
                Fra -Santana, Banásia
              </div>
            </div>

            <div className="pagamento">
              <div className="titulo-pagamento">Formato de pagamento</div>
              <div className="botoes-pagamento">
                {['PIX', 'Cartão de crédito', 'Boleto bancário'].map((p) => (
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

            <button className="btn-finalizar" onClick={() => alert('Finalizar compra: ' + payment)}>
              Finalizar compra
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Compra;
