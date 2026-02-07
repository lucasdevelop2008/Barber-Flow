// Export Module - Exportar dados em CSV e fazer backup/restauração
const Export = {
    // Exportar agendamentos em CSV
    exportAppointmentsCSV: () => {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const appointments = Data.getAppointmentsByUser(user.id);
        
        if (appointments.length === 0) {
            Notifications.warning('Nenhum agendamento para exportar');
            return;
        }

        // Create CSV header
        let csv = 'Cliente,Serviço,Data,Hora,Valor,Status,Observações\n';

        // Add data rows
        appointments.forEach(apt => {
            const date = new Date(apt.date).toLocaleDateString('pt-BR');
            const notes = (apt.notes || '').replace(/,/g, ';'); // Escape commas
            csv += `"${apt.clientName}","${apt.service}","${date}","${apt.time}",${apt.price},"${apt.status}","${notes}"\n`;
        });

        Export.downloadFile(csv, `agendamentos_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        Notifications.success('Agendamentos exportados com sucesso!');
    },

    // Exportar relatório de receita
    exportRevenueReport: () => {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const appointments = Data.getAppointmentsByUser(user.id);
        const completed = appointments.filter(a => a.status === 'completed');
        const totalRevenue = completed.reduce((sum, a) => sum + a.price, 0);

        let csv = 'Relatório de Receita\n';
        csv += `Período: ${new Date().toLocaleDateString('pt-BR')}\n`;
        csv += `Usuário: ${user.name}\n\n`;
        csv += 'Cliente,Serviço,Data,Valor\n';

        completed.forEach(apt => {
            const date = new Date(apt.date).toLocaleDateString('pt-BR');
            csv += `"${apt.clientName}","${apt.service}","${date}",${apt.price}\n`;
        });

        csv += `\nTotal de Receita,R$ ${totalRevenue.toFixed(2)}\n`;
        csv += `Total de Agendamentos Concluídos,${completed.length}\n`;

        Export.downloadFile(csv, `relatorio_receita_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        Notifications.success('Relatório de receita exportado!');
    },

    // Fazer backup completo dos dados
    backupData: () => {
        const backup = {
            timestamp: new Date().toISOString(),
            users: Storage.getUsers(),
            appointments: Storage.getAppointments(),
            clients: Storage.getClients(),
            settings: localStorage.getItem('barber_settings') || '{}'
        };

        const json = JSON.stringify(backup, null, 2);
        Export.downloadFile(json, `backup_barberflow_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
        Notifications.success('Backup criado com sucesso!');
    },

    // Restaurar dados de backup
    restoreData: (file) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const backup = JSON.parse(e.target.result);
                
                // Validate backup structure
                if (!backup.users || !backup.appointments || !backup.clients) {
                    throw new Error('Arquivo de backup inválido');
                }

                // Confirm restore
                if (confirm('Tem certeza? Isso vai sobrescrever todos os dados atuais!')) {
                    Storage.setUsers(backup.users);
                    Storage.setAppointments(backup.appointments);
                    Storage.setClients(backup.clients);
                    
                    if (backup.settings) {
                        localStorage.setItem('barber_settings', backup.settings);
                    }

                    Notifications.success('Dados restaurados com sucesso! Recarregando...');
                    setTimeout(() => location.reload(), 2000);
                }
            } catch (error) {
                Notifications.error('Erro ao restaurar backup: ' + error.message);
            }
        };

        reader.readAsText(file);
    },

    // Helper function to download file
    downloadFile: (content, filename, type) => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:' + type + ';charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
};

// Export for global use
window.Export = Export;
