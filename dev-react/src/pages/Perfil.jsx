import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import ModalAlert from '../components/ModalAlert.jsx';
import '../styles/perfil.css';

const BASE_URL = "http://localhost:8080";

function getAuthToken() {
  return localStorage.getItem("token");
}

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json || {};
  } catch {
    return {};
  }
}

export default function Perfil() {
  const [modalAlert, setModalAlert] = useState({ isOpen: false, title: '', message: '', confirmText: 'OK', onConfirm: null });
  const [enderecos, setEnderecos] = useState([]);
  const [loadingEnderecos, setLoadingEnderecos] = useState(true);
  const [campos, setCampos] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    email: "",
    senha: "********",
  });

  const [editando, setEditando] = useState({
    nome: false,
    telefone: false,
    cpf: false,
    email: false,
    senha: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [fotoBase64, setFotoBase64] = useState(null);


  useEffect(() => {
    let active = true;
    async function loadUser() {
      try {
        setLoading(true);
        setError(null);

        const token = getAuthToken();
        if (!token) {
          setError("Você precisa estar logado para ver o perfil.");
          return;
        }

        const payload = decodeJwt(token);
        const email = payload?.sub; // campo 'sub' do JWT contém o login/email

        const resUser = await fetch(`${BASE_URL}/usuarios/login/${email}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resUser.ok) {
          const msg = await resUser.text();
          throw new Error(msg || "Falha ao carregar usuário logado");
        }

        const u = await resUser.json();
        if (!u) throw new Error("Usuário autenticado não encontrado");

        if (!active) return;
        setUsuario(u);

        // Buscar dados detalhados do usuário pelo ID
        const res = await fetch(`${BASE_URL}/usuarios/${u.idUsuario}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Falha ao carregar perfil");
        }

        const userData = await res.json();
        if (!active) return;

        // Atualiza campos com os dados vindos do backend
        setCampos({
          nome: userData?.nomeCompleto || "",
          telefone: userData?.telefone || "",
          cpf: userData?.cpf || "",
          email: userData?.login || "",
          senha: "********",
        });

        if (userData.foto) {
          setFotoBase64(userData.foto);
        }
      } catch (e) {
        console.error(e);
        if (active) setError(e.message || "Erro ao carregar perfil");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadUser();
    return () => {
      active = false;
    };
  }, []);

  async function handleTrocarFoto(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];
      setFotoBase64(base64);

      try {
        const token = getAuthToken();
        if (!token) return;

        const res = await fetch(`${BASE_URL}/usuarios/${usuario.idUsuario}/foto`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ imagemBase64: base64 })
        });

        if (!res.ok) {
          throw new Error(await res.text());
        }

        setModalAlert({
          isOpen: true,
          title: "Sucesso",
          message: "Foto atualizada com sucesso!",
          confirmText: "OK",
          onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false })
        });

      } catch (err) {
        setModalAlert({
          isOpen: true,
          title: "Erro",
          message: "Não foi possível atualizar sua foto: " + err.message,
          confirmText: "OK",
          onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false })
        });
      }
    };

    reader.readAsDataURL(file);
  }


  // Função para excluir endereço (deve estar no escopo do componente)
  async function handleDeleteEndereco(idEndereco) {
    setModalAlert({
      isOpen: true,
      title: 'Excluir Endereço',
      message: 'Deseja realmente excluir este endereço?',
      confirmText: 'Excluir',
      onConfirm: async () => {
        setModalAlert({ ...modalAlert, isOpen: false });
        try {
          setLoadingEnderecos(true);
          const token = getAuthToken();
          const res = await fetch(`${BASE_URL}/enderecos/${idEndereco}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          });
          if (!res.ok) throw new Error('Erro ao excluir endereço');
          setEnderecos(enderecos.filter(e => e.idEndereco !== idEndereco));
        } catch (e) {
          setModalAlert({
            isOpen: true,
            title: 'Erro',
            message: 'Erro ao excluir endereço: ' + (e.message || ''),
            confirmText: 'OK',
            onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false })
          });
        } finally {
          setLoadingEnderecos(false);
        }
      }
    });
  }

  useEffect(() => {
    async function fetchEnderecos() {
      if (!usuario || !usuario.idUsuario) return;
      try {
        setLoadingEnderecos(true);
        const res = await fetch(`${BASE_URL}/enderecos/usuario/${usuario.idUsuario}`);
        if (!res.ok) throw new Error('Erro ao buscar endereços');
        const data = await res.json();
        setEnderecos(Array.isArray(data) ? data : []);
      } catch (e) {
        setEnderecos([]);
      } finally {
        setLoadingEnderecos(false);
      }
    }
    fetchEnderecos();
  }, [usuario]);

  async function handleUpdate() {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        setModalAlert({
          isOpen: true,
          title: 'Erro',
          message: 'Token inválido',
          confirmText: 'OK',
          onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false })
        });
        return;
      }
      const payload = decodeJwt(token);
      const login = payload?.sub;
      const params = new URLSearchParams();
      if (campos.nome) params.append("nome", campos.nome);
      if (campos.telefone) params.append("telefone", campos.telefone);
      if (campos.cpf) params.append("cpf", campos.cpf);
      if (campos.email) params.append("email", campos.email);
      if (campos.senha && campos.senha !== "********") params.append("senha", campos.senha);
      const res = await fetch(`${BASE_URL}/usuarios/atualizar/${login}?` + params.toString(), {
        method: "PUT",
        mode: "cors",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Erro ao atualizar");
      }
      setModalAlert({
        isOpen: true,
        title: 'Sucesso',
        message: 'Dados atualizados com sucesso!',
        confirmText: 'OK',
        onConfirm: () => {
          setModalAlert({ ...modalAlert, isOpen: false });
          if (campos.email !== login) {
            setModalAlert({
              isOpen: true,
              title: 'Atenção',
              message: 'Você mudou seu e-mail. Faça login novamente.',
              confirmText: 'OK',
              onConfirm: () => {
                setModalAlert({ ...modalAlert, isOpen: false });
                localStorage.removeItem("token");
                window.location.href = "/login";
              }
            });
          }
        }
      });
    } catch (e) {
      setModalAlert({
        isOpen: true,
        title: 'Erro',
        message: 'Erro ao atualizar: ' + e.message,
        confirmText: 'OK',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (campo) => {
    setEditando({ ...editando, [campo]: true });
  };

  const handleChange = (e) => {
    setCampos({ ...campos, [e.target.name]: e.target.value });
  };

  const handleBlur = (campo) => {
    setEditando({ ...editando, [campo]: false });
  };

  if (loading) return <p>Carregando perfil...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <ModalAlert
        isOpen={modalAlert.isOpen}
        title={modalAlert.title}
        message={modalAlert.message}
        confirmText={modalAlert.confirmText}
        onConfirm={modalAlert.onConfirm}
        onClose={() => setModalAlert({ ...modalAlert, isOpen: false })}
      />
      <main data-scroll-container>
        <Header showOffcanvas={true} />
        <section className="perfil-section">
          <div style={{ flex: '1 1 340px', minWidth: 410, maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              type="file"
              accept="image/*"
              id="inputFoto"
              style={{ display: "none" }}
              onChange={handleTrocarFoto}
            />
            <div className="foto-container" onClick={() => document.getElementById('inputFoto').click()}>
              <img
                src={
                  fotoBase64
                    ? `data:image/png;base64,${fotoBase64}`
                    : usuario?.foto
                      ? `data:image/png;base64,${usuario.foto}`
                      : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXMzMz////JycnNzc3n5+f39/fy8vL8/Pzp6enU1NTs7Oz5+fnQ0NDZ2dnf39/09PTgONpwAAAE/ElEQVR4nO2cCZaDIBBEI64o6v1vOzoZJ+ISFZpQSeofII8KvQvcboQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEK2UQ9iL0UcpdJUt11WFyN11rU6TT9Hp1Kmq/oysSn7qjOfIFLd2qxJ9miy9vbeIpXO+l15d/pMv7FGXe1v32wjKx17oW4oXS19b4+yesN9VGl2Vt+vxix9N43dGfu0bLWLveRLmPqivpHaxF72eXTuIDBJ8neJOKq94oFzyvY9nDFz1DeSxV78GSoPgUlSxV7+IamfwEFiGlvCAb4C0XdR+fjgRAYcblQnIDBJOlyJrYjAJGljC9nDuObBJSVqdeNSqm1Tx5ayiUiUmYB0RX21m3hGg1iiytnoSBFbzhqpODoBF0+VW8O0T47miTK5fg5Yz59Kb+GwiVgluLQXjmB5YhFAIVQ41QEEJglQThQtZx4gtVHycWYkjy3rQRgjBYo1gYwUyUyPvqC50scWNpEGEpgkKEk/RLq/g+KI8jXpBEhtqmQ7wzk1SKgJUbLdQSncwuT7EZScLzVEXFPGlvZHMIFJElvaH1RIhVQYHyqkQnyFn5/xJT862aBUbR9feX9B9xRqEIVzCOzzpxjh0kVsYf98/DTxCybCoRwRxg1D5fwmtqwHX/B17eO/kH7BV26hg6U2YGfbApw2iS1pwcefGJJPGECp4o64J4J54YhscQpTks7QkuOaEioXTkgWNiitr00ql/YLlCMKC8TsFNNGb+PFQyGFuNcQhXoMpJ5ihcRgEfM6yYRAtEGNMhPeEiEFKj1flZ+hWiaK8gqBrsv5urzuyVp3ZHVTI6SN9tcsrfDXOd9WtzomM/acReR5m9JTvT1vBVwv5C+u4/95dB/xVRClZ2Fl/l8rp3hTWG6nHj9RxNJoO1xpm5P3yx/Wj8e5wt4uRjONZWPKXAs4lbH3aVEd5RHccV2gLdxItedNtVhWouu/58X9lNp+vWQxeTircaVvM6fmr/TG3aHM6o8+filq/UqUMjsDkReObvZbiNosV2G6qtlLHmVTdeuL6UsHf/IHhuJZXdZvVCGmzYr1qvMia7fu3T+rF17TdqgD59qa5CpldDfIvC++HMR1evPBvaNMWrzAUI9vi+4laKWOn4Y8LPjC3yzdiwJzysxtGVaNtEcf+EWJk+WYS4IeaoRT5WzYBvLIB2fruDhNUumTByQXPx3QFy+d78q7889aKnPlhb5wZ8GujtKaTJ8RqUxbXGu3Qg3jHMahZdHpp26jhmRZXf+6Gmig6vZ4SbmT2EdS3VW5S7cc5umT81FmvaC+7rQ26X9KvKVGt/8VgAMhoo33PHuoZOoq+6WqC99PxgFcMdR9bVfk7TTU+UNXpD8SBzkw44dwtyj2UJkcsk+eKf/nEOWpJDdR9BSCFJJfigPeN/BBsD5FyxQTYpsIuoWCmxju3QtfhJrhYEfx/ZGq3cK9KOCL0BnUcJd+/BH5YAMbZ0ZEYo0Jd4HSn0aidEM2UhEzhTZSGTNFNlKR4+CoFduEd+UG2PraeDfC4G4o4IgK2w0HR/RViFt1T/hW39jZcMQzI8IHGu9QA9w5TXh2UPCh1D+Yoo261/gOv9GThX/dhjgotfF9pSf2+k9AhVSIDxVSIT5USIX4UCEV4kOFVIgPFVIhPlRIhfhQIRXiQ4VUiA8VUiE+VEiF+FAhFeJDhVSIz9cr/AF79V2yoD2oxQAAAABJRU5ErkJggg=='

                }
                className="foto-perfil"
                alt="Foto de perfil"
              />
              <div className="foto-overlay">
                <i className="bi bi-pencil-fill"></i>
                <span>Editar</span>
              </div>
            </div>

            <div className="form-perfil">
              {/* ...dados pessoais... */}
              <div className="campo">
                <label htmlFor="nome">Nome:</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={campos.nome}
                  disabled={!editando.nome}
                  onChange={handleChange}
                  onBlur={() => handleBlur("nome")}
                />
                <i
                  className="bi bi-pencil-fill"
                  onClick={() => handleEdit("nome")}
                ></i>
              </div>
              <div className="campo">
                <label htmlFor="telefone">Telefone:</label>
                <input
                  type="text"
                  id="telefone"
                  name="telefone"
                  value={campos.telefone}
                  disabled={!editando.telefone}
                  onChange={handleChange}
                  onBlur={() => handleBlur("telefone")}
                />
                <i
                  className="bi bi-pencil-fill"
                  onClick={() => handleEdit("telefone")}
                ></i>
              </div>
              <div className="campo">
                <label htmlFor="cpf">CPF:</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={campos.cpf}
                  disabled={!editando.cpf}
                  onChange={handleChange}
                  onBlur={() => handleBlur("cpf")}
                />
                <i
                  className="bi bi-pencil-fill"
                  onClick={() => handleEdit("cpf")}
                ></i>
              </div>
              <div className="campo">
                <label htmlFor="email">E-mail:</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={campos.email}
                  disabled={!editando.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                />
                <i
                  className="bi bi-pencil-fill"
                  onClick={() => handleEdit("email")}
                ></i>
              </div>
              <div className="campo">
                <label htmlFor="senha">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={campos.senha}
                  disabled={!editando.senha}
                  onChange={handleChange}
                  onBlur={() => handleBlur("senha")}
                />
                <i
                  className="bi bi-pencil-fill"
                  onClick={() => handleEdit("senha")}
                ></i>
              </div>
              <button onClick={handleUpdate}>Atualizar Informacões</button>
            </div>
          </div>
          {/* Seção de endereços do usuário */}
          <div className="enderecos-section">
            <h3>Meus Endereços</h3>
            {loadingEnderecos ? (
              <p>Carregando endereços...</p>
            ) : (
              <>
                {enderecos.length > 0 ? (
                  <ul className="lista-enderecos">
                    {enderecos.map((end, idx) => (
                      <li key={end.idEndereco || idx} className="endereco-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>{end.logradouro}, {end.numero} - {end.bairro}, {end.localidade} - {end.uf} | CEP: {end.cep}</span>
                          {end.complemento && <span> Complemento: {end.complemento}</span>}
                          {end.padrao && <span className="endereco-padrao"> Principal</span>}
                        </div>
                        <button
                          className="btn-excluir-endereco"
                          title="Excluir endereço"
                          aria-label="Excluir endereço"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#3A3A3A',
                            cursor: 'pointer',
                            fontSize: '1.3rem',
                            padding: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          onClick={() => handleDeleteEndereco(end.idEndereco)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhum endereço cadastrado.</p>
                )}
                <a href="/cadastro-endereco" className="btn btn-primary" style={{ marginTop: 12 }}>Adicionar novo endereço</a>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
