import React from 'react';
import './CatalogoHome.css';

import lacoAzul from '../assets/laco-azul.webp';
import unicornio from '../assets/laco-kit-unicornio.webp';
import barbie from '../assets/laco-barbie-detalhado.jpg';
import panda from '../assets/laco-panda.webp';

const produtos = [
  { id: 1, nome: 'Laço Azul', colecao: 'COLEÇÃO TRADICIONAIS', preco: 'R$ 34,90', desconto: '-15%', img: lacoAzul },
  { id: 2, nome: 'Kit Laços Unicórnio', colecao: 'COLEÇÃO UNICÓRNIO', preco: 'R$ 59,99', img: unicornio },
  { id: 3, nome: 'Laço Barbie Detalhado', colecao: 'COLEÇÃO BARBIE', preco: 'R$ 44,90', img: barbie },
  { id: 4, nome: 'Laço Panda', colecao: 'COLEÇÃO PANDA', preco: 'R$ 44,90', img: panda },
];

const CatalogoPreview = () => {
  return (
    <section id="catalogo" className="catalogo-preview">
      <div className="catalogo-preview__header">
        <h2>Alguns de nossos produtos</h2>
        <a href="#catalogo" className="btn-ver-mais">Ver catálogo</a>
      </div>

      <div className="catalogo-preview__grid">
        {produtos.map((p) => (
          <a key={p.id} href="#catalogo" className="produto-card" aria-label={`Ver ${p.nome}`}>
            <div className="produto-card__image-wrap">
              <img src={p.img} alt={p.nome} />
              {p.desconto && <span className="badge-desconto">{p.desconto}</span>}
            </div>
            <div className="produto-card__info">
              <p className="produto-card__title">{p.nome} <br /> <i>{p.colecao}</i></p>
              <span className="produto-card__price">{p.preco}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CatalogoPreview;
