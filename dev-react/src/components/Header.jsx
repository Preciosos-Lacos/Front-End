// ...existing code...
import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import { useCart } from '../context/CartContext.jsx';

const Header = ({ showOffcanvas = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { count } = useCart();

  // Fecha o offcanvas e restaura o scroll ao trocar de rota
  useEffect(() => {
    // Remove classes e estilos do body que travam o scroll
    document.body.classList.remove('offcanvas-backdrop', 'modal-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.paddingRight = '';
    // Remove backdrop do Bootstrap
    document.querySelectorAll('.offcanvas-backdrop, .modal-backdrop').forEach(el => el.remove());
    // Fecha o offcanvas se estiver aberto
    const offcanvas = document.getElementById('offcanvasMenu');
    if (offcanvas && offcanvas.classList.contains('show')) {
      offcanvas.classList.remove('show');
      offcanvas.setAttribute('aria-hidden', 'true');
      offcanvas.style.visibility = 'hidden';
    }
  }, [location.pathname]);

  // const handleLogout = async () => {
  //   if (!window.confirm('Deseja sair da conta?')) return;

  //   try {
  //     const base = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  //     // notify backend if endpoint exists (optional)
  //     await fetch(`${base}/auth/logout`, {
  //       method: 'POST',
  //       credentials: 'include'
  //     }).catch(() => {});
  //   } catch (err) {
  //     console.warn('Logout backend falhou (ignorando):', err);
  //   }

  //   try {
  //     sessionStorage.clear();
  //     localStorage.removeItem('token');
  //     localStorage.removeItem('user');
  //   } catch (e) {
  //     console.warn('Erro ao limpar storage:', e);
  //   }

  //   navigate('/');
  // };

  return (
    <header className="app-header">
      <div className="app-navbar">
        <Link to="/" className="app-brand">
          <img src="/src/assets/logo_preciosos_lacos.png" alt="Preciosos Laços" />
        </Link>

        {/* Desktop header: text labels (visible on desktop) */}
        <nav className="header-desktop">
          <ul className="desktop-nav">
            <li>
              <Link to="/catalogo" className={location.pathname === '/catalogo' ? 'nav-active' : ''}>Catálogo</Link>
            </li>
            <li>
              <Link to="/perfil" className={location.pathname === '/perfil' ? 'nav-active' : ''}>Perfil</Link>
            </li>
            <li>
              <Link to="/minhas-compras" className={location.pathname === '/minhas-compras' ? 'nav-active' : ''}>Compras</Link>
            </li>
            <li>
              <Link to="/favoritos" className={location.pathname === '/favoritos' ? 'nav-active' : ''}>Favoritos</Link>
            </li>
            <li>
              <Link to="/carrinho" className={location.pathname === '/carrinho' ? 'nav-active cart-link' : 'cart-link'}>
                Carrinho
                {count > 0 && (
                  <span className="cart-badge" aria-label={`${count} item(ns) no carrinho`}>
                    {count}
                  </span>
                )}
              </Link>
            </li>
            {/* <li>
              <button type="button" className="link-button" onClick={handleLogout} aria-label="Sair">
                Sair
              </button>
            </li> */}
          </ul>
        </nav>

        {/* Mobile/Tablet header: icons (visible on small screens) */}
        <nav className="header-mobile">
          <ul className="mobile-iconbar">
            <li><Link to="/catalogo"><i className="bi bi-grid"></i></Link></li>
            <li><Link to="/perfil"><i className="bi bi-person-fill"></i></Link></li>
            <li><Link to="/minhas-compras"><i className="bi bi-bag"></i></Link></li>
            <li><Link to="/favoritos"><i className="bi bi-heart"></i></Link></li>
            <li style={{position:'relative'}}>
              <Link to="/carrinho" style={{position:'relative', display:'inline-block'}}>
                <i className="bi bi-cart"></i>
                {count > 0 && (
                  <span className="cart-badge mobile" aria-label={`${count} item(ns) no carrinho`}>
                    {count}
                  </span>
                )}
              </Link>
            </li>
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

              {/* Cadastro Endereço removido do menu */}
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
              {/* <li>
                <button type="button" className="btn-logout-offcanvas" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Sair
                </button>
              </li> */}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
