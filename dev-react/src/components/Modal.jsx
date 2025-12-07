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

const ConfirmModal = ({ colorName, onConfirm, onCancel, isActivating }) => (
  <div className="modal-content">
    <span className="close" onClick={onCancel}>&times;</span>
    <h2 className="tituloPopUp">Deseja disponibilizar a cor "{colorName}"?</h2>
    <div style={{ margin: '18px 0', textAlign: 'center', color: '#a04c6e', fontWeight: 500, fontSize: 16 }}>
      Essa ação tornará a cor disponível para uso no sistema.
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12 }}>
      <button
        className="btn-confirm"
        onClick={onConfirm}
        disabled={isActivating}
        style={isActivating ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
      >
        {isActivating ? 'Disponibilizando...' : 'Disponibilizar cor'}
      </button>
      <button className="btn-cancel" onClick={onCancel}>
        Cancelar
      </button>
    </div>
  </div>
);
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
  // Variáveis de conteúdo para cada tipo de modal
  const modalConfig = {
    create: {
      title: 'Cadastro de Cor',
      buttonLabel: 'Cadastrar cor',
      showColorInput: true,
      showValueInput: true,
      showModelos: true,
      readOnlyName: false,
    },
    edit: {
      title: 'Editar Cor',
      buttonLabel: 'Atualizar cor',
      showColorInput: false,
      showValueInput: true,
      showModelos: true,
      readOnlyName: true,
    },
    delete: {
      title: `Você Deseja inativar: "${colorName}"?`,
      buttonLabel: 'Inativar cor',
      showColorInput: false,
      showValueInput: false,
      showModelos: false,
      readOnlyName: true,
    },
    activate: {
      title: `Deseja disponibilizar a cor "${colorName}"?`,
      buttonLabel: 'Confirmar',
      showColorInput: false,
      showValueInput: false,
      showModelos: false,
      readOnlyName: true,
    }
  };
  const config = modalConfig[type] || modalConfig.create;
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
    cor: '#EEEEEE',
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
      <div className="modal-overlay">
        <div className="modal">
          {viewContent}
        </div>
      </div>
    );
  }

  if (type === 'activate') {
    return (
      <div className="modal-overlay">
        <ConfirmModal
          colorName={colorName}
          onConfirm={() => onSubmit()}
          onCancel={onClose}
          isActivating={false}
        />
      </div>
    );
  }

  const renderCreateModal = () => (
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      <h2 className="tituloPopUp">{config.title}</h2>
      {/* Nome da cor */}
      <input
        type="text"
        id="inpNome"
        value={formData.nome}
        onChange={e => handleInputChange('nome', e.target.value)}
        placeholder="Nome da cor"
        style={{ marginBottom: '8px', fontWeight: 500 }}
        readOnly={config.readOnlyName}
      />
      {/* Bloco para escolher a cor */}
      {config.showColorInput && (
        <>
          <div style={{ width: '100%', textAlign: 'center', margin: '8px 0', fontWeight: 600, fontSize: 16 }}>Clique para escolher a cor:</div>
          <input
            type="color"
            id="inpCor"
            value={formData.cor}
            onChange={e => handleInputChange('cor', e.target.value)}
            style={{
              margin: '-10px 0px 15px 0px',
              width: '100%',
              height: '45px',
              border: '2.5px solid white',
              cursor: 'pointer',
              borderRadius: '10px',
              background: 'rgb(255, 255, 255)'
            }}
          />
        </>
      )}
      {/* Valor */}
      {config.showValueInput && (
        <input
          type="text"
          id="inpValor"
          value={formData.valor}
          onChange={e => handleInputChange('valor', e.target.value.replace(/[^\d,]/g, ''))}
          onBlur={e => {
            import('../utils/formatValor').then(({ formatValorBR }) => {
              setFormData(prev => ({ ...prev, valor: formatValorBR(prev.valor) }));
            });
          }}
          placeholder="Valor: R$ 0,00"
          style={{ marginBottom: '8px' }}
        />
      )}
      {/* Associar modelo */}
      {config.showModelos && (
        <>
          <div style={{ width: '100%', textAlign: 'left', fontWeight: 600, fontSize: 16, margin: '8px 0 2px 0' }}>
            Associar modelo: <i className="bi bi-bookmark-plus-fill" style={{ color: '#000000', marginLeft: '5px' }}></i>
          </div>
          <div className="modal-search-wrapper" style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="searchInput"
              placeholder="Pesquisar modelo"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                paddingRight: '32px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
            <i
              className="bi bi-search"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#a04c6e',
                fontSize: '20px',
                pointerEvents: 'none'
              }}
            ></i>
          </div>
          <div className="checkboxList">
            {filteredModels.map(model => (
              <div key={model.id}>
                <input
                  type="checkbox"
                  id={`modelo${model.id}`}
                  checked={formData.modelos.includes(model.id)}
                  onChange={e => handleModelChange(model, e.target.checked)}
                />
                <label htmlFor={`modelo${model.id}`}>{model.nome}</label>
              </div>
            ))}
          </div>
        </>
      )}
      <button id="fecharModal" onClick={handleSubmit}>
        {config.buttonLabel}
      </button>
    </div>
  );

  const renderEditModal = () => (
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      <h2 className="tituloPopUp">{config.title}</h2>
      {(!formData || !colorData || !Array.isArray(availableModels) || availableModels.length === 0) ? (
        <div style={{ textAlign: 'center', margin: '32px 0', color: '#a04c6e', fontWeight: 500 }}>
          Carregando dados da cor e modelos...
        </div>
      ) : (
        <>
          {/* Nome da cor */}
          <input
            type="text"
            id="inpNome"
            value={colorInfo?.descricao || formData.nome}
            readOnly={config.readOnlyName}
            style={{ backgroundColor: config.readOnlyName ? '#eee' : '#fff', color: config.readOnlyName ? '#888' : '#222', cursor: config.readOnlyName ? 'not-allowed' : 'text', marginBottom: '8px', fontWeight: 500 }}
          />
          {/* Bloco para escolher a cor (apenas visualização) */}
          {config.showColorInput && (
            <>
              <div style={{ width: '100%', textAlign: 'center', margin: '8px 0', fontWeight: 600, fontSize: 16 }}>Clique para escolher a cor:</div>
              <div className="color-block" style={{ background: formData.cor, border: '2px solid #fff', marginBottom: 8 }}></div>
              <input
                type="color"
                id="inpCor"
                value={formData.cor}
                onChange={e => handleInputChange('cor', e.target.value)}
                style={{ width: '100%', height: 44, borderRadius: 10, border: '2px solid #fff', cursor: 'pointer', marginBottom: 8 }}
              />
            </>
          )}
          {/* Valor da cor */}
          {config.showValueInput && (
            <input
              type="text"
              id="inpValor"
              value={formData.valor}
              onChange={e => handleInputChange('valor', e.target.value.replace(/[^\d,]/g, ''))}
              onBlur={e => {
                import('../utils/formatValor').then(({ formatValorBR }) => {
                  setFormData(prev => ({ ...prev, valor: formatValorBR(prev.valor) }));
                });
              }}
              placeholder="Valor: R$ 0,00"
              style={{ marginBottom: '8px' }}
            />
          )}
          {/* Associar modelo */}
          {config.showModelos && (
            <>
              <div style={{ width: '100%', textAlign: 'left', fontWeight: 600, fontSize: 16, margin: '8px 0 2px 0' }}>
                Associar modelo: <i className="bi bi-bookmark-plus-fill" style={{ color: '#000000', marginLeft: '5px' }}></i>
              </div>
              <div className="modal-search-wrapper" style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  className="searchInput"
                  placeholder="Pesquisar modelo"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    paddingRight: '32px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
                <i
                  className="bi bi-search"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#a04c6e',
                    fontSize: '20px',
                    pointerEvents: 'none'
                  }}
                ></i>
              </div>
              <div className="checkboxList">
                {filteredModels.map(model => (
                  <div key={model.id}>
                    <input
                      type="checkbox"
                      id={`modeloEdit${model.id}`}
                      checked={formData.modelos.includes(model.id)}
                      onChange={e => handleModelChange(model, e.target.checked)}
                    />
                    <label htmlFor={`modeloEdit${model.id}`}>{model.nome}</label>
                  </div>
                ))}
              </div>
            </>
          )}
          <button id="fecharModal" onClick={handleSubmit}>
            {config.buttonLabel}
          </button>
        </>
      )}
    </div>
  );

  const renderDeleteModal = () => (
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      <h2 className="tituloPopUp">Você Deseja intativar: "{colorName}"?</h2>

      <button id="fecharModalExcluir" onClick={handleSubmit}>
        Inativar cor
      </button>
      <button id="fecharModalCancelar" onClick={onClose}>
        Cancelar
      </button>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal">
        {type === 'create' && renderCreateModal()}
        {type === 'edit' && renderEditModal()}
        {type === 'delete' && renderDeleteModal()}
      </div>
    </div>
  );
};

export default Modal;