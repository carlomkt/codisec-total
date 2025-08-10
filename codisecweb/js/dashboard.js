// Verificar si el usuario está logueado
const userData = JSON.parse(localStorage.getItem("codisecUser"));
if (!userData) {
  window.location.href = "index.html";
}

document.getElementById("usernameDisplay").textContent = userData.user;

// Cerrar sesión
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("codisecUser");
  window.location.href = "index.html";
});

// Datos ficticios para KPIs
const kpiData = {
  itcaCumplimiento: 78,
  eventosProgramados: 15,
  actividadesPendientes: 4
};

document.getElementById("kpi-itca").textContent = `${kpiData.itcaCumplimiento}%`;
document.getElementById("kpi-eventos").textContent = kpiData.eventosProgramados;
document.getElementById("kpi-pendientes").textContent = kpiData.actividadesPendientes;

// Gráfico de cumplimiento ITCA
const ctx1 = document.getElementById("chartCumplimiento").getContext("2d");
new Chart(ctx1, {
  type: "doughnut",
  data: {
    labels: ["Cumplido", "Pendiente"],
    datasets: [{
      data: [kpiData.itcaCumplimiento, 100 - kpiData.itcaCumplimiento],
      backgroundColor: ["#003366", "#cc0000"]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "bottom" }
    }
  }
});

// Gráfico de eventos programados
const ctx2 = document.getElementById("chartEventos").getContext("2d");
new Chart(ctx2, {
  type: "bar",
  data: {
    labels: ["GPAI", "Escuela Segura", "Proyecto de Vida"],
    datasets: [{
      label: "Eventos",
      data: [5, 7, 3],
      backgroundColor: "#003366"
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
});
