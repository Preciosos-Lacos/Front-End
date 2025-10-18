import React, { useEffect, useRef } from "react";
import SideBar from "./SideBar.jsx";

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
} from "chart.js";

import "./Dashboard.css";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title);

const Dashboard = () => {
  const chartRef = useRef(null);

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
      <SideBar />
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
              <tr className="dashboard-status-atrasado">
                <td>Paloma Souza</td>
                <td>11 94115-9057</td>
                <td>23 Mar 2025</td>
                <td>R$ 23,00</td>
                <td>Débito</td>
                <td className="dashboard-status-pagamento dashboard-atrasado">
                  Atrasado
                </td>
                <td className="dashboard-status-pedido dashboard-concluido">
                  Concluído
                </td>
              </tr>
              <tr>
                <td>Rodrigo Simões</td>
                <td>11 94121-9217</td>
                <td>24 Mar 2025</td>
                <td>R$ 27,00</td>
                <td>Débito</td>
                <td className="dashboard-status-pagamento dashboard-aguardando">
                  Aguardando
                </td>
                <td className="dashboard-status-pedido dashboard-iniciado">
                  Iniciado
                </td>
              </tr>
              <tr>
                <td>Cleber Santana</td>
                <td>11 92143-9232</td>
                <td>23 Mar 2025</td>
                <td>R$ 23,00</td>
                <td>Crédito</td>
                <td className="dashboard-status-pagamento dashboard-aguardando">
                  Aguardando
                </td>
                <td className="dashboard-status-pedido dashboard-concluido">
                  Concluído
                </td>
              </tr>
              <tr>
                <td>Ricardo Silva</td>
                <td>11 91221-9232</td>
                <td>23 Mar 2025</td>
                <td>R$ 23,00</td>
                <td>Crédito</td>
                <td className="dashboard-status-pagamento dashboard-concluido">
                  Concluído
                </td>
                <td className="dashboard-status-pedido dashboard-concluido">
                  Concluído
                </td>
              </tr>
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
              <tr>
                <td>#1024</td>
                <td>Ana Souza</td>
                <td style={{ color: "rgb(223, 36, 36)" }}>Atrasado</td>
                <td>08/09/2025</td>
              </tr>
              <tr>
                <td>#1023</td>
                <td>Maria Oliveira</td>
                <td>Em trânsito</td>
                <td>09/09/2025</td>
              </tr>
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
