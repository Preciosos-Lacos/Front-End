import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  type, 
  colorData = null, 
  onSubmit,
  colorName = '',
  viewContent = null
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    cor: '#F29DC3',
    valor: '',
    modelos: []
  });
  const [searchTerm, setSearchTerm] = useState('');

  const availableModels = [
    'Laço Padrão',
    'Laço de Piscina',
    'Laço de Festa',
    'Laço Infantil',
    'Laço Escolar',
    'Laço de Gala',
    'Laço Esportivo',
    'Laço Casual'
  ];

  const filteredModels = availableModels.filter(model =>
    model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (type === 'edit' && colorData) {
      setFormData({
        nome: colorData.nome || '',
        cor: colorData.cor || '#F29DC3',
        valor: colorData.valor || '',
        modelos: colorData.modelos || []
      });
    } else if (type === 'create') {
      setFormData({
        nome: '',
        cor: '#F29DC3',
        valor: '',
        modelos: []
      });
    }
    setSearchTerm('');
  }, [type, colorData, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleModelChange = (model, checked) => {
    setFormData(prev => ({
      ...prev,
      modelos: checked
        ? [...prev.modelos, model]
        : prev.modelos.filter(m => m !== model)
    }));
  };

  const handleSubmit = () => {
    if (type === 'delete') {
      onSubmit();
      return;
    }

    if (!formData.nome || !formData.cor) {
      alert('Preencha o nome e a cor!');
      return;
    }

    if (!formData.valor) {
      alert('Preencha o Valor!');
      return;
    }

    if (formData.modelos.length === 0) {
      alert('Selecione pelo menos um modelo!');
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  if (type === 'view' && viewContent) {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          {viewContent}
        </div>
      </div>
    );
  }

  const renderCreateModal = () => (
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      <h2 className="tituloPopUp">Cadastro de Cor</h2>

      <input
        type="text"
        placeholder="Nome da cor: Verde-Água"
        style={{
          width: '100%',
          padding: '8px',
          margin: '10px 0',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
        value={formData.nome}
        onChange={(e) => handleInputChange('nome', e.target.value)}
      />

      <h3 className="titulo">Clique para escolher a cor:</h3>
      <input
        type="color"
        value={formData.cor}
        onChange={(e) => handleInputChange('cor', e.target.value)}
      />
      <div className="color-block" style={{ background: formData.cor }}></div>

      <input
        type="text"
        placeholder="Valor: R$ 0,00"
        style={{
          width: '100%',
          padding: '8px',
          margin: '10px 0',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
        value={formData.valor}
        onChange={(e) => handleInputChange('valor', e.target.value)}
      />

      <h3 className="titulo">
        Associar modelo:
        <i className="bi bi-bookmark-plus-fill" style={{ color: '#000000', marginLeft: '5px' }}></i>
      </h3>

      <div className="modal-search-wrapper">
        <input
          type="text"
          className="searchInput"
          placeholder="Pesquisar modelo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="bi bi-search"></i>
      </div>

      <div className="checkboxList">
        {filteredModels.map((model, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`modelo${index}`}
              checked={formData.modelos.includes(model)}
              onChange={(e) => handleModelChange(model, e.target.checked)}
            />
            <label htmlFor={`modelo${index}`}>{model}</label>
          </div>
        ))}
      </div>

      <button id="fecharModal" onClick={handleSubmit}>
        Cadastrar cor
      </button>
    </div>
  );

  const renderEditModal = () => (
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      <h2 className="tituloPopUp">Editar Cor</h2>

      <input
        type="text"
        style={{
          width: '100%',
          padding: '8px',
          margin: '10px 0',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
        value={formData.nome}
        readOnly
      />

      <h3 className="titulo">Valor</h3>
      <input
        type="number"
        style={{
          width: '100%',
          padding: '8px',
          margin: '10px 0',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
        value={formData.valor}
        onChange={(e) => handleInputChange('valor', e.target.value)}
      />

      <h3 className="titulo">
        Modelos Associados:
        <i className="bi bi-bookmark-plus-fill" style={{ color: '#000000', marginLeft: '5px' }}></i>
      </h3>

      <div className="modal-search-wrapper">
        <input
          type="text"
          className="searchInput"
          placeholder="Pesquisar modelo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="bi bi-search"></i>
      </div>

      <div className="checkboxList">
        {filteredModels.map((model, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`modeloEdit${index}`}
              checked={formData.modelos.includes(model)}
              onChange={(e) => handleModelChange(model, e.target.checked)}
            />
            <label htmlFor={`modeloEdit${index}`}>{model}</label>
          </div>
        ))}
      </div>

      <button id="fecharModal" onClick={handleSubmit}>
        Atualizar cor
      </button>
    </div>
  );

  const renderDeleteModal = () => (
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      <h2 className="tituloPopUp">Você Deseja Deletar: "{colorName}"?</h2>

      <button id="fecharModalExcluir" onClick={handleSubmit}>
        Deletar cor
      </button>
      <button id="fecharModalCancelar" onClick={onClose}>
        Cancelar
      </button>
    </div>
  );

  return (
    <div className="modal">
      {type === 'create' && renderCreateModal()}
      {type === 'edit' && renderEditModal()}
      {type === 'delete' && renderDeleteModal()}
    </div>
  );
};

export default Modal;