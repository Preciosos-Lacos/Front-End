import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/BannerHome.css';

const BannerHome = () => {
  const [bannerAtivo, setBannerAtivo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBannerAtivo() {
      try {
        // Novo endpoint retorna só o banner ativo
        const res = await axios.get('/api/banners/ativo');
        setBannerAtivo(res.data);
      } catch (err) {
        setError('Erro ao buscar banner ativo');
      } finally {
        setLoading(false);
      }
    }
    fetchBannerAtivo();
  }, []);

  if (loading) return null;
  if (error || !bannerAtivo) return null;

  return (
    <section className="home-banner">
      <div className="home-banner__container">
        <Link to={bannerAtivo.link || "/catalogo"} className="home-banner__link" aria-label={bannerAtivo.titulo || "Ver catálogo"}>
          <img src={bannerAtivo.imagemUrl} alt={bannerAtivo.titulo || "Banner destaque"} className="home-banner__image" />
        </Link>
      </div>
    </section>
  );
};

export default BannerHome;
