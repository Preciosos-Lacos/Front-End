import React, { useState } from "react";
import Sidebar from "./Sidebar"; // seu componente existente
import "./CadastroTipoLaco.css";

const tiposDeLacos = [
  { nome: "Bico de Pato", imagem: "./assets/images/bico de pato.svg" },
  { nome: "Meio de Seda", imagem: "./assets/images/meio de seda.svg" },
  { nome: "Baby Clips", imagem: "./assets/images/baby clips com borrachina.svg" },
  { nome: "Tiara", imagem: "./assets/images/tiara.svg" },
  { nome: "Elástico de cabelo", imagem: "./assets/images/elástico de cabelo.svg" },
  { nome: "Argola de Acrílico", imagem: "./assets/images/argola de acrilico.svg" },
  { nome: "Presilha Jacaré", imagem: "./assets/images/presilha jacaré.svg" },
  { nome: "Grampo", imagem: "./assets/images/grampo.svg" },
  { nome: "Faixa de Meia", imagem: "./assets/images/faixa de meia.svg" },
  { nome: "Pente de cabelo", imagem: "./assets/images/pente de cabelo.svg" },
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
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [itemExcluir, setItemExcluir] = useState("");

  const abrirModal = (nome) => {
    setItemExcluir(nome);
    setMostrarModal(true);
  };

  const fecharModal = () => setMostrarModal(false);

  const deletar = () => {
    alert(`Tipo de Laço "${itemExcluir}" deletado com sucesso!`);
    setMostrarModal(false);
  };

  const tiposFiltrados = tiposDeLacos.filter((tipo) =>
    tipo.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="cadastro-tipo-lacos">
      <Sidebar />

      <div className="main-content">
        <header>Tipos de Laços</header>

        <div className="nav-pesquisa">
          <div className="search-wrapper">
            <input
              type="text"
              className="search-box"
              placeholder="Pesquisar Tipo de Laço"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
            <i className="bi bi-search" id="lupa-search"></i>
          </div>

          <a href="#" className="btn-cadastrar">
            <i className="bi bi-patch-plus"></i>
            <span> Cadastrar Tipo de Laço</span>
          </a>
        </div>

        <div className="card-container">
          {tiposFiltrados.map((tipo) => (
            <div key={tipo.nome} className="card-custom">
              <h5>{tipo.nome}</h5>
              <div className="tipo-laco-box">
                <img className="img-laco" src={tipo.imagem} alt={tipo.nome} />
              </div>

              <p>
                <strong>Modelos Associados:</strong>
              </p>
              <div className="list-associates">
                <ul>
                  {modelosAssociados.map((modelo) => (
                    <li key={modelo}>{modelo}</li>
                  ))}
                </ul>
              </div>

              <div
                className="card-footer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p className="mt-2">Valor: R$ 6,00</p>
                <div className="icons">
                  <i className="bi bi-pencil"></i>
                  <i
                    className="bi bi-trash"
                    onClick={() => abrirModal(tipo.nome)}
                    style={{ cursor: "pointer" }}
                  ></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de exclusão */}
        {mostrarModal && (
          <div id="excluir" className="modal">
            <div className="modal-content">
              <span className="close" onClick={fecharModal}>
                &times;
              </span>
              <h2 className="tituloPopUp">
                Você deseja deletar: “{itemExcluir}”?
              </h2>

              <button id="fecharModalExcluir" onClick={deletar}>
                Deletar tipo
              </button>
              <button id="fecharModalCancelar" onClick={fecharModal}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
