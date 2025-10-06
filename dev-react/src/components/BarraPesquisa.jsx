import React from 'react';
import './BarraPesquisa.css';

const BarraPesquisa = ({ searchTerm, onSearchChange, onAddClick }) => {
  return (
    <div className="nav-pesquisa">
      <div className="nav-search-wrapper">
        <input 
          type="text" 
          className="nav-search-box" 
          placeholder="Pesquisar Cor" 
          aria-label="Pesquisar Cor"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <i className="bi bi-search" id="lupa-search"></i>
      </div>
      <button className="btn-cadastrar" onClick={onAddClick}>
        <i className="bi bi-patch-plus"></i>
        <span> Cadastrar Cores</span>
      </button>
    </div>
  );
};

export default BarraPesquisa;