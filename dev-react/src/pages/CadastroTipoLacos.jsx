import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import BarraPesquisa from "../components/BarraPesquisa";
import ModalTipoLaco from "../components/ModalTipoLaco";
import "../styles/CadastroTipoLaco.css";

function getAuthToken() {
  return localStorage.getItem("token");
}

export default function CadastroTipoLacos() {
  const BASE_URL = "http://localhost:8080/caracteristica-detalhe";

  const [tipos, setTipos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modelos, setModelos] = useState([]);


  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    tipoData: null
  });

  useEffect(() => {
    carregarTiposDeLaco();
  }, []);

  async function carregarTiposDeLaco() {
    try {
      const token = getAuthToken();

      const response = await fetch(`${BASE_URL}/tipo-laco`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.warn("Nenhum dado retornado.");
        setTipos([]);
        return;
      }

      const dados = await response.json();

      const tiposFormatados = dados.map((item) => ({
        id: item.id,
        nome: item.descricao,
        preco: item.preco,
        imagem: item.imagem ? `data:image/png;base64,${item.imagem}` : null,
        modelos: item.modelos ?? [],
        ativo: item.ativo
      }));

      setTipos(tiposFormatados);
    } catch (error) {
      console.error("Erro ao carregar tipos de laço:", error);
    }
  }

  async function carregarModelos() {
    try {
      const token = getAuthToken();

      const response = await fetch("http://localhost:8080/modelos", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.warn("Nenhum modelo retornado.");
        setModelos([]);
        return;
      }

      const dados = await response.json();

      setModelos(
        dados.map(m => ({
          id: m.idModelo,
          nome: m.nomeModelo,
          foto: m.fotoBase64 ? `data:image/png;base64,${m.fotoBase64}` : null
        }))
      );

    } catch (error) {
      console.error("Erro ao carregar modelos:", error);
    }
  }


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
    alertDiv.style.zIndex = 9999;
    alertDiv.textContent = mensagem;

    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
  };

  async function handleModalSubmit(formData) {
    try {
      const token = getAuthToken();

      const dadosParaEnvio = {
        nome: formData.nome,
        preco: Number(formData.preco),
        modelosIds: formData.modelosIds,
        imagemBase64: formData.imagemBase64
      };


      const response = await fetch(`${BASE_URL}/tipo-laco`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dadosParaEnvio)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao cadastrar tipo de laço:", errorText);
        alert(`Erro ao cadastrar: ${errorText}`);
        return;
      }

      alert("Tipo de laço cadastrado com sucesso!");
      closeModal();
      carregarTiposDeLaco();

    } catch (error) {
      console.error("Erro de rede ou processamento:", error);
      alert("Ocorreu um erro inesperado.");
    }
  }

  const handleUpdate = async (data, id) => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${BASE_URL}/tipo-laco/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: data.nome,
          preco: Number(data.preco),
          imagemBase64: data.imagemBase64 || null
        })
      });

      if (!response.ok) {
        const msg = await response.text();
        showAlert("erro", msg || "Erro ao atualizar tipo de laço.");
        return;
      }

      showAlert("sucesso", "Tipo de laço atualizado com sucesso!");
      closeModal();
      carregarTiposDeLaco();

    } catch (err) {
      console.error(err);
      showAlert("erro", "Erro inesperado ao atualizar.");
    }
  };

  async function deletarTipoLaco(id) {
    try {
      const token = getAuthToken();

      const response = await fetch(`${BASE_URL}/tipo-laco/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const msg = await response.text();
        showAlert("erro", msg || "Erro ao excluir o tipo de laço.");
        return;
      }

      showAlert("sucesso", "Tipo de laço excluído com sucesso!");
      closeModal();
      carregarTiposDeLaco();

    } catch (err) {
      console.error(err);
      showAlert("erro", "Erro inesperado ao excluir.");
    }
  }

  async function handleAtivarTipoLaco(id) {
    try {
      const token = getAuthToken();

      const response = await fetch(`${BASE_URL}/cor/${id}/ativar`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const msg = await response.text();
        showAlert("erro", msg || "Erro ao ativar o tipo de laço.");
        return;
      }

      showAlert("sucesso", "Tipo de laço ativado com sucesso!");
      carregarTiposDeLaco(); // Recarrega a lista para atualizar a tela

    } catch (err) {
      console.error("Erro inesperado ao ativar:", err);
      showAlert("erro", "Erro inesperado ao ativar.");
    }
  }

  // -------- MODAL ----------
  const openModal = (type, tipo = null) => {
    setModalState({ isOpen: true, type, tipoData: tipo });

    if (type === "create") {
      carregarModelos();
    }

    if (type === "edit") {
      carregarModelos();
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, tipoData: null });
  };

  const tiposFiltrados = tipos.filter((tipo) =>
    tipo.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cadastro-tipo-lacos">
      <Sidebar />

      <div className="main-content1">
        <header>Tipos de Laços</header>

        <BarraPesquisa
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onAddClick={() => openModal("create")}
          addLabel="Cadastrar Tipo de Laço"
        />

        <div className="card-container-tipo-laco">
          {tiposFiltrados.map((tipo) => (
            <div key={tipo.id} className="card-custom"
              style={{ opacity: tipo.ativo ? 1 : 0.5 }}>
              <h5>{tipo.nome}</h5>

              <div className="tipo-laco-box">
                {tipo.imagem ? (
                  <img src={tipo.imagem} alt={tipo.nome} className="img-laco" />
                ) : (
                  <p>Sem imagem</p>
                )}
              </div>

              <p><strong>Modelos Associados:</strong></p>

              <div className="list-associates">
                <ul>
                  {tipo.modelos.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="card-footer">
                <p>Valor: R$ {tipo.preco?.toFixed(2)}</p>

                <div className="icons">
                  {!tipo.ativo && (
                    <div className="status-indisponivel-a">
                      <button
                        className="btn btn-sm me-2 btn-disponibilizar-a"
                        onClick={() => handleAtivarTipoLaco(tipo.id)}
                      >
                        Disponibilizar
                      </button>
                      <span className="text-indisponivel-a">Indisponível</span>
                    </div>
                  )}
                  {tipo.ativo && (
                    <>
                      <i
                        className="bi bi-pencil"
                        style={{ cursor: "pointer" }}
                        onClick={() => openModal("edit", tipo)}
                      ></i>

                      <i
                        className="bi bi-trash"
                        style={{ cursor: "pointer" }}
                        onClick={() => openModal("delete", tipo)}
                      ></i>
                    </>
                  )}
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
            modelosDisponiveis={modelos}
            onSubmit={
              modalState.type === "delete"
                ? () => deletarTipoLaco(modalState.tipoData.id)
                : modalState.type === "edit"
                  ? (data) => handleUpdate(data, modalState.tipoData.id)
                  : handleModalSubmit
            }
          />
        )}
      </div>
    </div>
  );
}
