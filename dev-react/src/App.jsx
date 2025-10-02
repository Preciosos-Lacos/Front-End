import { useState } from 'react'
import viteLogo from '/vite.svg'
import Login from './components/Login.jsx'
import Catalogo from './components/Catalogo.jsx'
import PedidoConfirmado from './components/PedidoConfirmado.jsx'
import PedidoEntregue from './components/PedidoEntregue.jsx'
import Perfil from './components/Perfil.jsx' // ADICIONE ESTA LINHA
import CadastroUsuario from './components/CadastroUsuario.jsx'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const navigate = (screen) => {
    setCurrentScreen(screen)
  }

  const goToLogin = () => {
    setCurrentScreen('login')
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

  const goToHome = () => {
    setCurrentScreen('home')
  }

  const goToCadastroUsuario = () => {
    setCurrentScreen('cadastro-usuario')
  }

  return (
    <>
      {currentScreen === 'home' ? (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={goToLogin}>Ir para Login</button>
            <button onClick={goToCatalogo}>Ir para Catálogo</button>
            <button onClick={goToPedidoConfirmado}>Ir para Pedido Confirmado</button>
            <button onClick={goToPedidoEntregue}>Ir para Pedido Entregue</button>
            <button onClick={goToPerfil}>Ir para Perfil</button> {/* NOVO BOTÃO */}
            <button onClick={goToCadastroUsuario}>Ir para Cadastro</button>
            <p>
              Edit <code>src/App.jsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </div>
      ) : currentScreen === 'login' ? (
        <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
          <button 
            onClick={goToHome} 
            className="home-button"
          >
            <i className="bi bi-house-fill"></i>
          </button>
          <Login />
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
      ) : currentScreen === 'perfil' ? (
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <button 
            onClick={goToHome} 
            className="home-button"
          >
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
        </div>
      ) : null}
    </>
  )
}

export default App