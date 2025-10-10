import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import BarraPesquisa from './BarraPesquisa';
import CardCor from './CardCor';
import Modal from './Modal';
import './CadastroCor.css';

// Constante estável fora do componente para evitar dependências desnecessárias no useCallback/useEffect
const mockColors = [
  {
    id: "1",
    nome: "Vermelho",
    cor: "#f44336",
    valor: "6.00",
    modelos: ["Laço Padrão", "Laço de Festa", "Laço Infantil", "Laço Princesa", "Laço Piscina", "Laço Silicone"]
  },
  {
    id: "2",
    nome: "Rosa",
    cor: "#f8b2cc",
    valor: "6.00",
    modelos: ["Laço Padrão", "Laço de Festa", "Laço Infantil", "Laço Princesa", "Laço Piscina", "Laço Silicone"]
  },
  {
    id: "3",
    nome: "Lilas",
    cor: "#dda0dd",
    valor: "6.00",
    modelos: ["Laço Padrão", "Laço de Festa", "Laço Infantil", "Laço Princesa", "Laço Piscina", "Laço Silicone"]
  },
  {
    id: "4",
    nome: "Azul claro",
    cor: "lightskyblue",
    valor: "6.00",
    modelos: ["Laço Padrão", "Laço de Festa", "Laço Infantil", "Laço Princesa", "Laço Piscina", "Laço Silicone"]
  },
  {
    id: "5",
    nome: "Lavanda",
    cor: "#cac1fe",
    valor: "6.00",
    modelos: ["Laço Padrão", "Laço de Festa", "Laço Infantil", "Laço Princesa", "Laço Piscina", "Laço Silicone"]
  },
  {
    id: "6",
    nome: "Amarelo",
    cor: "#fdfd96",
    valor: "6.00",
    modelos: ["Laço Padrão", "Laço de Festa", "Laço Infantil", "Laço Princesa", "Laço Piscina", "Laço Silicone"]
  },
  {
    id: "7",
    nome: "Verde",
    cor: "#98fb98",
    valor: "6.00",
    modelos: ["Laço Padrão", "Laço de Festa", "Laço Infantil", "Laço Princesa", "Laço Piscina", "Laço Silicone"]
  },
  {
    id: "8",
    nome: "Marrom",
    cor: "#d2b48c",
    valor: "6.00",
    modelos: ["Laço Padrão", "Laço de Festa", "Laço Infantil", "Laço Princesa", "Laço Piscina", "Laço Silicone"]
  },
  {
    id: "9",
    nome: "Preto",
    cor: "#000000",
    valor: "6.00",
    modelos: ["Laço Padrão", "Laço de Festa", "Laço Infantil", "Laço Princesa", "Laço Piscina", "Laço Silicone"]
  },
  {
    id: "10",
    nome: "Branco",
    cor: "#ffffff",
    valor: "6.00",
    modelos: ["Laço Padrão", "Laço de Festa", "Laço Infantil", "Laço Princesa", "Laço Piscina", "Laço Silicone"]
  }
];

const CadastroCor = () => {
  const [colors, setColors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    colorData: null,
    colorName: ''
  });

  const API_URL = "http://localhost:3000/cores";

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
      const res = await fetch(API_URL);
      const colorsData = await res.json();
      setColors(colorsData);
    } catch {
      console.log("API não disponível, usando dados de exemplo");
      setColors(mockColors);
    }
  }, []);

  const createColor = async (formData) => {
    try {
      const valor = formData.valor.replace("R$ ", "").replace(",", ".").trim();
      
      try {
        const res = await fetch(API_URL);
        const existingColors = await res.json();
        const novoId = existingColors.length > 0
          ? Math.max(...existingColors.map(c => Number(c.id) || 0)) + 1
          : 1;

        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: String(novoId),
            nome: formData.nome,
            cor: formData.cor,
            valor: valor || "0.00",
            modelos: formData.modelos
          })
        });
      } catch {
        const novoId = colors.length > 0
          ? Math.max(...colors.map(c => Number(c.id) || 0)) + 1
          : 1;
        
        const newColor = {
          id: String(novoId),
          nome: formData.nome,
          cor: formData.cor,
          valor: valor || "0.00",
          modelos: formData.modelos
        };
        
        setColors(prev => [...prev, newColor]);
      }

      showAlert("sucesso", "Cor cadastrada com sucesso!");
      closeModal();
      loadColors();
    } catch {
      showAlert("erro", "Erro ao cadastrar cor!");
    }
  };

  const updateColor = async (formData) => {
    try {
      let corHex = modalState.colorData.cor || "#ffffff";

      try {
        await fetch(`${API_URL}/${modalState.colorData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: modalState.colorData.id,
            nome: formData.nome,
            cor: corHex,
            valor: formData.valor,
            modelos: formData.modelos
          })
        });
      } catch {
        setColors(prev => prev.map(color => 
          color.id === modalState.colorData.id 
            ? { ...color, nome: formData.nome, valor: formData.valor, modelos: formData.modelos }
            : color
        ));
      }

      showAlert("sucesso", "Cor atualizada com sucesso!");
      closeModal();
      loadColors();
    } catch {
      showAlert("erro", "Erro ao atualizar cor!");
    }
  };

  const deleteColor = async () => {
    try {
      try {
        const res = await fetch(`${API_URL}/${modalState.colorData.id}`, { 
          method: "DELETE" 
        });
        if (!res.ok) throw new Error("Erro ao excluir");
      } catch {
        setColors(prev => prev.filter(color => color.id !== modalState.colorData.id));
      }
      
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
      let colorData;
      
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Cor não encontrada");
        colorData = await res.json();
      } catch {
        colorData = colors.find(color => color.id === id);
        if (!colorData) throw new Error("Cor não encontrada");
      }
      
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

  const filteredColors = colors.filter(color =>
    color.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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