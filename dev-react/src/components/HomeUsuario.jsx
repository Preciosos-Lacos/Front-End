import React from 'react';
import HeaderHome from './HeaderHome.jsx';
import BannerHome from './BannerHome.jsx';
import CatalogoPreview from './CatalogoHome.jsx';
import QuemSouEu from './QuemSouEu.jsx';
import './HomeUsuario.css';

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
