import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
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
    <main data-scroll-container>
      <Header showOffcanvas={true} />
      <section className="perfil-section">
        <div className="foto-container">
          <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXMzMz////JycnNzc3n5+f39/fy8vL8/Pzp6enU1NTs7Oz5+fnQ0NDZ2dnf39/09PTgONpwAAAE/ElEQVR4nO2cCZaDIBBEI64o6v1vOzoZJ+ISFZpQSeofII8KvQvcboQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEK2UQ9iL0UcpdJUt11WFyN11rU6TT9Hp1Kmq/oysSn7qjOfIFLd2qxJ9miy9vbeIpXO+l15d/pMv7FGXe1v32wjKx17oW4oXS19b4+yesN9VGl2Vt+vxix9N43dGfu0bLWLveRLmPqivpHaxF72eXTuIDBJ8neJOKq94oFzyvY9nDFz1DeSxV78GSoPgUlSxV7+IamfwEFiGlvCAb4C0XdR+fjgRAYcblQnIDBJOlyJrYjAJGljC9nDuObBJSVqdeNSqm1Tx5ayiUiUmYB0RX21m3hGg1iiytnoSBFbzhqpODoBF0+VW8O0T47miTK5fg5Yz59Kb+GwiVgluLQXjmB5YhFAIVQ41QEEJglQThQtZx4gtVHycWYkjy3rQRgjBYo1gYwUyUyPvqC50scWNpEGEpgkKEk/RLq/g+KI8jXpBEhtqmQ7wzk1SKgJUbLdQSncwuT7EZScLzVEXFPGlvZHMIFJElvaH1RIhVQYHyqkQnyFn5/xJT862aBUbR9feX9B9xRqEIVzCOzzpxjh0kVsYf98/DTxCybCoRwRxg1D5fwmtqwHX/B17eO/kH7BV26hg6U2YGfbApw2iS1pwcefGJJPGECp4o64J4J54YhscQpTks7QkuOaEioXTkgWNiitr00ql/YLlCMKC8TsFNNGb+PFQyGFuNcQhXoMpJ5ihcRgEfM6yYRAtEGNMhPeEiEFKj1flZ+hWiaK8gqBrsv5urzuyVp3ZHVTI6SN9tcsrfDXOd9WtzomM/acReR5m9JTvT1vBVwv5C+u4/95dB/xVRClZ2Fl/l8rp3hTWG6nHj9RxNJoO1xpm5P3yx/Wj8e5wt4uRjONZWPKXAs4lbH3aVEd5RHccV2gLdxItedNtVhWouu/58X9lNp+vWQxeTircaVvM6fmr/TG3aHM6o8+filq/UqUMjsDkReObvZbiNosV2G6qtlLHmVTdeuL6UsHf/IHhuJZXdZvVCGmzYr1qvMia7fu3T+rF17TdqgD59qa5CpldDfIvC++HMR1evPBvaNMWrzAUI9vi+4laKWOn4Y8LPjC3yzdiwJzysxtGVaNtEcf+EWJk+WYS4IeaoRT5WzYBvLIB2fruDhNUumTByQXPx3QFy+d78q7889aKnPlhb5wZ8GujtKaTJ8RqUxbXGu3Qg3jHMahZdHpp26jhmRZXf+6Gmig6vZ4SbmT2EdS3VW5S7cc5umT81FmvaC+7rQ26X9KvKVGt/8VgAMhoo33PHuoZOoq+6WqC99PxgFcMdR9bVfk7TTU+UNXpD8SBzkw44dwtyj2UJkcsk+eKf/nEOWpJDdR9BSCFJJfigPeN/BBsD5FyxQTYpsIuoWCmxju3QtfhJrhYEfx/ZGq3cK9KOCL0BnUcJd+/BH5YAMbZ0ZEYo0Jd4HSn0aidEM2UhEzhTZSGTNFNlKR4+CoFduEd+UG2PraeDfC4G4o4IgK2w0HR/RViFt1T/hW39jZcMQzI8IHGu9QA9w5TXh2UPCh1D+Yoo261/gOv9GThX/dhjgotfF9pSf2+k9AhVSIDxVSIT5USIX4UCEV4kOFVIgPFVIhPlRIhfhQIRXiQ4VUiA8VUiE+VEiF+FAhFeJDhVSIz9cr/AF79V2yoD2oxQAAAABJRU5ErkJggg==' className="foto-perfil" alt="Foto de perfil" />
          <div className="foto-overlay">
            <i className="bi bi-pencil-fill"></i>
            <span>Editar</span>
          </div>
        </div>

        <div className="form-perfil">
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
        </div>
      </section>
    </main>
  );
}
