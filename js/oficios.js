if (!localStorage.getItem('codisecUser')) {
  window.location.href = 'index.html';
}

function logout() {
  localStorage.removeItem('codisecUser');
  window.location.href = 'index.html';
}

const modal = document.getElementById('oficioModal');
const oficioForm = document.getElementById('oficioForm');
const oficiosTable = document.getElementById('oficiosTable');

let oficios = [
  { numero: '001-2025', fecha: '2025-08-05', destinatario: 'Alcaldía Distrital', asunto: 'Solicitud de apoyo', referencia: 'Ref-001', estado: 'Enviado' },
  { numero: '002-2025', fecha: '2025-08-07', destinatario: 'Policía Nacional', asunto: 'Informe de seguridad', referencia: 'Ref-002', estado: 'Pendiente' }
];

let editingIndex = null;

function renderOficios() {
  oficiosTable.innerHTML = '';
  oficios.forEach((o, index) => {
    const row = `<tr>
      <td>${o.numero}</td>
      <td>${o.fecha}</td>
      <td>${o.destinatario}</td>
      <td>${o.asunto}</td>
      <td>${o.referencia}</td>
      <td>${o.estado}</td>
      <td>
        <button onclick="editOficio(${index})">Editar</button>
        <button onclick="deleteOficio(${index})">Eliminar</button>
      </td>
    </tr>`;
    oficiosTable.innerHTML += row;
  });
}

function openModal(index = null) {
  modal.style.display = 'block';
  if (index !== null) {
    document.getElementById('modalTitle').textContent = 'Editar Oficio';
    const o = oficios[index];
    document.getElementById('numero').value = o.numero;
    document.getElementById('fecha').value = o.fecha;
    document.getElementById('destinatario').value = o.destinatario;
    document.getElementById('asunto').value = o.asunto;
    document.getElementById('referencia').value = o.referencia;
    document.getElementById('estado').value = o.estado;
    editingIndex = index;
  } else {
    document.getElementById('modalTitle').textContent = 'Registrar Oficio';
    oficioForm.reset();
    editingIndex = null;
  }
}

function closeModal() {
  modal.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target === modal) closeModal();
};

oficioForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const nuevo = {
    numero: document.getElementById('numero').value,
    fecha: document.getElementById('fecha').value,
    destinatario: document.getElementById('destinatario').value,
    asunto: document.getElementById('asunto').value,
    referencia: document.getElementById('referencia').value,
    estado: document.getElementById('estado').value
  };
  if (editingIndex !== null) {
    oficios[editingIndex] = nuevo;
  } else {
    oficios.push(nuevo);
  }
  renderOficios();
  closeModal();
});

function editOficio(index) {
  openModal(index);
}

function deleteOficio(index) {
  if (confirm('¿Eliminar este oficio?')) {
    oficios.splice(index, 1);
    renderOficios();
  }
}

document.addEventListener('DOMContentLoaded', renderOficios);
