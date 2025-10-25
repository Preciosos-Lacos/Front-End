import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CadastroUsuario.css';
import logo from '../assets/logo_preciosos_lacos.png';
import { formatCPF } from '../utils/regexCPF';
import { formatTelefone } from '../utils/regexTelefone';

export default function CadastroUsuario() {
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    email: '',
    senha: '',
    confirmar_senha: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showPwdConfirm, setShowPwdConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  function handleChange(e) {
    const { id, value } = e.target;
    let v = value;
    if (id === 'telefone') v = formatTelefone(v);
    if (id === 'cpf') v = formatCPF(v);
    setForm(prev => ({ ...prev, [id]: v }));
  }

  const cadastro = async () => {

    const { nome, telefone, cpf, email, senha, confirmar_senha } = form;

    console.log("Tentando cadastrar com:", form);

    if (!nome || !telefone || !cpf || !email || !senha || !confirmar_senha) {
      alert("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmar_senha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          nomeCompleto: nome,
          email,
          senha,
          cpf,
          telefone,
        }),
      });

      console.log("Resposta recebida do backend:", response);

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Falha no Cadastro");
      }

      const data = await response.json();
      alert(`Usuário cadastrado com sucesso! ID: ${data.id}`);
      //  window.location.href = "/login";
    } catch (err) {
      setErrorMessage(err.message);
      console.error("Erro no Cadastro:", err);
    }
  };

  return (
    <main className="cadastro-main">
      <section className="cadastro-section">
        <div className="logo-cadastro">
          <img src={logo} alt="Logo Preciosos Laços" />
        </div>

        <form
          className="form-cadastro"
          onSubmit={(e) => {
            e.preventDefault();
            cadastro();
          }}>

          <div className="incio">
            <h2 id="inicio">Crie sua conta!</h2>
            <p id="p-inicio">E encontre o laço perfeito para cada momento especial</p>
          </div>

          <div className="cadastro">
            <input
              type="text"
              id="nome"
              placeholder="Nome completo:"
              value={form.nome}
              onChange={handleChange}
            />

            <input
              type="text"
              id="telefone"
              placeholder="Telefone:"
              value={form.telefone}
              onChange={handleChange}
              inputMode="tel"
              maxLength={16}
            />

            <input
              type="text"
              id="cpf"
              placeholder="CPF:"
              value={form.cpf}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={14}
            />

            <input
              type="email"
              id="email"
              placeholder="E-mail:"
              value={form.email}
              onChange={handleChange}
            />

            <div className="input-group">
              <input
                type={showPwd ? 'text' : 'password'}
                id="senha"
                placeholder="Senha:"
                className="form-control"
                value={form.senha}
                onChange={handleChange}
              />
              <button
                type="button"
                className="input-group-text"
                onClick={() => setShowPwd(s => !s)}
                aria-label="Mostrar/ocultar senha"
              >
                <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>

            <div className="input-group">
              <input
                type={showPwdConfirm ? 'text' : 'password'}
                id="confirmar_senha"
                placeholder="Confirmar senha:"
                className="form-control"
                value={form.confirmar_senha}
                onChange={handleChange}
              />
              <button
                type="button"
                className="input-group-text"
                onClick={() => setShowPwdConfirm(s => !s)}
                aria-label="Mostrar/ocultar confirmar senha"
              >
                <i className={`bi ${showPwdConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>

            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
            <button id="cadastro" type="submit">Cadastrar</button>

            <p className="link-container">
              Já tem conta? <Link to="/login">Faça o login aqui.</Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}