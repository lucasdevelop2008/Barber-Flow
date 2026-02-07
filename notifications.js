// Notifications Module - Sistema completo de notificações
const Notifications = {
    container: null,
    notificationId: 0,

    init: () => {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        Notifications.container = document.getElementById('notification-container');
    },

    show: (message, type = 'info', duration = 4000) => {
        if (!Notifications.container) {
            Notifications.init();
        }

        const notificationId = ++Notifications.notificationId;
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} notification-enter`;
        notification.id = `notification-${notificationId}`;

        // Icon mapping
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon ${icons[type] || icons.info}"></i>
                <div class="notification-message">
                    <p>${message}</p>
                </div>
                <button class="notification-close" onclick="Notifications.remove(${notificationId})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-progress"></div>
        `;

        Notifications.container.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.remove('notification-enter');
            notification.classList.add('notification-show');
        }, 10);

        // Auto-dismiss
        if (duration > 0) {
            setTimeout(() => {
                Notifications.remove(notificationId);
            }, duration);
        }

        return notificationId;
    },

    success: (message, duration = 4000) => {
        return Notifications.show(message, 'success', duration);
    },

    error: (message, duration = 5000) => {
        return Notifications.show(message, 'error', duration);
    },

    warning: (message, duration = 4000) => {
        return Notifications.show(message, 'warning', duration);
    },

    info: (message, duration = 3000) => {
        return Notifications.show(message, 'info', duration);
    },

    remove: (notificationId) => {
        const notification = document.getElementById(`notification-${notificationId}`);
        if (notification) {
            notification.classList.remove('notification-show');
            notification.classList.add('notification-exit');
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    },

    clearAll: () => {
        if (Notifications.container) {
            const notifications = Notifications.container.querySelectorAll('.notification');
            notifications.forEach(notif => {
                notif.classList.add('notification-exit');
                setTimeout(() => notif.remove(), 300);
            });
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', Notifications.init);

// Export for global use
window.Notifications = Notifications;
