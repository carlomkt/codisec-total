document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya hay una sesión activa
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'dashboard-ultra-simple.html';
    }
    
    // Manejar el formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Simulación de autenticación (en un sistema real, esto se haría en el backend)
            if (username === 'admin' && password === 'admin123') {
                // Guardar sesión
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                
                if (rememberMe) {
                    localStorage.setItem('rememberUser', username);
                } else {
                    localStorage.removeItem('rememberUser');
                }
                
                // Redirigir al dashboard
                window.location.href = 'dashboard-ultra-simple.html';
            } else {
                // Mostrar error
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-danger mt-3';
                alertDiv.textContent = 'Usuario o contraseña incorrectos';
                loginForm.appendChild(alertDiv);
                
                // Eliminar la alerta después de 3 segundos
                setTimeout(() => {
                    alertDiv.remove();
                }, 3000);
            }
        });
    }
    
    // Recordar usuario si está guardado
    const rememberedUser = localStorage.getItem('rememberUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
});

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

// Si necesitas actualizar datos, hazlo solo UNA vez al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Tu código de carga de datos aquí
});