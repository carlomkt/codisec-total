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
let responsables = [
  { id: "1", nombre: "Patricia Cruz", cargo: "Coordinadora GPAI", institucion: "CEM", distrito: "Distrito Norte", telefono: "987654321", email: "patricia.cruz@ejemplo.com" },
  { id: "2", nombre: "Luis Fernández", cargo: "Jefe de Seguridad", institucion: "Municipalidad", distrito: "Distrito Sur", telefono: "912345678", email: "luis.fernandez@ejemplo.com" }
];

const tableBody = document.getElementById("responsablesTableBody");
const modal = document.getElementById("responsableModal");
const form = document.getElementById("responsableForm");
let editResponsableId = null;

function renderResponsables() {
  tableBody.innerHTML = "";
  responsables.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.nombre}</td>
      <td>${r.cargo}</td>
      <td>${r.institucion}</td>
      <td>${r.distrito}</td>
      <td>${r.telefono}</td>
      <td>${r.email}</td>
      <td>
        <button onclick="editarResponsable('${r.id}')">✏️</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

document.getElementById("nuevoResponsableBtn").addEventListener("click", () => {
  editResponsableId = null;
  form.reset();
  document.getElementById("modalTitle").textContent = "Nuevo Responsable";
  modal.showModal();
});

document.getElementById("saveResponsableBtn").addEventListener("click", (e) => {
  e.preventDefault();

  const nuevo = {
    id: editResponsableId || String(Date.now()),
    nombre: document.getElementById("nombreResponsable").value,
    cargo: document.getElementById("cargoResponsable").value,
    institucion: document.getElementById("institucionResponsable").value,
    distrito: document.getElementById("distritoResponsable").value,
    telefono: document.getElementById("telefonoResponsable").value,
    email: document.getElementById("emailResponsable").value
  };

  if (editResponsableId) {
    const index = responsables.findIndex(r => r.id === editResponsableId);
    responsables[index] = nuevo;
  } else {
    responsables.push(nuevo);
  }

  renderResponsables();
  modal.close();
});

function editarResponsable(id) {
  const r = responsables.find(res => res.id === id);
  if (!r) return;

  editResponsableId = id;
  document.getElementById("modalTitle").textContent = "Editar Responsable";
  document.getElementById("nombreResponsable").value = r.nombre;
  document.getElementById("cargoResponsable").value = r.cargo;
  document.getElementById("institucionResponsable").value = r.institucion;
  document.getElementById("distritoResponsable").value = r.distrito;
  document.getElementById("telefonoResponsable").value = r.telefono;
  document.getElementById("emailResponsable").value = r.email;

  modal.showModal();
}

renderResponsables();
