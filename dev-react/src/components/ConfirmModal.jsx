import React from 'react';
import '../styles/Modal.css';

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="modal" style={{ zIndex: 1200 }}>
      <div style={{
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        minWidth: 320,
        maxWidth: 400,
        width: '100%',
        padding: '32px 28px 22px 28px',
        textAlign: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <button
          className="close"
          onClick={onCancel}
          aria-label="Fechar"
          style={{
            position: 'absolute',
            top: 10,
            right: 12,
            fontSize: 20,
            background: 'none',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2
          }}
        >
          &times;
        </button>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#222', margin: '0 0 28px 0', wordBreak: 'break-word' }}>{message}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, width: '100%' }}>
          <button className="admin-banner-btn admin-banner-btn--danger" onClick={onConfirm} style={{ minWidth: 110, fontWeight: 600, fontSize: 16 }}>
            Confirmar
          </button>
          <button className="admin-banner-btn admin-banner-btn--secondary" onClick={onCancel} style={{ minWidth: 110, fontWeight: 600, fontSize: 16 }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
