import React from 'react';
import '../styles/CardCor.css';

const CardCor = ({ color, onEdit, onDelete, onActivate, isActivating = false }) => {
  const { id, nome, cor, modelos = [], valor, ativo } = color;
  const realId = typeof id === 'number' || (!isNaN(Number(id)) && String(Number(id)) === String(id)) ? Number(id) : null;
  const isActive = Number(ativo) === 1;
  const isInactive = Number(ativo) === 0;
  const cardBg = isInactive ? '#e0e0e0' : '#F29DC3';
  const colorBoxBg = cor || '#fff';
  const valorFormatado = typeof valor === 'string' && valor.startsWith('R$') ? valor : `R$ ${valor}`;
  const displayModelos = Array.isArray(modelos)
    ? modelos.map((m) => {
        if (typeof m === 'string') return m;
        if (typeof m === 'object' && m !== null) {
          return m.nomeModelo || m.nome || m.descricao || m.label || m.titulo || m.modeloNome || m.nomeCor || '';
        }
        return '';
      }).filter((v) => typeof v === 'string' && v.trim().length > 0)
    : [];

  return (
    <div className="card-custom" style={{ opacity: isInactive ? 0.6 : 1 }}>
      <h5>{nome || '—'}</h5>
      <div className="color-box" style={{ background: colorBoxBg }}></div>
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
      <div className="card-footer">
        <p className="valor">Valor: {valorFormatado}</p>
        <div className="icons">
          {isActive && (
            <>
              <i
                className="bi bi-pencil"
                onClick={() => onEdit(realId)}
                title="Editar"
              ></i>
              <i
                className="bi bi-trash"
                onClick={() => onDelete(realId, nome)}
                title="Excluir"
              ></i>
            </>
          )}
          {isInactive && (
            <button
              className="btn-activate"
              onClick={() => onActivate(realId)}
              disabled={isActivating}
              style={isActivating ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
            >
              {isActivating ? 'Disponibilizando...' : 'Disponibilizar'}
            </button>
          )}
        </div>
      </div>
      {isInactive && (
        <div style={{ textAlign: 'center', color: '#a04c6e', fontWeight: 600, marginTop: 8 }}>
          Indisponível
        </div>
      )}
    </div>
  );
};

export default CardCor;