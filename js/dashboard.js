if (!localStorage.getItem('codisecUser')) {
  window.location.href = 'index.html';
}

function logout() {
  localStorage.removeItem('codisecUser');
  window.location.href = 'index.html';
}

const ctx1 = document.getElementById('chart1');
new Chart(ctx1, {
  type: 'bar',
  data: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr'],
    datasets: [{
      label: 'Cumplimiento ITCA (%)',
      data: [70, 80, 75, 85],
      backgroundColor: '#003366'
    }]
  }
});

const ctx2 = document.getElementById('chart2');
new Chart(ctx2, {
  type: 'pie',
  data: {
    labels: ['Programados', 'Ejecutados'],
    datasets: [{
      data: [12, 9],
      backgroundColor: ['#003366', '#cc0000']
    }]
  }
});
