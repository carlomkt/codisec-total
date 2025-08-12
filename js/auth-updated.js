// Sistema de autenticación mejorado con manejo de errores

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya hay una sesión activa
    const isLoggedIn = SafeStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
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
            
            try {
                // Validación de entrada
                if (!username || !password) {
                    throw new Error('Usuario y contraseña son requeridos');
                }
                
                // Simulación de autenticación con manejo de errores
                if (username === 'admin' && password === 'admin123') {
                    // Guardar sesión de forma segura
                    SafeStorage.setItem('isLoggedIn', 'true');
                    SafeStorage.setItem('username', username);
                    
                    if (rememberMe) {
                        SafeStorage.setItem('rememberUser', username);
                    } else {
                        SafeStorage.removeItem('rememberUser');
                    }
                    
                    // Redirigir al dashboard
                    window.location.href = 'dashboard-ultra-simple.html';
                } else {
                    throw new Error('Credenciales incorrectas');
                }
            } catch (error) {
                Logger.error('Error en autenticación', error);
                ErrorHandler.showUserError(error.message);
            }
        });
    }
    
    // Recordar usuario si está guardado
    const rememberedUser = SafeStorage.getItem('rememberUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
});

// Función mejorada de logout
function logout() {
    try {
        SafeStorage.removeItem('isLoggedIn');
        SafeStorage.removeItem('username');
        window.location.href = 'index.html';
    } catch (error) {
        Logger.error('Error al cerrar sesión', error);
        ErrorHandler.showUserError('Error al cerrar sesión');
    }
}

// Función para verificar autenticación
function checkAuth() {
    try {
        const isLoggedIn = SafeStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = 'index.html';
            return false;
        }
        
        // Mostrar nombre de usuario
        const username = SafeStorage.getItem('username');
        if (username) {
            document.getElementById('usernameDisplay').textContent = username;
        }
        return true;
    } catch (error) {
        Logger.error('Error al verificar autenticación', error);
        window.location.href = 'index.html';
        return false;
    }
}
