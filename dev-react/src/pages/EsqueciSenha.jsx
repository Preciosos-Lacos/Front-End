import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/esqueciSenha.css';
import logo from '../assets/logo_preciosos_lacos.png';

export default function EsqueciSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const handleRedefinirSenha = async () => {
    if (!email || !novaSenha || !confirmarSenha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/usuarios/atualizar_senha', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({ email, senha: novaSenha })
      });

      if (response.ok) {
        alert('Senha redefinida com sucesso! Faça login com sua nova senha.');
        window.location.href = '/login';
        return;
      }

      if (response.status === 404) {
        alert('E-mail não encontrado.');
        return;
      }

      const msg = await response.text();
      alert(msg || 'Erro ao atualizar a senha. Tente novamente.');
    } catch (error) {
      alert('Erro de conexão com o servidor. Tente novamente.');
    }
  };

  return (
    <div className="esqueci-senha-bg">
      {/* Header removido para usar o header global, igual à tela de login */}
      <section className="login-section">
        <div className="logo-login">
          <img src={logo} alt="Logo Preciosos Laços" />
        </div>
        <div className="form-login">
          <div className="incio">
            <h2 id="inicio">Redefinir senha</h2>
            <p id="p-inicio">Informe seu e-mail para redefinir sua senha.</p>
          </div>
          <div className="login">
            <input
              type="text"
              id="email"
              placeholder="E-mail:"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <div className="input-group mt-3">
              <input
                type={showNovaSenha ? 'text' : 'password'}
                id="novaSenha"
                placeholder="Nova senha:"
                className="form-control"
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
              />
              <span className="input-group-text" onClick={() => setShowNovaSenha(s => !s)} style={{ cursor: 'pointer' }}>
                <i className={`bi ${showNovaSenha ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </span>
            </div>
            <div className="input-group mt-2">
              <input
                type={showConfirmarSenha ? 'text' : 'password'}
                id="confirmarSenha"
                placeholder="Confirmar nova senha:"
                className="form-control"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
              />
              <span className="input-group-text" onClick={() => setShowConfirmarSenha(s => !s)} style={{ cursor: 'pointer' }}>
                <i className={`bi ${showConfirmarSenha ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </span>
            </div>
            <button id="redefinirSenha" className="mt-3" onClick={handleRedefinirSenha}>
              Redefinir senha
            </button>
            <p className="link-container mt-3">
              <Link to="/login">Voltar ao login</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
