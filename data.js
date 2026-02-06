// Data Management Module
const Data = {
    // Appointments
    getAppointmentsByUser: (userId) => {
        return Storage.getAppointments().filter(apt => apt.userId === userId);
    },

    addAppointment: (userId, appointment) => {
        const appointments = Storage.getAppointments();
        const newAppointment = {
            id: Math.max(...appointments.map(a => a.id), 0) + 1,
            userId,
            ...appointment,
            createdAt: new Date().toISOString()
        };
        appointments.push(newAppointment);
        Storage.setAppointments(appointments);
        return newAppointment;
    },

    updateAppointment: (id, updates) => {
        const appointments = Storage.getAppointments();
        const index = appointments.findIndex(a => a.id === id);
        if (index !== -1) {
            appointments[index] = { ...appointments[index], ...updates };
            Storage.setAppointments(appointments);
            return appointments[index];
        }
        return null;
    },

    deleteAppointment: (id) => {
        const appointments = Storage.getAppointments();
        const filtered = appointments.filter(a => a.id !== id);
        Storage.setAppointments(filtered);
    },

    // Clients
    getClientsByUser: (userId) => {
        return Storage.getClients().filter(c => c.userId === userId);
    },

    getOrCreateClient: (userId, clientName) => {
        const clients = Storage.getClients();
        let client = clients.find(c => c.userId === userId && c.name.toLowerCase() === clientName.toLowerCase());
        
        if (!client) {
            client = {
                id: Math.max(...clients.map(c => c.id), 0) + 1,
                userId,
                name: clientName,
                phone: '',
                email: '',
                visits: 0
            };
            clients.push(client);
            Storage.setClients(clients);
        }
        
        return client;
    },

    updateClient: (id, updates) => {
        const clients = Storage.getClients();
        const index = clients.findIndex(c => c.id === id);
        if (index !== -1) {
            clients[index] = { ...clients[index], ...updates };
            Storage.setClients(clients);
            return clients[index];
        }
        return null;
    },

    // Insights
    getInsights: (userId) => {
        const appointments = Data.getAppointmentsByUser(userId);
        const total = appointments.length;
        const completed = appointments.filter(a => a.status === 'completed').length;
        const pending = appointments.filter(a => a.status === 'pending').length;
        const revenue = appointments
            .filter(a => a.status === 'completed')
            .reduce((sum, a) => sum + (a.price || 0), 0);

        return { total, completed, pending, revenue };
    },

    // Service prices
    getServicePrice: (serviceName) => {
        const prices = {
            'Corte Simples': 35,
            'Barba': 25,
            'Corte e Barba': 50,
            'Degradê': 40,
            'Hidratação': 30,
            'Coloração': 60
        };
        return prices[serviceName] || 0;
    }
};
