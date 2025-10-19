import './Carrinho.css';
import Header from './Header.jsx';
import imgVermelho from '../assets/laco-pink.webp';
import imgBolinhas from '../assets/laco-bolinha.webp';

export default function Carrinho() {
  return (
    <>
      <Header />
      <main className="cart-page">
        <section className="container-carrinho">
          <div className="cart-left">
            <h1 className="title">Carrinho de compras</h1>

            <div className="cart-items">
              {/* Item 1 */}
              <article className="cart-item">
                <div className="item-image">
                  <img src={imgVermelho} alt="Laço vermelho" />
                </div>
                <div className="item-details">
                  <h3 className="item-name">Laço Vermelho</h3>
                  <p className="item-collection">COLEÇÃO TRADICIONAIS</p>
                  <p className="item-size">(Tam M | Bico de pato)</p>

                  <div className="item-bottom">
                    <div className="item-price">R$29,98</div>
                    <div className="item-controls">
                      <div className="quantity-control">
                        <button className="quantity-btn minus" type="button">-</button>
                        <span className="quantity">2</span>
                        <button className="quantity-btn plus" type="button">+</button>
                      </div>
                      <button className="remove-btn" type="button" title="Remover">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              {/* Item 2 */}
              <article className="cart-item">
                <div className="item-image">
                  <img src={imgBolinhas} alt="Laço de bolinhas" />
                </div>
                <div className="item-details">
                  <h3 className="item-name">Laço de bolinhas</h3>
                  <p className="item-collection">COLEÇÃO TRADICIONAIS</p>
                  <p className="item-size">(Tam M | Elástico)</p>

                  <div className="item-bottom">
                    <div className="item-price">R$14,99</div>
                    <div className="item-controls">
                      <div className="quantity-control">
                        <button className="quantity-btn minus" type="button">-</button>
                        <span className="quantity">1</span>
                        <button className="quantity-btn plus" type="button">+</button>
                      </div>
                      <button className="remove-btn" type="button" title="Remover">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/* Resumo */}
          <aside className="cart-summary">
            <div className="cart-summary-list">
              <div className="cart-summary-list-item">
                <span>Laço Vermelho</span>
                <span>R$29,98</span>
              </div>
              <div className="cart-summary-list-item">
                <span>Laço de bolinhas</span>
                <span>R$14,99</span>
              </div>
            </div>

            <hr />

            <div className="subtotal-row">
              <span>Subtotal (Sem frete)</span>
              <span className="subtotal-price">R$44,97</span>
            </div>

            <div className="action-buttons">
              <button className="btn-continue" type="button">Continuar comprando</button>
              <button className="btn-finalize" type="button">Finalizar pedido</button>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}