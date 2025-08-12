// Gráfico de cumplimiento ITCA
const ctxCumplimiento = document.getElementById('chartCumplimiento');
new Chart(ctxCumplimiento, {
  type: 'doughnut',
  data: {
    labels: ['Cumplido', 'Pendiente'],
    datasets: [{
      data: [85, 15],
      backgroundColor: ['#28a745', '#dc3545']
    }]
  },
  options: { responsive: true }
});

// Gráfico de eventos
const ctxEventos = document.getElementById('chartEventos');
new Chart(ctxEventos, {
  type: 'bar',
  data: {
    labels: ['Programados', 'Ejecutados'],
    datasets: [{
      label: 'Eventos',
      data: [12, 9],
      backgroundColor: ['#007bff', '#28a745']
    }]
  },
  options: { responsive: true }
});
