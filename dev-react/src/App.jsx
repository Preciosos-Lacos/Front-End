import { useState, useEffect } from 'react'
import Logo from './assets/logo_preciosos_lacos.png';
import Login from './components/Login.jsx'
import Catalogo from './components/Catalogo.jsx'
import PedidoConfirmado from './components/PedidoConfirmado.jsx'
import PedidoEntregue from './components/PedidoEntregue.jsx'
import CadastroCor from './components/CadastroCor.jsx'
import Pedidos from './components/Pedidos.jsx'
import CadastroUsuario from './components/CadastroUsuario.jsx'
import Perfil from './components/Perfil.jsx'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')

  const navigate = (screen) => {
    setCurrentScreen(screen)
  }

  const goToLogin = () => {
    setCurrentScreen('login')
  }

  const goToCadastroUsuario = () => {
    setCurrentScreen('cadastro-usuario')
  }

  const goToCatalogo = () => {
    setCurrentScreen('catalogo')
  }

  const goToPedidoConfirmado = () => {
    setCurrentScreen('pedido-confirmado')
  }

  const goToPedidoEntregue = () => {
    setCurrentScreen('pedido-entregue')
  }

  const goToPerfil = () => {
    setCurrentScreen('perfil')
  }

  const goToCadastroCor = () => {
    setCurrentScreen('cadastro-cor')
  }

    const goToPedido = () => {
    setCurrentScreen('pedido')
  }

  const goToHome = () => {
    setCurrentScreen('home')
  }

  useEffect(() => {
    const applyHash = (hash) => {
      if (!hash) return;
      if (hash === 'login') setCurrentScreen('login')
      else if (hash === 'catalogo') setCurrentScreen('catalogo')
      else if (hash === 'perfil') setCurrentScreen('perfil')
      else if (hash === 'pedido') setCurrentScreen('pedido')
      else if (hash === 'cadastro-cor') setCurrentScreen('cadastro-cor')
      else if (hash === 'cadastroUsuario' || hash === 'cadastro-usuario') setCurrentScreen('cadastro-usuario')
      else if (hash === 'home') setCurrentScreen('home')
    }

    const initialHash = window.location.hash.replace('#', '')
    applyHash(initialHash)

    const onHashChange = () => applyHash(window.location.hash.replace('#', ''))

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <>
      {currentScreen === 'home' ? (
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
            <button onClick={goToPedido}>Ir para Pedido</button>
          </div>
        </div>
      ) : currentScreen === 'login' ? (
        <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
          <button
            onClick={goToHome}
            className="home-button"
          >
            <i className="bi bi-house-fill"></i>
          </button>
          <Login onLoginSuccess={goToCatalogo} />
        </div>
      ) : currentScreen === 'catalogo' ? (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <Catalogo onNavigate={navigate} />
        </div>
      ) : currentScreen === 'pedido-confirmado' ? (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <PedidoConfirmado onNavigate={navigate} />
        </div>
      ) : currentScreen === 'pedido-entregue' ? (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <PedidoEntregue onNavigate={navigate} />
        </div>
      ) : currentScreen === 'cadastro-cor' ? (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <button onClick={goToHome} className="home-button">
            <i className="bi bi-house-fill"></i>
          </button>
          <CadastroCor />
        </div>
      ) : currentScreen === 'pedido' ? (
          <Pedidos />
      ) : currentScreen === 'cadastro-usuario' ? (
        <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
          <button
            onClick={goToHome}
            className="home-button"
          >
            <i className="bi bi-house-fill"></i>
          </button>
          <CadastroUsuario />
        </div>
      ) : currentScreen === 'perfil' ? (
        <div style={{ height: '100vh', width: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
          <Perfil />
        </div>
      ) : null}
    </>
  )
}

export default App
