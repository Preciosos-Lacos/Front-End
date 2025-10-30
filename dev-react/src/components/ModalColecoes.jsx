import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

const ModalColecoes = ({ isOpen, onClose, type, data = null, onSubmit }) => {
  const [form, setForm] = useState({ nome: '', descricao: '', modelos: [], imagem: '' });
  const modelosDisponiveis = ['Laço Padrão','Laço Linho','Laço Festa','Laço Infantil'];

  useEffect(() => {
    if (type === 'edit' && data) {
      setForm({
        nome: data.nome || '',
        descricao: data.descricao || '',
        modelos: Array.isArray(data.modelos) ? data.modelos : [],
        imagem: data.imagem || ''
      });
    } else if (type === 'create') {
      setForm({ nome: '', descricao: '', modelos: [], imagem: '' });
    }
  }, [isOpen, type, data]);

  const toggleModelo = (m) => setForm(prev => ({
    ...prev,
    modelos: prev.modelos.includes(m) ? prev.modelos.filter(x => x !== m) : [...prev.modelos, m]
  }));

  const handleSubmit = () => {
    if (type === 'delete') { onSubmit(); return; }
    if (!form.nome) return alert('Preencha o nome da coleção');
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2 className="tituloPopUp">{type === 'create' ? 'Cadastro De Coleção' : type === 'edit' ? 'Atualizar Coleção' : `Você Deseja Deletar: "${data?.nome || ''}"?`}</h2>

        {(type === 'create' || type === 'edit') && (
          <>
            <input type="text" placeholder="Nome da Coleção:" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            <textarea placeholder="Descrição:" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />

            <h3 className="titulo">Modelos Associados:</h3>
            <div className="checkboxList">
              {modelosDisponiveis.map(m => (
                <div key={m}><input type="checkbox" id={`mc-${m}`} checked={form.modelos.includes(m)} onChange={() => toggleModelo(m)} /><label htmlFor={`mc-${m}`}>{m}</label></div>
              ))}
            </div>

            <h3 className="titulo">Foto da Coleção:</h3>
            <input type="file" accept="image/*" onChange={e => setForm({ ...form, imagem: e.target.files?.[0]?.name || '' })} />
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
              <button id="fecharModal" onClick={handleSubmit}>{type === 'create' ? 'Cadastrar Coleção' : 'Atualizar Coleção'}</button>
            </div>
          </>
        )}

        {type === 'delete' && (
          <>
            <button id="fecharModalExcluir" onClick={handleSubmit}>Deletar Coleção</button>
            <button id="fecharModalCancelar" onClick={onClose}>Cancelar</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalColecoes;
