import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HeaderHome.css';

const HeaderHomeBootstrap = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  // Close menu when resizing above desktop breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 992 && open) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  return (
    <header className="navbar navbar-expand-lg" role="banner">
      <div className="container-fluid">
        <Link className="navbar-brand logo" to="/home" onClick={close} aria-label="Ir para o início">
          <img src="/src/assets/logo_preciosos_lacos.png" alt="Logo Preciosos Laços" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="menuNav"
          aria-expanded={open}
          aria-label="Abrir menu"
          onClick={toggle}
        >
          <span className="navbar-toggler-icon" aria-hidden="true"></span>
        </button>

        <nav className={`collapse navbar-collapse ${open ? 'show' : ''}`} id="menuNav" role="navigation" aria-label="Menu principal">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/catalogo" onClick={close}>Catálogo</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/cadastro-usuario" onClick={close}>Cadastro</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/login" onClick={close}>Login</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderHomeBootstrap;