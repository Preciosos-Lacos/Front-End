import { useEffect, useState } from 'react';
import '../styles/Favoritos.css';
import Header from '../components/Header';
import bolinhaImg from '../assets/laco-bolinha.webp';
import neonImg from '../assets/laco-neon-verde.webp';
import placeholderImg from '../assets/laco-personalizado.jpg';

const BASE_URL = 'http://localhost:8080';

function getAuthToken() {
    return localStorage.getItem('token');
}

function decodeJwt(token) {
    try {
        const payload = token.split('.')[1];
        const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        return json || {};
    } catch {
        return {};
    }
}

export default function Favoritos() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [favoritos, setFavoritos] = useState([]); // lista de modelos favoritos
    const [fotos, setFotos] = useState({}); // { [idModelo]: dataUrl }
    // Removido render condicional duplicado para evitar loop infinito

    const precoBRL = (v) => Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    useEffect(() => {
        let active = true;
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const token = getAuthToken();
                if (!token) {
                    setError('Faça login para ver seus favoritos.');
                    setLoading(false);
                    return;
                }
                const payload = decodeJwt(token);
                const email = payload?.sub; // subject deve ser o login (email)

                // 1) Buscar usuários e encontrar o logado pelo login/email
                const resUsers = await fetch(`${BASE_URL}/usuarios`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!resUsers.ok) {
                    const msg = await resUsers.text();
                    throw new Error(msg || 'Falha ao carregar usuários');
                }
                const listaUsuarios = await resUsers.json();
                const u = (listaUsuarios || []).find((x) => x.login === email) || null;
                if (!u) throw new Error('Usuário autenticado não encontrado');
                if (!active) return;
                setUsuario(u);

                // 2) Buscar favoritos do usuário (lista de Modelos)
                const resFav = await fetch(`${BASE_URL}/modelos/favoritos/${u.idUsuario}`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (resFav.status === 204) {
                    if (!active) return;
                    setFavoritos([]);
                    setFotos({});
                    setLoading(false);
                    return;
                }
                if (!resFav.ok) {
                    const msg = await resFav.text();
                    throw new Error(msg || 'Falha ao carregar favoritos');
                }
                const modelos = await resFav.json();
                if (!active) return;
                setFavoritos(modelos);

                // 3) Para cada modelo, tentar buscar a foto base64 específica
                const fotosMap = {};
                await Promise.all(
                    (modelos || []).map(async (m) => {
                        try {
                            const rf = await fetch(`${BASE_URL}/modelos/${m.idModelo}/foto`, {
                                method: 'GET',
                                mode: 'cors',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            if (rf.ok) {
                                const data = await rf.json();
                                if (data?.foto) fotosMap[m.idModelo] = `data:image/jpeg;base64,${data.foto}`; // faz o mapeamento para encontrar a foto do modelo correto
                            }
                        } catch {}
                    })
                );
                if (!active) return;
                setFotos(fotosMap);
                setLoading(false);
            } catch (e) {
                console.error(e);
                if (active) setError(e.message || 'Falha ao carregar favoritos');
                setLoading(false);
            }
        }
        load();
        return () => { active = false; };
    }, []);

    async function removerFavorito(idModelo) {
        try {
            if (!usuario?.idUsuario) return;
            const token = getAuthToken();
            const res = await fetch(`${BASE_URL}/modelos/favorito`, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ idUsuario: usuario.idUsuario, idModelo }),
            });
            if (res.status !== 204 && !res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Falha ao remover favorito');
            }
            // Atualiza lista local
            setFavoritos((prev) => prev.filter((m) => m.idModelo !== idModelo));
            setFotos((prev) => {
                const n = { ...prev }; delete n[idModelo]; return n;
            });
        } catch (e) {
            console.error(e);
            alert('Não foi possível remover o favorito');
        }
    }

    return (
        <>
            <Header />
            <main className="fav-main">
                <section className="fav-container">
                    <h1 className="fav-title">Meus Favoritos</h1>
                    {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}

                    {loading ? (
                        <p>Carregando…</p>
                    ) : favoritos.length === 0 ? (
                        <p>Você ainda não possui favoritos.</p>
                    ) : (
                        <div className="fav-grid">
                            {favoritos.map((m) => (
                                <article className="fav-card" key={m.idModelo}>
                                    <div className="fav-image">
                                        {(() => {
                                            // preferential mapping: if model name matches specific known names, use local asset
                                            const name = String(m.nomeModelo || '').toLowerCase();
                                            let mapped = null;
                                            if (name.includes('bolinha') || name.includes('laço bolinha') || name.includes('laco bolinha')) mapped = bolinhaImg;
                                            else if (name.includes('preciosos neon') || name.includes('preciosos-neon') || name.includes('neon')) mapped = neonImg;
                                            const src = mapped || fotos[m.idModelo] || placeholderImg || '';
                                            return <img src={src} alt={m.nomeModelo || 'Modelo'} />;
                                        })()}
                                    </div>
                                    <div className="fav-info">
                                        <h3 className="fav-name">{m.nomeModelo}</h3>
                                        <p className="fav-collection">{m.descricao || '—'}</p>
                                        <div className="fav-bottom">
                                            <div className="fav-price">{precoBRL(m.preco)}</div>
                                                                    <div className="fav-actions">
                                                                        <button className="btn-remove" onClick={() => removerFavorito(m.idModelo)}>Remover</button>
                                                                    </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}