import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/login.css';
import Logo from '../assets/logo_preciosos_lacos.png';

export default function Login({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);

const login = async () => {
  console.log("Tentando login com:", { email, senha });

  try {
    const response = await fetch("http://localhost:8080/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: 'cors', // Adicione esta linha
      body: JSON.stringify({ email, senha }),
    });

    console.log("Resposta recebida do backend:", response);

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Falha no Login");
    }

    const token = await response.text();
    localStorage.setItem("token", token);
    console.log("Token recebido:", token);

    if (onLoginSuccess) {
      onLoginSuccess();
    }
  } catch (err) {
    setError(err.message);
    console.error("Erro no login:", err);
  }
};

  return (
    <div className="login-container">
      <section className="login-section">
        <div className="logo-login">
          <img src={Logo} alt="Logo Preciosos Laços" />
        </div>
        <div className="form-login">
          <div className="inicio">
            <h2 id="inicio">Olá novamente!</h2>
            <p id="p-inicio">Que tal encontrar o laço perfeito hoje?</p>
          </div>
          <div className="login">
            <input
              type="text"
              id="email"
              placeholder="E-mail"
              className="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="input-group w-150px">
              <input
                type={showPassword ? 'text' : 'password'}
                id="senha"
                placeholder="Senha"
                className="form-control senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <span
                className="input-group-text"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowPassword((v) => !v)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} id="togglePassword"></i>
              </span>
            </div>

            <button id="login" className="login" onClick={login}>Login</button>

            {error && <p className="login-error" style={{ color: "red" }}>{error}</p>}

            <p className="link-container">
              Não tem conta? <Link to="/cadastro-usuario">Cadastre-se aqui.</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
