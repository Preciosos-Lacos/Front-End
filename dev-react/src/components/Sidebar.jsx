import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import logo from '../assets/logo_preciosos_lacos.png';

const Sidebar = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth <= 992) {
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('toggleSidebar');
        
        if (isActive && !sidebar?.contains(e.target) && e.target !== toggleBtn) {
          setIsActive(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isActive]);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsActive(!isActive);
  };

  const handleItemClick = () => {
    if (window.innerWidth <= 992) {
      setIsActive(false);
    }
  };

  const location = useLocation();

  const isActivePath = (path) => {
    try {
      const current = location.pathname || '/';
      // consider exact match or startsWith for nested routes
      return current === path || current.startsWith(path + '/') ;
    } catch (e) {
      return false;
    }
  };

  return (
    <>
      <button 
        className="toggle-btn" 
        id="toggleSidebar" 
        onClick={handleToggle}
      >
        <i className="bi bi-list"></i>
      </button>

      <div 
        className={`sidebar ${isActive ? 'active' : ''}`} 
        id="sidebar"
      >
        <img src={logo} alt="Logo" />
        <ul>
          <li onClick={handleItemClick} className={isActivePath('/admin/pedidos') ? 'active' : ''}>
            <Link to="/admin/pedidos">
              <i className="bi bi-box"></i>
              <span>Pedidos</span>
            </Link>
          </li>
          <li onClick={handleItemClick} className={isActivePath('/admin/dashboard') ? 'active' : ''}>
            <Link to="/admin/dashboard">
              <i className="bi bi-bar-chart"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li onClick={handleItemClick} className={isActivePath('/admin/cadastro-modelo') ? 'active' : ''}>
            <Link to="/admin/cadastro-modelo">
              <i className="bi bi-tag"></i>
              <span>Modelos</span>
            </Link>
          </li>
          <li onClick={handleItemClick} className={isActivePath('/admin/cadastro-cor') ? 'active' : ''}>
            <Link to="/admin/cadastro-cor">
              <i className="bi bi-palette"></i>
              <span>Cores</span>
            </Link>
          </li>
          <li onClick={handleItemClick} className={isActivePath('/admin/cadastro-tipo-lacos') ? 'active' : ''}>
            <Link to="/admin/cadastro-tipo-lacos">
              <i className="bi bi-scissors"></i>
              <span>Tipos de Laço</span>
            </Link>
          </li>
          <li onClick={handleItemClick} className={isActivePath('/admin/colecoes') ? 'active' : ''}>
            <Link to="/admin/colecoes"> <i className="bi bi-archive"></i>
              <span>Coleções</span>
            </Link>
          </li>
          <li onClick={handleItemClick} className={isActivePath('/admin/banner') ? 'active' : ''}>
            <Link to="/admin/banner">
              <i className="bi bi-image"></i>
              <span>Banner Home</span>
            </Link>
          </li>
        </ul>
        <ul>
          <li onClick={handleItemClick} className={isActivePath('/') ? 'active' : ''}>
            <Link to="/">
              <i className="bi bi-box-arrow-right"></i>
              <span>Sair</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;