import React, { useState } from 'react';
import Header from './Header.jsx';
import './perfil.css';
import camilaImg from '../assets/camila_osterman.jpg';

export default function Perfil() {
  const [campos, setCampos] = useState({
    nome: 'Camila Osterman',
    telefone: '(11) 91234-5678',
    cpf: '123.456.789-00',
    email: 'camila@email.com',
    senha: '********',
  });

  const [editando, setEditando] = useState({
    nome: false,
    telefone: false,
    cpf: false,
    email: false,
    senha: false,
  });

  const handleEdit = (campo) => {
    setEditando({ ...editando, [campo]: true });
  };

  const handleChange = (e) => {
    setCampos({ ...campos, [e.target.name]: e.target.value });
  };

  const handleBlur = (campo) => {
    setEditando({ ...editando, [campo]: false });
  };

  return (
    <main>
            <Header showOffcanvas={true} />
      <section className="perfil-section">
        <div className="foto-container">
         <img src={camilaImg} className="foto-perfil" alt="Foto de perfil" /> 
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
              onBlur={() => handleBlur('nome')}
            />
            <i className="bi bi-pencil-fill" onClick={() => handleEdit('nome')}></i>
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
              onBlur={() => handleBlur('telefone')}
            />
            <i className="bi bi-pencil-fill" onClick={() => handleEdit('telefone')}></i>
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
              onBlur={() => handleBlur('cpf')}
            />
            <i className="bi bi-pencil-fill" onClick={() => handleEdit('cpf')}></i>
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
              onBlur={() => handleBlur('email')}
            />
            <i className="bi bi-pencil-fill" onClick={() => handleEdit('email')}></i>
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
              onBlur={() => handleBlur('senha')}
            />
            <i className="bi bi-pencil-fill" onClick={() => handleEdit('senha')}></i>
          </div>
        </div>
      </section>
    </main>
  );
}