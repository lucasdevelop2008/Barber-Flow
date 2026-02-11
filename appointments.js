// Appointments Module
const Appointments = {
    openModal: () => {
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        document.getElementById('time').value = '09:00';
        document.getElementById('client-name').value = '';
        document.getElementById('service').value = '';
        document.getElementById('notes').value = '';
        
        const modal = document.getElementById('modal-appointment');
        modal.classList.add('active');
    },

    closeModal: () => {
        const modal = document.getElementById('modal-appointment');
        modal.classList.remove('active');
    },

    deleteAppointmentWithNotif: (appointmentId) => {
        if (confirm('Tem certeza que deseja deletar este agendamento?')) {
            Data.deleteAppointment(appointmentId);
            Notifications.warning('Agendamento deletado com sucesso.');
            Appointments.render();
        }
    },

    render: () => {
        const user = Auth.getCurrentUser();
        if (!user) return;

        let appointments = Data.getAppointmentsByUser(user.id)
            .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
        
        appointments = Filters.applyFilters(appointments);

        const html = `
            ${Filters.renderFilterPanel()}
            <div class="table-container">
                <div class="table-header">
                    <h3>Agendamentos</h3>
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
                                <th>Data</th>
                                <th>Hora</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Observações</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                                    <tbody>
                                        ${appointments.filter(apt => !apt.isPublicBooking).map(apt => `
                                <tr>
                                    <td>${apt.clientName}</td>
                                    <td>${apt.service}</td>
                                    <td>${new Date(apt.date).toLocaleDateString('pt-BR')}</td>
                                    <td>${apt.time}</td>
                                    <td>R$ ${apt.price.toFixed(2)}</td>
                                    <td><span class="status-badge status-${apt.status}">${Dashboard.getStatusLabel(apt.status)}</span></td>
                                    <td>${apt.notes || '-'}</td>
                                    <td>
                                        <button class="btn-action" onclick="Dashboard.openEditModal(${apt.id})" title="Editar"><i class="fas fa-edit"></i></button>
                                        <button class="btn-action delete" onclick="Appointments.deleteAppointmentWithNotif(${apt.id})" title="Deletar"><i class="fas fa-trash"></i></button>
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
    }
};

// Setup appointment form
document.addEventListener('DOMContentLoaded', () => {
    const appointmentForm = document.getElementById('appointment-form');
    const editAppointmentForm = document.getElementById('edit-appointment-form');
    const modalCloseButtons = document.querySelectorAll('.close-modal');

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const user = Auth.getCurrentUser();
            const clientName = document.getElementById('client-name').value;
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const notes = document.getElementById('notes').value;
            const price = Data.getServicePrice(service);

            // Create or get client
            Data.getOrCreateClient(user.id, clientName);

            // Add appointment
            Data.addAppointment(user.id, {
                clientName,
                service,
                date,
                time,
                status: 'pending',
                price,
                notes
            });

            Appointments.closeModal();
            Notifications.success(`Agendamento criado para ${clientName} em ${new Date(date).toLocaleDateString('pt-BR')} às ${time}`);
            
            // Reload current view
            const activeNav = document.querySelector('.nav-item.active');
            if (activeNav) {
                const view = activeNav.getAttribute('data-view');
                if (view === 'dashboard') {
                    loadDashboard();
                } else if (view === 'appointments') {
                    Appointments.render();
                }
            }
        });
    }

    if (editAppointmentForm) {
        editAppointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const appointmentId = parseInt(document.getElementById('edit-appointment-id').value);
            const status = document.getElementById('edit-status').value;
            const notes = document.getElementById('edit-notes').value;

            Data.updateAppointment(appointmentId, { status, notes });

            const modal = document.getElementById('modal-edit-appointment');
            modal.classList.remove('active');
            
            const statusLabel = Dashboard.getStatusLabel(status);
            Notifications.success(`Agendamento atualizado para ${statusLabel}`);
            
            // Reload current view
            const activeNav = document.querySelector('.nav-item.active');
            if (activeNav) {
                const view = activeNav.getAttribute('data-view');
                if (view === 'dashboard') {
                    loadDashboard();
                } else if (view === 'appointments') {
                    Appointments.render();
                }
            }
        });
    }

    // Close modals
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            modal.classList.remove('active');
        });
    });

    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});
