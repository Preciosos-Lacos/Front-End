import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BannerHome.css';
import banner from '../assets/banner_personagens.gif';

const BannerHome = () => {
  return (
    <section className="home-banner">
      <div className="home-banner__container">
        <Link to="/catalogo" className="home-banner__link" aria-label="Ver catálogo">
          <img src={banner} alt="Banner destaque" className="home-banner__image" />
        </Link>
      </div>
    </section>
  );
};

export default BannerHome;
