import './Favoritos.css';
import lacoBolinhas from '../assets/laco_bolinhas.png';
import lacoPink from '../assets/laco-pink.webp';
import lacoJeans from '../assets/laco-jeans.webp';
import Header from './Header';

export default function Favoritos() {
    return (
        <>
            <Header />
            <main className="fav-main"> 
                <section className="fav-container">
                    <h1 className="fav-title">Meus Favoritos</h1>

                    <div className="fav-grid">
                        <article className="fav-card">
                            <div className="fav-image">
                                <img src={lacoBolinhas} alt="Laço de bolinha" />
                            </div>
                            <div className="fav-info">
                                <h3 className="fav-name">Laço de bolinha</h3>
                                <p className="fav-collection">COLEÇÃO TRADICIONAIS</p>
                                <p className="fav-detail">(Tam M | Bico de pato)</p>
                                <div className="fav-bottom">
                                    <div className="fav-price">R$44,97</div>
                                    <div className="fav-actions">
                                        <button className="btn-add">Adicionar ao carrinho</button>
                                        <button className="btn-remove">Remover</button>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <article className="fav-card">
                            <div className="fav-image">
                                <img src={lacoPink} alt="Laço Pink" />
                            </div>
                            <div className="fav-info">
                                <h3 className="fav-name">Laço Pink</h3>
                                <p className="fav-collection">COLEÇÃO CETIM</p>
                                <p className="fav-detail">(Tam M | Bico de pato)</p>
                                <div className="fav-bottom">
                                    <div className="fav-price">R$39,90</div>
                                    <div className="fav-actions">
                                        <button className="btn-add">Adicionar ao carrinho</button>
                                        <button className="btn-remove">Remover</button>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <article className="fav-card">
                            <div className="fav-image">
                                <img src={lacoJeans} alt="Laço Jeans" />
                            </div>
                            <div className="fav-info">
                                <h3 className="fav-name">Laço Jeans</h3>
                                <p className="fav-collection">COLEÇÃO CASUAL</p>
                                <p className="fav-detail">(Tam M | Elástico)</p>
                                <div className="fav-bottom">
                                    <div className="fav-price">R$32,50</div>
                                    <div className="fav-actions">
                                        <button className="btn-add">Adicionar ao carrinho</button>
                                        <button className="btn-remove">Remover</button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>
            </main>
        </>
    );
}