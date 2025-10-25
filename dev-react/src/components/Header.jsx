import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ showOffcanvas = true }) => {
  return (
    <header className="app-header">
      <div className="app-navbar">
        <Link to="/catalogo" className="app-brand"> 
          <img src="/src/assets/logo_preciosos_lacos.png" alt="Preciosos Laços" />
        </Link>
        <ul className="app-iconbar">
          <li>
            <Link to="/perfil">
              <i className="bi bi-person-fill"></i>
            </Link>
          </li>
          <li>
            <Link to="/compras">
              <i className="bi bi-bag"></i>
            </Link>
          </li>
          <li>
            <Link to="/favorito">
              <i className="bi bi-heart"></i>
            </Link>
          </li>
          <li>
            <Link to="/carrinho">
              <i className="bi bi-cart"></i>
            </Link>
          </li>
        </ul>
        <div className="app-hamburguer-container">
          {showOffcanvas && (
            <button 
              className="app-hamburguer" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="/offcanvasMenu"
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
                <Link to="/compras">
                  <i className="bi bi-bag"></i> Minhas Compras
                </Link>
              </li>
              <li>
                <Link to="/favorito">
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
                <Link to="/home">
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