import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo_preciosos_lacos.png';
import '../App.css';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      <div>
        <img src={Logo} className="logo" alt="Preciosos Laços" />
      </div>
      <h1 style={{ padding: '0px 30px' }}>Preciosos Laços</h1>
      <div className="card">
        <button onClick={() => navigate('/login')}>Ir para Login</button>
        <button onClick={() => navigate('/cadastro-usuario')}>Ir para Cadastro de Usuário</button>
        <button onClick={() => navigate('/catalogo')}>Ir para Catálogo</button>
        <button onClick={() => navigate('/pedido-confirmado')}>Ir para Pedido Confirmado</button>
        <button onClick={() => navigate('/pedido-entregue')}>Ir para Pedido Entregue</button>
        <button onClick={() => navigate('/perfil')}>Ir para Perfil</button>
        <button onClick={() => navigate('/cadastro-cor')}>Ir para Cadastro de Cores</button>
        <button onClick={() => navigate('/cadastro-tipo-lacos')}>Ir para Cadastro de Tipos de Laços</button>
        <button onClick={() => navigate('/finalizar-compra')}>Ir para Finalizar Compra</button>
        <button onClick={() => navigate('/pedidos')}>Ir para Pedidos</button>
        <button onClick={() => navigate('/favoritos')}>Ir para Favoritos</button>
        <button onClick={() => navigate('/produto')}>Ir para Produto</button>
        <button onClick={() => navigate('/carrinho')}>Ir para Carrinho</button>
        <button onClick={() => navigate('/cadastro-modelo')}>Ir para Modelos (Dashboard)</button>
        <button onClick={() => navigate('/minhas-compras')}>Ir para Minhas Compras</button>
        <button onClick={() => navigate('/esqueci-senha')}>Ir para Esqueci Senha</button>
        <button onClick={() => navigate('/dashboard')}>Ir para Dashboard</button>
      </div>
    </div>
  );
}
