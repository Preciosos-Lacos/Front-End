import React from 'react';
import '../styles/Modal.css';

const AlertModal = ({ isOpen, type = 'info', message, onClose }) => {
  if (!isOpen) return null;

  let icon, color;
  switch (type) {
    case 'success':
      icon = <i className="bi bi-check-circle-fill" style={{ color: '#28a745', fontSize: 32 }}></i>;
      color = '#28a745';
      break;
    case 'error':
      icon = <i className="bi bi-x-circle-fill" style={{ color: '#dc3545', fontSize: 32 }}></i>;
      color = '#dc3545';
      break;
    case 'warning':
      icon = <i className="bi bi-exclamation-triangle-fill" style={{ color: '#ffc107', fontSize: 32 }}></i>;
      color = '#ffc107';
      break;
    default:
      icon = <i className="bi bi-info-circle-fill" style={{ color: '#17a2b8', fontSize: 32 }}></i>;
      color = '#17a2b8';
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 400, textAlign: 'center', borderTop: `4px solid ${color}` }}>
        <span className="close" onClick={onClose}>&times;</span>
        <div style={{ margin: '1rem 0' }}>{icon}</div>
        <div style={{ fontSize: 18, marginBottom: 16 }}>{message}</div>
        <button className="admin-banner-btn admin-banner-btn--secondary" onClick={onClose} style={{ minWidth: 100 }}>
          OK
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
