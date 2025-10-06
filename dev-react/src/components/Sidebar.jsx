import React, { useState, useEffect } from 'react';
import './Sidebar.css';
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
          <li onClick={handleItemClick}>
            <a href="#">
              <i className="bi bi-box"></i> 
              <span>Pedidos</span>
            </a>
          </li>
          <li onClick={handleItemClick}>
            <a href="./dashboard.html">
              <i className="bi bi-bar-chart"></i> 
              <span>Dashboard</span>
            </a>
          </li>
          <li onClick={handleItemClick}>
            <a href="./cadastro_modelo.html">
              <i className="bi bi-tag"></i> 
              <span>Modelos</span>
            </a>
          </li>
          <li onClick={handleItemClick}>
            <a href="./cadastro_cor.html">
              <i className="bi bi-palette"></i> 
              <span>Cores</span>
            </a>
          </li>
          <li onClick={handleItemClick}>
            <a href="#">
              <i className="bi bi-archive"></i> 
              <span>Coleções</span>
            </a>
          </li>
          <li onClick={handleItemClick}>
            <a href="./cadastro_tipo_laco.html">
              <i className="bi bi-scissors"></i> 
              <span>Tipos de Laço</span>
            </a>
          </li>
        </ul>
        <ul>
          <li onClick={handleItemClick}>
            <a href="./catalogo.html">
              <i className="bi bi-box-arrow-right"></i> 
              <span>Sair</span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;