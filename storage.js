// Storage Module - Gerencia persistência de dados no localStorage
const Storage = {
    // Users
    getUsers: () => JSON.parse(localStorage.getItem('barber_users') || '[]'),
    setUsers: (users) => localStorage.setItem('barber_users', JSON.stringify(users)),
    
    // Appointments
    getAppointments: () => JSON.parse(localStorage.getItem('barber_appointments') || '[]'),
    setAppointments: (appointments) => localStorage.setItem('barber_appointments', JSON.stringify(appointments)),
    
    // Clients
    getClients: () => JSON.parse(localStorage.getItem('barber_clients') || '[]'),
    setClients: (clients) => localStorage.setItem('barber_clients', JSON.stringify(clients)),
    
    // Current User
    getCurrentUser: () => JSON.parse(localStorage.getItem('barber_current_user') || 'null'),
    setCurrentUser: (user) => localStorage.setItem('barber_current_user', JSON.stringify(user)),
    
    // Initialize demo data
    initializeDemoData: () => {
        const users = Storage.getUsers();
        if (users.length === 0) {
            Storage.setUsers([
                { id: 1, name: 'Admin', email: 'admin@barber.com', password: 'admin123' }
            ]);
        }
        
        const appointments = Storage.getAppointments();
        if (appointments.length === 0) {
            Storage.setAppointments([
                {
                    id: 1,
                    userId: 1,
                    clientName: 'João Silva',
                    service: 'Corte e Barba',
                    date: new Date().toISOString().split('T')[0],
                    time: '14:00',
                    status: 'completed',
                    price: 50,
                    notes: ''
                },
                {
                    id: 2,
                    userId: 1,
                    clientName: 'Pedro Santos',
                    service: 'Corte Simples',
                    date: new Date().toISOString().split('T')[0],
                    time: '15:30',
                    status: 'pending',
                    price: 35,
                    notes: ''
                }
            ]);
        }
    }
};

// Initialize on load
Storage.initializeDemoData();
