import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

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

  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
    // Buscar modelos reais do backend
        const fetchModelos = async () => {
          try {
            const res = await fetch('http://localhost:8080/modelos', { method: 'GET', headers: { Accept: 'application/json' } });
            if (!res.ok) throw new Error('Erro ao buscar modelos');
            const data = await res.json();
            console.log("Modelos disponíveis:", data);
            // Supondo que cada modelo tem idModelo e nomeModelo
            const modelos = Array.isArray(data)
              ? data.map(m => ({ id: m.idModelo, nome: m.nomeModelo }))
              : [];
            setAvailableModels(modelos.filter(m => m.id && m.nome));
          } catch (e) {
            setAvailableModels([]);
          }
        };
        fetchModelos();
  }, []);

  const filteredModels = availableModels.filter(model =>
    model.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Preenche formData ao abrir modal de edição, sempre que availableModels estiver pronto
  useEffect(() => {
    if (type === 'edit' && colorData && availableModels.length > 0) {
      console.log('colorData recebido no modal:', colorData);
      console.log('availableModels carregados:', availableModels);
      let modelosIds = [];
      
      if (Array.isArray(colorData.modelos) && colorData.modelos.length > 0) {
        // Se os modelos são IDs (números)
        if (typeof colorData.modelos[0] === 'number') {
          modelosIds = colorData.modelos.filter(id => availableModels.some(m => m.id === id));
        } 
        // Se são strings (nomes dos modelos)
        else if (typeof colorData.modelos[0] === 'string') {
          modelosIds = availableModels
            .filter(m => colorData.modelos.includes(m.nome))
            .map(m => m.id);
        } 
        // Se são objetos com idModelo
        else if (typeof colorData.modelos[0] === 'object') {
          if (colorData.modelos[0].idModelo) {
            modelosIds = colorData.modelos
              .map(m => m.idModelo)
              .filter(id => availableModels.some(m => m.id === id));
          } else if (colorData.modelos[0].id) {
            modelosIds = colorData.modelos
              .map(m => m.id)
              .filter(id => availableModels.some(m => m.id === id));
          } else {
            // Tentar mapear por nome
            modelosIds = availableModels
              .filter(m => colorData.modelos.some(modelo => modelo.nomeModelo === m.nome || modelo.nome === m.nome))
              .map(m => m.id);
          }
        }
      }
      
      console.log('Modelos IDs mapeados:', modelosIds);
      
      setFormData({
        nome: colorData.nome || '',
        cor: colorData.cor || '#F29DC3',
        valor: colorData.valor || '',
        modelos: modelosIds
      });
      setSearchTerm('');
    } else if (type === 'create') {
      setFormData({
        nome: '',
        cor: '#F29DC3',
        valor: '',
        modelos: []
      });
      setSearchTerm('');
    }
  }, [type, colorData, isOpen, availableModels]);

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
        ? [...prev.modelos, model.id]
        : prev.modelos.filter(mId => mId !== model.id)
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
        id='inpNome'
        placeholder="Nome da cor: Verde-Água"
        value={formData.nome}
        onChange={(e) => handleInputChange('nome', e.target.value)}
      />

      <h3 className="titulo">Clique para escolher a cor:</h3>
      <input
        type="color"
        value={formData.cor}
        onChange={(e) => handleInputChange('cor', e.target.value)}
      />

      <input
        type="text"
        id='inpValor'
        placeholder="Valor: R$ 0,00"
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
        {filteredModels.map((model) => (
          <div key={model.id}>
            <input
              type="checkbox"
              id={`modelo${model.id}`}
              checked={formData.modelos.includes(model.id)}
              onChange={(e) => handleModelChange(model, e.target.checked)}
            />
            <label htmlFor={`modelo${model.id}`}>{model.nome}</label>
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
        id='inpNome'
        value={formData.nome}
        readOnly
      />

      <h3 className="titulo">Valor</h3>
      <input
        type="number"
        id='inpValor'
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
        {filteredModels.map((model) => (
          <div key={model.id}>
            <input
              type="checkbox"
              id={`modeloEdit${model.id}`}
              checked={formData.modelos.includes(model.id)}
              onChange={(e) => handleModelChange(model, e.target.checked)}
            />
            <label htmlFor={`modeloEdit${model.id}`}>{model.nome}</label>
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