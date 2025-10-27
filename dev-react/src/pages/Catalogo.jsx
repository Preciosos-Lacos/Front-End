import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import '../styles/Catalogo.css';

const Catalogo = () => {
    const [categoryFilter, setCategoryFilter] = useState('');
    const [colorFilter, setColorFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSticky, setIsSticky] = useState(false);
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

    const filterProducts = () => {
        return productos.filter(product => {
            const name = product.name.toLowerCase();
            const collection = product.collection.toLowerCase();

            let show = true;

            if (categoryFilter && !collection.includes(categoryFilter.toLowerCase())) show = false;
            if (colorFilter && !name.includes(colorFilter.toLowerCase())) show = false;
            if (searchQuery && !name.includes(searchQuery.toLowerCase())) show = false;

            if (priceFilter) {
                if (priceFilter === "20" && product.price > 20) show = false;
                if (priceFilter === "20-50" && (product.price < 20 || product.price > 50)) show = false;
                if (priceFilter === "50+" && product.price < 50) show = false;
            }

            return show;
        });
    };

    const filteredProducts = filterProducts();

    return (
        <div className="catalogo-page">
            <Header showOffcanvas={true} />

            <main data-scroll-container>
                <section className="promo-section">
                    <h2>Promoções atuais</h2>
                    <div id="promoCarousel" className="carousel slide promo-carousel" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="row g-3 justify-content-center">
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <img src="/src/assets/laco-panda.webp" className="d-block rounded" alt="Laço Panda" />
                                        <p className="promo-caption text-center">Laço Panda em promoção!</p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 d-none d-sm-block">
                                        <img src="/src/assets/laco-unicornio.webp" className="d-block rounded" alt="Laço Unicórnio" />
                                        <p className="promo-caption text-center">Laço Unicórnio especial!</p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 d-none d-md-block">
                                        <img src="/src/assets/laco-jeans.webp" className="d-block rounded" alt="Laço Jeans" />
                                        <p className="promo-caption text-center">Laço Jeans tendência!</p>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="row g-3 justify-content-center">
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <img src="/src/assets/laco-pink.webp" className="d-block rounded" alt="Laço Pink" />
                                        <p className="promo-caption text-center">Laço Pink especial!</p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 d-none d-sm-block">
                                        <img src="/src/assets/laco-azul.webp" className="d-block rounded" alt="Laço Azul" />
                                        <p className="promo-caption text-center">Laço Azul tendência!</p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 d-none d-md-block">
                                        <img src="/src/assets/laco-neon-frutinhas.webp" className="d-block rounded" alt="Laço Neon Verde" />
                                        <p className="promo-caption text-center">Laço Neon Verde promoção!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#promoCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#promoCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </button>
                    </div>
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
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="row g-3">
                                        <div className="col-12 col-sm-6 col-md-4">
                                            <div className="produto-card">
                                                <img src="/src/assets/kit-xuxinhas.jpg" alt="Produto" />
                                                <div className="produto-info">
                                                    <p>Kit Laços xuxinha - Coleção Tradicionais</p>
                                                    <p className="produto-preco">R$22,50</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6 col-md-4 d-none d-sm-block">
                                            <div className="produto-card">
                                                <img src="/src/assets/laco-faixinhas.jpg" alt="Produto" />
                                                <div className="produto-info">
                                                    <p>Laços em Faixa - Coleção Tradicionais</p>
                                                    <p className="produto-preco">R$25,90</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6 col-md-4 d-none d-md-block">
                                            <div className="produto-card">
                                                <img src="/src/assets/laco-aramados.jpg" alt="Produto" />
                                                <div className="produto-info">
                                                    <p>Laços Aramados - Tendência</p>
                                                    <p className="produto-preco">R$20,00</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <div className="row g-3">
                                        <div className="col-12 col-sm-6 col-md-4">
                                            <div className="produto-card">
                                                <img src="/src/assets/laco-barbie-detalhado.jpg" alt="Produto" />
                                                <div className="produto-info">
                                                    <p>Laços Barbie - Coleção Barbie</p>
                                                    <p className="produto-preco">R$17,99</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6 col-md-4 d-none d-sm-block">
                                            <div className="produto-card">
                                                <img src="/src/assets/laco-personalizado.jpg" alt="Produto" />
                                                <div className="produto-info">
                                                    <p>Laço Personalizado - Coleção Personalizados</p>
                                                    <p className="produto-preco">R$30,00</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6 col-md-4 d-none d-md-block">
                                            <div className="produto-card">
                                                <img src="/src/assets/laco-piscina.jpg" alt="Produto" />
                                                <div className="produto-info">
                                                    <p>Laço Neon Verde - Coleção Neon</p>
                                                    <p className="produto-preco">R$18,99</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#catalogoCarousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon"></span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#catalogoCarousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon"></span>
                            </button>
                        </div>

                        <div className="card-container">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    <Link to="/produto">
                                        <img src={product.image} alt={product.name} />
                                        <div className="card-info">
                                            <p className="product-name">
                                                {product.name} - <span className="collection">{product.collection}</span>
                                            </p>
                                            <p className="price">R${product.price.toFixed(2).replace('.', ',')}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Catalogo;