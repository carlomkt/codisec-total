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
    loadOficios();
    
    // Configurar eventos
    setupEventListeners();
});

function setupEventListeners() {
    // Botón confirmar envío masivo
    document.getElementById('confirmEnvioMasivoBtn').addEventListener('click', confirmEnvioMasivo);
    
    // Botón confirmar eliminación
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    // Filtros
    document.getElementById('filtroDistrito').addEventListener('change', loadOficios);
    document.getElementById('filtroResponsable').addEventListener('change', loadOficios);
    document.getElementById('filtroEstado').addEventListener('change', loadOficios);
}

function loadDistritosSelect() {
    const distritos = getDistritos();
    const select = document.getElementById('filtroDistrito');
    
    // Limpiar opciones existentes
    select.innerHTML = '<option value="">Todos los distritos</option>';
    
    // Agregar opciones
    distritos.forEach(distrito => {
        const option = document.createElement('option');
        option.value = distrito.id;
        option.textContent = distrito.nombre;
        select.appendChild(option);
    });
}

function loadResponsablesSelect() {
    const responsables = getResponsables();
    const select = document.getElementById('filtroResponsable');
    
    // Limpiar opciones existentes
    select.innerHTML = '<option value="">Todos los responsables</option>';
    
    // Agregar opciones
    responsables.forEach(responsable => {
        const option = document.createElement('option');
        option.value = responsable.id;
        option.textContent = responsable.nombre;
        select.appendChild(option);
    });
}

