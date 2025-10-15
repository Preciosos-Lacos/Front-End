import React from 'react';
import './BannerHome.css';
import banner from '../assets/banner_personagens.gif';

const BannerHome = () => {
  return (
    <section className="home-banner">
      <div className="home-banner__container">
        <a href="#catalogo" className="home-banner__link" aria-label="Ver catálogo">
          <img src={banner} alt="Banner destaque" className="home-banner__image" />
        </a>
      </div>
    </section>
  );
};

export default BannerHome;
