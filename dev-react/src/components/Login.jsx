import React, { useState } from 'react';
import './login.css';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <section className="login-section">
        <div className="logo-login">
          <img src="/src/assets/logo_preciosos_lacos.png" alt="Logo Preciosos Laços" />
        </div>
        <div className="form-login">
          <div className="inicio">
            <h2 id="inicio">Olá novamente!</h2>
            <p id="p-inicio">Que tal encontrar o laço perfeito hoje?</p>
          </div>
          <div className="login">
          <input type="text" id="email" placeholder="E-mail" className="email" />
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              id="senha"
              placeholder="Senha"
              className="form-control senha"
            />
            <span
              className="input-group-text"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowPassword((v) => !v)}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} id="togglePassword"></i>
            </span>
          </div>
          <button id="login" className="login">Login</button>
          <p className="link-container">
            Não tem conta? <a href="/cadastroUsuario">Cadastre-se aqui.</a>
          </p>
        </div>
      </div>
    </section>
    </div>
  );
} 
