import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ showOffcanvas = true }) => {
  return (
    <header className="app-header">
      <div className="app-navbar">
        <Link to="/" className="app-brand"> 
          <img src="/src/assets/logo_preciosos_lacos.png" alt="Preciosos Laços" />
        </Link>

        {/* Desktop header: text labels (visible on desktop) */}
        <nav className="header-desktop">
          <ul className="desktop-nav">
            <li><Link to="/catalogo">Catálogo</Link></li>
            <li><Link to="/perfil">Perfil</Link></li>
            <li><Link to="/minhas-compras">Compras</Link></li>
            <li><Link to="/favoritos">Favoritos</Link></li>
            <li><Link to="/carrinho">Carrinho</Link></li>
          </ul>
        </nav>

        {/* Mobile/Tablet header: icons (visible on small screens) */}
        <nav className="header-mobile">
          <ul className="mobile-iconbar">
            <li><Link to="/catalogo"><i className="bi bi-grid"></i></Link></li>
            <li><Link to="/perfil"><i className="bi bi-person-fill"></i></Link></li>
            <li><Link to="/minhas-compras"><i className="bi bi-bag"></i></Link></li>
            <li><Link to="/favoritos"><i className="bi bi-heart"></i></Link></li>
            <li><Link to="/carrinho"><i className="bi bi-cart"></i></Link></li>
          </ul>
        </nav>

        <div className="app-hamburguer-container">
          {showOffcanvas && (
            <button 
              className="app-hamburguer" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#offcanvasMenu"
            >
              <i className="bi bi-list"></i>
            </button>
          )}
        </div>
      </div>

      {showOffcanvas && (
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasMenu">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Menu</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
          </div>
          <div className="offcanvas-body">
            <ul className="list-unstyled mb-4">
              <li>
                <Link to="/perfil">
                  <i className="bi bi-person-fill"></i> Perfil
                </Link>
              </li>
              <li>
                <Link to="/minhas-compras">
                  <i className="bi bi-bag"></i> Minhas Compras
                </Link>
              </li>
              <li>
                <Link to="/favoritos">
                  <i className="bi bi-heart"></i> Favoritos
                </Link>
              </li>
              <li>
                <Link to="/carrinho">
                  <i className="bi bi-cart"></i> Carrinho
                </Link>
              </li>
            </ul>
            <hr />
            <ul className="list-unstyled">
              <li>
                <Link to="/">
                  <i className="bi bi-house-door"></i> Home
                </Link>
              </li>
              <li>
                <Link to="/catalogo">
                  <i className="bi bi-grid"></i> Catálogo
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;