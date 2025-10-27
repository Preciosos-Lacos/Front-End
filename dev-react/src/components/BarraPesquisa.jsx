import React from 'react';
import '../styles/BarraPesquisa.css';

const BarraPesquisa = ({ searchTerm, onSearchChange, onAddClick, addLabel = 'Cadastrar' }) => {
  return (
    <div className="nav-pesquisa">
      <div className="nav-search-wrapper">
        <input 
          type="text" 
          className="nav-search-box" 
          placeholder="Pesquisar" 
          aria-label="Pesquisar"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <i className="bi bi-search" id="lupa-search"></i>
      </div>
      <button className="btn-cadastrar-laco" onClick={onAddClick}>
        <i className="bi bi-patch-plus"></i>
        <span>{` ${addLabel}`}</span>
      </button>
    </div>
  );
};

export default BarraPesquisa;