import '../styles/Carrinho.css';
import Header from '../components/Header.jsx';
import imgNeon from '../assets/laco-neon-verde.webp';
import imgBolinha from '../assets/laco-bolinha.webp';
import { Link } from 'react-router-dom';

export default function Carrinho() {
  return (
    <>
      <Header />
  <main data-scroll-container className="cart-page">
        <section className="container-carrinho">
          <div className="cart-left">
            <h1 className="title">Carrinho de compras</h1>

            <div className="cart-items">
              {/* Item 1 */}
              <article className="cart-item">
                <div className="item-image">
                  <img src={imgBolinha} alt="Laço de bolinha" />
                </div>
                <div className="item-details">
                  <h3 className="item-name">Laço Bolinha</h3>
                  <p className="item-collection">COLEÇÃO TRADICIONAIS</p>
                  <p className="item-size">(Tam M | Bico de pato)</p>

                  <div className="item-bottom">
                    <div className="item-price">R$44,97</div>
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

              {/* Item 2 */}
              <article className="cart-item">
                <div className="item-image">
                  <img src={imgNeon} alt="Laço de bolinha" />
                </div>
                <div className="item-details">
                  <h3 className="item-name">Laço Preciosos Neon</h3>
                  <p className="item-collection">COLEÇÃO NEON</p>
                  <p className="item-size">(Tam M | Bico de pato)</p>

                  <div className="item-bottom">
                    <div className="item-price">R$16,70</div>
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
                <span>Laço Bolinha</span>
                <span>R$44,97</span>
              </div>
              <div className="cart-summary-list-item">
                <span>Laço Preciosos Neon</span>
                <span>R$16,70</span>
              </div>
            </div>

            <hr />

            <div className="subtotal-row">
              <span>Subtotal (Sem frete)</span>
              <span className="subtotal-price">R$61,67</span>
            </div>

            <div className="action-buttons">
              <Link to="/catalogo" className="btn-continue">Continuar comprando</Link>
              <Link to="/finalizar-compra" className="btn-finalize">Finalizar pedido</Link>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}