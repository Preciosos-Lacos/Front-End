import React from 'react';
import './CardCor.css';

const CardCor = ({ color, onEdit, onDelete }) => {
  const { id, nome, cor, modelos = [], valor } = color;
  const formattedValue = Number(valor || 0).toFixed(2);

  return (
    <div className="card-custom">
      <h5>{nome}</h5>
      <div className="color-box" style={{ background: cor }}></div>
      <p><strong>Modelos Associados:</strong></p>
      <div className="list-associates">
        <ul>
          {modelos.map((modelo, index) => (
            <li key={index}>{modelo}</li>
          ))}
        </ul>
      </div>
      <p className="mt-2">Valor: R$ {formattedValue}</p>
      <div className="icons">
        <i 
          className="bi bi-pencil" 
          onClick={() => onEdit(id)}
        ></i>
        <i 
          className="bi bi-trash" 
          onClick={() => onDelete(id, nome)}
        ></i>
      </div>
    </div>
  );
};

export default CardCor;