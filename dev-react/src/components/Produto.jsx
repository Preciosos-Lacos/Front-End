import './Produto.css';
import Header from './Header.jsx';
import imgPrincipal from '../assets/laco_bolinhas.png';

export default function Produto() {
  return (
    <>
      <Header />
      <main className="produto-page">
        <section className="produto-container">
          {/* Imagem principal */}
          <div className="produto-imagem">
            <img src={imgPrincipal} alt="Laço com bolinhas" />
          </div>

          {/* Informações do produto */}
          <div className="produto-info">
            <h1 className="produto-titulo">Laço com bolinhas</h1>

            <div className="produto-top">
              <span className="produto-preco">R$44,97</span>
              <button className="btn-add-cart">Adicionar ao carrinho</button>
            </div>

            <div className="produto-bloco">
              <h3 className="produto-subtitulo">Acabamento</h3>
              <div className="acabamento-tags">
                <button className="tag">Meia de seda</button>
                <button className="tag">Tiara</button>
                <button className="tag">Bico de pato</button>
                <button className="tag">Xuxa</button>
              </div>
            </div>

            <div className="produto-bloco">
              <h3 className="produto-subtitulo">Cor</h3>
              <div className="cores">
                <span className="cor selecionada" style={{ background: '#39D353' }} />
                <span className="cor" style={{ background: '#FF5A5F' }} />
                <span className="cor" style={{ background: '#FFD400' }} />
                <span className="cor" style={{ background: '#00C2FF' }} />
                <span className="cor" style={{ background: '#FFFFFF' }} />
                <span className="cor" style={{ background: '#F29DC3' }} />
              </div>
            </div>

            <div className="produto-bloco">
              <h3 className="produto-subtitulo">Descrição</h3>
              <p className="produto-descricao">
                Feito com tecido de cetim ou algodão, este laço é macio e confortável, com
                detalhes como strass ou pérolas. Tem acabamento de costura reforçada e um laço
                central bem estruturado, ideal para ocasiões especiais ou uso diário.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}