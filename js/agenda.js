if (!localStorage.getItem('codisecUser')) {
  window.location.href = 'index.html';
}

function logout() {
  localStorage.removeItem('codisecUser');
  window.location.href = 'index.html';
}

const modal = document.getElementById('eventModal');
const eventForm = document.getElementById('eventForm');
let editingEvent = null;

function openModal(eventData = null) {
  modal.style.display = 'block';
  if (eventData) {
    document.getElementById('modalTitle').textContent = 'Editar Evento';
    document.getElementById('fecha').value = eventData.startStr.split('T')[0];
    document.getElementById('hora').value = eventData.startStr.split('T')[1]?.slice(0,5) || '';
    document.getElementById('duracion').value = eventData.extendedProps.duracion || '';
    document.getElementById('lugar').value = eventData.extendedProps.lugar || '';
    document.getElementById('institucion').value = eventData.extendedProps.institucion || '';
    document.getElementById('aliado').value = eventData.extendedProps.aliado || '';
    document.getElementById('tema').value = eventData.extendedProps.tema || '';
    document.getElementById('publico').value = eventData.extendedProps.publico || '';
    document.getElementById('responsable').value = eventData.extendedProps.responsable || '';
    document.getElementById('observaciones').value = eventData.extendedProps.observaciones || '';
    document.getElementById('estado').value = eventData.extendedProps.estado || 'Pendiente';
    editingEvent = eventData;
  } else {
    document.getElementById('modalTitle').textContent = 'Registrar Evento';
    eventForm.reset();
    editingEvent = null;
  }
}

function closeModal() {
  modal.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target === modal) closeModal();
};

// Datos ficticios
let eventos = [
  {
    title: 'CHARLA - VIOLENCIA',
    start: '2025-08-19T10:00:00',
    extendedProps: {
      duracion: 40,
      lugar: 'CEM',
      institucion: 'Escolares',
      aliado: 'GPAI',
      tema: 'Violencia',
      publico: 'Escolares',
      responsable: 'Patricia Cruz',
      observaciones: 'Preventivo cyberbullying',
      estado: 'Confirmado'
    }
  }
];

document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'es',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: eventos,
    dateClick: function(info) {
      openModal({ startStr: info.dateStr });
    },
    eventClick: function(info) {
      openModal(info.event);
    }
  });
  calendar.render();

  eventForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const nuevoEvento = {
      title: document.getElementById('tema').value,
      start: `${document.getElementById('fecha').value}T${document.getElementById('hora').value}`,
      extendedProps: {
        duracion: document.getElementById('duracion').value,
        lugar: document.getElementById('lugar').value,
        institucion: document.getElementById('institucion').value,
        aliado: document.getElementById('aliado').value,
        tema: document.getElementById('tema').value,
        publico: document.getElementById('publico').value,
        responsable: document.getElementById('responsable').value,
        observaciones: document.getElementById('observaciones').value,
        estado: document.getElementById('estado').value
      }
    };
    if (editingEvent) {
      editingEvent.setProp('title', nuevoEvento.title);
      editingEvent.setStart(nuevoEvento.start);
      editingEvent.setExtendedProp('duracion', nuevoEvento.extendedProps.duracion);
      editingEvent.setExtendedProp('lugar', nuevoEvento.extendedProps.lugar);
      editingEvent.setExtendedProp('institucion', nuevoEvento.extendedProps.institucion);
      editingEvent.setExtendedProp('aliado', nuevoEvento.extendedProps.aliado);
      editingEvent.setExtendedProp('tema', nuevoEvento.extendedProps.tema);
      editingEvent.setExtendedProp('publico', nuevoEvento.extendedProps.publico);
      editingEvent.setExtendedProp('responsable', nuevoEvento.extendedProps.responsable);
      editingEvent.setExtendedProp('observaciones', nuevoEvento.extendedProps.observaciones);
      editingEvent.setExtendedProp('estado', nuevoEvento.extendedProps.estado);
    } else {
      calendar.addEvent(nuevoEvento);
    }
    closeModal();
  });
});
