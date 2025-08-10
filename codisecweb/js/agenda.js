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
let eventos = [
  {
    id: "1",
    title: "CHARLA - VIOLENCIA",
    start: "2025-08-19T10:00:00",
    extendedProps: {
      duracion: 40,
      tema: "VIOLENCIA",
      aliado: "GPAI",
      institucion: "CEM",
      publico: "Escolares",
      responsable: "Patricia Cruz",
      observaciones: "Preventivo Cyberbullying",
      estado: "Confirmado"
    }
  }
];

const calendarEl = document.getElementById("calendar");
const modal = document.getElementById("eventModal");
const form = document.getElementById("eventForm");
let editEventId = null;

// Inicializar FullCalendar
const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: "dayGridMonth",
  locale: "es",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay"
  },
  events: eventos,
  dateClick: (info) => {
    abrirModal(null, info.dateStr);
  },
  eventClick: (info) => {
    abrirModal(info.event);
  }
});

calendar.render();

// Función para abrir modal
function abrirModal(evento, fechaSeleccionada = null) {
  if (evento) {
    editEventId = evento.id;
    document.getElementById("modalTitle").textContent = "Editar Evento";
    document.getElementById("fecha").value = evento.startStr.split("T")[0];
    document.getElementById("hora").value = evento.startStr.split("T")[1]?.substring(0,5) || "";
    document.getElementById("duracion").value = evento.extendedProps.duracion;
    document.getElementById("actividad").value = evento.title.split(" - ")[0];
    document.getElementById("tema").value = evento.extendedProps.tema;
    document.getElementById("aliado").value = evento.extendedProps.aliado;
    document.getElementById("institucion").value = evento.extendedProps.institucion;
    document.getElementById("publico").value = evento.extendedProps.publico;
    document.getElementById("responsable").value = evento.extendedProps.responsable;
    document.getElementById("observaciones").value = evento.extendedProps.observaciones;
    document.getElementById("estado").value = evento.extendedProps.estado;
  } else {
    editEventId = null;
    form.reset();
    document.getElementById("modalTitle").textContent = "Nuevo Evento";
    if (fechaSeleccionada) {
      document.getElementById("fecha").value = fechaSeleccionada;
    }
  }
  modal.showModal();
}

// Guardar evento
document.getElementById("saveEventBtn").addEventListener("click", (e) => {
  e.preventDefault();

  const nuevoEvento = {
    id: editEventId || String(Date.now()),
    title: `${document.getElementById("actividad").value} - ${document.getElementById("tema").value}`,
    start: `${document.getElementById("fecha").value}T${document.getElementById("hora").value}`,
    extendedProps: {
      duracion: parseInt(document.getElementById("duracion").value),
      tema: document.getElementById("tema").value,
      aliado: document.getElementById("aliado").value,
      institucion: document.getElementById("institucion").value,
      publico: document.getElementById("publico").value,
      responsable: document.getElementById("responsable").value,
      observaciones: document.getElementById("observaciones").value,
      estado: document.getElementById("estado").value
    }
  };

  if (editEventId) {
    // Actualizar
    const index = eventos.findIndex(e => e.id === editEventId);
    eventos[index] = nuevoEvento;
  } else {
    eventos.push(nuevoEvento);
  }

  calendar.removeAllEvents();
  calendar.addEventSource(eventos);
  modal.close();
});
