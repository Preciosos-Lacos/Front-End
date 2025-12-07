
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RequireAuthModal from '../components/RequireAuthModal';
import Header from '../components/Header.jsx';
import '../styles/Catalogo.css';
import { color } from 'chart.js/helpers';

const CATALOGO_API = 'http://localhost:8080/modelos/catalogo';

const Catalogo = () => {
    // Estados
    const [modelos, setModelos] = useState([]);
    const [maisVendidos, setMaisVendidos] = useState([]);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSticky, setIsSticky] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedModelo, setSelectedModelo] = useState(null);
    const filterBarRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Buscar modelos do backend
        const fetchModelos = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await fetch(CATALOGO_API);
                if (!res.ok) throw new Error('Erro ao buscar modelos do catálogo');
                const data = await res.json();
                setModelos(Array.isArray(data) ? data : []);
            } catch {
                setModelos([]);
                setError('Servidor indisponível. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };
        // Buscar mais vendidos
        const fetchMaisVendidos = async () => {
            try {
                const res = await fetch('http://localhost:8080/modelos/catalogo/maisVendidos');
                if (!res.ok) throw new Error('Erro ao buscar mais vendidos');
                const data = await res.json();
                console.log('[Mais Vendidos] Dados recebidos do backend:', data);
                setMaisVendidos(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('[Mais Vendidos] Erro ao buscar:', err);
                setMaisVendidos([]);
            }
        };
        fetchModelos();
        fetchMaisVendidos();
    }, []);

    useEffect(() => {
        // Verifica autenticação
        const token = localStorage.getItem('token');
        if (!token) setShowAuthModal(true);
        const handleScroll = () => {
            if (filterBarRef.current) {
                const rect = filterBarRef.current.getBoundingClientRect();
                const headerHeight = 86;
                setIsSticky(rect.top <= headerHeight);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Filtros reativados: filtra modelos por categoria, preço e busca
    const filteredModelos = modelos.filter((modelo) => {
        let match = true;
        if (categoryFilter && modelo.categoria !== categoryFilter) match = false;
        if (priceFilter) {
            const preco = Number(modelo.preco ?? 0);
            if (priceFilter === '20' && preco > 20) match = false;
            else if (priceFilter === '20-50' && (preco < 20 || preco > 50)) match = false;
            else if (priceFilter === '50+' && preco < 50) match = false;
        }
        if (searchQuery && !modelo.nome.toLowerCase().includes(searchQuery.toLowerCase())) match = false;
        return match;
    });

    // Funções utilitárias
    const getImage = (modelo) => modelo.fotoModelo ? `data:image/png;base64,${modelo.fotoModelo}` : '/src/assets/laco-flor.webp';
    const getName = (modelo) => (modelo.nome || '').toString();
    const getCollection = (modelo) => (modelo.colecao || modelo.nome || '').toString();
    const getPrice = (modelo) => Number(modelo.preco ?? 0);

    if (showAuthModal) {
        return <RequireAuthModal show={true} message="Você precisa estar logado para visualizar o catálogo de produtos." />;
    }
    if (loading) {
        return (
            <div className="catalogo-page">
                <Header showOffcanvas={true} />
                <main><div className="loading">Carregando...</div></main>
            </div>
        );
    }
    return (
        <div className="catalogo-page">
            <Header showOffcanvas={true} />
            <main>
                {/* Carrossel de Nossos produtos - colado ao topo */}
                <section className="promo-section" style={{ marginTop: 0, paddingTop: 0 }}>
                    <h2 style={{
                        textAlign: 'center',
                        color: '#e48ab6',
                        fontWeight: 700,
                        fontSize: '2rem',
                        letterSpacing: '1px',
                        margin: '0 0 24px 0',
                        paddingTop: '32px',
                    }}>Nossos produtos</h2>
                    <div id="nossosProdutosCarousel" className="carousel slide promo-carousel" data-bs-ride="carousel" style={{ marginBottom: '32px' }}>
                        <div className="carousel-inner">
                            {modelos.length > 0 ? (
                                modelos.slice(0, 6).map((modelo, index) => (
                                    <div key={`variedade-${modelo.idModelo ? modelo.idModelo : `${modelo.nome}-${index}`}`} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <div className="row g-3 justify-content-center" style={{ padding: '24px 0' }}>
                                            <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center" style={{ padding: '0 12px' }}>
                                                <div
                                                    className="produto-card"
                                                    style={{ color: 'black', boxShadow: 'rgba(0, 0, 0, 0.12) 0px 4px 24px', borderRadius: '16px', background: 'rgb(255, 255, 255)', padding: '10px 0px 0px 0px', margin: '0px', cursor: 'pointer' }}
                                                    onClick={() => navigate(`/produto?id=${modelo.idModelo}`)}
                                                >
                                                    <div style={{ width: '180px', height: '180px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
                                                        <img src={getImage(modelo)} alt={getName(modelo)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div className="produto-info">
                                                        <p>{getName(modelo)} - {getCollection(modelo)}</p>
                                                        <p className="produto-preco">R${getPrice(modelo).toFixed(2).replace('.', ',')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="carousel-item active">
                                    <div className="row g-3 justify-content-center" style={{ padding: '24px 0' }}>
                                        <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center" style={{ padding: '0 12px' }}>
                                            <div className="produto-card" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)', borderRadius: 16, background: '#fff', padding: 0, margin: 0, cursor: 'pointer' }} onClick={() => navigate('/produto?id=null')}>
                                                <div style={{ width: '180px', height: '180px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
                                                    <img src="/src/assets/laco_panda.webp" alt="Produto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div className="produto-info">
                                                    <p>Nossos produtos</p>
                                                    <p className="produto-preco">R$00,00</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#nossosProdutosCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#nossosProdutosCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </button>
                    </div>
                </section>
                {/* Carrossel de mais vendidos */}
                <section className="catalogo">
                    <div className="container my-3">
                        <div id="linha"></div>
                        <div ref={filterBarRef} className={`filter-bar d-none d-md-flex ${isSticky ? 'is-sticky' : ''}`}>
                            <div className="filter-selects">
                                <select id="filter-category" className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                                    <option value="">Categoria</option>
                                    <option value="laços">Laços</option>
                                    <option value="tiara">Tiara</option>
                                </select>
                                <select id="filter-price" className="form-select" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
                                    <option value="">Preço</option>
                                    <option value="20">Até R$20</option>
                                    <option value="20-50">R$20 - R$50</option>
                                    <option value="50+">Acima de R$50</option>
                                </select>
                            </div>
                            <div className="search-box">
                                <input type="text" className="form-control" placeholder="Buscar modelos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                <button className="btn btn-light"><i className="bi bi-search"></i></button>
                            </div>
                        </div>
                        <div className="search-box d-flex d-md-none">
                            <input type="text" className="form-control" placeholder="Buscar modelos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <button className="btn btn-light"><i className="bi bi-search"></i></button>
                        </div>
                        <div className="filter-mobile-btn d-md-none">
                            <button className="btn btn-dark w-100" data-bs-toggle="offcanvas" data-bs-target="#mobileFilters"><i className="bi bi-funnel"></i> Filtros</button>
                        </div>
                        <div className="offcanvas offcanvas-bottom" tabIndex="-1" id="mobileFilters" data-bs-backdrop="true">
                            <div className="offcanvas-header">
                                <h5 className="offcanvas-title">Filtros</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                            </div>
                            <div className="offcanvas-body">
                                <select id="mobile-filter-category" className="form-select mb-3" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                                    <option value="">Categoria</option>
                                    <option value="laços">Laços</option>
                                    <option value="tiara">Tiara</option>
                                </select>
                                <select id="mobile-filter-price" className="form-select mb-3" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
                                    <option value="">Preço</option>
                                    <option value="20">Até R$20</option>
                                    <option value="20-50">R$20 - R$50</option>
                                    <option value="50+">Acima de R$50</option>
                                </select>
                                <button className="btn btn-primary w-100" data-bs-dismiss="offcanvas">Aplicar</button>
                            </div>
                        </div>
                        <div id="linha"></div>
                        <h3 id="mais-vendidos">Mais Vendidos</h3>
                        <div id="maisVendidosCarousel" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                {maisVendidos.length === 0 && (
                                    <div className="carousel-item active">
                                        <div className="row g-3 justify-content-center" style={{ padding: '24px 0' }}>
                                            <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center" style={{ padding: '0 12px' }}>
                                                <div className="produto-card" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)', borderRadius: 16, background: '#fff', padding: 0, margin: 0, cursor: 'pointer' }} onClick={() => navigate('/produto?id=0')}>
                                                    <div style={{ width: '180px', height: '180px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
                                                        <img src="/src/assets/laco-flor.webp" alt="Produto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div className="produto-info">
                                                        <p>Mais vendidos</p>
                                                        <p className="produto-preco">R$00,00</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {maisVendidos.map((modelo, index) => (
                                    <div key={`vendido-${modelo.idModelo ? modelo.idModelo : `${modelo.nome}-${index}`}`} className={`carousel-item ${index === 0 && maisVendidos.length > 0 ? 'active' : ''}`}>
                                        <div className="row g-3 justify-content-center" style={{ padding: '24px 0' }}>
                                            <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center" style={{ padding: '0 12px' }}>
                                                <div
                                                    className="produto-card"
                                                    style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)', borderRadius: 16, background: '#fff', padding: 0, margin: 0, cursor: 'pointer' }}
                                                    onClick={() => navigate(`/produto?id=${modelo.idModelo}`)}
                                                >
                                                    <div style={{ width: '180px', height: '180px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
                                                        <img src={getImage(modelo)} alt={getName(modelo)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div className="produto-info">
                                                        <p>{getName(modelo)} - {getCollection(modelo)}</p>
                                                        <p className="produto-preco">R${getPrice(modelo).toFixed(2).replace('.', ',')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#maisVendidosCarousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon"></span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#maisVendidosCarousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon"></span>
                            </button>
                        </div>
                        <div id="linha"></div>
                        <h3 id="catalogo">CATÁLOGO</h3>
                        <div id="linha"></div>
                        {/* Grid de cards de modelo */}
                        <div className="card-container">
                            {filteredModelos.length > 0 ? (
                                filteredModelos.map((modelo, index) => (
                                    <div
                                        key={`card-${modelo.idModelo ? modelo.idModelo : `${modelo.nome}-${index}`}`}
                                        className="product-card"
                                        style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 4px 24px', borderRadius: '16px', background: 'rgb(255, 255, 255)', padding: '0px 0px 0px 0px', margin: '0px', cursor: 'pointer' }}
                                        onClick={() => navigate(`/produto?id=${modelo.idModelo}`)}
                                    >
                                        <div style={{ width: '180px', height: '180px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
                                            <img src={getImage(modelo)} alt={getName(modelo)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div className="card-info">
                                            <p className="product-name">{getName(modelo)} - <span className="collection">{getCollection(modelo)}</span></p>
                                            <p className="price">R${getPrice(modelo).toFixed(2).replace('.', ',')}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">
                                    <p>Nenhum modelo encontrado com os filtros selecionados.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                {/* Modal de modelo selecionado */}
                {selectedModelo && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                    }}
                        onClick={() => setSelectedModelo(null)}
                    >
                        <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 320 }} onClick={e => e.stopPropagation()}>
                            <h2>{getName(selectedModelo)}</h2>
                            <div>Preço: R$ {getPrice(selectedModelo).toFixed(2)}</div>
                            <div>Coleção: {getCollection(selectedModelo) || 'N/A'}</div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                                {selectedModelo.fotoModelo ? (
                                    <img
                                        src={`data:image/png;base64,${selectedModelo.fotoModelo}`}
                                        alt={getName(selectedModelo)}
                                        width={120}
                                        style={{ margin: 8 }}
                                    />
                                ) : (
                                    <img src={'/src/assets/laco-flor.webp'} alt={getName(selectedModelo)} width={120} style={{ margin: 8 }} />
                                )}
                            </div>
                            <button onClick={() => setSelectedModelo(null)} style={{ marginTop: 16 }}>Fechar</button>
                        </div>
                    </div>
                )}
                {/* Footer */}
                <footer style={{
                    width: '100%',
                    backgroundColor: '#b15d7b',
                    // background: 'linear-gradient(90deg, #f29dc3 0%, #a7c7e7 100%)',
                    color: '#fff',
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
                            <span style={{ fontSize: 14, color: '#fff' }}>CNPJ: 33.970.501/0001-50</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 220, textAlign: 'center', margin: '12px 0' }}>
                            <a href="https://www.instagram.com/preciososlacosbycamilaosterman/" target="_blank" rel="noopener noreferrer" style={{ margin: '0 8px', color: '#fff', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="#fff" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                                </svg>
                                Instagram
                            </a>
                            <a href="mailto:contato@preciososlacos.com.br" style={{ margin: '0 8px', color: '#fff', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" fill="#fff" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                E-mail
                            </a>
                        </div>
                        <div style={{ flex: 1, minWidth: 220, textAlign: 'right' }}>
                            <span style={{ fontSize: 14, color: '#fff' }}>© {new Date().getFullYear()} Preciosos Laços. Todos os direitos reservados.</span>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Catalogo;