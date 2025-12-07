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
import CadastroEndereco from '../pages/CadastroEndereco.jsx';
import ScrollToTop from '../components/ScrollToTop.jsx';
import Colecoes from '../pages/Colecoes.jsx';
import CadastroBanner from '../pages/CadastroBanner.jsx';
import AtualizarEndereco from '../pages/AtualizarEndereco.jsx';
// Admin routes are no longer wrapped with ProtectedRoute

export default function AppRoutes() {
  return (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop behavior="smooth" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/produto" element={<Produto />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/carrinho" element={<Carrinho />} />

        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />

        {/* User (authenticated) flows */}
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/minhas-compras" element={<MinhasCompras />} />
        <Route path="/finalizar-compra" element={<Compra />} />
        <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
        <Route path="/pedido-entregue" element={<PedidoEntregue />} />
        {/* <Route path="/pedido-entregue/:id" element={<PedidoEntregue />} /> */}
        <Route path="/cadastro-endereco" element={<CadastroEndereco />} />
        <Route path="/atualizar-endereco" element={<AtualizarEndereco />} />
        <Route path="/atualizar-endereco/:idEndereco" element={<AtualizarEndereco />} />

        {/* Admin / Management flows */}
        <Route path="/admin/pedidos" element={<Pedidos />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/cadastro-cor" element={<CadastroCor />} />
        <Route path="/admin/cadastro-cor/:id" element={<CadastroCor />} />
        <Route path="/admin/cadastro-tipo-lacos" element={<CadastroTipoLacos />} />
        <Route path="/admin/cadastro-modelo" element={<Modelo />} />
        <Route path="/admin/colecoes" element={<Colecoes />} />
        <Route path="/admin/banner" element={<CadastroBanner />} />

        {/* Fallback */}
        <Route path="*" element={<div style={{ padding: 20 }}>Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}

