// Sistema de manejo de errores y utilidades

// Clase para manejo centralizado de errores
class ErrorHandler {
    static logError(error, context = '') {
        console.error(`[ERROR] ${context}:`, error);
        
        // Mostrar error al usuario si es crítico
        if (this.shouldShowToUser(error)) {
            this.showUserError(this.getUserFriendlyMessage(error));
        }
    }

    static shouldShowToUser(error) {
        return error instanceof TypeError || 
               error instanceof ReferenceError ||
               error.message.includes('localStorage') ||
               error.message.includes('JSON');
    }

    static getUserFriendlyMessage(error) {
        const errorMessages = {
            'QuotaExceededError': 'Espacio de almacenamiento lleno',
            'TypeError': 'Error de tipo de dato',
            'ReferenceError': 'Referencia no encontrada',
            'JSON': 'Error al procesar datos',
            'localStorage': 'Error al guardar datos localmente',
            'network': 'Error de conexión',
            'default': 'Ha ocurrido un error inesperado'
        };

        for (const [key, message] of Object.entries(errorMessages)) {
            if (error.message.includes(key) || error.name === key) {
                return message;
            }
        }

        return errorMessages.default;
    }

    static showUserError(message) {
        // Crear notificación de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        errorDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
        errorDiv.innerHTML = `
            <strong>Error:</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    static safeExecute(fn, fallback = null, context = '') {
        try {
            return fn();
        } catch (error) {
            this.logError(error, context);
            return fallback;
        }
    }

    static async safeAsyncExecute(asyncFn, fallback = null, context = '') {
        try {
            return await asyncFn();
        } catch (error) {
            this.logError(error, context);
            return fallback;
        }
    }
}

// Wrapper seguro para localStorage
class SafeStorage {
    static setItem(key, value) {
        return ErrorHandler.safeExecute(() => {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
            return true;
        }, false, `setItem(${key})`);
    }

    static getItem(key, defaultValue = null) {
        return ErrorHandler.safeExecute(() => {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        }, defaultValue, `getItem(${key})`);
    }

    static removeItem(key) {
        return ErrorHandler.safeExecute(() => {
            localStorage.removeItem(key);
            return true;
        }, false, `removeItem(${key})`);
    }

    static clear() {
        return ErrorHandler.safeExecute(() => {
            localStorage.clear();
            return true;
        }, false, 'clear');
    }
}

// Validador de datos
class DataValidator {
    static validateDistrito(distrito) {
        const errors = [];
        
        if (!distrito || typeof distrito !== 'object') {
            errors.push('El distrito debe ser un objeto válido');
        } else {
            if (!distrito.nombre || distrito.nombre.trim().length === 0) {
                errors.push('El nombre del distrito es requerido');
            }
            if (!distrito.coordinador || distrito.coordinador.trim().length === 0) {
                errors.push('El coordinador es requerido');
            }
            if (!distrito.telefono || !this.validatePhone(distrito.telefono)) {
                errors.push('El teléfono debe tener al menos 7 dígitos');
            }
        }
        
        return errors;
    }

    static validateResponsable(responsable) {
        const errors = [];
        
        if (!responsable || typeof responsable !== 'object') {
            errors.push('El responsable debe ser un objeto válido');
        } else {
            if (!responsable.nombre || responsable.nombre.trim().length === 0) {
                errors.push('El nombre es requerido');
            }
            if (!responsable.cargo || responsable.cargo.trim().length === 0) {
                errors.push('El cargo es requerido');
            }
            if (!responsable.email || !this.validateEmail(responsable.email)) {
                errors.push('El email debe ser válido');
            }
        }
        
        return errors;
    }

    static validateActividad(actividad) {
        const errors = [];
        
        if (!actividad || typeof actividad !== 'object') {
            errors.push('La actividad debe ser un objeto válido');
        } else {
            if (!actividad.titulo || actividad.titulo.trim().length === 0) {
                errors.push('El título es requerido');
            }
            if (!actividad.distritoId || actividad.distritoId.trim().length === 0) {
                errors.push('Debe seleccionar un distrito');
            }
            if (!actividad.responsableId || actividad.responsableId.trim().length === 0) {
                errors.push('Debe seleccionar un responsable');
            }
        }
        
        return errors;
    }

    static validateOficio(oficio) {
        const errors = [];
        
        if (!oficio || typeof oficio !== 'object') {
            errors.push('El oficio debe ser un objeto válido');
        } else {
            if (!oficio.numero || oficio.numero.trim().length === 0) {
                errors.push('El número de oficio es requerido');
            }
            if (!oficio.asunto || oficio.asunto.trim().length === 0) {
                errors.push('El asunto es requerido');
            }
            if (!oficio.destinatario || oficio.destinatario.trim().length === 0) {
                errors.push('El destinatario es requerido');
            }
        }
        
        return errors;
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePhone(phone) {
        const phoneRegex = /^\d{7,}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }
}

// Sistema de logging mejorado
class Logger {
    static log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console[level](`[${timestamp}] ${level.toUpperCase()}: ${message}`, data);
        
        // Guardar logs en localStorage para debugging
        const logs = SafeStorage.getItem('app_logs', []);
        logs.push(logEntry);
        
        // Mantener solo los últimos 100 logs
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }
        
        SafeStorage.setItem('app_logs', logs);
    }

    static info(message, data = null) {
        this.log('info', message, data);
    }

    static warn(message, data = null) {
        this.log('warn', message, data);
    }

    static error(message, data = null) {
        this.log('error', message, data);
    }
}

// Exportar utilidades para uso global
window.ErrorHandler = ErrorHandler;
window.SafeStorage = SafeStorage;
window.DataValidator = DataValidator;
window.Logger = Logger;
