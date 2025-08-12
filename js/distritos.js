if (!localStorage.getItem('codisecUser')) {
  window.location.href = 'index.html';
}

function logout() {
  localStorage.removeItem('codisecUser');
  window.location.href = 'index.html';
}

const modal = document.getElementById('distritoModal');
const distritosTable = document.getElementById('distritosTable');
const distritoForm = document.getElementById('distritoForm');

let distritos = [
  { nombre: 'Distrito Norte', responsable: 'María Pérez', telefono: '987654321', correo: 'maria.perez@correo.com', actividades: 'Charlas GPAI, inspecciones' },
  { nombre: 'Distrito Sur', responsable: 'Juan López', telefono: '912345678', correo: 'juan.lopez@correo.com', actividades: 'Escuela Segura, campañas informativas' }
];

let editingIndex = null;

function renderDistritos() {
  distritosTable.innerHTML = '';
  distritos.forEach((d, index) => {
    const row = `<tr>
      <td>${d.nombre}</td>
      <td>${d.responsable}</td>
      <td>${d.telefono}</td>
      <td>${d.correo}</td>
      <td>${d.actividades}</td>
      <td>
        <button onclick="editDistrito(${index})">Editar</button>
        <button onclick="deleteDistrito(${index})">Eliminar</button>
      </td>
    </tr>`;
    distritosTable.innerHTML += row;
  });
}

function openModal(index = null) {
  modal.style.display = 'block';
  if (index !== null) {
    document.getElementById('modalTitle').textContent = 'Editar Distrito';
    const d = distritos[index];
    document.getElementById('nombre').value = d.nombre;
    document.getElementById('responsable').value = d.responsable;
    document.getElementById('telefono').value = d.telefono;
    document.getElementById('correo').value = d.correo;
    document.getElementById('actividades').value = d.actividades;
    editingIndex = index;
  } else {
    document.getElementById('modalTitle').textContent = 'Registrar Distrito';
    distritoForm.reset();
    editingIndex = null;
  }
}

function closeModal() {
  modal.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target === modal) closeModal();
};

distritoForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const nuevo = {
    nombre: document.getElementById('nombre').value,
    responsable: document.getElementById('responsable').value,
    telefono: document.getElementById('telefono').value,
    correo: document.getElementById('correo').value,
    actividades: document.getElementById('actividades').value
  };
  if (editingIndex !== null) {
    distritos[editingIndex] = nuevo;
  } else {
    distritos.push(nuevo);
  }
  renderDistritos();
  closeModal();
});

function editDistrito(index) {
  openModal(index);
}

function deleteDistrito(index) {
  if (confirm('¿Eliminar este distrito?')) {
    distritos.splice(index, 1);
    renderDistritos();
  }
}

document.addEventListener('DOMContentLoaded', renderDistritos);
