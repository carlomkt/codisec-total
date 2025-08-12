if (!localStorage.getItem('codisecUser')) {
  window.location.href = 'index.html';
}

function logout() {
  localStorage.removeItem('codisecUser');
  window.location.href = 'index.html';
}

const modal = document.getElementById('informeModal');
const informeForm = document.getElementById('informeForm');
const informesTable = document.getElementById('informesTable');

let informes = [
  { trimestre: 'I Trimestre', fecha: '2025-03-31', resumen: 'Informe de actividades preventivas del primer trimestre.', archivo: 'informe1.pdf' },
  { trimestre: 'II Trimestre', fecha: '2025-06-30', resumen: 'Actividades y estadísticas preventivas del segundo trimestre.', archivo: 'informe2.pdf' }
];

let editingIndex = null;

function renderInformes() {
  informesTable.innerHTML = '';
  informes.forEach((i, index) => {
    const row = `<tr>
      <td>${i.trimestre}</td>
      <td>${i.fecha}</td>
      <td>${i.resumen}</td>
      <td><a href="${i.archivo}" target="_blank">${i.archivo}</a></td>
      <td>
        <button onclick="editInforme(${index})">Editar</button>
        <button onclick="deleteInforme(${index})">Eliminar</button>
      </td>
    </tr>`;
    informesTable.innerHTML += row;
  });
}

function openModal(index = null) {
  modal.style.display = 'block';
  if (index !== null) {
    document.getElementById('modalTitle').textContent = 'Editar Informe';
    const i = informes[index];
    document.getElementById('trimestre').value = i.trimestre[0];
    document.getElementById('fecha').value = i.fecha;
    document.getElementById('resumen').value = i.resumen;
    editingIndex = index;
  } else {
    document.getElementById('modalTitle').textContent = 'Registrar Informe';
    informeForm.reset();
    editingIndex = null;
  }
}

function closeModal() {
  modal.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target === modal) closeModal();
};

informeForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const nuevo = {
    trimestre: `${document.getElementById('trimestre').value} Trimestre`,
    fecha: document.getElementById('fecha').value,
    resumen: document.getElementById('resumen').value,
    archivo: document.getElementById('archivo').files[0] ? document.getElementById('archivo').files[0].name : ''
  };
  if (editingIndex !== null) {
    informes[editingIndex] = nuevo;
  } else {
    informes.push(nuevo);
  }
  renderInformes();
  closeModal();
});

function editInforme(index) {
  openModal(index);
}

function deleteInforme(index) {
  if (confirm('¿Eliminar este informe?')) {
    informes.splice(index, 1);
    renderInformes();
  }
}

document.addEventListener('DOMContentLoaded', renderInformes);
