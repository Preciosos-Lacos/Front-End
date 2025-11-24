import React from 'react';
import '../styles/Modal.css';

const ModalAlert = ({ isOpen, onClose, title, message, confirmText = 'OK', onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="modal" style={{zIndex: 9999}}>
      <div className="modal-content" style={{maxWidth: 340, textAlign: 'center'}}>
        <span className="close" onClick={onClose}>&times;</span>
        {title && <h2 className="tituloPopUp" style={{marginBottom: 12}}>{title}</h2>}
        <div style={{marginBottom: 18, fontSize: '1.08rem'}}>{message}</div>
        <button className="btn btn-primary" style={{marginRight: 8}} onClick={onConfirm || onClose}>{confirmText}</button>
      </div>
    </div>
  );
};

export default ModalAlert;
