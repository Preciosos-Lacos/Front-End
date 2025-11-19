import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import '../styles/Catalogo.css';

const API = 'http://localhost:8080/produtos';

const Catalogo = () => {
    const [categoryFilter, setCategoryFilter] = useState('');
    const [colorFilter, setColorFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSticky, setIsSticky] = useState(false);
    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [promotionalProducts, setPromotionalProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const filterBarRef = useRef(null);

    useEffect(() => {
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

    // Busca produtos filtrados do backend sempre que filtros mudam
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError('');
                // Monta query string dos filtros
                const params = new URLSearchParams();
                if (categoryFilter) params.append('categoria', categoryFilter);
                if (colorFilter) params.append('cor', colorFilter);
                if (priceFilter) {
                    if (priceFilter === '20') {
                        params.append('precoMax', '20');
                    } else if (priceFilter === '20-50') {
                        params.append('precoMin', '20');
                        params.append('precoMax', '50');
                    } else if (priceFilter === '50+') {
                        params.append('precoMin', '50');
                    }
                }
                if (searchQuery) params.append('search', searchQuery);
                const [allRes, featRes, promoRes] = await Promise.all([
                    fetch(`${API}?${params.toString()}`),
                    fetch(`${API}/destaques`),
                    fetch(`${API}/promocoes`),
                ]);
                let productsData = [];
                if (allRes.ok) {
                    productsData = await allRes.json();
                }
                setProducts(Array.isArray(productsData) ? productsData : []);
                if (featRes.ok) {
                    setFeaturedProducts(await featRes.json());
                }
                if (promoRes.ok) {
                    setPromotionalProducts(await promoRes.json());
                }
            } catch (err) {
                setError('Servidor indisponível. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryFilter, colorFilter, priceFilter, searchQuery]);

    // Funções utilitárias para extrair dados do ProdutoDTO
    const getName = (product) => (product.nome || '').toString();
    const getCollection = (product) => (product.categoria?.nome || '').toString();
    const getColor = (product) => (product.cor || '').toString();
    const getPrice = (product) => Number(product.preco ?? 0);
    const getImage = (product) => product.imagens?.[0]?.urlImagem || '/src/assets/default-product.webp';

    // Produtos já vêm filtrados do backend
    const filteredProducts = products;

    if (loading) {
        return (
            <div className="catalogo-page">
                <Header showOffcanvas={true} />
                <main data-scroll-container>
                    <div className="loading-container">
                        <div className="spinner-border text-pink" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                        <p className="loading-text">Carregando produtos...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="catalogo-page">
            <Header showOffcanvas={true} />
            <main data-scroll-container>
                {error && (
                    <div className="container mt-3">
                        <div className="alert alert-warning" role="alert">
                            <i className="bi bi-exclamation-triangle-fill"></i>
                            <span style={{ marginLeft: 8 }}>{error}</span>
                            <button className="btn btn-sm btn-outline-secondary ms-3" onClick={() => window.location.reload()}>
                                Tentar Novamente
                            </button>
                        </div>
                    </div>
                )}
                <section className="promo-section">
                    <h2>Promoções atuais</h2>
                    {promotionalProducts.length > 0 ? (
                        <div id="promoCarousel" className="carousel slide promo-carousel" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                {promotionalProducts.map((product, index) => (
                                    <div key={product.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <div className="row g-3 justify-content-center">
                                            <div className="col-12 col-sm-6 col-md-4">
                                                <img 
                                                    src={getImage(product)} 
                                                    className="d-block rounded" 
                                                    alt={getName(product)} 
                                                />
                                                <p className="promo-caption text-center">{getName(product)} em promoção!</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#promoCarousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon"></span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#promoCarousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon"></span>
                            </button>
                        </div>
                    ) : (
                        <div className="no-promotions">
                            <p>Nenhuma promoção disponível no momento.</p>
                        </div>
                    )}
                </section>

                <section className="catalogo">
                    <div className="container my-3">
                        <div
                            ref={filterBarRef}
                            className={`filter-bar d-none d-md-flex ${isSticky ? 'is-sticky' : ''}`}
                        >
                            <div className="filter-selects">
                                <select
                                    id="filter-category"
                                    className="form-select"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="">Categoria</option>
                                    <option value="neon">Neon</option>
                                    <option value="tradicionais">Tradicionais</option>
                                    <option value="especiais">Especiais</option>
                                    <option value="barbie">Barbie</option>
                                    <option value="escolares">Escolares</option>
                                </select>
                                <select
                                    id="filter-color"
                                    className="form-select"
                                    value={colorFilter}
                                    onChange={(e) => setColorFilter(e.target.value)}
                                >
                                    <option value="">Cor</option>
                                    <option value="vermelho">Vermelho</option>
                                    <option value="azul">Azul</option>
                                    <option value="verde">Verde</option>
                                    <option value="rosa">Rosa</option>
                                </select>
                                <select
                                    id="filter-price"
                                    className="form-select"
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(e.target.value)}
                                >
                                    <option value="">Preço</option>
                                    <option value="20">Até R$20</option>
                                    <option value="20-50">R$20 - R$50</option>
                                    <option value="50+">Acima de R$50</option>
                                </select>
                            </div>
                            <div className="search-box">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar produtos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="btn btn-light">
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </div>
                        <div className="search-box d-flex d-md-none">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar produtos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="btn btn-light">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                        <div className="filter-mobile-btn d-md-none">
                            <button className="btn btn-dark w-100" data-bs-toggle="offcanvas" data-bs-target="#mobileFilters">
                                <i className="bi bi-funnel"></i> Filtros
                            </button>
                        </div>
                        <div className="offcanvas offcanvas-bottom" tabIndex="-1" id="mobileFilters">
                            <div className="offcanvas-header">
                                <h5 className="offcanvas-title">Filtros</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                            </div>
                            <div className="offcanvas-body">
                                <select
                                    className="form-select mb-3"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="">Categoria</option>
                                    <option value="neon">Neon</option>
                                    <option value="tradicionais">Tradicionais</option>
                                    <option value="especiais">Especiais</option>
                                    <option value="barbie">Barbie</option>
                                    <option value="escolares">Escolares</option>
                                </select>
                                <select
                                    className="form-select mb-3"
                                    value={colorFilter}
                                    onChange={(e) => setColorFilter(e.target.value)}
                                >
                                    <option value="">Cor</option>
                                    <option value="vermelho">Vermelho</option>
                                    <option value="azul">Azul</option>
                                    <option value="verde">Verde</option>
                                    <option value="rosa">Rosa</option>
                                </select>
                                <select
                                    className="form-select mb-3"
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(e.target.value)}
                                >
                                    <option value="">Preço</option>
                                    <option value="20">Até R$20</option>
                                    <option value="20-50">R$20 - R$50</option>
                                    <option value="50+">Acima de R$50</option>
                                </select>
                                <button className="btn btn-primary w-100" data-bs-dismiss="offcanvas">
                                    Aplicar
                                </button>
                            </div>
                        </div>
                        <div id="linha"></div>
                        <h3 id="catalogo">CATÁLOGO</h3>
                        <div id="linha"></div>
                        <div className="card-container">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product, index) => (
                                    <div key={product.id || index} className="card-item">
                                        <img 
                                            src={getImage(product)} 
                                            alt={getName(product)} 
                                            className="card-image" 
                                        />
                                        <div className="card-content">
                                            <h3 className="card-title">{getName(product)}</h3>
                                            <p className="card-collection">{getCollection(product)}</p>
                                            <p className="card-color">Cor: {getColor(product) || 'N/A'}</p>
                                            <p className="card-price">R${getPrice(product).toFixed(2).replace('.', ',')}</p>
                                            <Link
                                                to={`/produto${product.id ? `?id=${product.id}` : ''}`}
                                                className="btn btn-primary btn-sm"
                                                onClick={() => setSelectedProduct(product)}
                                            >
                                                Ver Produto
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">
                                    <p>Nenhum produto encontrado com os filtros selecionados.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                {selectedProduct && (
                    <div style={{
                      position:'fixed',top:0,left:0,right:0,bottom:0,
                      background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999
                    }}
                      onClick={() => setSelectedProduct(null)}
                    >
                      <div style={{background:'#fff',padding:32,borderRadius:8,minWidth:320}} onClick={e => e.stopPropagation()}>
                        <h2>{getName(selectedProduct)}</h2>
                        <div>Preço: R$ {getPrice(selectedProduct).toFixed(2)}</div>
                        <div>Cor: {getColor(selectedProduct) || 'N/A'}</div>
                        <div>Categoria: {getCollection(selectedProduct) || 'N/A'}</div>
                        <div style={{display:'flex',gap:8,marginTop:16}}>
                          {selectedProduct.imagens && selectedProduct.imagens.length > 0 ? (
                            selectedProduct.imagens.map((img, idx) => (
                              <img key={idx} src={img.urlImagem} alt={getName(selectedProduct)} width={120} style={{margin:8}} />
                            ))
                          ) : (
                            <img src={'/src/assets/default-product.webp'} alt={getName(selectedProduct)} width={120} style={{margin:8}} />
                          )}
                        </div>
                        <button onClick={() => setSelectedProduct(null)} style={{marginTop:16}}>Fechar</button>
                      </div>
                    </div>
                  )}
            </main>
        </div>
    );
};

export default Catalogo;