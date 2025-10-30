import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
} from "chart.js";


Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title);

const Dashboard = () => {
  const chartRef = useRef(null);
  const [pedidos, setPedidos] = useState([]);
  const [entregasDoDia, setEntregasDoDia] = useState([]);

  useEffect(() => {
    // === Função para buscar pedidos do backend ===
    const fetchPedidos = async () => {
      try {
        const response = await fetch("http://localhost:8080/dashboard");
        if (!response.ok) {
          throw new Error("Erro ao buscar pedidos");
        }
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchPedidos();
  }, []);

  useEffect(() => {
    // === Função para buscar entregas do dia do backend ===
    const fetchEntregasDoDia = async () => {

      try {
        const response = await fetch("http://localhost:8080/dashboard/entregasDoDia");
        if (!response.ok) {
          throw new Error("Erro ao buscar entregas do dia");
        }
        const data = await response.json();
        setEntregasDoDia(data);
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchEntregasDoDia();
  }, []);

  // === Gráfico (permanece igual) ===
  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        datasets: [
          {
            label: "Vendas (R$)",
            data: [120, 150, 180, 90, 200, 250, 320],
            backgroundColor: "rgba(255, 105, 180, 0.2)",
            borderColor: "#ff69b4",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Bem-vinda, Camila!</h1>
          <p className="dashboard-subtitle">Resumo das operações da Preciosos Laços</p>
        </header>


        <section className="dashboard-kpis">
          <div className="dashboard-card">
            Pedidos (últimas 24h)
            <strong>12</strong>
            <span className="dashboard-detalhe dashboard-positivo">
              ↑ +20% vs ontem
            </span>
          </div>
          <div className="dashboard-card">
            Entregas programadas
            <strong>5</strong>
            <span className="dashboard-detalhe">3 concluídas (60%)</span>
          </div>
          <div className="dashboard-card dashboard-alerta">
            Entregas atrasadas
            <strong>3</strong>
            <span className="dashboard-detalhe dashboard-negativo">
              ↓ Atraso médio: 1,5 dia
            </span>
          </div>
          <div className="dashboard-card">
            Pedidos pendentes
            <strong>4</strong>
            <span className="dashboard-detalhe">
              2 em separação, 2 aguardando pagamento
            </span>
          </div>
          <div className="dashboard-card">
            Vendas do dia
            <strong>R$ 320,00</strong>
            <span className="dashboard-detalhe dashboard-positivo">
              ↑ +7% vs ontem
            </span>
          </div>
          <div className="dashboard-card">
            Ticket médio
            <strong>R$ 40,00</strong>
            <span className="dashboard-detalhe dashboard-positivo">
              ↑ vs R$ 38 semana
            </span>
          </div>
        </section>

        <div className="dashboard-filtros-container">
          <div className="dashboard-filtros">
            <div className="dashboard-filter-item">
              <label>Data Início</label>
              <input type="date" defaultValue="2025-01-20" />
            </div>
            <div className="dashboard-filter-item">
              <label>Data Fim</label>
              <input type="date" defaultValue="2025-06-27" />
            </div>
            <div className="dashboard-filter-item">
              <label>Status Pagamento</label>
              <select>
                <option>Todos</option>
                <option>Concluído</option>
                <option>Aguardando</option>
                <option>Atrasado</option>
              </select>
            </div>
            <div className="dashboard-filter-item">
              <label>Status Pedido</label>
              <select>
                <option>Todos</option>
                <option>Concluído</option>
                <option>Iniciado</option>
              </select>
            </div>
          </div>
        </div>

        <section className="dashboard-tabela">
          <h2>Pedidos pendentes</h2>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Telefone</th>
                <th>Data de Entrega</th>
                <th>Preço</th>
                <th>Tipo Pagamento</th>
                <th>Status Pagamento</th>
                <th>Status Pedido</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length > 0 ? (
                pedidos.map((p, index) => (
                  <tr key={index}>
                    <td>{p.nomeCliente}</td>
                    <td>{p.telefone}</td>
                    <td>{p.dataPedido}</td>
                    <td>R$ {p.total.toFixed(2).replace(".", ",")}</td>
                    <td>{p.formaPagamento}</td>
                    <td
                      className={`dashboard-status-pagamento ${p.statusPagamento === "Atrasado" || p.statusPagamento === "Cancelado"
                        ? "dashboard-cancelado"
                        : p.statusPagamento === "Pendente"
                          ? "dashboard-aguardando"
                          : "dashboard-concluido"
                        }`}
                    >
                      {p.statusPagamento}
                    </td>
                    <td
                      className={`dashboard-status-pedido ${p.statusPedido === "Cancelado"
                        ? "dashboard-cancelado"
                        : p.statusPedido === "Em andamento"
                          ? "dashboard-aguardando"
                          : p.statusPedido === "Entregue"
                            ? "dashboard-concluido"
                            : ""
                        }`}
                    >
                      {p.statusPedido}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Carregando pedidos...</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="dashboard-tabela">
          <h2>Entregas do dia</h2>
          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Status</th>
                <th>Previsão</th>
              </tr>
            </thead>
            <tbody>
              {entregasDoDia.length > 0 ? (
                entregasDoDia.map((entrega, index) => (
                  <tr key={index}>
                    <td>#{entrega.id_pedido}</td>
                    <td>{entrega.cliente}</td>
                    <td
                      className={`dashboard-status-pedido ${entrega.status?.toLowerCase().includes("Cancelado")
                          ? "dashboard-cancelado"
                          : entrega.status?.toLowerCase().includes("em trânsito")
                            ? "dashboard-aguardando"
                            : "dashboard-concluido"
                        }`}
                    >
                      {entrega.status}
                    </td>
                    <td>
                      {new Date(entrega.previsao_entrega).toLocaleDateString("pt-BR", {
                        timeZone: "UTC",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Carregando entregas...</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>


        <section className="dashboard-graficos">
          <h2>Vendas nos últimos 7 dias</h2>
          <canvas ref={chartRef} width="600" height="200"></canvas>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
