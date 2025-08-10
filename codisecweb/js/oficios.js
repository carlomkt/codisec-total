// Verificar login
const userData = JSON.parse(localStorage.getItem("codisecUser"));
if (!userData) {
  window.location.href = "index.html";
}
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("codisecUser");
  window.location.href = "index.html";
});

// Datos ficticios iniciales
let oficios = [
  {
    id: "1",
    fecha: "2025-08-05",
    destinatario: "Dirección de Educación",
    asunto: "Solicitud de apoyo para evento",
    contenido: "Solicitamos apoyo logístico para el evento de prevención escolar...",
    estado: "Enviado"
  }
];

const tableBody = document.getElementById("oficiosTableBody");
const modal = document.getElementById("oficioModal");
const form = document.getElementById("oficioForm");
let editOficioId = null;

function renderOficios() {
  tableBody.innerHTML = "";
  oficios.forEach(o => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.fecha}</td>
      <td>${o.destinatario}</td>
      <td>${o.asunto}</td>
      <td>${o.estado}</td>
      <td>
        <button onclick="editarOficio('${o.id}')">✏️</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

document.getElementById("nuevoOficioBtn").addEventListener("click", () => {
  editOficioId = null;
  form.reset();
  document.getElementById("modalTitle").textContent = "Nuevo Oficio";
  modal.showModal();
});

document.getElementById("saveOficioBtn").addEventListener("click", (e) => {
  e.preventDefault();

  const nuevo = {
    id: editOficioId || String(Date.now()),
    fecha: document.getElementById("fecha").value,
    destinatario: document.getElementById("destinatario").value,
    asunto: document.getElementById("asunto").value,
    contenido: document.getElementById("contenido").value,
    estado: document.getElementById("estado").value
  };

  if (editOficioId) {
    const index = oficios.findIndex(o => o.id === editOficioId);
    oficios[index] = nuevo;
  } else {
    oficios.push(nuevo);
  }

  renderOficios();
  modal.close();
});

function editarOficio(id) {
  const o = oficios.find(of => of.id === id);
  if (!o) return;

  editOficioId = id;
  document.getElementById("modalTitle").textContent = "Editar Oficio";
  document.getElementById("fecha").value = o.fecha;
  document.getElementById("destinatario").value = o.destinatario;
  document.getElementById("asunto").value = o.asunto;
  document.getElementById("contenido").value = o.contenido;
  document.getElementById("estado").value = o.estado;

  modal.showModal();
}

// PDF
document.getElementById("pdfBtn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(`Oficio - ${document.getElementById("asunto").value}`, 10, 10);
  doc.text(`Fecha: ${document.getElementById("fecha").value}`, 10, 20);
  doc.text(`Destinatario: ${document.getElementById("destinatario").value}`, 10, 30);
  doc.text(`Contenido:`, 10, 40);
  doc.text(document.getElementById("contenido").value, 10, 50);
  doc.save(`oficio_${Date.now()}.pdf`);
});

renderOficios();
