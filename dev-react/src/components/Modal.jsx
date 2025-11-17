import React, { useState, useEffect } from 'react';

// Função utilitária para garantir o valor correto do input
function getValorCor(formData, colorData) {
  if (formData.valor) return formData.valor;
  if (colorData && colorData.valorNumerico !== undefined && colorData.valorNumerico !== null && colorData.valorNumerico !== '') {
    return `R$ ${colorData.valorNumerico}`;
  }
  if (colorData && colorData.valor) return colorData.valor;
  return "R$ 0,00";
}
// Defina a URL igual à usada em CadastroCor.jsx
const API_URL = 'http://localhost:8080/caracteristica-detalhe/cor';
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
  // ...existing code...
  const [colorInfo, setColorInfo] = useState(null);
  // Atualiza o valor do input assim que colorInfo é carregado
  useEffect(() => {
    if (
      type === 'edit' &&
      colorInfo &&
      typeof colorInfo === 'object' &&
      colorInfo.preco !== undefined &&
      colorInfo.preco !== null
    ) {
      setFormData(prev => ({
        ...prev,
        valor: `R$ ${colorInfo.preco}`
      }));
    }
  }, [type, colorInfo]);
  const [formData, setFormData] = useState({
    nome: '',
    cor: '#F29DC3',
    valor: '',
    modelos: []
  });
  const [searchTerm, setSearchTerm] = useState('');

  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
      // Buscar informações da cor pelo id ao abrir modal de edição
      const fetchColorById = async (id) => {
        try {
          const res = await fetch(`${API_URL}/${id}/completo`, { method: 'GET', headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          setColorInfo(data);
          console.log('Modal fetchColorById response:', data);
        } catch (error) {
          console.error('Erro ao carregar cor no modal:', error);
          setColorInfo(null);
        }
      };
      if (type === 'edit' && isOpen && colorData && colorData.id) {
        fetchColorById(colorData.id);
      }
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
      // Usar modelosIds se existir, senão tentar mapear como antes
      let modelosIds = Array.isArray(colorData.modelosIds) ? colorData.modelosIds : [];
      if (modelosIds.length === 0 && Array.isArray(colorData.modelos) && colorData.modelos.length > 0) {
        if (typeof colorData.modelos[0] === 'number') {
          modelosIds = colorData.modelos.filter(id => availableModels.some(m => m.id === id));
        } else if (typeof colorData.modelos[0] === 'string') {
          modelosIds = availableModels
            .filter(m => colorData.modelos.includes(m.nome))
            .map(m => m.id);
        } else if (typeof colorData.modelos[0] === 'object') {
          if (colorData.modelos[0].idModelo) {
            modelosIds = colorData.modelos
              .map(m => m.idModelo)
              .filter(id => availableModels.some(m => m.id === id));
          } else if (colorData.modelos[0].id) {
            modelosIds = colorData.modelos
              .map(m => m.id)
              .filter(id => availableModels.some(m => m.id === id));
          } else {
            modelosIds = availableModels
              .filter(m => colorData.modelos.some(modelo => modelo.nomeModelo === m.nome || modelo.nome === m.nome))
              .map(m => m.id);
          }
        }
      }
      console.log('Modelos IDs mapeados:', modelosIds);
      // Usar valorNumerico do objeto normalizado
      setFormData({
        nome: colorData.nome || '',
        cor: colorData.cor || '#F29DC3',
        valor: colorData.valorNumerico ? `R$ ${colorData.valorNumerico}` : (colorData.valor || "R$ 0,00"),
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
        id='inpValor'
        value={(function() {
          let valorInput = formData.valor;
          if (colorInfo && typeof colorInfo === 'object' && colorInfo.preco !== undefined && colorInfo.preco !== null) {
            valorInput = `R$ ${colorInfo.preco}`;
          }
          console.log('Valor exibido no input do modal:', valorInput);
          return valorInput;
        })()}
        onChange={(e) => {
          let v = e.target.value.replace(/[^\d,]/g, '');
          setFormData(prev => ({ ...prev, valor: v }));
        }}
        onBlur={(e) => {
          import('../utils/formatValor').then(({ formatValorBR }) => {
            setFormData(prev => ({ ...prev, valor: formatValorBR(prev.valor) }));
          });
        }}
        placeholder="Valor: R$ 0,00"
        style={{ marginTop: '5px' }}
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

      {/* Nome da cor */}
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="inpNome" style={{ fontWeight: 'bold' }}>Nome da cor:</label>
        <input
          type="text"
          id='inpNome'
          value={colorInfo?.descricao || formData.nome}
          readOnly
          style={{ backgroundColor: '#eee', color: '#888', cursor: 'not-allowed', marginTop: '5px' }}
        />
      </div>

      {/* Valor da cor */}

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="inpValor" style={{ fontWeight: 'bold' }}>Valor:</label>
        <input
          type="text"
          id='inpValor'
          value={formData.valor}
          onChange={(e) => {
            let v = e.target.value.replace(/[^\d,]/g, '');
            setFormData(prev => ({ ...prev, valor: v }));
          }}
          onBlur={(e) => {
            import('../utils/formatValor').then(({ formatValorBR }) => {
              setFormData(prev => ({ ...prev, valor: formatValorBR(prev.valor) }));
            });
          }}
          placeholder="Valor: R$ 0,00"
          style={{ marginTop: '5px' }}
        />
      </div>




      {/* Modelos associados */}
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