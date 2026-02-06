// Dashboard Module
const Dashboard = {
    render: () => {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const insights = Data.getInsights(user.id);
        const appointments = Data.getAppointmentsByUser(user.id)
            .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));

        const html = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-calendar-check"></i></div>
                    <div class="stat-info">
                        <h3>Total de Agendamentos</h3>
                        <p>${insights.total}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-info">
                        <h3>Concluídos</h3>
                        <p>${insights.completed}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange"><i class="fas fa-clock"></i></div>
                    <div class="stat-info">
                        <h3>Pendentes</h3>
                        <p>${insights.pending}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon amber"><i class="fas fa-dollar-sign"></i></div>
                    <div class="stat-info">
                        <h3>Receita Total</h3>
                        <p>R$ ${insights.revenue.toFixed(2)}</p>
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
                ${appointments.length > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Serviço</th>
                                <th>Data/Hora</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${appointments.map(apt => `
                                <tr>
                                    <td>${apt.clientName}</td>
                                    <td>${apt.service}</td>
                                    <td>${new Date(apt.date).toLocaleDateString('pt-BR')} às ${apt.time}</td>
                                    <td>R$ ${apt.price.toFixed(2)}</td>
                                    <td><span class="status-badge status-${apt.status}">${Dashboard.getStatusLabel(apt.status)}</span></td>
                                    <td>
                                        <button class="btn-action" onclick="Dashboard.openEditModal(${apt.id})"><i class="fas fa-edit"></i></button>
                                        <button class="btn-action delete" onclick="Dashboard.deleteAppointment(${apt.id})"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : `
                    <div class="empty-state">
                        <i class="fas fa-calendar"></i>
                        <p>Nenhum agendamento encontrado</p>
                    </div>
                `}
            </div>
        `;

        document.getElementById('view-container').innerHTML = html;
        document.getElementById('open-appointment-modal').addEventListener('click', Appointments.openModal);
    },

    getStatusLabel: (status) => {
        const labels = {
            'pending': 'Pendente',
            'completed': 'Concluído',
            'cancelled': 'Cancelado'
        };
        return labels[status] || status;
    },

    openEditModal: (appointmentId) => {
        const appointments = Storage.getAppointments();
        const appointment = appointments.find(a => a.id === appointmentId);
        
        if (appointment) {
            document.getElementById('edit-appointment-id').value = appointmentId;
            document.getElementById('edit-status').value = appointment.status;
            document.getElementById('edit-notes').value = appointment.notes || '';
            
            const modal = document.getElementById('modal-edit-appointment');
            modal.classList.add('active');
        }
    },

    deleteAppointment: (appointmentId) => {
        if (confirm('Tem certeza que deseja deletar este agendamento?')) {
            Data.deleteAppointment(appointmentId);
            Dashboard.render();
        }
    }
};

function loadDashboard() {
    document.getElementById('view-title').textContent = 'Dashboard';
    Dashboard.render();
}
