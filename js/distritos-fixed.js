document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    // Mostrar nombre de usuario
    const username = localStorage.getItem('username');
    document.getElementById('usernameDisplay').textContent = username;
    
    // Cargar distritos
    loadDistritos();
    
    // Configurar eventos
    setupEventListeners();
});

function setupEventListeners() {
    // Botón guardar distrito
    document.getElementById('saveDistritoBtn').addEventListener('click', saveDistrito);
    
    // Botón confirmar eliminación
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    // Resetear formulario al cerrar modal
    document.getElementById('distritoModal').addEventListener('hidden.bs.modal', resetForm);
}

function loadDistritos() {
    const distritos = getDistritos();
    const container = document.getElementById('distritosContainer');
    
    if (distritos.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-inbox display-1 text-muted"></i>
                <h4 class="mt-3">No hay distritos registrados</h4>
                <p class="text-muted">Agrega un nuevo distrito para comenzar</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    distritos.forEach(distrito => {
        const card = createDistritoCard(distrito);
        container.appendChild(card);
    });
}

function createDistritoCard(distrito) {
    const col = document.createElement('div');
    col.className = 'col-xl-3 col-lg-4 col-md-6 mb-4';
    
    const actividadesCount = getActividades().filter(a => a.distritoId === distrito.id).length;
    const responsablesCount = getResponsables().filter(r => r.distritoId === distrito.id).length;
    
    col.innerHTML = `
        <div class="card h-100">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <h5 class="card-title">${distrito.nombre}</h5>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="editDistrito('${distrito.id}')">
                                <i class="bi bi-pencil"></i> Editar
                            </a></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="deleteDistrito('${distrito.id}')">
                                <i class="bi bi-trash"></i> Eliminar
                            </a></li>
                        </ul>
                    </div>
                </div>
                <p class="text-muted mb-2">${distrito.provincia}, ${distrito.departamento}</p>
                <p class="card-text">${distrito.descripcion || 'Sin descripción'}</p>
                <div class="mt-auto">
                    <div class="d-flex justify-content-between text-muted small">
                        <span><i class="bi bi-clipboard-data"></i> ${actividadesCount} actividades</span>
                        <span><i class="bi bi-people"></i> ${responsablesCount} responsables</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

function saveDistrito() {
    const id = document.getElementById('distritoId').value;
    const nombre = document.getElementById('distritoNombre').value.trim();
    const provincia = document.getElementById('distritoProvincia').value.trim();
    const departamento = document.getElementById('distritoDepartamento').value.trim();
    const descripcion = document.getElementById('distritoDescripcion').value.trim();
    
    if (!nombre || !provincia || !departamento) {
        showAlert('Por favor, complete todos los campos obligatorios', 'danger');
        return;
    }
    
    const distritoData = { nombre, provincia, departamento, descripcion };
    
    if (id) {
        // Actualizar distrito existente
        if (updateDistrito(id, distritoData)) {
            showAlert('Distrito actualizado correctamente', 'success');
        } else {
            showAlert('Error al actualizar el distrito', 'danger');
        }
    } else {
        // Crear nuevo distrito
        addDistrito(distritoData);
        showAlert('Distrito creado correctamente', 'success');
    }
    
    // Cerrar modal y recargar
    const modal = bootstrap.Modal.getInstance(document.getElementById('distritoModal'));
    modal.hide();
    loadDistritos();
}

function editDistrito(id) {
    const distrito = getDistritoById(id);
    if (!distrito) return;
    
    document.getElementById('distritoId').value = distrito.id;
    document.getElementById('distritoNombre').value = distrito.nombre;
    document.getElementById('distritoProvincia').value = distrito.provincia;
    document.getElementById('distritoDepartamento').value = distrito.departamento;
    document.getElementById('distritoDescripcion').value = distrito.descripcion || '';
    
    document.getElementById('distritoModalLabel').textContent = 'Editar Distrito';
    
    const modal = new bootstrap.Modal(document.getElementById('distritoModal'));
    modal.show();
}

function deleteDistrito(id) {
    // Verificar si hay actividades o responsables asociados
    const actividadesCount = getActividades().filter(a => a.distritoId === id).length;
    const responsablesCount = getResponsables().filter(r => r.distritoId === id).length;
    
    if (actividadesCount > 0 || responsablesCount > 0) {
        showAlert(`No se puede eliminar el distrito porque tiene ${actividadesCount} actividades y ${responsablesCount} responsables asociados`, 'warning');
        return;
    }
    
    // Guardar ID para confirmación
    document.getElementById('confirmDeleteBtn').setAttribute('data-id', id);
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

function confirmDelete() {
    const id = document.getElementById('confirmDeleteBtn').getAttribute('data-id');
    
    if (deleteDistrito(id)) {
        showAlert('Distrito eliminado correctamente', 'success');
        loadDistritos();
    } else {
        showAlert('Error al eliminar el distrito', 'danger');
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    modal.hide();
}

function resetForm() {
    document.getElementById('distritoForm').reset();
    document.getElementById('distritoId').value = '';
    document.getElementById('distritoModalLabel').textContent = 'Nuevo Distrito';
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
