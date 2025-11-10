import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

const ModalModelo = ({ isOpen, onClose, type, modeloData = null, onSubmit }) => {
  // Mantém suporte a upload base64 (campo imagemBase64) e inclui campos principais do modelo
  const [form, setForm] = useState({ nome: '', descricao: '', valor: '', imagem: '', imagemBase64: '' });

  useEffect(() => {
    if (type === 'edit' && modeloData) {
      setForm({ nome: modeloData.nome || '', descricao: modeloData.descricao || '', valor: modeloData.valor || '', imagem: modeloData.imagem || '', imagemBase64: '' });
    } else if (type === 'create') {
      setForm({ nome: '', descricao: '', valor: '', imagem: '', imagemBase64: '' });
    }
  }, [isOpen, type, modeloData]);

  const handleSubmit = () => {
    if (type === 'delete') { onSubmit(); return; }
    if (!form.nome) return alert('Preencha o nome do modelo');
    if (!form.valor) return alert('Preencha o valor do modelo');
    onSubmit(form);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setForm(prev => ({ ...prev, imagem: '', imagemBase64: '' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result; // data URL
      if (typeof result === 'string') {
        const base64 = result.split(',')[1] || '';
        setForm(prev => ({ ...prev, imagem: file.name, imagemBase64: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2 className="tituloPopUp">{type === 'create' ? 'Cadastro De Modelo' : type === 'edit' ? 'Editar Modelo' : `Você Deseja Deletar: "${modeloData?.nome || ''}"?`}</h2>

        {(type === 'create' || type === 'edit') && (
          <>
            <input type="text" placeholder="Nome do Modelo:" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            <textarea placeholder="Descrição:" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
            <div className="valor-box">
              <label>Valor: R$</label>
              <input type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
            </div>

            <h3 className="titulo">Foto do Modelo:</h3>
            <input type="file" accept="image/*" onChange={handleFileChange} />

            <button id="fecharModal" onClick={handleSubmit}>{type === 'create' ? 'Cadastrar Modelo' : 'Atualizar Modelo'}</button>
          </>
        )}

        {type === 'delete' && (
          <>
            <button id="fecharModalExcluir" onClick={handleSubmit}>Deletar Modelo</button>
            <button id="fecharModalCancelar" onClick={onClose}>Cancelar</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalModelo;
