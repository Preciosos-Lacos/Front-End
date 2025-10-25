import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/esqueciSenha.css';
import logo from '../assets/logo_preciosos_lacos.png';

export default function EsqueciSenha() {
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
      const url = `http://localhost:3000/users?email=${encodeURIComponent(email)}`;
      const response = await fetch(url);
      if (response.ok) {
        const users = await response.json();
        if (users.length > 0) {
          const userId = users[0].id;
          const updateUrl = `http://localhost:3000/users/${userId}`;
          const updateResponse = await fetch(updateUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senha: novaSenha })
          });
          if (updateResponse.ok) {
            alert('Senha redefinida com sucesso! Faça login com sua nova senha.');
            window.location.href = '/login';
          } else {
            alert('Erro ao atualizar a senha. Tente novamente.');
          }
        } else {
          alert('E-mail não encontrado.');
        }
      } else {
        alert('Erro ao buscar usuário.');
      }
    } catch (error) {
      alert('Ocorreu um erro. Tente novamente.');
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
