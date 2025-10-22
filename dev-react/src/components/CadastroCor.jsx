import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import BarraPesquisa from './BarraPesquisa';
import CardCor from './CardCor';
import Modal from './Modal';
import './CadastroCor.css';

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

  // Normaliza os campos vindos do backend (Hibernate/Spring) para o formato usado no frontend
  // Backend (tabela): id_caracteristica_detalhe, descricao, hexa_decimal, preco, imagem
  // Frontend esperado: { id, nome, cor, valor, imagem, modelos }
  const normalizeColor = (raw) => {
    if (!raw) return null;
    const id = raw.id ?? raw.idCaracteristicaDetalhe ?? raw.id_caracteristica_detalhe ?? raw.id_caracteristica ?? raw.idCor;
    const nome = raw.nome ?? raw.descricao ?? '';
    const cor = raw.cor ?? raw.hexaDecimal ?? raw.hexa_decimal ?? '';
    const valor = typeof raw.valor === 'number' ? raw.valor : (typeof raw.preco === 'number' ? raw.preco : parseFloat(String(raw.preco ?? raw.valor ?? 0).toString().replace('R$','').replace('.','').replace(',','.')) || 0);
    const imagem = raw.imagem ?? null;
    const modelos = Array.isArray(raw.modelos) ? raw.modelos : [];
    return { id, nome, cor, valor, imagem, modelos };
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
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : [];
      setColors(list.map(normalizeColor).filter(Boolean));
    } catch (error) {
      console.error("Erro ao carregar cores:", error);
      setColors([]);
    }
  }, []);

  const createColor = async (formData) => {
    try {
      const precoNumerico = parseFloat(String(formData.valor ?? '').replace('R$','').replace('.', '').replace(',', '.').trim()) || 0.0;
      // Corpo no formato esperado pelo backend (Spring/Jackson camelCase)
      const payload = {
        nomeDaCor: formData.nome,
        hexaDecimal: formData.cor,
        preco: precoNumerico,
        imagem: formData.imagem ?? null,
        listaModelos: []
      
      };
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        showAlert('sucesso', 'Cor cadastrada com sucesso!');
        closeModal();
        loadColors();
      } else {
        showAlert('erro', 'Erro ao cadastrar cor no servidor!');
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
      // DELETE /caracteristica-detalhe/cor/{id}
      const id = modalState.colorData?.id ?? modalState.colorData?.idCaracteristicaDetalhe ?? modalState.colorData?.id_caracteristica_detalhe;
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
      // GET /caracteristica-detalhe/cor/{id}
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Cor não encontrada");
      const colorDataRaw = await res.json();
      const colorData = normalizeColor(colorDataRaw);
      setModalState({
        isOpen: true,
        type: 'edit',
        colorData: colorData,
        colorName: colorData.nome
      });
    } catch {
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
      default:
        break;
    }
  };

  const filteredColors = colors
    .map(normalizeColor)
    .filter(Boolean)
    .filter(color => color.nome?.toLowerCase().includes(searchTerm.toLowerCase()));

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
          {filteredColors.map(color => (
            <CardCor
              key={color.id}
              color={color}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
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