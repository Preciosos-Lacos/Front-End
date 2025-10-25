import React from 'react';
import './CardCor.css';

const CardCor = ({ color, onEdit, onDelete }) => {
  const { id, nome, cor, modelos = [], valor } = color;
  const formattedValue = Number(valor || 0).toFixed(2);

  // Só considera id real do banco (número)
  const realId = typeof id === 'number' || (!isNaN(Number(id)) && String(Number(id)) === String(id)) ? Number(id) : null;

  const displayModelos = (Array.isArray(modelos) ? modelos : [])
    .map((m) => {
      if (typeof m === 'string') return m;
      if (!m || typeof m !== 'object') return null;
      if (m.modelo) {
        if (typeof m.modelo === 'string') return m.modelo;
        if (m.modelo && typeof m.modelo === 'object') {
          const nested = m.modelo.nome ?? m.modelo.descricao ?? Object.values(m.modelo).find(v => typeof v === 'string' && v.trim().length > 0) ?? null;
          if (nested) return nested;
        }
      }
      const direto = (
        m.nome ??
        m.nomeDoModelo ??
        m.descricao ??
        m.titulo ??
        m.label ??
        m.nomeCor ??
        m.modeloNome ??
        null
      );
      if (direto) return direto;
      const anyString = Object.values(m).find(v => typeof v === 'string' && v.trim().length > 0) ?? null;
      return anyString ?? m.id ?? null;
    })
    .filter((v) => typeof v === 'string' && v.trim().length > 0);

  return (
    <div className="card-custom">
      <h5>{nome}</h5>
      <div className="color-box" style={{ background: cor }}></div>
      <p><strong>Modelos Associados:</strong></p>
      <div className="list-associates">
        {displayModelos.length > 0 ? (
          <ul>
            {displayModelos.map((modelo, index) => (
              <li key={`${realId ?? nome ?? cor ?? 'modelo'}-${index}`}>{modelo}</li>
            ))}
          </ul>
        ) : (
          <span>—</span>
        )}
      </div>
      <p className="mt-2">Valor: R$ {formattedValue}</p>
      <div className="icons">
        <i 
          className="bi bi-pencil" 
          onClick={() => realId !== null && onEdit(realId)}
          style={{opacity: realId !== null ? 1 : 0.3, pointerEvents: realId !== null ? 'auto' : 'none'}}
        ></i>
        <i 
          className="bi bi-trash" 
          onClick={() => realId !== null && onDelete(realId, nome)}
          style={{opacity: realId !== null ? 1 : 0.3, pointerEvents: realId !== null ? 'auto' : 'none'}}
        ></i>
      </div>
    </div>
  );
};

export default CardCor;