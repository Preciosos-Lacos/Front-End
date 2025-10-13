import { useState, useEffect } from 'react';
import Logo from './assets/logo_preciosos_lacos.png';
import Login from './components/Login.jsx';
import Catalogo from './components/Catalogo.jsx';
import PedidoConfirmado from './components/PedidoConfirmado.jsx';
import PedidoEntregue from './components/PedidoEntregue.jsx';
import CadastroCor from './components/CadastroCor.jsx';
import CadastroUsuario from './components/CadastroUsuario.jsx';
import Perfil from './components/Perfil.jsx';
import CadastroTipoLacos from './components/CadastroTipoLacos.jsx';
import Compra from './components/Compra.jsx';
import Pedidos from './components/Pedidos.jsx';
import Favoritos from './components/Favoritos.jsx';
import Produto from './components/Produto.jsx';
import Carrinho from './components/Carrinho.jsx';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState(() => {
    // initialize from hash when present, otherwise default to 'home'
    const h = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    if (h) {
      if (h === 'login') return 'login';
      if (h === 'catalogo') return 'catalogo';
      if (h === 'perfil') return 'perfil';
      if (h === 'cadastroUsuario' || h === 'cadastro-usuario') return 'cadastro-usuario';
      if (h === 'cadastro-cor' || h === 'cadastroCor') return 'cadastro-cor';
      if (h === 'pedido' || h === 'pedidos') return 'pedidos';
      if (h === 'compra') return 'compra';
      if (h === 'home') return 'home';
      if (h === 'cadastro-tipo-lacos') return 'cadastro-tipo-lacos'
      if (h === 'favoritos') return 'favoritos'
      if (h === 'produto') return 'produto';
      if (h === 'carrinho') return 'carrinho';
    }
    return 'home';
  });

  // navigation helpers
  const navigate = (screen) => setCurrentScreen(screen);
  const goToLogin = () => setCurrentScreen('login');
  const goToCadastroUsuario = () => setCurrentScreen('cadastro-usuario');
  const goToCatalogo = () => setCurrentScreen('catalogo');
  const goToPedidoConfirmado = () => setCurrentScreen('pedido-confirmado');
  const goToPedidoEntregue = () => setCurrentScreen('pedido-entregue');
  const goToPerfil = () => setCurrentScreen('perfil');
  const goToCadastroCor = () => setCurrentScreen('cadastro-cor');
  const goToCadastroTipoLacos = () => setCurrentScreen('cadastro-tipo-lacos');
  const goToPedidos = () => setCurrentScreen('pedidos');
  const goToCompra = () => setCurrentScreen('compra');
  const goToHome = () => setCurrentScreen('home');
  const goToFavoritos = () => setCurrentScreen('favoritos');
  const goToProduto = () => setCurrentScreen('produto');
  const goToCarrinho = () => setCurrentScreen('carrinho');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'login') setCurrentScreen('login');

    const onHashChange = () => {
      const h = window.location.hash.replace('#', '');
      if (h) {
        if (h === 'login') setCurrentScreen('login');
        else if (h === 'catalogo') setCurrentScreen('catalogo');
        else if (h === 'perfil') setCurrentScreen('perfil');
        else if (h === 'cadastroUsuario' || h === 'cadastro-usuario') setCurrentScreen('cadastro-usuario');
        else if (h === 'cadastro-cor' || h === 'cadastroCor') setCurrentScreen('cadastro-cor');
        else if (h === 'pedido' || h === 'pedidos') setCurrentScreen('pedidos');
        else if (h === 'compra') setCurrentScreen('compra');
        else if (h === 'home') setCurrentScreen('home');
        else if (h === 'cadastro-tipo-lacos') setCurrentScreen('cadastro-tipo-lacos')
        else if (h === 'favoritos') setCurrentScreen('favoritos')
        else if (h === 'produto') setCurrentScreen('produto');
        
      }
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Renderização condicional
  return (
    <>
      {currentScreen === 'home' && (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <div>
            <img src={Logo} className="logo" alt="Vite logo" />
          </div>
          <h1 style={{ padding: '0px 30px' }}>Preciosos Laços</h1>
          <div className="card">
            <button onClick={goToLogin}>Ir para Login</button>
            <button onClick={goToCadastroUsuario}>Ir para Cadastro de Usuário</button>
            <button onClick={goToCatalogo}>Ir para Catálogo</button>
            <button onClick={goToPedidoConfirmado}>Ir para Pedido Confirmado</button>
            <button onClick={goToPedidoEntregue}>Ir para Pedido Entregue</button>
            <button onClick={goToPerfil}>Ir para Perfil</button>
            <button onClick={goToCadastroCor}>Ir para Cadastro de Cores</button>
            <button onClick={goToCadastroTipoLacos}>Ir para Cadastro de Tipos de Laços</button>
            <button onClick={goToCompra}>Ir para Finalizar Compra</button>
            <button onClick={goToPedidos}>Ir para Pedidos</button>
            <button onClick={goToFavoritos}>Ir para Favoritos</button>
            <button onClick={goToProduto}>Ir para Produto</button>
            <button onClick={goToCarrinho}>Ir para Carrinho</button>
          </div>
        </div>
      )}

      {currentScreen === 'login' && (
        <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
          <button onClick={goToHome} className="home-button">
            <i className="bi bi-house-fill"></i>
          </button>
          <Login onLoginSuccess={goToCatalogo} />
        </div>
      )}

      {currentScreen === 'catalogo' && (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <Catalogo onNavigate={navigate} />
        </div>
      )}

      {currentScreen === 'pedido-confirmado' && (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <PedidoConfirmado onNavigate={navigate} />
        </div>
      )}

      {currentScreen === 'pedido-entregue' && (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <PedidoEntregue onNavigate={navigate} />
        </div>
      )}

      {currentScreen === 'cadastro-cor' && (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <button onClick={goToHome} className="home-button">
            <i className="bi bi-house-fill"></i>
          </button>
          <CadastroCor />
        </div>
      )}

      {currentScreen === 'cadastro-usuario' && (
        <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
          <button onClick={goToHome} className="home-button">
            <i className="bi bi-house-fill"></i>
          </button>
          <CadastroUsuario />
        </div>
      )}

      {currentScreen === 'cadastro-tipo-lacos' && (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <button onClick={goToHome} className="home-button">
            <i className="bi bi-house-fill"></i>
          </button>
          <CadastroTipoLacos />
        </div>
      )}

      {currentScreen === 'pedidos' && (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <button onClick={goToHome} className="home-button">
            <i className="bi bi-house-fill"></i>
          </button>
          <Pedidos />
        </div>
      )}

      {currentScreen === 'perfil' && (
        <div
          style={{
            height: '100vh',
            width: '100%',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
          }}
        >
          <Perfil />
        </div>
      )}

      {currentScreen === 'favoritos' && (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <Favoritos />
        </div>
      )}

      {currentScreen === 'compra' && (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <button onClick={goToHome} className="home-button">
            <i className="bi bi-house-fill"></i>
          </button>
          <Compra />
        </div>
      )}

      {currentScreen === 'produto' && (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <button onClick={goToHome} className="home-button">
            <i className="bi bi-house-fill"></i>
          </button>
          <Produto />
        </div>
      )}

      {currentScreen === 'carrinho' && (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <button onClick={goToHome} className="home-button">
            <i className="bi bi-house-fill"></i>
          </button>
          <Carrinho />
        </div>
      )}
    </>
  );
}

export default App;
