import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

const ModalTipoLaco = ({ isOpen, onClose, type, tipoData = null, onSubmit }) => {
  const [form, setForm] = useState({ nome: '', descricao: '', valor: '', modelos: [], imagem: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const modelosDisponiveis = [
    'Laço Padrão', 'Laço de Festa', 'Laço Infantil', 'Laço Princesa', 'Laço Piscina', 'Laço Silicone'
  ];

  useEffect(() => {
    if (type === 'edit' && tipoData) {
      setForm({
        nome: tipoData.nome || '',
        descricao: tipoData.descricao || '',
        valor: tipoData.valor || '',
        modelos: Array.isArray(tipoData.modelos) ? tipoData.modelos : [],
        imagem: tipoData.imagem || ''
      });
    } else if (type === 'create') {
      setForm({ nome: '', descricao: '', valor: '', modelos: [], imagem: '' });
    }
  }, [isOpen, type, tipoData]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleModelo = (m) => {
    setForm(prev => ({
      ...prev,
      modelos: prev.modelos.includes(m) ? prev.modelos.filter(x => x !== m) : [...prev.modelos, m]
    }));
  };

  const handleSubmit = () => {
    if (type === 'delete') {
      onSubmit(); return;
    }
    if (!form.nome) return alert('Preencha o nome do tipo');
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2 className="tituloPopUp">{type === 'create' ? 'Cadastro De Tipo de Laço' : type === 'edit' ? 'Editar De Tipo de Laço' : `Você Deseja Deletar: "${tipoData?.nome || ''}"?`}</h2>

        {(type === 'create' || type === 'edit') && (
          <>
            <input type="text" placeholder="Nome do Tipo:" value={form.nome} onChange={e => handleChange('nome', e.target.value)} />
            <textarea placeholder="Descrição:" value={form.descricao} onChange={e => handleChange('descricao', e.target.value)} />

            <div className="valor-box">
              <label>Valor: R$</label>
              <input type="number" value={form.valor} onChange={e => handleChange('valor', e.target.value)} />
            </div>

            <h3 className="titulo">Modelos Associados:</h3>
            <div className="checkboxList">
              {modelosDisponiveis.filter(m => m.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
                <div key={m}>
                  <input type="checkbox" id={`mt-${m}`} checked={form.modelos.includes(m)} onChange={() => toggleModelo(m)} />
                  <label htmlFor={`mt-${m}`}>{m}</label>
                </div>
              ))}
            </div>

            <h3 className="titulo">Foto do Tipo:</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="file" accept="image/*" onChange={e => handleChange('imagem', e.target.files?.[0]?.name || '')} />
              {form.imagem && <small>{form.imagem}</small>}
            </div>

            <button id="fecharModal" onClick={handleSubmit}>{type === 'create' ? 'Cadastrar Tipo' : 'Atualizar Tipo'}</button>
          </>
        )}

        {type === 'delete' && (
          <>
            <button id="fecharModalExcluir" onClick={handleSubmit}>Deletar Tipo</button>
            <button id="fecharModalCancelar" onClick={onClose}>Cancelar</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalTipoLaco;
