import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import '../styles/Catalogo.css';

const Catalogo = () => {
    const SERVER_ENABLED = (import.meta.env.VITE_ENABLE_CATALOG_SERVER === 'true');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [colorFilter, setColorFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSticky, setIsSticky] = useState(false);
    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [promotionalProducts, setPromotionalProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    // Fetch products from backend (raw fetch). If server is disabled or fails,
    // fall back to local `productos` array so the catalog never breaks.
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                if (!SERVER_ENABLED) {
                    // server disabled by env flag — use local products
                    setProducts(productos);
                    setFeaturedProducts(productos.slice(0, 6));
                    setPromotionalProducts(productos.slice(6, 9));
                    return;
                }

                const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
                const [allRes, featRes, promoRes] = await Promise.all([
                    fetch(`${BASE}/produtos`).catch(() => ({ ok: false })),
                    fetch(`${BASE}/produtos/destaques`).catch(() => ({ ok: false })),
                    fetch(`${BASE}/produtos/promocoes`).catch(() => ({ ok: false })),
                ]);

                let productsData = [];
                if (allRes && allRes.ok) {
                    const body = await allRes.json();
                    productsData = Array.isArray(body) ? body : (body?.content || []);
                }

                // if server returned nothing, fallback to local
                if (!productsData || productsData.length === 0) {
                    setProducts(productos);
                } else {
                    setProducts(productsData);
                }

                if (featRes && featRes.ok) {
                    const featuredData = await featRes.json();
                    setFeaturedProducts(Array.isArray(featuredData) ? featuredData : (featuredData?.content || []));
                } else {
                    setFeaturedProducts(productos.slice(0, 6));
                }

                if (promoRes && promoRes.ok) {
                    const promotionalData = await promoRes.json();
                    setPromotionalProducts(Array.isArray(promotionalData) ? promotionalData : (promotionalData?.content || []));
                } else {
                    setPromotionalProducts(productos.slice(6, 9));
                }
                
            } catch (err) {
                console.error('Error fetching products:', err);
                // Non-blocking error — show a warning but keep the local catalog
                setError('Servidor indisponível. Exibindo catálogo offline.');
                setProducts(productos);
                setFeaturedProducts(productos.slice(0, 6));
                setPromotionalProducts(productos.slice(6, 9));
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const productos = [
        {
            id: 1,
            image: '/src/assets/laco-neon-verde.webp',
            name: 'Laço Preciosos Neon',
            collection: 'COLEÇÃO NEON',
            price: 16.70
        },
        {
            id: 2,
            image: '/src/assets/laco-neon-estrass.webp',
            name: 'Laço Neon Strass',
            collection: 'COLEÇÃO NEON',
            price: 18.00
        },
        {
            id: 3,
            image: '/src/assets/laco-neon-glitter.webp',
            name: 'Laço Neon Glitter',
            collection: 'COLEÇÃO NEON',
            price: 21.90
        },
        {
            id: 4,
            image: '/src/assets/laco-neon-cinza.webp',
            name: 'Laço Neon Vibes',
            collection: 'COLEÇÃO NEON',
            price: 15.00
        },
        {
            id: 5,
            image: '/src/assets/laco-mia-neon.webp',
            name: 'Laço Mia Neon',
            collection: 'COLEÇÃO NEON',
            price: 23.70
        },
        {
            id: 6,
            image: '/src/assets/laco-neon-branco.webp',
            name: 'Laço pompom Neon',
            collection: 'COLEÇÃO NEON',
            price: 20.00
        },
        {
            id: 7,
            image: '/src/assets/laco-kit-6.webp',
            name: 'Kit 6 laços multicolorido',
            collection: 'COLEÇÃO TRADICIONAIS',
            price: 52.20
        },
        {
            id: 8,
            image: '/src/assets/laco-kit-borboleta.webp',
            name: 'Kit 5 laços Borboleta',
            collection: 'COLEÇÃO TRADICIONAIS',
            price: 37.90
        },
        {
            id: 9,
            image: '/src/assets/laco-kit-duplo.webp',
            name: 'Kit laço Duplo Pompom',
            collection: 'COLEÇÃO ESPECIAIS',
            price: 39.90
        },
        {
            id: 10,
            image: '/src/assets/laco-kit-escolar.webp',
            name: 'Kit 5 laços Escolares',
            collection: 'COLEÇÃO ESCOLARES',
            price: 82.30
        },
        {
            id: 11,
            image: '/src/assets/laco-kit-12.webp',
            name: 'Kit 6 pares de laços multicoloridos',
            collection: 'COLEÇÃO TRADICIONAIS',
            price: 67.90
        },
        {
            id: 12,
            image: '/src/assets/laco-kit-unicornio.webp',
            name: 'Kit 3 laços Unicornio',
            collection: 'COLEÇÃO ESPECIAIS',
            price: 49.90
        },
        {
            id: 13,
            image: '/src/assets/laco-bolinha.webp',
            name: 'Laço Bolinha',
            collection: 'COLEÇÃO TRADICIONAIS',
            price: 44.97
        },
        {
            id: 14,
            image: '/src/assets/laco-escolar-pompom.webp',
            name: 'Laço Escolar Pompom',
            collection: 'COLEÇÃO ESCOLAR',
            price: 18.90
        },
        {
            id: 15,
            image: '/src/assets/laco-flor.webp',
            name: 'Laço Flor',
            collection: 'COLEÇÃO ESPECIAIS',
            price: 29.90
        },
        {
            id: 16,
            image: '/src/assets/laco-tricolor-escolar.webp',
            name: 'Laço Tricolor Escolar',
            collection: 'COLEÇÃO ESPECIAIS',
            price: 27.90
        },
        {
            id: 17,
            image: '/src/assets/laco-barbie-glam.webp',
            name: 'Laço Barbie Glam',
            collection: 'COLEÇÃO BARBIE',
            price: 23.00
        },
        {
            id: 18,
            image: '/src/assets/laco-barbie.webp',
            name: 'Laço Barbie Lollipop',
            collection: 'COLEÇÃO BARBIE',
            price: 18.00
        }
    ];

    const getName = (product) => ((product.nome || product.name) || '').toString().toLowerCase();
    const getCollection = (product) => ((product.categoria?.nome) || product.collection || '').toString().toLowerCase();
    const getColor = (product) => ((product.cor || product.color) || '').toString().toLowerCase();
    const getPrice = (product) => Number(product.preco ?? product.price ?? 0);

    const filterProducts = () => {
        return products.filter(product => {
            const name = getName(product);
            const collection = getCollection(product);
            const cor = getColor(product);

            let show = true;

            if (categoryFilter && !collection.includes(categoryFilter.toLowerCase())) show = false;
            if (colorFilter && !cor.includes(colorFilter.toLowerCase()) && !name.includes(colorFilter.toLowerCase())) show = false;
            if (searchQuery && !name.includes(searchQuery.toLowerCase()) && !collection.includes(searchQuery.toLowerCase())) show = false;

            const price = getPrice(product);
            if (priceFilter) {
                if (priceFilter === "20" && price > 20) show = false;
                if (priceFilter === "20-50" && (price < 20 || price > 50)) show = false;
                if (priceFilter === "50+" && price < 50) show = false;
            }

            return show;
        });
    };

    const filteredProducts = filterProducts();

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

    // Do not return on error; show a non-blocking alert and continue with local data

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
                                                    src={product.imagens?.[0]?.urlImagem || product.image || '/src/assets/default-product.webp'} 
                                                    className="d-block rounded" 
                                                    alt={product.nome || product.name} 
                                                />
                                                <p className="promo-caption text-center">{(product.nome || product.name)} em promoção!</p>
                                            </div>
                                            {promotionalProducts[index + 1] && (
                                                <div className="col-12 col-sm-6 col-md-4 d-none d-sm-block">
                                                    <img 
                                                        src={promotionalProducts[index + 1].imagens?.[0]?.urlImagem || promotionalProducts[index + 1].image || '/src/assets/default-product.webp'} 
                                                        className="d-block rounded" 
                                                        alt={promotionalProducts[index + 1].nome || promotionalProducts[index + 1].name} 
                                                    />
                                                    <p className="promo-caption text-center">{(promotionalProducts[index + 1].nome || promotionalProducts[index + 1].name)} especial!</p>
                                                </div>
                                            )}
                                            {promotionalProducts[index + 2] && (
                                                <div className="col-12 col-sm-6 col-md-4 d-none d-md-block">
                                                    <img 
                                                        src={promotionalProducts[index + 2].imagens?.[0]?.urlImagem || promotionalProducts[index + 2].image || '/src/assets/default-product.webp'} 
                                                        className="d-block rounded" 
                                                        alt={promotionalProducts[index + 2].nome || promotionalProducts[index + 2].name} 
                                                    />
                                                    <p className="promo-caption text-center">{(promotionalProducts[index + 2].nome || promotionalProducts[index + 2].name)} tendência!</p>
                                                </div>
                                            )}
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

                        <div id="catalogoCarousel" className="carousel slide" data-bs-ride="carousel">
                            <h2 id="carrossel-catalogo">Mais Vendidos</h2>
                            {featuredProducts.length > 0 ? (
                                <div className="carousel-inner">
                                    {featuredProducts.map((product, index) => (
                                        <div key={product.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                            <div className="row g-3">
                                                <div className="col-12 col-sm-6 col-md-4">
                                                    <div className="produto-card">
                                                            <img 
                                                                src={product.imagens?.[0]?.urlImagem || product.image || '/src/assets/default-product.webp'} 
                                                                alt={product.nome || product.name} 
                                                            />
                                                            <div className="produto-info">
                                                                <p>{(product.nome || product.name)} - {product.categoria?.nome || product.collection || 'Coleção'}</p>
                                                                <p className="produto-preco">R${(product.preco ?? product.price)?.toFixed(2).replace('.', ',')}</p>
                                                            </div>
                                                    </div>
                                                </div>
                                                {featuredProducts[index + 1] && (
                                                    <div className="col-12 col-sm-6 col-md-4 d-none d-sm-block">
                                                        <div className="produto-card">
                                                            <img 
                                                                src={featuredProducts[index + 1].imagens?.[0]?.urlImagem || featuredProducts[index + 1].image || '/src/assets/default-product.webp'} 
                                                                alt={featuredProducts[index + 1].nome || featuredProducts[index + 1].name} 
                                                            />
                                                            <div className="produto-info">
                                                                <p>{(featuredProducts[index + 1].nome || featuredProducts[index + 1].name)} - {featuredProducts[index + 1].categoria?.nome || featuredProducts[index + 1].collection || 'Coleção'}</p>
                                                                <p className="produto-preco">R${(featuredProducts[index + 1].preco ?? featuredProducts[index + 1].price)?.toFixed(2).replace('.', ',')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {featuredProducts[index + 2] && (
                                                    <div className="col-12 col-sm-6 col-md-4 d-none d-md-block">
                                                        <div className="produto-card">
                                                            <img 
                                                                src={featuredProducts[index + 2].imagens?.[0]?.urlImagem || featuredProducts[index + 2].image || '/src/assets/default-product.webp'} 
                                                                alt={featuredProducts[index + 2].nome || featuredProducts[index + 2].name} 
                                                            />
                                                            <div className="produto-info">
                                                                <p>{(featuredProducts[index + 2].nome || featuredProducts[index + 2].name)} - {featuredProducts[index + 2].categoria?.nome || featuredProducts[index + 2].collection || 'Coleção'}</p>
                                                                <p className="produto-preco">R${(featuredProducts[index + 2].preco ?? featuredProducts[index + 2].price)?.toFixed(2).replace('.', ',')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-featured-products">
                                    <p>Nenhum produto em destaque no momento.</p>
                                </div>
                            )}
                            <button className="carousel-control-prev" type="button" data-bs-target="#catalogoCarousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon"></span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#catalogoCarousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon"></span>
                            </button>
                        </div>

                        <div className="card-container">
                            {loading ? (
                                <div className="loading-container">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Carregando...</span>
                                    </div>
                                    <p>Carregando produtos...</p>
                                </div>
                            ) : error ? (
                                <div className="error-container">
                                    <div className="alert alert-danger">
                                        <p>Erro ao carregar produtos: {error}</p>
                                        <button className="btn btn-danger" onClick={() => window.location.reload()}>
                                            Tentar Novamente
                                        </button>
                                    </div>
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product, index) => (
                                    <div key={product.id || index} className="card-item">
                                        <img 
                                            src={product.imagens?.[0]?.urlImagem || product.image || '/src/assets/default-product.webp'} 
                                            alt={product.nome || product.name} 
                                            className="card-image" 
                                        />
                                        <div className="card-content">
                                            <h3 className="card-title">{product.nome || product.name}</h3>
                                            <p className="card-collection">{product.categoria?.nome || product.collection}</p>
                                            <p className="card-price">R${(product.preco || product.price)?.toFixed(2).replace('.', ',')}</p>
                                            <button className="btn btn-primary btn-sm">Ver Produto</button>
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
            </main>
        </div>
    );
};

export default Catalogo;