import React from 'react';
import './Header.css';

const Header = ({ showOffcanvas = true }) => {
  return (
    <header className="app-header">
      <div className="app-navbar">
        <a href="#catalogo" className="app-brand">
          <img src="/src/assets/logo_preciosos_lacos.png" alt="Preciosos Laços" />
        </a>
        <ul className="app-iconbar">
          <li>
            <a href="#perfil">
              <i className="bi bi-person-fill"></i>
            </a>
          </li>
          <li>
            <a href="#compras">
              <i className="bi bi-bag"></i>
            </a>
          </li>
          <li>
            <a href="#favorito">
              <i className="bi bi-heart"></i>
            </a>
          </li>
          <li>
            <a href="#carrinho">
              <i className="bi bi-cart"></i>
            </a>
          </li>
        </ul>
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
                <a href="#perfil">
                  <i className="bi bi-person-fill"></i> Perfil
                </a>
              </li>
              <li>
                <a href="#compras">
                  <i className="bi bi-bag"></i> Minhas Compras
                </a>
              </li>
              <li>
                <a href="#favorito">
                  <i className="bi bi-heart"></i> Favoritos
                </a>
              </li>
              <li>
                <a href="#carrinho">
                  <i className="bi bi-cart"></i> Carrinho
                </a>
              </li>
            </ul>
            <hr />
            <ul className="list-unstyled">
              <li>
                <a href="#home">
                  <i className="bi bi-house-door"></i> Home
                </a>
              </li>
              <li>
                <a href="#catalogo">
                  <i className="bi bi-grid"></i> Catálogo
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;