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
    loadResponsables();
    
    // Configurar eventos
    setupEventListeners();
});

function setupEventListeners() {
    // Botón guardar responsable
    document.getElementById('saveResponsableBtn').addEventListener('click', saveResponsable);
    
    // Botón confirmar eliminación
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    // Filtros
    document.getElementById('filtroDistrito').addEventListener('change', loadResponsables);
    document.getElementById('filtroInstitucion').addEventListener('input', loadResponsables);
    document.getElementById('filtroEstado').addEventListener('change', loadResponsables);
    
    // Resetear formulario al cerrar modal
    document.getElementById('responsableModal').addEventListener('hidden.bs.modal', resetForm);
}

function loadDistritosSelect() {
    const distritos = getDistritos();
    const select = document.getElementById('responsableDistrito');
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

function loadResponsables() {
    const responsables = getResponsables();
    const tbody = document.getElementById('responsablesTable');
    
    // Obtener valores de filtros
    const filtroDistrito = document.getElementById('filtroDistrito').value;
    const filtroInstitucion = document.getElementById('filtroInstitucion').value.toLowerCase();
    const filtroEstado = document.getElementById('filtroEstado').value;
    
    // Filtrar responsables
    let responsablesFiltrados = responsables.filter(responsable => {
        const matchDistrito = !filtroDistrito || responsable.distritoId === filtroDistrito;
        const matchInstitucion = !filtroInstitucion || 
            (responsable.institucion && responsable.institucion.toLowerCase().includes(filtroInstitucion));
        const matchEstado = !filtroEstado || responsable.estado === filtroEstado;
        
        return matchDistrito && matchInstitucion && matchEstado;
    });
    
    if (responsablesFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No hay responsables que coincidan con los filtros</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    responsablesFiltrados.forEach(responsable => {
        const row = createResponsableRow(responsable);
        tbody.appendChild(row);
    });
}

function createResponsableRow(responsable) {
    const row = document.createElement('tr');
    const distrito = getDistritoById(responsable.distritoId);
    const actividadesCount = getActividades().filter(a => a.responsableId === responsable.id).length;
    
    row.innerHTML = `
        <td>${responsable.id}</td>
        <td>${responsable.nombre}</td>
        <td>${responsable.cargo}</td>
        <td>${responsable.institucion}</td>
        <td>${distrito ? distrito.nombre : 'N/A'}</td>
        <td>${responsable.email}</td>
        <td>${responsable.telefono || 'N/A'}</td>
        <td>
            <span class="badge bg-${responsable.estado === 'Activo' ? 'success' : 'secondary'}">
                ${responsable.estado}
            </span>
        </td>
        <td>
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-primary" onclick="editResponsable('${responsable.id}')" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteResponsable('${responsable.id}')" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function saveResponsable() {
    const id = document.getElementById('responsableId').value;
    const nombre = document.getElementById('responsableNombre').value.trim();
    const cargo = document.getElementById('responsableCargo').value.trim();
    const email = document.getElementById('responsableEmail').value.trim();
    const telefono = document.getElementById('responsableTelefono').value.trim();
    const institucion = document.getElementById('responsableInstitucion').value.trim();
    const distritoId = document.getElementById('responsableDistrito').value;
    const direccion = document.getElementById('responsableDireccion').value.trim();
    const observaciones = document.getElementById('responsableObservaciones').value.trim();
    const estado = document.getElementById('responsableEstado').value;
    
    if (!nombre || !cargo || !email || !institucion || !distritoId) {
        showAlert('Por favor, complete todos los campos obligatorios', 'danger');
        return;
    }
    
    const responsableData = {
        nombre, cargo, email, telefono, institucion, distritoId, direccion, observaciones, estado
    };
    
    if (id) {
        // Actualizar responsable existente
        if (updateResponsable(id, responsableData)) {
            showAlert('Responsable actualizado correctamente', 'success');
        } else {
            showAlert('Error al actualizar el responsable', 'danger');
        }
    } else {
        // Crear nuevo responsable
        addResponsable(responsableData);
        showAlert('Responsable creado correctamente', 'success');
    }
    
    // Cerrar modal y recargar
    const modal = bootstrap.Modal.getInstance(document.getElementById('responsableModal'));
    modal.hide();
    loadResponsables();
}

function editResponsable(id) {
    const responsable = getResponsableById(id);
    if (!responsable) return;
    
    document.getElementById('responsableId').value = responsable.id;
    document.getElementById('responsableNombre').value = responsable.nombre;
    document.getElementById('responsableCargo').value = responsable.cargo;
    document.getElementById('responsableEmail').value = responsable.email;
    document.getElementById('responsableTelefono').value = responsable.telefono || '';
    document.getElementById('responsableInstitucion').value = responsable.institucion;
    document.getElementById('responsableDistrito').value = responsable.distritoId;
    document.getElementById('responsableDireccion').value = responsable.direccion || '';
    document.getElementById('responsableObservaciones').value = responsable.observaciones || '';
    document.getElementById('responsableEstado').value = responsable.estado;
    
    document.getElementById('responsableModalLabel').textContent = 'Editar Responsable';
    
    const modal = new bootstrap.Modal(document.getElementById('responsableModal'));
    modal.show();
}

function deleteResponsable(id) {
    // Verificar si hay actividades asociadas
    const actividadesCount = getActividades().filter(a => a.responsableId === id).length;
    
    if (actividadesCount > 0) {
        showAlert(`No se puede eliminar el responsable porque tiene ${actividadesCount} actividades asociadas`, 'warning');
        return;
    }
    
    // Guardar ID para confirmación
    document.getElementById('confirmDeleteBtn').setAttribute('data-id', id);
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

function confirmDelete() {
    const id = document.getElementById('confirmDeleteBtn').getAttribute('data-id');
    
    if (deleteResponsable(id)) {
        showAlert('Responsable eliminado correctamente', 'success');
        loadResponsables();
    } else {
        showAlert('Error al eliminar el responsable', 'danger');
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    modal.hide();
}

function resetForm() {
    document.getElementById('responsableForm').reset();
    document.getElementById('responsableId').value = '';
    document.getElementById('responsableModalLabel').textContent = 'Nuevo Responsable';
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