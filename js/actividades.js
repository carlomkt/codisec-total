document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    // Mostrar nombre de usuario
    const username = localStorage.getItem('username');
    document.getElementById('usernameDisplay').textContent = username;
    
    // Cargar datos iniciales
    loadDistritosSelect();
    loadResponsablesSelect();
    loadActividades();
    
    // Configurar eventos
    setupEventListeners();
    
    // Calcular avance automáticamente
    document.getElementById('actividadProgramado').addEventListener('input', calcularAvance);
    document.getElementById('actividadEjecutado').addEventListener('input', calcularAvance);
});

function setupEventListeners() {
    // Botón guardar actividad
    document.getElementById('saveActividadBtn').addEventListener('click', saveActividad);
    
    // Botón confirmar eliminación
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    // Filtros
    document.getElementById('filtroDistrito').addEventListener('change', loadActividades);
    document.getElementById('filtroResponsable').addEventListener('change', loadActividades);
    document.getElementById('filtroEstado').addEventListener('change', loadActividades);
    document.getElementById('filtroTrimestre').addEventListener('change', loadActividades);
    
    // Resetear formulario al cerrar modal
    document.getElementById('actividadModal').addEventListener('hidden.bs.modal', resetForm);
}

function loadDistritosSelect() {
    const distritos = getDistritos();
    const select = document.getElementById('actividadDistrito');
    const filtroSelect = document.getElementById('filtroDistrito');
    
    // Limpiar opciones existentes
    select.innerHTML = '<option value="">Seleccione un distrito</option>';
    filtroSelect.innerHTML = '<option value="">Todos los distritos</option>';
    
    // Agregar opciones
    distritos.forEach(distrito => {
        const option = document.createElement('option');
        option.value = distrito.id;
        option.textContent = distrito.nombre;
        select.appendChild(option.cloneNode(true));
        filtroSelect.appendChild(option);
    });
}

function loadResponsablesSelect() {
    const responsables = getResponsables();
    const select = document.getElementById('actividadResponsable');
    const filtroSelect = document.getElementById('filtroResponsable');
    
    // Limpiar opciones existentes
    select.innerHTML = '<option value="">Seleccione un responsable</option>';
    filtroSelect.innerHTML = '<option value="">Todos los responsables</option>';
    
    // Agregar opciones
    responsables.forEach(responsable => {
        const option = document.createElement('option');
        option.value = responsable.id;
        option.textContent = responsable.nombre;
        select.appendChild(option.cloneNode(true));
        filtroSelect.appendChild(option);
    });
}

function loadActividades() {
    const actividades = getActividades();
    const tbody = document.getElementById('actividadesTable');
    
    // Obtener valores de filtros
    const filtroDistrito = document.getElementById('filtroDistrito').value;
    const filtroResponsable = document.getElementById('filtroResponsable').value;
    const filtroEstado = document.getElementById('filtroEstado').value;
    const filtroTrimestre = document.getElementById('filtroTrimestre').value;
    
    // Filtrar actividades
    let actividadesFiltradas = actividades.filter(actividad => {
        const matchDistrito = !filtroDistrito || actividad.distritoId === filtroDistrito;
        const matchResponsable = !filtroResponsable || actividad.responsableId === filtroResponsable;
        const matchEstado = !filtroEstado || actividad.estado === filtroEstado;
        const matchTrimestre = !filtroTrimestre || actividad.trimestre === filtroTrimestre;
        
        return matchDistrito && matchResponsable && matchEstado && matchTrimestre;
    });
    
    if (actividadesFiltradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center">No hay actividades que coincidan con los filtros</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    actividadesFiltradas.forEach(actividad => {
        const row = createActividadRow(actividad);
        tbody.appendChild(row);
    });
}

