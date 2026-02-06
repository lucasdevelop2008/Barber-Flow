// Main App Module
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (Auth.isLoggedIn()) {
        showScreen('app-screen');
        updateUserProfile();
        loadDashboard();
    } else {
        showScreen('login-screen');
    }

    // Setup navigation
    setupNavigation();
});

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Get view name and render
            const view = item.getAttribute('data-view');
            loadView(view);
        });
    });
}

function loadView(view) {
    const titleMap = {
        'dashboard': 'Dashboard',
        'appointments': 'Agendamentos',
        'clients': 'Clientes'
    };

    document.getElementById('view-title').textContent = titleMap[view] || 'Dashboard';

    switch(view) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'appointments':
            Appointments.render();
            break;
        case 'clients':
            Clients.render();
            break;
        default:
            loadDashboard();
    }
}

// Export functions for global use
window.showScreen = showScreen;
window.updateUserProfile = updateUserProfile;
window.loadDashboard = loadDashboard;
window.loadView = loadView;
