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
  const [resumo, setResumo] = useState({});
  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    statusPagamento: "",
    statusPedido: "",
  });

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const tamanhoPagina = 5;


  const aplicarFiltros = async () => {
    try {
      const params = new URLSearchParams();

      if (filtros.dataInicio) params.append("dataInicio", filtros.dataInicio);
      if (filtros.dataFim) params.append("dataFim", filtros.dataFim);
      if (filtros.statusPagamento !== "Todos") params.append("statusPagamento", filtros.statusPagamento);
      if (filtros.statusPedido !== "Todos") params.append("statusPedido", filtros.statusPedido);

      const response = await fetch(`http://localhost:8080/dashboard/filtrado?${params.toString()}`);
      if (!response.ok) throw new Error("Erro ao aplicar filtros");

      const data = await response.json();

      setPedidos(data.pedidos || []);
      setResumo(data.resumo || {});
      setEntregasDoDia(data.entregas || []);

      const ctx = chartRef.current.getContext("2d");
      if (ctx.chart) ctx.chart.destroy();

      const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
      const vendasMap = {};
      (data.vendas7dias || []).forEach(item => {
        const dia = item.dia_semana;
        vendasMap[dia] = item.total;
      });

      const dataset = diasDaSemana.map(d => vendasMap[d] || 0);

      ctx.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: diasDaSemana,
          datasets: [
            {
              label: "Vendas (R$)",
              data: dataset,
              borderColor: "#ff69b4",
              backgroundColor: "rgba(255,105,180,0.2)",
              borderWidth: 2,
              tension: 0.3,
            },
          ],
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } },
      });
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
    }
  };

  useEffect(() => {
    const fetchResumo = async () => {
      try {
        const response = await fetch("http://localhost:8080/dashboard/resumo");
        if (!response.ok) throw new Error("Erro ao buscar resumo");
        const data = await response.json();
        setResumo(data);
      } catch (error) {
        console.error("Erro ao carregar resumo:", error);
      }
    };

    fetchResumo();
  }, []);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/dashboard/paginado?page=${paginaAtual}&size=${tamanhoPagina}`
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar pedidos paginados");
        }

        const data = await response.json();

        setPedidos(data.pedidos || []);
        setTotalPaginas(data.totalPages || 1);
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchPedidos();
  }, [paginaAtual]);

  useEffect(() => {
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

  useEffect(() => {
    const fetchVendas7Dias = async () => {
      try {
        const response = await fetch("http://localhost:8080/dashboard/vendas7dias");
        if (!response.ok) throw new Error("Erro ao buscar vendas");
        const data = await response.json();

        const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
        const vendasMap = {};
        data.forEach(item => {
          const dia = item.dia_semana === "Mon" ? "Seg" :
            item.dia_semana === "Tue" ? "Ter" :
              item.dia_semana === "Wed" ? "Qua" :
                item.dia_semana === "Thu" ? "Qui" :
                  item.dia_semana === "Fri" ? "Sex" :
                    item.dia_semana === "Sat" ? "Sáb" :
                      item.dia_semana === "Sun" ? "Dom" : item.dia_semana;
          vendasMap[dia] = item.total;
        });

        const labels = diasDaSemana;
        const dataset = diasDaSemana.map(d => vendasMap[d] || 0); 

        const ctx = chartRef.current.getContext("2d");
        const chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Vendas (R$)",
                data: dataset,
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
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchVendas7Dias();
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
            <strong>{resumo.pedidos24h ?? 0}</strong>
            <span
              className={`dashboard-detalhe ${resumo.variacaoPedidos >= 0
                ? "dashboard-positivo"
                : "dashboard-negativo"
                }`}
            >
              {resumo.variacaoPedidos >= 0 ? "↑" : "↓"}{" "}
              {resumo.variacaoPedidos?.toFixed(1)}% vs ontem
            </span>
          </div>

          <div className="dashboard-card">
            Entregas programadas
            <strong>{resumo.entregasProgramadas ?? 0}</strong>
            <span className="dashboard-detalhe">Dentro da 1ª semana</span>
          </div>

          <div className="dashboard-card dashboard-alerta">
            Entregas atrasadas
            <strong>{resumo.entregasAtrasadas ?? 0}</strong>
            <span className="dashboard-detalhe dashboard-negativo">
              Atraso médio: {resumo.atrasoMedioDias?.toFixed(1)} dias
            </span>
          </div>

          <div className="dashboard-card">
            Pedidos pendentes
            <strong>{resumo.pedidosPendentes ?? 0}</strong>
            <span className="dashboard-detalhe">Aguardando pagamento</span>
          </div>

          <div className="dashboard-card">
            Vendas do dia
            <strong>
              R$ {resumo.vendasDia ? resumo.vendasDia.toFixed(2).replace(".", ",") : "0,00"}
            </strong>
            <span
              className={`dashboard-detalhe ${resumo.variacaoVendas >= 0
                ? "dashboard-positivo"
                : "dashboard-negativo"
                }`}
            >
              {resumo.variacaoVendas >= 0 ? "↑" : "↓"}{" "}
              {resumo.variacaoVendas?.toFixed(1)}% vs ontem
            </span>
          </div>

          <div className="dashboard-card">
            Ticket médio
            <strong>
              R$ {resumo.ticketMedio ? resumo.ticketMedio.toFixed(2).replace(".", ",") : "0,00"}
            </strong>
            <span
              className={`dashboard-detalhe ${resumo.variacaoTicket >= 0
                ? "dashboard-positivo"
                : "dashboard-negativo"
                }`}
            >
              {resumo.variacaoTicket >= 0 ? "↑" : "↓"} vs R$
              {resumo.ticketSemana ? resumo.ticketSemana.toFixed(2).replace(".", ",") : "0,00"} semana
            </span>
          </div>
        </section>

        <div className="dashboard-filtros-container">
          <div className="dashboard-filtros">
            <div className="dashboard-filter-item">
              <label>Data Início</label>
              <input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
              />
            </div>
            <div className="dashboard-filter-item">
              <label>Data Fim</label>
              <input
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
              />
            </div>
            <div className="dashboard-filter-item">
              <label>Status Pagamento</label>
              <select
                value={filtros.statusPagamento}
                onChange={(e) => setFiltros({ ...filtros, statusPagamento: e.target.value })}
              >
                <option>Todos</option>
                <option>Pago</option>
                <option>Pendente</option>
                <option>Cancelado</option>
              </select>
            </div>
            <div className="dashboard-filter-item">
              <label>Status Pedido</label>
              <select
                value={filtros.statusPedido}
                onChange={(e) => setFiltros({ ...filtros, statusPedido: e.target.value })}
              >
                <option>Todos</option>
                <option>Entregue</option>
                <option>Concluído</option>
                <option>Em andamento</option>
                <option>Cancelado</option>
              </select>
            </div>
            <div className="dashboard-filter-item">
              <button className="dashboard-filtrar-btn" onClick={aplicarFiltros}>
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>

        <section className="dashboard-tabela">
          <h2>Pedidos</h2>
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
        <div className="paginacao">
          <button
            onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>

          <span>Página {paginaAtual} de {totalPaginas}</span>

          <button
            onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
          >
            Próxima
          </button>
        </div>



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
