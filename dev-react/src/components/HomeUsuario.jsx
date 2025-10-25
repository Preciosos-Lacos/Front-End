import React from 'react';
import HeaderHome from '../components/HeaderHome.jsx';
import BannerHome from '../components/BannerHome.jsx';
// import CatalogoPreview from '../components/pagesatalogoHome.jsx';
import QuemSouEu from '../components/QuemSouEu.jsx';
import '../styles/HomeUsuario.css';

const HomeUsuario = () => {
  return (
    <main className="home-usuario">
      <HeaderHome />
      <BannerHome />
      <CatalogoPreview />
      <QuemSouEu />
    </main>
  );
};

export default HomeUsuario;
