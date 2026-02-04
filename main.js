document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app-screen');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const viewContainer = document.getElementById('view-container');
    const navLinks = document.querySelectorAll('.nav-links li');
    const viewTitle = document.getElementById('view-title');
    const modal = document.getElementById('modal-appointment');
    const appointmentForm = document.getElementById('appointment-form');
    const closeModal = document.querySelector('.close-modal');

    const checkAuth = () => {
        if (Auth.isLoggedIn()) {
            loginScreen.classList.add('hidden');
            appScreen.classList.remove('hidden');
            renderView('dashboard');
        } else {
            loginScreen.classList.remove('hidden');
            appScreen.classList.add('hidden');
        }
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (Auth.login(email, password)) {
            checkAuth();
        } else {
            alert('Credenciais inválidas! Tente admin@barber.com / admin123');
        }
    });

    logoutBtn.addEventListener('click', () => {
        Auth.logout();
    });

    const renderView = (view) => {
        const titleMap = {
            'dashboard': 'Dashboard',
            'appointments': 'Agendamentos',
            'clients': 'Clientes'
        };
        viewTitle.textContent = titleMap[view] || 'BarberFlow';
        
        if (view === 'dashboard' || view === 'appointments') {
            viewContainer.innerHTML = Dashboard.renderDashboard();
            attachDashboardEvents();
        } else if (view === 'clients') {
            const appointments = Dashboard.getAppointments();
            const clients = [...new Set(appointments.map(a => a.client))];
            viewContainer.innerHTML = `
                <div class="table-container">
                    <h3>Lista de Clientes</h3>
                    <br>
                    <table>
                        <thead><tr><th>Nome</th><th>Total de Visitas</th></tr></thead>
                        <tbody>
                            ${clients.map(client => `
                                <tr>
                                    <td>${client}</td>
                                    <td>${appointments.filter(a => a.client === client).length}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.view === view);
        });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            renderView(link.dataset.view);
        });
    });

    const attachDashboardEvents = () => {
        const btn = document.getElementById('open-appointment-modal');
        if (btn) {
            btn.addEventListener('click', () => {
                modal.classList.remove('hidden');
            });
        }
    };

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newApp = {
            client: document.getElementById('client-name').value,
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value
        };

        Dashboard.saveAppointment(newApp);
        modal.classList.add('hidden');
        appointmentForm.reset();
        renderView('dashboard');
    });

    checkAuth();
});
