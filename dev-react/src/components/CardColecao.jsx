import React from 'react';
import '../styles/CardColecao.css';

const CardColecao = ({ collection, onEdit, onDelete }) => {
  const { nome, imagem } = collection || {};

  return (
    <div className="card-colecao">
      <div className="card-title">{nome}</div>
      <div className="card-image">
        {imagem ? <img src={imagem} alt={nome} /> : <div className="placeholder">Sem imagem</div>}
      </div>

      <div className="card-actions">
        <i className="bi bi-pencil" onClick={onEdit} title="Editar" />
        <i className="bi bi-trash" onClick={onDelete} title="Excluir" />
      </div>
    </div>
  );
};

export default CardColecao;
