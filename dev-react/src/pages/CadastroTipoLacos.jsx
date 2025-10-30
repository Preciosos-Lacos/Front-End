import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import BarraPesquisa from "../components/BarraPesquisa";
import ModalTipoLaco from "../components/ModalTipoLaco";
import "../styles/CadastroTipoLaco.css";

import bicoDePato from "../assets/bico de pato.svg";
import meioDeSeda from "../assets/meio de seda.svg";
import babyClips from "../assets/baby clips com borrachina.svg";
import tiara from "../assets/tiara.svg";
import elastico from "../assets/elástico de cabelo.svg";
import argola from "../assets/argola de acrilico.svg";
import presilha from "../assets/presilha jacaré.svg";
import grampo from "../assets/grampo.svg";
import faixa from "../assets/faixa de meia.svg";
import pente from "../assets/pente de cabelo.svg";

const mockTiposDeLacos = [
  { id: "1", nome: "Bico de Pato", imagem: bicoDePato },
  { id: "2", nome: "Meio de Seda", imagem: meioDeSeda },
  { id: "3", nome: "Baby Clips", imagem: babyClips },
  { id: "4", nome: "Tiara", imagem: tiara },
  { id: "5", nome: "Elástico de cabelo", imagem: elastico },
  { id: "6", nome: "Argola de Acrílico", imagem: argola },
  { id: "7", nome: "Presilha Jacaré", imagem: presilha },
  { id: "8", nome: "Grampo", imagem: grampo },
  { id: "9", nome: "Faixa de Meia", imagem: faixa },
  { id: "10", nome: "Pente de cabelo", imagem: pente },
];

const modelosAssociados = [
  "Laço Padrão",
  "Laço de Festa",
  "Laço Infantil",
  "Laço Princesa",
  "Laço Piscina",
  "Laço Silicone",
];

export default function CadastroTipoLacos() {
  const [tipos, setTipos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'create', 'edit', 'delete'
    tipoData: null
  });

  useEffect(() => {
    // Carrega os dados (mock ou API)
    setTipos(mockTiposDeLacos);
  }, []);

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

  const openModal = (type, tipo = null) => {
    setModalState({ isOpen: true, type, tipoData: tipo });
  };

  const closeModal = () => setModalState({ isOpen: false, type: null, tipoData: null });

  const handleModalSubmit = (formData) => {
    switch (modalState.type) {
      case "create": {
        const novoTipo = {
          id: String(tipos.length + 1),
          nome: formData.nome,
          imagem: formData.imagem || bicoDePato
        };
        setTipos(prev => [...prev, novoTipo]);
        showAlert("sucesso", "Tipo de laço cadastrado!");
        break;
      }

      case "edit": {
        setTipos(prev => prev.map(t => t.id === modalState.tipoData.id ? { ...t, ...formData } : t));
        showAlert("sucesso", "Tipo de laço atualizado!");
        break;
      }

      case "delete": {
        setTipos(prev => prev.filter(t => t.id !== modalState.tipoData.id));
        showAlert("sucesso", "Tipo de laço deletado!");
        break;
      }

      default:
        break;
    }
    closeModal();
  };

  const tiposFiltrados = tipos.filter(tipo =>
    tipo.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cadastro-tipo-lacos">
      <Sidebar />

      <div className="main-content1">
        <header>Tipos de Laços</header>

        <BarraPesquisa
          searchTerm={"Pesquisar tipo de laço"}
          onSearchChange={setSearchTerm}
          onAddClick={() => openModal("create")}
          addLabel="Cadastrar Tipo de Laço"
        />

        <div className="card-container-tipo-laco">
          {tiposFiltrados.map(tipo => (
            <div key={tipo.id} className="card-custom">
              <h5>{tipo.nome}</h5>
              <div className="tipo-laco-box">
                <img src={tipo.imagem} alt={tipo.nome} className="img-laco" />
              </div>

              <p><strong>Modelos Associados:</strong></p>

              <div className="list-associates">
                <ul>
                  {modelosAssociados.map((modelo) => (
                    <li key={modelo}>{modelo}</li>
                  ))}
                </ul>
              </div>
            
              <div className="card-footer">
                <p>Valor: R$ 6,00</p>
                <div className="icons">
                  <i className="bi bi-pencil" style={{ cursor: "pointer" }} onClick={() => openModal("edit", tipo)}></i>
                  <i className="bi bi-trash" style={{ cursor: "pointer" }} onClick={() => openModal("delete", tipo)}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {modalState.isOpen && (
          <ModalTipoLaco
            isOpen={modalState.isOpen}
            onClose={closeModal}
            type={modalState.type}
            tipoData={modalState.tipoData}
            onSubmit={handleModalSubmit}
          />
        )}
      </div>
    </div>
  );
}
