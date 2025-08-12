// Funciones para gestionar datos en localStorage

// Inicializar datos si no existen
function inicializarDatos() {
    if (!localStorage.getItem('distritos')) {
        localStorage.setItem('distritos', JSON.stringify([]));
    }
    if (!localStorage.getItem('responsables')) {
        localStorage.setItem('responsables', JSON.stringify([]));
    }
    if (!localStorage.getItem('actividades')) {
        localStorage.setItem('actividades', JSON.stringify([]));
    }
    if (!localStorage.getItem('oficios')) {
        localStorage.setItem('oficios', JSON.stringify([]));
    }
}

// Funciones para Distritos
function getDistritos() {
    inicializarDatos();
    return JSON.parse(localStorage.getItem('distritos')) || [];
}

function addDistrito(distrito) {
    const distritos = getDistritos();
    distrito.id = Date.now().toString();
    distritos.push(distrito);
    localStorage.setItem('distritos', JSON.stringify(distritos));
    return distrito;
}

function updateDistrito(id, distritoActualizado) {
    const distritos = getDistritos();
    const index = distritos.findIndex(d => d.id === id);
    if (index !== -1) {
        distritos[index] = { ...distritos[index], ...distritoActualizado };
        localStorage.setItem('distritos', JSON.stringify(distritos));
        return true;
    }
    return false;
}

function deleteDistrito(id) {
    const distritos = getDistritos();
    const nuevosDistritos = distritos.filter(d => d.id !== id);
    localStorage.setItem('distritos', JSON.stringify(nuevosDistritos));
    return nuevosDistritos.length !== distritos.length;
}

function getDistritoById(id) {
    const distritos = getDistritos();
    return distritos.find(d => d.id === id);
}

// Funciones para Responsables
function getResponsables() {
    inicializarDatos();
    return JSON.parse(localStorage.getItem('responsables')) || [];
}

function addResponsable(responsable) {
    const responsables = getResponsables();
    responsable.id = Date.now().toString();
    responsables.push(responsable);
    localStorage.setItem('responsables', JSON.stringify(responsables));
    return responsable;
}

function updateResponsable(id, responsableActualizado) {
    const responsables = getResponsables();
    const index = responsables.findIndex(r => r.id === id);
    if (index !== -1) {
        responsables[index] = { ...responsables[index], ...responsableActualizado };
        localStorage.setItem('responsables', JSON.stringify(responsables));
        return true;
    }
    return false;
}

function deleteResponsable(id) {
    const responsables = getResponsables();
    const nuevosResponsables = responsables.filter(r => r.id !== id);
    localStorage.setItem('responsables', JSON.stringify(nuevosResponsables));
    return nuevosResponsables.length !== responsables.length;
}

function getResponsableById(id) {
    const responsables = getResponsables();
    return responsables.find(r => r.id === id);
}

// Funciones para Actividades
function getActividades() {
    inicializarDatos();
    return JSON.parse(localStorage.getItem('actividades')) || [];
}

function addActividad(actividad) {
    const actividades = getActividades();
    actividad.id = Date.now().toString();
    actividad.estado = 'Pendiente';
    actividad.fechaCreacion = new Date().toISOString();
    actividades.push(actividad);
    localStorage.setItem('actividades', JSON.stringify(actividades));
    return actividad;
}

function updateActividad(id, actividadActualizada) {
    const actividades = getActividades();
    const index = actividades.findIndex(a => a.id === id);
    if (index !== -1) {
        actividades[index] = { ...actividades[index], ...actividadActualizada };
        localStorage.setItem('actividades', JSON.stringify(actividades));
        return true;
    }
    return false;
}

function deleteActividad(id) {
    const actividades = getActividades();
    const nuevasActividades = actividades.filter(a => a.id !== id);
    localStorage.setItem('actividades', JSON.stringify(nuevasActividades));
    return nuevasActividades.length !== actividades.length;
}

function getActividadById(id) {
    const actividades = getActividades();
    return actividades.find(a => a.id === id);
}

// Funciones para Oficios
function getOficios() {
    inicializarDatos();
    return JSON.parse(localStorage.getItem('oficios')) || [];
}

function addOficio(oficio) {
    const oficios = getOficios();
    oficio.id = Date.now().toString();
    oficio.fechaEnvio = new Date().toISOString();
    oficios.push(oficio);
    localStorage.setItem('oficios', JSON.stringify(oficios));
    return oficio;
}

function updateOficio(id, oficioActualizado) {
    const oficios = getOficios();
    const index = oficios.findIndex(o => o.id === id);
    if (index !== -1) {
        oficios[index] = { ...oficios[index], ...oficioActualizado };
        localStorage.setItem('oficios', JSON.stringify(oficios));
        return true;
    }
    return false;
}

function deleteOficio(id) {
    const oficios = getOficios();
    const nuevosOficios = oficios.filter(o => o.id !== id);
    localStorage.setItem('oficios', JSON.stringify(nuevosOficios));
    return nuevosOficios.length !== oficios.length;
}

function getOficioById(id) {
    const oficios = getOficios();
    return oficios.find(o => o.id === id);
}