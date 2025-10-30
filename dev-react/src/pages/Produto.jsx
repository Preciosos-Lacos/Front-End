import React, { useState } from 'react';
import '../styles/Produto.css';
import Header from '../components/Header.jsx';
import { Link } from 'react-router-dom';
import imgPrincipal from '../assets/laco-neon-verde.webp';

export default function Produto() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [favorite, setFavorite] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const selectColor = (index) => setSelectedColorIndex(index);

  const toggleFavorite = () => setFavorite(f => !f);

  return (
    <>
      <Header />
  <main data-scroll-container className="produto-page">
        <section className="produto-container">
          {/* Imagem principal */}
          <div className="produto-imagem">
            <img src={imgPrincipal} alt="Laço Preciosos Neon" />
          </div>

          {/* Informações do produto */}
          <div className="produto-info">
            <h1 className="produto-titulo">Laço Preciosos Neon</h1>

            <div className="produto-top">
              <span className="produto-preco">R$44,97</span>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Link to="/carrinho" className="btn-add-cart">Adicionar ao carrinho</Link>
                <button
                  type="button"
                  className={`btn-fav ${favorite ? 'active' : ''}`}
                  aria-pressed={favorite}
                  onClick={toggleFavorite}
                  title={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <i className={`bi ${favorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                </button>
              </div>
            </div>

            <div className="produto-bloco">
              <h3 className="produto-subtitulo">Acabamento</h3>
              <div className="acabamento-tags">
                {['Meia de seda','Tiara','Bico de pato','Xuxa'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`tag ${selectedTags.includes(t) ? 'selected' : ''}`}
                    onClick={() => toggleTag(t)}
                    aria-pressed={selectedTags.includes(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="produto-bloco">
              <h3 className="produto-subtitulo">Cor</h3>
              <div className="cores">
                {['#39D353','#FF5A5F','#FFD400','#00C2FF','#FFFFFF','#F29DC3'].map((c, idx) => (
                  <button
                    key={c}
                    type="button"
                    className={`cor ${selectedColorIndex === idx ? 'selecionada' : ''}`}
                    style={{ background: c }}
                    onClick={() => selectColor(idx)}
                    aria-label={`Selecionar cor ${c}`}
                  />
                ))}
              </div>
            </div>

            <div className="produto-bloco">
              <h3 className="produto-subtitulo">Descrição</h3>
              <p className="produto-descricao">
                Feito com tecido de cetim ou algodão, este laço é macio e confortável. 
                Tem acabamento de costura reforçada e um laço central bem estruturado, 
                ideal para ocasiões especiais ou uso diário.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}