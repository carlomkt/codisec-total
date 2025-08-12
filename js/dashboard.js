// Protección de acceso
if (!localStorage.getItem("loggedIn")) {
  window.location.href = "index.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
});

// Datos ficticios
document.getElementById("kpi-itca").textContent = "85%";
document.getElementById("kpi-eventos").textContent = "12";
document.getElementById("kpi-alertas").textContent = "3";

// Chart.js ITCA
const ctx1 = document.getElementById("chartITCA").getContext("2d");
new Chart(ctx1, {
  type: "bar",
  data: {
    labels: ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Trimestre 4"],
    datasets: [{
      label: "Cumplimiento ITCA (%)",
      data: [82, 85, 78, 90],
      backgroundColor: "#003366"
    }]
  },
  options: { responsive: true }
});

// Chart.js Eventos
const ctx2 = document.getElementById("chartEventos").getContext("2d");
new Chart(ctx2, {
  type: "pie",
  data: {
    labels: ["GPAI", "Escuela Segura", "Proyecto de Vida"],
    datasets: [{
      data: [5, 4, 3],
      backgroundColor: ["#003366", "#cc0000", "#006699"]
    }]
  },
  options: { responsive: true }
});
