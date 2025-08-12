if (!localStorage.getItem('codisecUser')) {
  window.location.href = 'index.html';
}

function logout() {
  localStorage.removeItem('codisecUser');
  window.location.href = 'index.html';
}

const modal = document.getElementById('responsableModal');
const responsablesTable = document.getElementById('responsablesTable');
const responsableForm = document.getElementById('responsableForm');

let responsables = [
  { nombre: 'Carlos Martínez', cargo: 'Coordinador GPAI', institucion: 'CEM', distrito: 'Distrito Norte', telefono: '987654321', correo: 'carlos.martinez@correo.com' },
  { nombre: 'Ana López', cargo: 'Directora Escuela Segura', institucion: 'IE N° 102', distrito: 'Distrito Sur', telefono: '912345678', correo: 'ana.lopez@correo.com' }
];

let editingIndex = null;

function renderResponsables() {
  responsablesTable.innerHTML = '';
  responsables.forEach((r, index) => {
    const row = `<tr>
      <td>${r.nombre}</td>
      <td>${r.cargo}</td>
      <td>${r.institucion}</td>
      <td>${r.distrito}</td>
      <td>${r.telefono}</td>
      <td>${r.correo}</td>
      <td>
        <button onclick="editResponsable(${index})">Editar</button>
        <button onclick="deleteResponsable(${index})">Eliminar</button>
      </td>
    </tr>`;
    responsablesTable.innerHTML += row;
  });
}

function openModal(index = null) {
  modal.style.display = 'block';
  if (index !== null) {
    document.getElementById('modalTitle').textContent = 'Editar Responsable';
    const r = responsables[index];
    document.getElementById('nombre').value = r.nombre;
    document.getElementById('cargo').value = r.cargo;
    document.getElementById('institucion').value = r.institucion;
    document.getElementById('distrito').value = r.distrito;
    document.getElementById('telefono').value = r.telefono;
    document.getElementById('correo').value = r.correo;
    editingIndex = index;
  } else {
    document.getElementById('modalTitle').textContent = 'Registrar Responsable';
    responsableForm.reset();
    editingIndex = null;
  }
}

function closeModal() {
  modal.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target === modal) closeModal();
};

responsableForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const nuevo = {
    nombre: document.getElementById('nombre').value,
    cargo: document.getElementById('cargo').value,
    institucion: document.getElementById('institucion').value,
    distrito: document.getElementById('distrito').value,
    telefono: document.getElementById('telefono').value,
    correo: document.getElementById('correo').value
  };
  if (editingIndex !== null) {
    responsables[editingIndex] = nuevo;
  } else {
    responsables.push(nuevo);
  }
  renderResponsables();
  closeModal();
});

function editResponsable(index) {
  openModal(index);
}

function deleteResponsable(index) {
  if (confirm('¿Eliminar este responsable?')) {
    responsables.splice(index, 1);
    renderResponsables();
  }
}

document.addEventListener('DOMContentLoaded', renderResponsables);
