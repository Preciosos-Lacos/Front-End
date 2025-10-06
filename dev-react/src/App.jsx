import { useState, useEffect } from 'react'
import Logo from './assets/logo_preciosos_lacos.png';
import Login from './components/Login.jsx'
import Catalogo from './components/Catalogo.jsx'
import PedidoConfirmado from './components/PedidoConfirmado.jsx'
import PedidoEntregue from './components/PedidoEntregue.jsx'
<<<<<<< Updated upstream
import Perfil from './components/Perfil.jsx'
=======
import CadastroCor from './components/CadastroCor.jsx'
>>>>>>> Stashed changes
import CadastroUsuario from './components/CadastroUsuario.jsx'
import Perfil from './components/Perfil.jsx'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')

  const navigate = (screen) => {
    setCurrentScreen(screen)
  }

<<<<<<< Updated upstream
  const goToLogin = () => setCurrentScreen('login')
  const goToCatalogo = () => setCurrentScreen('catalogo')
  const goToPedidoConfirmado = () => setCurrentScreen('pedido-confirmado')
  const goToPedidoEntregue = () => setCurrentScreen('pedido-entregue')
  const goToPerfil = () => setCurrentScreen('perfil')
  const goToHome = () => setCurrentScreen('home')
=======
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
    setCurrentScreen('color-page')
  }

  const goToHome = () => {
    setCurrentScreen('home')
  }
>>>>>>> Stashed changes

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'login') setCurrentScreen('login')

    const onHashChange = () => {
      const h = window.location.hash.replace('#', '')
      if (h) {
        if (h === 'login') setCurrentScreen('login')
        else if (h === 'catalogo') setCurrentScreen('catalogo')
        else if (h === 'perfil') setCurrentScreen('perfil')
        else if (h === 'cadastroUsuario' || h === 'cadastro-usuario') setCurrentScreen('cadastro-usuario')
        else if (h === 'home') setCurrentScreen('home')
      }
    }

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
<<<<<<< Updated upstream
            <button onClick={goToCadastroUsuario}>Ir para Cadastro</button>
            <p>
              Edit <code>src/App.jsx</code> and save to test HMR
            </p>
=======
            <button onClick={goToCadastroCor}>Ir para Cadastro de Cores</button>
>>>>>>> Stashed changes
          </div>
        </div>
      ) : currentScreen === 'login' ? (
        <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
<<<<<<< Updated upstream
          <button onClick={goToHome} className="home-button">
=======
          <button
            onClick={goToHome}
            className="home-button"
          >
>>>>>>> Stashed changes
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
      ) : currentScreen === 'color-page' ? (
        <div style={{ minHeight: '100vh', width: '100%' }}>
<<<<<<< Updated upstream
          <button onClick={goToHome} className="home-button">
            <i className="bi bi-house-fill"></i>
          </button>
          <Perfil />
        </div>
      ) : currentScreen === 'cadastro-usuario' ? (
        <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
          <button
            onClick={goToHome} 
            className="home-button"
          >
            <i className="bi bi-house-fill"></i>
          </button>
          <CadastroUsuario />
=======
          <CadastroCor />
>>>>>>> Stashed changes
        </div>
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
