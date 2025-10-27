import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
            <Link to="/pedidos">
              <i className="bi bi-box"></i>
              <span>Pedidos</span>
            </Link>
          </li>
          <li onClick={handleItemClick}>
            <Link to="/dashboard">
              <i className="bi bi-bar-chart"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li onClick={handleItemClick}>
            <Link to="/cadastro-modelo">
              <i className="bi bi-tag"></i>
              <span>Modelos</span>
            </Link>
          </li>
          <li onClick={handleItemClick}>
            <Link to="/cadastro-cor">
              <i className="bi bi-palette"></i>
              <span>Cores</span>
            </Link>
          </li>
          {/* <li onClick={handleItemClick}>
            <Link to="/colecoes">
              <i className="bi bi-archive"></i>
              <span>Coleções</span>
            </Link>
          </li> */}
          <li onClick={handleItemClick}>
            <Link to="/cadastro-tipo-lacos">
              <i className="bi bi-scissors"></i>
              <span>Tipos de Laço</span>
            </Link>
          </li>
        </ul>
        <ul>
          <li onClick={handleItemClick}>
            <Link to="/home">
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