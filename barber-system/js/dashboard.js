const Dashboard = {
    getAppointments: () => {
        const appointments = localStorage.getItem('barber_appointments');
        if (!appointments) {
            const initialData = [
                { id: 1, client: 'João Silva', service: 'Corte e Barba', date: '2026-02-04', time: '14:00', status: 'completed', price: 50 },
                { id: 2, client: 'Pedro Santos', service: 'Corte Simples', date: '2026-02-04', time: '15:30', status: 'pending', price: 35 },
                { id: 3, client: 'Ricardo Oliveira', service: 'Degradê', date: '2026-02-05', time: '10:00', status: 'pending', price: 40 }
            ];
            localStorage.setItem('barber_appointments', JSON.stringify(initialData));
            return initialData;
        }
        return JSON.parse(appointments);
    },

    saveAppointment: (appointment) => {
        const appointments = Dashboard.getAppointments();
        appointment.id = Date.now();
        appointment.status = 'pending';
        
        const prices = {
            'Corte Simples': 35,
            'Barba': 25,
            'Corte e Barba': 50,
            'Degradê': 40
        };
        appointment.price = prices[appointment.service] || 0;
        
        appointments.push(appointment);
        localStorage.setItem('barber_appointments', JSON.stringify(appointments));
    },

    getInsights: () => {
        const appointments = Dashboard.getAppointments();
        const totalRevenue = appointments.reduce((acc, curr) => acc + curr.price, 0);
        const totalAppointments = appointments.length;
        const pendingCount = appointments.filter(a => a.status === 'pending').length;

        return {
            revenue: totalRevenue,
            count: totalAppointments,
            pending: pendingCount
        };
    },

    renderDashboard: () => {
        const insights = Dashboard.getInsights();
        const appointments = Dashboard.getAppointments().sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

        return `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-calendar-check"></i></div>
                    <div class="stat-info">
                        <h3>Total Agendamentos</h3>
                        <p>${insights.count}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-dollar-sign"></i></div>
                    <div class="stat-info">
                        <h3>Receita Total</h3>
                        <p>R$ ${insights.revenue.toFixed(2)}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange"><i class="fas fa-clock"></i></div>
                    <div class="stat-info">
                        <h3>Pendentes</h3>
                        <p>${insights.pending}</p>
                    </div>
                </div>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <h3>Agendamentos Recentes</h3>
                    <button class="btn-add" id="open-appointment-modal">
                        <i class="fas fa-plus"></i> Novo Agendamento
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Serviço</th>
                            <th>Data/Hora</th>
                            <th>Valor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${appointments.map(app => `
                            <tr>
                                <td>${app.client}</td>
                                <td>${app.service}</td>
                                <td>${app.date.split('-').reverse().join('/')} às ${app.time}</td>
                                <td>R$ ${app.price.toFixed(2)}</td>
                                <td><span class="status-badge status-${app.status}">${app.status === 'completed' ? 'Concluído' : 'Pendente'}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
};
