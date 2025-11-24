import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import BarraPesquisa from '../components/BarraPesquisa';
import CardCor from '../components/CardCor';
import Modal from '../components/Modal';
import '../styles/CadastroCor.css';

const CadastroCor = () => {
  const [colors, setColors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    colorData: null,
    colorName: ''
  });

  const API_URL = "http://localhost:8080/caracteristica-detalhe/cor";

  // Safe JSON parser: handles empty responses and invalid JSON gracefully
  const safeParseJson = async (res) => {
    try {
      const text = await res.text();
      if (!text) return null;
      return JSON.parse(text);
    } catch (e) {
      console.warn('safeParseJson failed:', e);
      return null;
    }
  };

  const normalizeColor = (raw) => {

  if (!raw) return null;

  const id = raw.id ?? raw.idCaracteristicaDetalhe ?? raw.id_caracteristica_detalhe ?? raw.id_caracteristica ?? raw.idCor;
  const nome = raw.nomeDaCor ?? raw.nome ?? raw.descricao ?? '';
  const cor = raw.cor ?? raw.hexaDecimal ?? raw.hexa_decimal ?? '';
  // Normalizar ativo para 1 ou 0
  let ativo = 0;
  if (raw.ativo !== undefined && raw.ativo !== null) {
    if (raw.ativo === true || raw.ativo === 'true' || raw.ativo === 1 || raw.ativo === '1') ativo = 1;
    else if (raw.ativo === false || raw.ativo === 'false' || raw.ativo === 0 || raw.ativo === '0') ativo = 0;
    else ativo = Number(raw.ativo) ? 1 : 0;
  }

  // Formatar valor para moeda brasileira e valor puro para edição
  let valor = '';
  let valorNumerico = '';
  const precoValido = raw.preco !== undefined && raw.preco !== null && raw.preco !== '' && raw.preco !== 0;
  const valorValido = raw.valor !== undefined && raw.valor !== null && raw.valor !== '' && raw.valor !== 0;

  if (precoValido) {
    valorNumerico = String(raw.preco);
    valor = `R$ ${raw.preco}`;
  } else if (valorValido) {
    valorNumerico = String(raw.valor);
    valor = `R$ ${raw.valor}`;
  } else {
    valorNumerico = '0';
    valor = 'R$ 0';
  }

  const imagem = raw.imagem ?? null;

  // Definir modelosRaw corretamente
  let modelosRaw = [];
  if (Array.isArray(raw.modelos)) {
    modelosRaw = raw.modelos;
  } else if (Array.isArray(raw.listaModelos)) {
    modelosRaw = raw.listaModelos;
  } else if (Array.isArray(raw.modelosIds)) {
    modelosRaw = raw.modelosIds;
  }

  // Modelos associados: para o card, nomes; para o modal, IDs
  let modelosNomes = [];
  let modelosIds = [];
  if (Array.isArray(modelosRaw)) {
    modelosNomes = modelosRaw
      .map((m) => {
        if (m === null || m === undefined) return null;
        if (typeof m === 'object') {
          if (m.nomeModelo) return m.nomeModelo;
          if (m.nome) return m.nome;
          if (m.descricao) return m.descricao;
          if (m.modelo && typeof m.modelo === 'object') {
            if (m.modelo.nomeModelo) return m.modelo.nomeModelo;
            if (m.modelo.nome) return m.modelo.nome;
            if (m.modelo.descricao) return m.modelo.descricao;
          }
          const anyString = Object.values(m).find(v => typeof v === 'string' && v.trim().length > 0);
          if (anyString) return anyString;
          return null;
        }
        if (typeof m === 'string') return m;
        return null;
      })
      .filter((v) => v !== null && typeof v === 'string' && v.trim().length > 0);

    modelosIds = modelosRaw
      .map((m) => {
        if (m === null || m === undefined) return null;
        if (typeof m === 'number') return m;
        if (typeof m === 'object') {
          if (m.idModelo !== undefined) return m.idModelo;
          if (m.id !== undefined) return m.id;
          if (m.modelo && typeof m.modelo === 'object') {
            if (m.modelo.idModelo !== undefined) return m.modelo.idModelo;
            if (m.modelo.id !== undefined) return m.modelo.id;
          }
        }
        if (typeof m === 'string' && /^\d+$/.test(m)) return Number(m);
        return null;
      })
      .filter((v) => v !== null && !isNaN(Number(v)));
  }

  // Se vier modelos do backend como campo separado (ex: do /corModelo/{id}), sobrescrever modelosIds
  if (raw.modelosIds && Array.isArray(raw.modelosIds)) {
    modelosIds = raw.modelosIds.filter((v) => v !== null && !isNaN(Number(v)));
  }

  // Para o card, nomes; para o modal, IDs
    // Garantir valorNumerico correto no retorno padrão
    let valorNumericoPadrao = '';
    if (raw.preco !== undefined && raw.preco !== null && raw.preco !== '') {
      valorNumericoPadrao = raw.preco;
    } else if (raw.valor !== undefined && raw.valor !== null && raw.valor !== '') {
      valorNumericoPadrao = raw.valor;
    }
    return { id, nome, cor, valor, valorNumerico: valorNumericoPadrao, imagem, modelos: modelosNomes, modelosIds, ativo };

  // Se não encontrou nomes mas há objetos Modelo completos com IDs
  if (modelos.length === 0 && raw.listaModelos && Array.isArray(raw.listaModelos) && raw.listaModelos.length > 0) {
    // Se listaModelos contém objetos Modelo completos com idModelo
    const objetosComIds = raw.listaModelos.filter(m => 
      m && typeof m === 'object' && (m.idModelo !== undefined || m.id !== undefined)
    );
    if (objetosComIds.length > 0) {
      // Extrair IDs dos objetos Modelo
      const idsModelos = objetosComIds.map(m => m.idModelo ?? m.id);
      // Garantir valorNumerico correto
      let valorNumerico = '';
      if (raw.preco !== undefined && raw.preco !== null && raw.preco !== '') {
        valorNumerico = raw.preco;
      } else if (raw.valor !== undefined && raw.valor !== null && raw.valor !== '') {
        valorNumerico = raw.valor;
      }
      return { id, nome, cor, valor, valorNumerico, imagem, modelos: idsModelos, ativo };
    }
    
    // Se listaModelos contém apenas números (IDs diretos)
    const idsNumericos = raw.listaModelos.filter(m => typeof m === 'number');
    if (idsNumericos.length > 0) {
      let valorNumerico = '';
      if (raw.preco !== undefined && raw.preco !== null && raw.preco !== '') {
        valorNumerico = raw.preco;
      } else if (raw.valor !== undefined && raw.valor !== null && raw.valor !== '') {
        valorNumerico = raw.valor;
      }
      return { id, nome, cor, valor, valorNumerico, imagem, modelos: idsNumericos, ativo };
    }
  }

  return { id, nome, cor, valor, imagem, modelos };
  // Se não houver modelos, garantir que ativo seja passado
  return { id, nome, cor, valor, imagem, modelos, ativo };
};


  const showAlert = (tipo, mensagem) => {
    let bgColor = "#f0f0f0";
    if (tipo === "sucesso") bgColor = "#28a745";
    else if (tipo === "erro") bgColor = "#dc3545";
    else if (tipo === "aviso") bgColor = "#ffc107";

    const alertDiv = document.createElement("div");
    alertDiv.style.position = "fixed";
    alertDiv.style.top = "20px";
    alertDiv.style.right = "20px";
    alertDiv.style.padding = "15px 20px";
    alertDiv.style.color = "#fff";
    alertDiv.style.backgroundColor = bgColor;
    alertDiv.style.borderRadius = "8px";
    alertDiv.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    alertDiv.style.zIndex = "9999";
    alertDiv.textContent = mensagem;

    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
  };

  const loadColors = useCallback(async () => {
    try {
      // Busca todas as cores (GET /caracteristica-detalhe/cor)
      const res = await fetch(API_URL, { method: 'GET', headers: { Accept: 'application/json' } });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await safeParseJson(res);
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : [];
      console.log('loadColors response:', data);
      setColors(list.map(normalizeColor).filter(Boolean));
    } catch (error) {
      console.error("Erro ao carregar cores:", error);
      setColors([]);
    }
  }, []);

  // Função para cadastrar cor e associar modelos em duas requisições
  const createColor = async (formData) => {
    try {
      const precoNumerico = parseFloat(String(formData.valor ?? '').replace('R$','').replace('.', '').replace(',', '.').trim()) || 0.0;
      const modelosArray = Array.isArray(formData.modelos) ? formData.modelos : [];
      console.log('Modelos selecionados:', modelosArray);
      if (!modelosArray.length) {
        showAlert('aviso', 'Selecione pelo menos um modelo para associar à cor.');
        return;
      }
      // Payload da cor (inclui listaModelos, obrigatório para o backend)
      const corPayload = {
        nomeDaCor: formData.nome,
        hexaDecimal: formData.cor,
        preco: precoNumerico,
        imagem: formData.imagem ?? null,
        // backend espera array de objetos { idModelo }
        listaModelos: modelosArray.map(id => ({ idModelo: id }))
      };
      console.log('Payload enviado para cadastro de cor:', corPayload);
          // POST para cadastrar cor
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(corPayload)
          });
          if (response.ok) {
            // Busca a cor recém-criada pelo nome e cor
            let corId = null;
            try {
              const resGet = await fetch(API_URL, { method: 'GET', headers: { Accept: 'application/json' } });
              if (resGet.ok) {
                const data = await safeParseJson(resGet);
                const list = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
                const corEncontrada = list.find(c => (c.nomeDaCor === formData.nome || c.nome === formData.nome) && (c.hexaDecimal === formData.cor || c.cor === formData.cor));
                corId = corEncontrada?.id ?? null;
              }
            } catch (e) {
              corId = null;
            }
            if (corId) {
              const modelosPayload = {
                id: corId,
                // backend espera um array de inteiros
                listaModelos: modelosArray
              };
              await fetch('http://localhost:8080/caracteristica-detalhe/corModelo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(modelosPayload)
              });
            }
            showAlert('sucesso', 'Cor cadastrada e modelos associados com sucesso!');
            closeModal();
            loadColors();
          } else {
            // Tenta ler o corpo da resposta (pode ajudar a debugar o 500)
            let serverText = '';
            try {
              serverText = await response.text();
            } catch (e) {
              console.warn('Não foi possível ler o corpo da resposta do servidor', e);
            }
            console.error('createColor failed', response.status, serverText);
            // Mostrar parte da mensagem no UI para ajudar debug (cortar para não poluir)
            const short = serverText ? serverText.slice(0, 300) : '';
            showAlert('erro', `Erro ao cadastrar cor no servidor: ${response.status}${short ? ' — ' + short : ''}`);
          }
    } catch (error) {
      console.error(error);
      showAlert('erro', 'Erro ao conectar com o servidor!');
    }
  };

  const updateColor = async (formData) => {
    try {
      const id = modalState.colorData?.id ?? modalState.colorData?.idCaracteristicaDetalhe ?? modalState.colorData?.id_caracteristica_detalhe;
      if (!id) throw new Error('ID inválido para atualização');
      if (isNaN(Number(id))) {
        showAlert('aviso', 'Esta cor não pode ser editada no backend (id não é do banco).');
        closeModal();
        return;
      }
      const payload = {
        preco: parseFloat(String(formData.valor ?? '').replace('R$','').replace('.', '').replace(',', '.').trim()) || 0.0,
      };
      // PUT /caracteristica-detalhe/cor/{id}
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        // Primeiro, remove associações antigas
        try {
          await fetch(`http://localhost:8080/caracteristica-detalhe/corModelo/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
          });
        } catch (e) {
          console.warn('Erro ao remover associações antigas (pode não existir):', e);
        }
        
        // Depois, adiciona novas associações
        const modelosArray = Array.isArray(formData.modelos) ? formData.modelos : [];
        if (modelosArray.length > 0) {
          const modelosPayload = {
            id: id,
              listaModelos: modelosArray
          };
          const resAssociacao = await fetch('http://localhost:8080/caracteristica-detalhe/corModelo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(modelosPayload)
          });
          
          if (!resAssociacao.ok) {
            const txt = await resAssociacao.text();
            throw new Error(txt || 'Erro ao associar modelos');
          }
        }
        
        showAlert('sucesso', 'Cor atualizada com sucesso!');
        closeModal();
        loadColors();
      } else {
        showAlert('erro', 'Erro ao atualizar cor!');
      }
    } catch (e) {
      console.error(e);
      showAlert('erro', 'Erro ao atualizar cor!');
    }
  };

  const deleteColor = async () => {
    try {
      const id = modalState.colorData?.id ?? modalState.colorData?.idCaracteristicaDetalhe ?? modalState.colorData?.id_caracteristica_detalhe;
      // Se o id não for um número, não tente deletar no backend
      if (isNaN(Number(id))) {
        showAlert('aviso', 'Esta cor não pode ser excluída no backend (id não é do banco).');
        closeModal();
        return;
      }
      // DELETE /caracteristica-detalhe/cor/{id}
      const res = await fetch(`${API_URL}/${id}`, { 
        method: "DELETE" 
      });
  if (!res.ok) throw new Error("Erro ao excluir");
      showAlert("sucesso", "Cor excluída com sucesso!");
      closeModal();
      loadColors();
    } catch {
      showAlert("erro", "Cor não encontrada ou já excluída!");
    }
  };

  const [isActivating, setIsActivating] = React.useState(false);
  const activateColor = async (id) => {
    console.log('[DISPONIBILIZAR] INÍCIO DA FUNÇÃO activateColor, id:', id);
    if (isActivating) return;
    setIsActivating(true);
    try {
      console.log('[DISPONIBILIZAR] PATCH para:', `${API_URL}/${id}/ativar`);
      const res = await fetch(`${API_URL}/${id}/ativar`, {
        method: "PATCH"
      });
      const text = await res.text();
      console.log('[DISPONIBILIZAR] Resposta do backend:', res.status, text);
      if (!res.ok) throw new Error("Erro ao ativar");
      // Após ativar, buscar a cor individualmente para garantir que o status está atualizado
      let corAtualizada = null;
      try {
        const resCor = await fetch(`${API_URL}/${id}`);
        if (resCor.ok) {
          corAtualizada = await safeParseJson(resCor);
          console.log('[DISPONIBILIZAR] Cor atualizada:', corAtualizada);
        }
      } catch (e) {
        console.warn('Não foi possível buscar cor atualizada após ativação', e);
      }
      showAlert("sucesso", "Cor reativada com sucesso!");
      closeModal();
      await loadColors();
    } catch (err) {
      console.error('[DISPONIBILIZAR] Erro ao ativar:', err);
      showAlert("erro", "Erro ao reativar cor!");
    } finally {
      setIsActivating(false);
    }
  };

  const openCreateModal = () => {
    setModalState({
      isOpen: true,
      type: 'create',
      colorData: null,
      colorName: ''
    });
  };

  const openEditModal = async (id) => {
    try {
      // Se o id for composto (ex: nome-cor), buscar no array colors
      let colorDataRaw = null;
      if (String(id).includes('-')) {
        colorDataRaw = colors.find(c => (c.id ?? `${c.nome}-${c.cor}`) === id);
      }
      if (!colorDataRaw) {
        // GET /caracteristica-detalhe/cor/{id}/completo - busca cor com modelos associados
        const res = await fetch(`${API_URL}/${id}/completo`);
        if (!res.ok) {
          // Tenta primeiro endpoint antigo simples, depois o /completo
          const resOld = await fetch(`${API_URL}/${id}`);
          if (resOld.ok) {
            colorDataRaw = await safeParseJson(resOld) || null;
          } else {
            // como último recurso, tenta novamente o /completo
            const resAgain = await fetch(`${API_URL}/${id}/completo`);
            if (!resAgain.ok) throw new Error("Cor não encontrada");
            colorDataRaw = await safeParseJson(resAgain) || null;
          }
        } else {
          colorDataRaw = await safeParseJson(res) || null;
        }
        console.log('[EDIT MODAL] Resposta /cor/{id}/completo:', colorDataRaw);

        // Se o endpoint /completo ou /{id} não trouxe modelos, tentar buscar associações explicitamente
        try {
          // Normalizar qualquer listaModelos já presente na resposta para IDs numéricos
          if (colorDataRaw && Array.isArray(colorDataRaw.listaModelos) && (!colorDataRaw.modelos || colorDataRaw.modelos.length === 0)) {
            const normalizedFromLista = colorDataRaw.listaModelos
              .map(m => {
                if (m === null || m === undefined) return null;
                if (typeof m === 'number') return m;
                if (typeof m === 'string' && /^\d+$/.test(m)) return Number(m);
                if (typeof m === 'object') return m.idModelo ?? m.id ?? (m.modelo && (m.modelo.idModelo ?? m.modelo.id)) ?? null;
                return null;
              })
              .filter(v => v !== null && v !== undefined);
            if (normalizedFromLista.length > 0) colorDataRaw.modelos = normalizedFromLista;
          }

          const assocRes = await fetch(`http://localhost:8080/caracteristica-detalhe/corModelo/${id}`);
          if (assocRes.ok) {
            const assocData = await safeParseJson(assocRes) || [];
            console.log('[EDIT MODAL] Resposta /corModelo/{id}:', assocData);
            let assocIds = [];
            if (Array.isArray(assocData) && assocData.length > 0) {
              const first = assocData[0];
              if (typeof first === 'number') {
                assocIds = assocData;
              } else if (first && typeof first === 'object') {
                // tentar vários formatos possíveis
                if (first.idModelo !== undefined) assocIds = assocData.map(a => a.idModelo).filter(Boolean);
                else if (first.id !== undefined) assocIds = assocData.map(a => a.id).filter(Boolean);
                else if (first.modelo && first.modelo.idModelo !== undefined) assocIds = assocData.map(a => a.modelo.idModelo).filter(Boolean);
              }
            }
            if (assocIds.length > 0) {
              // garantir que colorDataRaw exista
              colorDataRaw = colorDataRaw || {};
              // combinar IDs já existentes (se houver) com os retornados pela associação
              const existing = Array.isArray(colorDataRaw.modelos) ? colorDataRaw.modelos.map(v => Number(v)).filter(Boolean) : [];
              const combined = Array.from(new Set([...existing, ...assocIds.map(Number).filter(Boolean)]));
              colorDataRaw.modelos = combined;
            }
          }
        } catch (e) {
          // ignore assoc fetch errors - modal will handle missing associations gracefully
          console.warn('Erro ao buscar associações de modelos para a cor:', e);
        }
      }
      // Assegurar que colorDataRaw.modelos é um array de números (ou undefined)
      if (colorDataRaw && Array.isArray(colorDataRaw.modelos)) {
        colorDataRaw.modelos = colorDataRaw.modelos.map(m => {
          if (typeof m === 'number') return m;
          if (typeof m === 'string' && /^\d+$/.test(m)) return Number(m);
          if (m && typeof m === 'object') return m.idModelo ?? m.id ?? (m.modelo && (m.modelo.idModelo ?? m.modelo.id)) ?? null;
          return null;
        }).filter(v => v !== null && v !== undefined);
        console.log('[EDIT MODAL] IDs normalizados para checkboxes:', colorDataRaw.modelos);
      }

      const colorData = normalizeColor(colorDataRaw);
      console.log('[EDIT MODAL] colorData normalizado:', colorData);
      setModalState({
        isOpen: true,
        type: 'edit',
        colorData: colorData,
        colorName: colorData.nome
      });
      // LOG EXTRA PARA DEBUG
      setTimeout(() => {
        console.log('[EDIT MODAL] modalState.colorData:', colorData);
      }, 1000);
    } catch (error) {
      console.error("Erro ao abrir modal de edição:", error);
      showAlert("erro", "Cor não encontrada!");
    }
  };

  const openDeleteModal = (id, nome) => {
    setModalState({
      isOpen: true,
      type: 'delete',
      colorData: { id },
      colorName: nome
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      colorData: null,
      colorName: ''
    });
  };

  const handleModalSubmit = (formData) => {
    switch (modalState.type) {
      case 'create':
        createColor(formData);
        break;
      case 'edit':
        updateColor(formData);
        break;
      case 'delete':
        deleteColor();
        break;
      case 'activate':
        activateColor(modalState.colorData?.id);
        break;
      default:
        break;
    }
  };

  const filteredColors = colors
    .filter(Boolean)
    .filter(color => (color.nome ?? '').toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    loadColors();
  }, [loadColors]);

  return (
    <div className="color-page">
      <Sidebar />
      <header>Cores</header>
      <BarraPesquisa 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={openCreateModal}
        addLabel="Cadastrar Cores"
      />
      <div className="content">
        <div className="card-container">
          {filteredColors.map((color, idx) => (
            <CardCor
              key={
                color.id
                  ?? (color.nome && color.cor ? `${color.nome}-${color.cor}` : undefined)
                  ?? color.cor
                  ?? color.nome
                  ?? idx
              }
              color={color}
              onEdit={id => openEditModal(id)}
              onDelete={(id, nome) => openDeleteModal(id, nome)}
              onActivate={id => {
                console.log('[DISPONIBILIZAR] Clique em disponibilizar cor:', id, color);
                setModalState({
                  isOpen: true,
                  type: 'activate',
                  colorData: { id },
                  colorName: color.nome
                });
              }}
              isActivating={isActivating}
            />
          ))}
        </div>
      </div>
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        colorData={modalState.colorData}
        colorName={modalState.colorName}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default CadastroCor;