// Clients Module
const Clients = {
    render: () => {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const clients = Data.getClientsByUser(user.id);
        const appointments = Data.getAppointmentsByUser(user.id);

        // Enrich clients with visit count
        const enrichedClients = clients.map(client => {
            const visits = appointments.filter(apt => apt.clientName.toLowerCase() === client.name.toLowerCase()).length;
            return { ...client, visits };
        });

        const html = `
            <div class="table-container">
                <div class="table-header">
                    <h3>Clientes</h3>
                </div>
                ${enrichedClients.length > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Telefone</th>
                                <th>E-mail</th>
                                <th>Visitas</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${enrichedClients.map(client => `
                                <tr>
                                    <td>${client.name}</td>
                                    <td>${client.phone || '-'}</td>
                                    <td>${client.email || '-'}</td>
                                    <td>
                                        <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: rgba(201, 160, 80, 0.1); color: var(--secondary); font-weight: bold;">
                                            ${client.visits}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : `
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <p>Nenhum cliente encontrado</p>
                        <p style="font-size: 0.9rem; margin-top: 0.5rem;">Clientes serão adicionados automaticamente ao criar agendamentos</p>
                    </div>
                `}
            </div>
        `;

        document.getElementById('view-container').innerHTML = html;
    }
};
