import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/homeShortcut.css';
import '../styles/login.css';
import Logo from '../assets/logo_preciosos_lacos.png';

export default function Login({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    console.log("Tentando login com:", { email: normalizedEmail, senha });

    // helpers to persist attempts per email (like the legacy HTML version)
    const attemptsKey = 'loginAttemptsByEmail';
    function getAttemptsObj() {
      try { return JSON.parse(localStorage.getItem(attemptsKey)) || {}; }
      catch { return {}; }
    }
    function setAttemptsObj(obj) { localStorage.setItem(attemptsKey, JSON.stringify(obj)); }

    if (!normalizedEmail || !senha) {
      setError('Por favor preencha e-mail e senha.');
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: 'cors',
        body: JSON.stringify({ email: normalizedEmail, senha }),
      });

      // successful login
      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("token", token);
        try { sessionStorage.setItem('logged_email', normalizedEmail); } catch (e) { }
        // clear attempts on success
        const attempts = getAttemptsObj();
        if (attempts[normalizedEmail]) { delete attempts[normalizedEmail]; setAttemptsObj(attempts); }

        if (onLoginSuccess) onLoginSuccess();
        if (normalizedEmail === 'camila.osterman@gmail.com') navigate('/admin/pedidos');
        else navigate('/catalogo');
        return;
      }

      // not ok: read message and react similarly to the legacy page
      const text = await response.text();
      // common backends may return 404 for not found – treat as "email not found"
      if (response.status === 404) {
        const go = window.confirm('O e-mail informado não está cadastrado. Deseja criar uma conta agora?');
        if (go) navigate('/cadastro-usuario');
        return;
      }

      // other failures (wrong password etc): increment attempts and offer reset after 3
      const attempts = getAttemptsObj();
      attempts[normalizedEmail] = (attempts[normalizedEmail] || 0) + 1;
      setAttemptsObj(attempts);

      const current = attempts[normalizedEmail];
      if (current >= 3) {
        // reset the counter for this email and open modal to offer password reset
        delete attempts[normalizedEmail];
        setAttemptsObj(attempts);
        setResetEmail(normalizedEmail);
        setShowResetModal(true);
        return;
      }

      // otherwise show the backend message or a generic error
      setError(text || 'Falha no login. Verifique suas credenciais.');

    } catch (err) {
      console.error('Erro no login:', err);
      // show a simple server error modal/confirm like legacy page
      const tryAgain = window.confirm('Não foi possível conectar ao servidor. Verifique se o backend está rodando.\nDeseja tentar novamente?');
      if (!tryAgain) {
        // optionally navigate or do nothing
      }
    }
  };

  return (
    <div className="login-container">
      <Link to="" aria-label="Ir para a página inicial" className="home-shortcut">
        <i className="bi bi-house-door"></i>
      </Link>
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

            <div className="login-actions">
              <p className="link-container">
                Esqueceu sua senha? <Link to="/esqueci-senha">Clique aqui.</Link>
              </p>

              <button id="login" className="login" onClick={login}>Login</button>
            </div>

            {error && <p className="login-error" style={{ color: "red" }}>{error}</p>}

            <p className="link-container">
              Não tem conta? <Link to="/cadastro-usuario">Cadastre-se aqui.</Link>
            </p>
          </div>
        </div>
      </section>
      {/* Reset password modal (simple inline React modal to avoid depending on global Bootstrap JS) */}
      {showResetModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} onClick={() => setShowResetModal(false)} />
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, width: 360, maxWidth: '90%', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 2001 }}>
            <h4 style={{ marginTop: 0 }}>Redefinir senha</h4>
            <p>Você errou a senha 3 vezes para o e-mail <strong>{resetEmail}</strong>. Deseja redefinir a senha agora?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
              <button className="btn btn-secondary" onClick={() => setShowResetModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => { setShowResetModal(false); navigate(`/esqueci-senha?email=${encodeURIComponent(resetEmail)}`); }}>Redefinir senha</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
