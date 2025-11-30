
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomeUsuario.css';
import '../styles/BannerHome.css';
import HeaderHome from '../components/HeaderHome.jsx';
import QuemSouEu from '../components/QuemSouEu';
import { useEffect, useState } from 'react';

// Componente para embed do Instagram
function InstagramEmbed({ url, style = {} }) {
  React.useEffect(() => {
    // Remove script antigo se existir
    const oldScript = document.getElementById('instagram-embed-script');
    if (oldScript) {
      oldScript.remove();
    }
    // Adiciona script novo
    const script = document.createElement('script');
    script.id = 'instagram-embed-script';
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
    // Processa embeds após carregar
    script.onload = () => {
      window.instgrm?.Embeds?.process();
    };
  }, [url]);
  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{
        background: '#FFF',
        border: 0,
        margin: '0 auto',
        maxWidth: 280,
        minWidth: 220,
        width: 300,
        height: 540,
        boxSizing: 'border-box',
        padding: 0,
        display: 'block',
        ...style
      }}
    />
  );
}
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

export default function Home() {
  const [bannerUrl, setBannerUrl] = useState('');
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [bannerError, setBannerError] = useState('');

  useEffect(() => {
    setLoadingBanner(true);
    fetch(`${API_BASE}/banners/ativo/home`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.imagemUrl) {
          // Se começa com /uploads, monta URL absoluta
          if (data.imagemUrl.startsWith('/uploads')) {
            setBannerUrl(`${API_BASE}${data.imagemUrl}`);
          } else {
            setBannerUrl(data.imagemUrl);
          }
        } else {
          setBannerUrl('');
        }
      })
      .catch(() => {
        setBannerError('Erro ao carregar banner.');
      })
      .finally(() => setLoadingBanner(false));
  }, []);

  if (loadingBanner) {
    return (
      <div className="home-page">
        <HeaderHome />
        <main data-scroll-container>
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p>Carregando banner...</p>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div>
      <HeaderHome />
      <main data-scroll-container>
        {/* ...existing code... */}
        <section
          className="banner"
          style={{
            width: '100%',
            minHeight: 'calc(56vh + 85px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: `url(${bannerUrl || banner}) center center / cover no-repeat`,
            borderRadius: 16,
            position: 'relative',
            overflow: 'hidden',
            transition: 'background-image 0.2s',
          }}
        >
          <div className="banner-content" style={{ width: '100%', maxWidth: 1200, margin: '0 auto', zIndex: 2, height: '100%' }}>
            <Link
              to="/catalogo"
              style={{
                display: 'block',
                width: '100%',
                height: 'calc(52vh + 80px)',
                minHeight: 180,
                maxHeight: 540,
                textDecoration: 'none',
                position: 'relative',
              }}
              aria-label="Ir para catálogo"
            >
              {/* Conteúdo do banner/link pode ser adicionado aqui, se necessário */}
            </Link>
            {bannerError && <div style={{ color: '#e57373', marginTop: 8 }}>{bannerError}</div>}
          </div>
        </section>

        <section id="instagram" className="instagram-embed-section container" style={{ marginTop: 32, alignContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: 30, marginBottom: 24, color: 'var(--color-primary, #BC6686)'}}>
            Um pouco do nosso trabalho!
            </h2>
        <div className="instagram-embed-container" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <InstagramEmbed url="https://www.instagram.com/p/DMWU_WINZxU/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" />
          <InstagramEmbed url="https://www.instagram.com/p/DMWT3JRNYfM/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" />
          <InstagramEmbed url="https://www.instagram.com/p/DJ6_Oi4tp0I/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" />
        </div>
        <a href="https://www.instagram.com/preciososlacosbycamilaosterman/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
          <button className="btn-rosa bold" style={{ height: 50, fontSize: 18, padding: '0 24px', borderRadius: 12, display: 'flex', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: 8 }}>
              {/* SVG logo do Instagram */}
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="#b15d7b" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
              </svg>
            </span>
            Veja mais!
          </button>
        </a>
      </section>
      <section style={{ paddingTop: 24 }}>
        <QuemSouEu />
      </section>
    </main>
      {/* Footer */ }
  <footer style={{
    width: '100%',
    background: 'linear-gradient(90deg, #f29dc3 0%, #a7c7e7 100%)',
    color: '#333',
    padding: '32px 0 16px 0',
    marginTop: 48,
    textAlign: 'center',
    fontSize: 16,
    boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
  }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
      <div style={{ flex: 1, minWidth: 220, textAlign: 'left' }}>
        <strong>Preciosos Laços by Camila Osterman</strong><br />
        <span>Laços, acessórios e carinho para todas as idades.</span><br />
        <span style={{ fontSize: 14, color: '#555' }}>CNPJ: 33.970.501/0001-50</span>
      </div>
      <div style={{ flex: 1, minWidth: 220, textAlign: 'center', margin: '12px 0' }}>
        <a href="https://www.instagram.com/preciososlacosbycamilaosterman/" target="_blank" rel="noopener noreferrer" style={{ margin: '0 8px', color: '#9d4e6aff', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9d4e6aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="#fff" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
          </svg>
          Instagram
        </a>
        <a href="mailto:contato@preciososlacos.com.br" style={{ margin: '0 8px', color: '#333', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" fill="#fff" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          E-mail
        </a>
      </div>
      <div style={{ flex: 1, minWidth: 220, textAlign: 'right' }}>
        <span style={{ fontSize: 14, color: '#555' }}>© {new Date().getFullYear()} Preciosos Laços. Todos os direitos reservados.</span>
      </div>
    </div>
  </footer>
    </div >
  );
}
