import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Catalogo from '../pages/Catalogo.jsx';
import PedidoConfirmado from '../pages/PedidoConfirmado.jsx';
import PedidoEntregue from '../pages/PedidoEntregue.jsx';
import CadastroCor from '../pages/CadastroCor.jsx';
import CadastroUsuario from '../pages/CadastroUsuario.jsx';
import Perfil from '../pages/Perfil.jsx';
import CadastroTipoLacos from '../pages/CadastroTipoLacos.jsx';
import Compra from '../pages/Compra.jsx';
import Pedidos from '../pages/Pedidos.jsx';
import Favoritos from '../pages/Favoritos.jsx';
import Produto from '../pages/Produto.jsx';
import Carrinho from '../pages/Carrinho.jsx';
import Modelo from '../pages/Modelo.jsx';
import MinhasCompras from '../pages/MinhasCompras.jsx';
import EsqueciSenha from '../pages/EsqueciSenha.jsx';
import Dashboard from '../pages/Dashboard.jsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
        <Route path="/pedido-entregue" element={<PedidoEntregue />} />
        <Route path="/cadastro-cor" element={<CadastroCor />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/cadastro-tipo-lacos" element={<CadastroTipoLacos />} />
        <Route path="/finalizar-compra" element={<Compra />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/produto" element={<Produto />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/cadastro-modelo" element={<Modelo />} />
        <Route path="/minhas-compras" element={<MinhasCompras />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cor/:id" element={<CadastroCor />} />
        <Route path="*" element={<div style={{ padding: 20 }}>Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}
