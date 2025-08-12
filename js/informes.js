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
    
    // Configurar eventos
    setupEventListeners();
});

function setupEventListeners() {
    // Actualizar vista previa al cambiar filtros
    document.getElementById('informeDistrito').addEventListener('change', actualizarVistaPrevia);
    document.getElementById('informeTrimestre').addEventListener('change', actualizarVistaPrevia);
    document.getElementById('informeAnio').addEventListener('change', actualizarVistaPrevia);
}

function loadDistritosSelect() {
    const distritos = getDistritos();
    const select = document.getElementById('informeDistrito');
    
    // Limpiar opciones existentes
    select.innerHTML = '<option value="">Seleccione un distrito</option>';
    
    // Agregar opciones
    distritos.forEach(distrito => {
        const option = document.createElement('option');
        option.value = distrito.id;
        option.textContent = distrito.nombre;
        select.appendChild(option);
    });
}

function actualizarVistaPrevia() {
    const distritoId = document.getElementById('informeDistrito').value;
    const trimestre = document.getElementById('informeTrimestre').value;
    const anio = document.getElementById('informeAnio').value;
    
    if (!distritoId || !trimestre || !anio) {
        document.getElementById('vistaPrevia').innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-file-earmark-text display-1 text-muted"></i>
                <h4 class="mt-3">Configure el informe para ver la vista previa</h4>
                <p class="text-muted">Seleccione un distrito, trimestre y año para generar el informe</p>
            </div>
        `;
        return;
    }
    
    const distrito = getDistritoById(distritoId);
    const actividades = getActividades().filter(a => 
        a.distritoId === distritoId && a.trimestre === trimestre
    );
    
    // Generar vista previa
    const vistaPrevia = document.getElementById('vistaPrevia');
    vistaPrevia.innerHTML = generarVistaPrevia(distrito, trimestre, anio, actividades);
    
    // Crear gráficos después de un pequeño retraso para asegurar que el DOM esté actualizado
    setTimeout(() => {
        crearGraficos(actividades);
    }, 100);
}

function generarVistaPrevia(distrito, trimestre, anio, actividades) {
    const totalActividades = actividades.length;
    const actividadesCompletadas = actividades.filter(a => a.estado === 'Completado').length;
    const porcentajeCumplimiento = totalActividades > 0 ? (actividadesCompletadas / totalActividades * 100).toFixed(1) : 0;
    
    return `
        <div class="row mb-4">
            <div class="col-12">
                <div class="text-center mb-4">
                    <h2>INFORME TRIMESTRAL DE CUMPLIMIENTO DE ACTIVIDADES</h2>
                    <h4>${distrito.nombre} - ${trimestre} Trimestre de ${anio}</h4>
                </div>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="text-muted">Total Actividades</h5>
                        <h3>${totalActividades}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="text-muted">Completadas</h5>
                        <h3>${actividadesCompletadas}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="text-muted">% Cumplimiento</h5>
                        <h3>${porcentajeCumplimiento}%</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="text-muted">Pendientes</h5>
                        <h3>${totalActividades - actividadesCompletadas}</h3>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Actividades por Estado</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="estadoChart" height="200"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Avance por Actividad</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="avanceChart" height="200"></canvas>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Detalle de Actividades</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Actividad</th>
                                <th>Responsable</th>
                                <th>Programado</th>
                                <th>Ejecutado</th>
                                <th>% Avance</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${actividades.map(actividad => {
                                const responsable = getResponsableById(actividad.responsableId);
                                const avance = actividad.avance || (actividad.programado > 0 ? (actividad.ejecutado / actividad.programado * 100).toFixed(1) : 0);
                                
                                return `
                                    <tr>
                                        <td>${actividad.id}</td>
                                        <td>${actividad.nombre}</td>
                                        <td>${responsable ? responsable.nombre : 'N/A'}</td>
                                        <td>${actividad.programado}</td>
                                        <td>${actividad.ejecutado || 0}</td>
                                        <td>${avance}%</td>
                                        <td>
                                            <span class="badge bg-${getEstadoBadgeClass(actividad.estado)}">
                                                ${actividad.estado}
                                            </span>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function crearGraficos(actividades) {
    // Gráfico de actividades por estado
    const estados = ['Pendiente', 'Enviado', 'Recibido', 'Completado'];
    const estadosCount = estados.map(estado => 
        actividades.filter(a => a.estado === estado).length
    );
    
    new Chart(document.getElementById('estadoChart'), {
        type: 'doughnut',
        data: {
            labels: estados,
            datasets: [{
                data: estadosCount,
                backgroundColor: [
                    'rgba(255, 193, 7, 0.6)',
                    'rgba(13, 110, 253, 0.6)',
                    'rgba(108, 117, 125, 0.6)',
                    'rgba(25, 135, 84, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 193, 7, 1)',
                    'rgba(13, 110, 253, 1)',
                    'rgba(108, 117, 125, 1)',
                    'rgba(25, 135, 84, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Gráfico de avance por actividad
    const actividadesNombres = actividades.map(a => a.nombre.length > 20 ? a.nombre.substring(0, 20) + '...' : a.nombre);
    const avances = actividades.map(a => a.avance || (a.programado > 0 ? (a.ejecutado / a.programado * 100) : 0));
    
    new Chart(document.getElementById('avanceChart'), {
        type: 'bar',
        data: {
            labels: actividadesNombres,
            datasets: [{
                label: '% Avance',
                data: avances,
                backgroundColor: 'rgba(26, 42, 108, 0.6)',
                borderColor: 'rgba(26, 42, 108, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function generarInforme() {
    const distritoId = document.getElementById('informeDistrito').value;
    const trimestre = document.getElementById('informeTrimestre').value;
    const anio = document.getElementById('informeAnio').value;
    
    if (!distritoId || !trimestre || !anio) {
        showAlert('Por favor, complete todos los campos', 'danger');
        return;
    }
    
    const distrito = getDistritoById(distritoId);
    const actividades = getActividades().filter(a => 
        a.distritoId === distritoId && a.trimestre === trimestre
    );
    
    if (actividades.length === 0) {
        showAlert('No hay actividades para generar el informe', 'warning');
        return;
    }
    
    // Crear contenido HTML para el PDF
    const contenido = generarContenidoPDF(distrito, trimestre, anio, actividades);
    
    // Crear un elemento temporal para renderizar el contenido
    const tempElement = document.createElement('div');
    tempElement.innerHTML = contenido;
    tempElement.style.position = 'absolute';
    tempElement.style.left = '-9999px';
    tempElement.style.width = '210mm';
    document.body.appendChild(tempElement);
    
    // Generar PDF
    html2canvas(tempElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
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
        
        pdf.save(`Informe_${distrito.nombre}_${trimestre}_${anio}.pdf`);
        
        // Eliminar elemento temporal
        document.body.removeChild(tempElement);
        
        showAlert('Informe generado correctamente', 'success');
    });
}

function generarContenidoPDF(distrito, trimestre, anio, actividades) {
    const totalActividades = actividades.length;
    const actividadesCompletadas = actividades.filter(a => a.estado === 'Completado').length;
    const porcentajeCumplimiento = totalActividades > 0 ? (actividadesCompletadas / totalActividades * 100).toFixed(1) : 0;
    
    return `
        <div style="font-family: Arial; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1>INFORME TRIMESTRAL DE CUMPLIMIENTO DE ACTIVIDADES</h1>
                <h2>${distrito.nombre} - ${trimestre} Trimestre de ${anio}</h2>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3>Resumen Ejecutivo</h3>
                <p><strong>Total de Actividades:</strong> ${totalActividades}</p>
                <p><strong>Actividades Completadas:</strong> ${actividadesCompletadas}</p>
                <p><strong>Porcentaje de Cumplimiento:</strong> ${porcentajeCumplimiento}%</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3>Detalle de Actividades</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">ID</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Actividad</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Responsable</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Programado</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Ejecutado</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">% Avance</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${actividades.map(actividad => {
                            const responsable = getResponsableById(actividad.responsableId);
                            const avance = actividad.avance || (actividad.programado > 0 ? (actividad.ejecutado / actividad.programado * 100).toFixed(1) : 0);
                            
                            return `
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${actividad.id}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${actividad.nombre}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${responsable ? responsable.nombre : 'N/A'}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${actividad.programado}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${actividad.ejecutado || 0}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${avance}%</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${actividad.estado}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <div style="margin-top: 50px; text-align: center;">
                <p>Generado el ${new Date().toLocaleDateString()}</p>
                <p>Sistema CODISEC - Comité Distrital de Seguridad Ciudadana</p>
            </div>
        </div>
    `;
}

function exportarExcel() {
    const distritoId = document.getElementById('informeDistrito').value;
    const trimestre = document.getElementById('informeTrimestre').value;
    const anio = document.getElementById('informeAnio').value;
    
    if (!distritoId || !trimestre || !anio) {
        showAlert('Por favor, complete todos los campos', 'danger');
        return;
    }
    
    const distrito = getDistritoById(distritoId);
    const actividades = getActividades().filter(a => 
        a.distritoId === distritoId && a.trimestre === trimestre
    );
    
    // Preparar datos para exportar
    const datos = actividades.map(actividad => {
        const responsable = getResponsableById(actividad.responsableId);
        const avance = actividad.avance || (actividad.programado > 0 ? (actividad.ejecutado / actividad.programado * 100).toFixed(1) : 0);
        
        return {
            ID: actividad.id,
            'Actividad': actividad.nombre,
            'Responsable': responsable ? responsable.nombre : 'N/A',
            'Programado': actividad.programado,
            'Ejecutado': actividad.ejecutado || 0,
            '% Avance': avance,
            'Estado': actividad.estado
        };
    });
    
    // Crear libro de Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datos);
    
    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Informe");
    
    // Generar archivo y descargar
    XLSX.writeFile(wb, `Informe_${distrito.nombre}_${trimestre}_${anio}.xlsx`);
    
    showAlert('Archivo Excel exportado correctamente', 'success');
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