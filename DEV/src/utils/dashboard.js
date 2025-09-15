const ctx = document.getElementById('graficoVendas').getContext('2d');
const graficoVendas = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [{
      label: 'Vendas (R$)',
      data: [500, 800, 1200, 950, 1100, 1350],
      backgroundColor: '#727272ff'
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});