function loadOficios() {
    const oficios = getOficios();
    const tbody = document.getElementById('oficiosTable');
    
    // Obtener valores de filtros
    const filtroDistrito = document.getElementById('filtroDistrito').value;
    const filtroResponsable = document.getElementById('filtroResponsable').value;
    const filtroEstado = document.getElementById('filtroEstado').value;
    
    // Filtrar oficios
    let oficiosFiltrados = oficios.filter(oficio => {
        const actividad = getActividadById(oficio.actividadId);
        if (!actividad) return false;
        
        const distrito = getDistritoById(actividad.distritoId);
        const responsable = getResponsableById(actividad.responsableId);
        
        const matchDistrito = !filtroDistrito || (distrito && distrito.id === filtroDistrito);
        const matchResponsable = !filtroResponsable || (responsable && responsable.id === filtroResponsable);
        const matchEstado = !filtroEstado || oficio.estado === filtroEstado;
        
        return matchDistrito && matchResponsable && matchEstado;
    });
    
    if (oficiosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay oficios que coincidan con los filtros</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    oficiosFiltrados.forEach(oficio => {
        const row = createOficioRow(oficio);
        tbody.appendChild(row);
    });
}

function createOficioRow(oficio) {
    const row = document.createElement('tr');
    const actividad = getActividadById(oficio.actividadId);
    const responsable = getResponsableById(oficio.responsableId);
    const distrito = getDistritoById(actividad.distritoId);
    
    const fechaEnvio = new Date(oficio.fechaEnvio).toLocaleDateString();
    
    row.innerHTML = `
        <td>${oficio.id}</td>
        <td>${actividad.nombre}</td>
        <td>${responsable ? responsable.nombre : 'N/A'}</td>
        <td>${distrito ? distrito.nombre : 'N/A'}</td>
        <td>${fechaEnvio}</td>
        <td>
            <span class="badge bg-${getEstadoBadgeClass(oficio.estado)}">
                ${oficio.estado}
            </span>
        </td>
        <td>
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-primary" onclick="verOficio('${oficio.id}')" title="Ver Oficio">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="generarPDF('${oficio.id}')" title="Generar PDF">
                    <i class="bi bi-file-earmark-pdf"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteOficio('${oficio.id}')" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function enviarOficiosMasivos() {
    // Verificar si hay actividades pendientes
    const actividadesPendientes = getActividades().filter(a => a.estado === 'Pendiente');
    
    if (actividadesPendientes.length === 0) {
        showAlert('No hay actividades pendientes para enviar oficios', 'warning');
        return;
    }
    
    // Mostrar modal de confirmación
    const modal = new bootstrap.Modal(document.getElementById('envioMasivoModal'));
    modal.show();
}

function confirmEnvioMasivo() {
    const actividadesPendientes = getActividades().filter(a => a.estado === 'Pendiente');
    let enviados = 0;
    
    actividadesPendientes.forEach(actividad => {
        // Crear oficio
        const oficioData = {
            actividadId: actividad.id,
            responsableId: actividad.responsableId,
            fechaEnvio: new Date().toISOString(),
            estado: 'Enviado'
        };
        
        addOficio(oficioData);
        
        // Actualizar estado de la actividad
        updateActividad(actividad.id, { estado: 'Enviado' });
        
        enviados++;
    });
    
    // Cerrar modal y recargar
    const modal = bootstrap.Modal.getInstance(document.getElementById('envioMasivoModal'));
    modal.hide();
    
    showAlert(`Se enviaron ${enviados} oficios correctamente`, 'success');
    loadOficios();
}

function verOficio(id) {
    const oficio = getOficioById(id);
    if (!oficio) return;
    
    const actividad = getActividadById(oficio.actividadId);
    const responsable = getResponsableById(oficio.responsableId);
    
    // Crear contenido del oficio
    const contenido = `
        <h4>Oficio N° ${oficio.id}-${new Date().getFullYear()}-RST-CODISEC</h4>
        <p><strong>Fecha:</strong> ${new Date(oficio.fechaEnvio).toLocaleDateString()}</p>
        <p><strong>Destinatario:</strong> ${responsable.nombre}</p>
        <p><strong>Cargo:</strong> ${responsable.cargo}</p>
        <p><strong>Institución:</strong> ${responsable.institucion}</p>
        <hr>
        <h5>Asunto: Solicitud de Informe de Actividades</h5>
        <p>Por medio del presente, se solicita remitir el informe de las actividades desarrolladas en el marco del Plan de Acción Distrital de Seguridad Ciudadana.</p>
        <p><strong>Actividad:</strong> ${actividad.nombre}</p>
        <p><strong>Unidad de Medida:</strong> ${actividad.unidadMedida}</p>
        <p><strong>Meta Programada:</strong> ${actividad.programado}</p>
        <p><strong>Fecha límite de entrega:</strong> ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
        <hr>
        <p>Atentamente,</p>
        <p>Comité Distrital de Seguridad Ciudadana</p>
    `;
    
    // Mostrar en un modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'verOficioModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Vista Previa del Oficio</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ${contenido}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" onclick="generarPDF('${id}')">Generar PDF</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // Eliminar modal al cerrar
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
    });
}

function generarPDF(id) {
    const oficio = getOficioById(id);
    if (!oficio) return;
    
    const actividad = getActividadById(oficio.actividadId);
    const responsable = getResponsableById(oficio.responsableId);
    
    // Crear contenido HTML para el PDF
    const contenido = `
        <div style="font-family: Arial; padding: 20px;">
            <h1 style="text-align: center;">OFICIO N° ${oficio.id}-${new Date().getFullYear()}-RST-CODISEC</h1>
            <p style="text-align: right;">${new Date(oficio.fechaEnvio).toLocaleDateString()}</p>
            <br>
            <p><strong>Señor(a):</strong></p>
            <p>${responsable.nombre}</p>
            <p>${responsable.cargo}</p>
            <p>${responsable.institucion}</p>
            <br>
            <h2>ASUNTO: SOLICITUD DE INFORME DE ACTIVIDADES</h2>
            <br>
            <p>De mi mayor consideración:</p>
            <br>
            <p>Por medio del presente, se solicita remitir el informe de las actividades desarrolladas en el marco del Plan de Acción Distrital de Seguridad Ciudadana.</p>
            <br>
            <p><strong>Actividad:</strong> ${actividad.nombre}</p>
            <p><strong>Unidad de Medida:</strong> ${actividad.unidadMedida}</p>
            <p><strong>Meta Programada:</strong> ${actividad.programado}</p>
            <p><strong>Fecha límite de entrega:</strong> ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            <br>
            <p>Sin otro particular, le saludo atentamente.</p>
            <br>
            <p>Atentamente,</p>
            <p>Comité Distrital de Seguridad Ciudadana</p>
        </div>
    `;
    
    // Crear un elemento temporal para renderizar el contenido
    const tempElement = document.createElement('div');
    tempElement.innerHTML = contenido;
    tempElement.style.position = 'absolute';
    tempElement.style.left = '-9999px';
    document.body.appendChild(tempElement);
    
    // Generar PDF
    html2canvas(tempElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(`Oficio_${oficio.id}.pdf`);
        
        // Eliminar elemento temporal
        document.body.removeChild(tempElement);
        
        showAlert('PDF generado correctamente', 'success');
    });
}

function deleteOficio(id) {
    // Guardar ID para confirmación
    document.getElementById('confirmDeleteBtn').setAttribute('data-id', id);
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

function confirmDelete() {
    const id = document.getElementById('confirmDeleteBtn').getAttribute('data-id');
    
    if (deleteOficio(id)) {
        showAlert('Oficio eliminado correctamente', 'success');
        loadOficios();
    } else {
        showAlert('Error al eliminar el oficio', 'danger');
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    modal.hide();
}

function exportarExcel() {
    const oficios = getOficios();
    
    // Preparar datos para exportar
    const datos = oficios.map(oficio => {
        const actividad = getActividadById(oficio.actividadId);
        const responsable = getResponsableById(oficio.responsableId);
        const distrito = getDistritoById(actividad.distritoId);
        
        return {
            ID: oficio.id,
            'Actividad': actividad.nombre,
            'Responsable': responsable ? responsable.nombre : 'N/A',
            'Distrito': distrito ? distrito.nombre : 'N/A',
            'Fecha Envío': new Date(oficio.fechaEnvio).toLocaleDateString(),
            'Estado': oficio.estado
        };
    });
    
    // Crear libro de Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datos);
    
    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Oficios");
    
    // Generar archivo y descargar
    XLSX.writeFile(wb, "Oficios_CODISEC.xlsx");
    
    showAlert('Archivo Excel exportado correctamente', 'success');
}

function getEstadoBadgeClass(estado) {
    switch(estado) {
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