function createActividadRow(actividad) {
    const row = document.createElement('tr');
    const distrito = getDistritoById(actividad.distritoId);
    const responsable = getResponsableById(actividad.responsableId);
    
    // Calcular avance si no está definido
    const avance = actividad.avance || 
        (actividad.programado > 0 ? (actividad.ejecutado / actividad.programado * 100).toFixed(1) : 0);
    
    row.innerHTML = `
        <td>${actividad.id}</td>
        <td>${actividad.nombre}</td>
        <td>${distrito ? distrito.nombre : 'N/A'}</td>
        <td>${responsable ? responsable.nombre : 'N/A'}</td>
        <td>${actividad.unidadMedida}</td>
        <td>${actividad.programado}</td>
        <td>${actividad.ejecutado || 0}</td>
        <td>${avance}%</td>
        <td>${actividad.trimestre}</td>
        <td>
            <span class="badge bg-${getEstadoBadgeClass(actividad.estado)}">
                ${actividad.estado}
            </span>
        </td>
        <td>
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-primary" onclick="editActividad('${actividad.id}')" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="enviarOficio('${actividad.id}')" title="Enviar Oficio" 
                    ${actividad.estado !== 'Pendiente' ? 'disabled' : ''}>
                    <i class="bi bi-envelope"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteActividad('${actividad.id}')" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function calcularAvance() {
    const programado = parseFloat(document.getElementById('actividadProgramado').value) || 0;
    const ejecutado = parseFloat(document.getElementById('actividadEjecutado').value) || 0;
    
    if (programado > 0) {
        const avance = (ejecutado / programado * 100).toFixed(1);
        // Podríamos mostrar el avance en algún lugar si quisiéramos
    }
}

function saveActividad() {
    const id = document.getElementById('actividadId').value;
    const nombre = document.getElementById('actividadNombre').value.trim();
    const trimestre = document.getElementById('actividadTrimestre').value;
    const distritoId = document.getElementById('actividadDistrito').value;
    const responsableId = document.getElementById('actividadResponsable').value;
    const unidadMedida = document.getElementById('actividadUnidad').value.trim();
    const programado = parseFloat(document.getElementById('actividadProgramado').value) || 0;
    const ejecutado = parseFloat(document.getElementById('actividadEjecutado').value) || 0;
    const estado = document.getElementById('actividadEstado').value;
    const medioVerificacion = document.getElementById('actividadMedio').value.trim();
    const descripcion = document.getElementById('actividadDescripcion').value.trim();
    const observaciones = document.getElementById('actividadObservaciones').value.trim();
    
    if (!nombre || !trimestre || !distritoId || !responsableId || !unidadMedida) {
        showAlert('Por favor, complete todos los campos obligatorios', 'danger');
        return;
    }
    
    const avance = programado > 0 ? (ejecutado / programado * 100).toFixed(1) : 0;
    
    const actividadData = {
        nombre, trimestre, distritoId, responsableId, unidadMedida, programado, 
        ejecutado, avance, estado, medioVerificacion, descripcion, observaciones
    };
    
    if (id) {
        // Actualizar actividad existente
        if (updateActividad(id, actividadData)) {
            showAlert('Actividad actualizada correctamente', 'success');
        } else {
            showAlert('Error al actualizar la actividad', 'danger');
        }
    } else {
        // Crear nueva actividad
        addActividad(actividadData);
        showAlert('Actividad creada correctamente', 'success');
    }
    
    // Cerrar modal y recargar
    const modal = bootstrap.Modal.getInstance(document.getElementById('actividadModal'));
    modal.hide();
    loadActividades();
}

function editActividad(id) {
    const actividad = getActividadById(id);
    if (!actividad) return;
    
    document.getElementById('actividadId').value = actividad.id;
    document.getElementById('actividadNombre').value = actividad.nombre;
    document.getElementById('actividadTrimestre').value = actividad.trimestre;
    document.getElementById('actividadDistrito').value = actividad.distritoId;
    document.getElementById('actividadResponsable').value = actividad.responsableId;
    document.getElementById('actividadUnidad').value = actividad.unidadMedida;
    document.getElementById('actividadProgramado').value = actividad.programado;
    document.getElementById('actividadEjecutado').value = actividad.ejecutado || 0;
    document.getElementById('actividadEstado').value = actividad.estado;
    document.getElementById('actividadMedio').value = actividad.medioVerificacion || '';
    document.getElementById('actividadDescripcion').value = actividad.descripcion || '';
    document.getElementById('actividadObservaciones').value = actividad.observaciones || '';
    
    document.getElementById('actividadModalLabel').textContent = 'Editar Actividad';
    
    const modal = new bootstrap.Modal(document.getElementById('actividadModal'));
    modal.show();
}

function deleteActividad(id) {
    // Guardar ID para confirmación
    document.getElementById('confirmDeleteBtn').setAttribute('data-id', id);
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

function confirmDelete() {
    const id = document.getElementById('confirmDeleteBtn').getAttribute('data-id');
    
    if (deleteActividad(id)) {
        showAlert('Actividad eliminada correctamente', 'success');
        loadActividades();
    } else {
        showAlert('Error al eliminar la actividad', 'danger');
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    modal.hide();
}

function enviarOficio(id) {
    const actividad = getActividadById(id);
    if (!actividad) return;
    
    // Simular envío de oficio
    const oficioData = {
        actividadId: id,
        responsableId: actividad.responsableId,
        fechaEnvio: new Date().toISOString(),
        estado: 'Enviado'
    };
    
    addOficio(oficioData);
    
    // Actualizar estado de la actividad
    updateActividad(id, { estado: 'Enviado' });
    
    showAlert('Oficio enviado correctamente', 'success');
    loadActividades();
}

function exportarExcel() {
    const actividades = getActividades();
    
    // Preparar datos para exportar
    const datos = actividades.map(actividad => {
        const distrito = getDistritoById(actividad.distritoId);
        const responsable = getResponsableById(actividad.responsableId);
        
        return {
            ID: actividad.id,
            'Actividad': actividad.nombre,
            'Distrito': distrito ? distrito.nombre : 'N/A',
            'Responsable': responsable ? responsable.nombre : 'N/A',
            'Unidad Medida': actividad.unidadMedida,
            'Programado': actividad.programado,
            'Ejecutado': actividad.ejecutado || 0,
            '% Avance': actividad.avance || (actividad.programado > 0 ? (actividad.ejecutado / actividad.programado * 100).toFixed(1) : 0),
            'Trimestre': actividad.trimestre,
            'Estado': actividad.estado,
            'Medio Verificación': actividad.medioVerificacion || '',
            'Descripción': actividad.descripcion || '',
            'Observaciones': actividad.observaciones || ''
        };
    });
    
    // Crear libro de Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datos);
    
    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Actividades");
    
    // Generar archivo y descargar
    XLSX.writeFile(wb, "Actividades_CODISEC.xlsx");
    
    showAlert('Archivo Excel exportado correctamente', 'success');
}

function resetForm() {
    document.getElementById('actividadForm').reset();
    document.getElementById('actividadId').value = '';
    document.getElementById('actividadModalLabel').textContent = 'Nueva Actividad';
}

function getEstadoBadgeClass(estado) {
    switch(estado) {
        case 'Pendiente': return 'warning';
        case 'Enviado': return 'info';
        case 'Recibido': return 'secondary';
        case 'Completado': return 'success';
        default: return 'primary';
    }
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Eliminar alerta después de 3 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}
