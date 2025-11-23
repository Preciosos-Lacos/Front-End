import React from 'react';
import './StatusDropdown.css';

// Exemplo de opções para status de pagamento
// [{ value: 'Pendente', label: 'Pendente', icon: 'fa-hourglass-half', color: '#D7263D' }, ...]
export default function StatusDropdown({ options, value, onChange, disabled }) {
  return (
    <div className="status-dropdown">
      <button
        className="status-dropdown-btn"
        style={{ background: options.find(o => o.value === value)?.color || '#eee', color: '#fff' }}
        disabled={disabled}
      >
        <i className={`fa ${options.find(o => o.value === value)?.icon || ''}`} style={{ marginRight: 8 }}></i>
        {options.find(o => o.value === value)?.label || value}
        <span className="fa fa-caret-down" style={{ marginLeft: 8 }}></span>
      </button>
      <div className="status-dropdown-list">
        {options.map(opt => (
          <div
            key={opt.value}
            className="status-dropdown-item"
            style={{ background: opt.color, color: '#fff' }}
            onClick={() => !disabled && onChange(opt.value)}
          >
            <i className={`fa ${opt.icon}`} style={{ marginRight: 8 }}></i>
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
}
