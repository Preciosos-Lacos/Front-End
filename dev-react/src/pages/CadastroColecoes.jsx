import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/cadastro-colecoes.css';
import Logo from '../assets/logo_preciosos_lacos.png';

/**
 * Tela "Cadastro - Coleções"
 * - grade responsiva de cards-
 * - botão "Cadastrar Coleções"
 * - busca simples
 * - editar / apagar (local state)
 *
 * Ajuste rotas (navigate) e integração com backend conforme necessário.
 */
export default function CadastroColecoes() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [colecoes, setColecoes] = useState([
    { id: 1, nome: 'São João', imagem: '/src/assets/colecao-sao-joao.webp' },
    { id: 2, nome: 'Páscoa', imagem: '/src/assets/colecao-pascoa.webp' },
    { id: 3, nome: 'Volta as Aulas', imagem: '/src/assets/colecao-volta-aulas.webp' },
    { id: 4, nome: 'Inverno', imagem: '/src/assets/colecao-inverno.webp' },
    { id: 5, nome: 'Natal', imagem: '/src/assets/colecao-natal.webp' },
    { id: 6, nome: 'Dia dos Namorados', imagem: '/src/assets/colecao-namorados.webp' },
    { id: 7, nome: 'Viagens', imagem: '/src/assets/colecao-viagens.webp' },
    { id: 8, nome: 'Halloween', imagem: '/src/assets/colecao-halloween.webp' },
  ]);

  const filtered = colecoes.filter(c =>
    c.nome.toLowerCase().includes(query.trim().toLowerCase())
  );

  function handleCreate() {
    // navegar para página de criação (implemente a rota)
    navigate('/colecoes/novo');
  }

  function handleEdit(id) {
    navigate(`/colecoes/editar/${id}`);
  }

  function handleDelete(id) {
    const item = colecoes.find(c => c.id === id);
    if (!item) return;
    if (!window.confirm(`Excluir a coleção "${item.nome}"? Esta ação é irreversível.`)) return;
    setColecoes(prev => prev.filter(c => c.id !== id));
    // aqui você pode chamar API para deletar no backend
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-top">
          <img src={Logo} alt="Preciosos Laços" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>Pedidos</li>
            <li className="has-sub">
              Cadastro
              <ul>
                <li>Modelos</li>
                <li>Cores</li>
                <li className="active">Coleções</li>
                <li>Tipos de laço</li>
              </ul>
            </li>
            <li>Dashboard</li>
          </ul>
        </nav>
        <div className="sidebar-bottom">Sair</div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Cadastro de Coleções</h1>
          <div className="header-actions">
            <button className="btn btn-primary btn-cadastrar" onClick={handleCreate}>
              Cadastrar Coleções
            </button>
            <div className="search-wrap">
              <input
                type="text"
                placeholder="Pesquisar Coleções"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="btn-search" aria-label="Pesquisar">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </header>

        <section className="colecoes-grid">
          {filtered.length === 0 ? (
            <div className="empty">Nenhuma coleção encontrada.</div>
          ) : (
            filtered.map(col => (
              <article key={col.id} className="colecao-card">
                <div className="card-img">
                  <img src={col.imagem} alt={col.nome} onError={(e) => e.currentTarget.src = '/src/assets/default-product.webp'} />
                </div>
                <div className="card-footer">
                  <div className="card-title">{col.nome}</div>
                  <div className="card-actions">
                    <button className="icon-btn edit" title="Editar" onClick={() => handleEdit(col.id)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="icon-btn delete" title="Excluir" onClick={() => handleDelete(col.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}