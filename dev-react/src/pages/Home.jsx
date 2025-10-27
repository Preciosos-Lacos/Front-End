import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomeUsuario.css';
import '../styles/BannerHome.css';
import HeaderHome from '../components/HeaderHome';
import QuemSouEu from '../components/QuemSouEu';
import LacoAzul from '../assets/laco-azul.webp';
import LacosUnicornio from '../assets/laco-kit-unicornio.webp';
import LacoBarbie from '../assets/laco-barbie-detalhado.jpg';
import LacoPanda from '../assets/laco-panda.webp';
import banner from '../assets/banner_natal.png';

export default function Home() {
  return (
    <div>
      <HeaderHome />
      <main data-scroll-container>
        <section className="banner">
          <div className="banner-content">
            <Link to="/catalogo">
              <img src={banner} alt="Banner" />
            </Link>
          </div>
        </section>

        <section id="catalogo" className="catalogo container">
          <h2>Alguns de nossos produtos</h2>
          <div className="catalogo-container">
            <div className="card">
              <Link to="/catalogo">
                <img src={LacoAzul} alt="Laço Azul" />
                <div className="card-info">
                  <p>Laço Azul <br /><i>COLEÇÃO TRADICIONAIS</i></p>
                  <span className="price">R$34,90</span>
                  <span className="desconto">-15%</span>
                </div>
              </Link>
            </div>

            <div className="card">
              <Link to="/catalogo">
                <img src={LacosUnicornio} alt="Laço Unicornio" />
                <div className="card-info">
                  <p>Kit Laços unicornio <br /><i>COLEÇÃO UNICORNIO</i></p>
                  <span className="price">R$59,99</span>
                </div>
              </Link>
            </div>

            <div className="card">
              <Link to="/catalogo">
                <img src={LacoBarbie} alt="Laço Barbie" />
                <div className="card-info">
                  <p>Laço Barbie detalhado <br /><i>COLEÇÃO BARBIE</i></p>
                  <span className="price">R$44,90</span>
                </div>
              </Link>
            </div>

            <div className="card">
              <Link to="/catalogo">
                <img src={LacoPanda} alt="Laço Panda" />
                <div className="card-info">
                  <p>Laço Panda <br /><i>COLEÇÃO PANDA</i></p>
                  <span className="price">R$44,90</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section style={{ paddingTop: 24 }}>
          <QuemSouEu />
        </section>
      </main>
    </div>
  );
}
