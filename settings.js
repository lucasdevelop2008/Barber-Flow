// Settings Module - Configurações de serviços, horário e tema
const Settings = {
    defaultServices: [
        { name: 'Corte Simples', price: 35, duration: 30 },
        { name: 'Barba', price: 25, duration: 20 },
        { name: 'Corte e Barba', price: 50, duration: 50 },
        { name: 'Degradê', price: 40, duration: 40 },
        { name: 'Hidratação', price: 30, duration: 30 },
        { name: 'Coloração', price: 60, duration: 60 }
    ],

    getSettings: () => {
        const settings = localStorage.getItem('barber_settings');
        return settings ? JSON.parse(settings) : Settings.getDefaultSettings();
    },

    getDefaultSettings: () => ({
        services: Settings.defaultServices,
        businessHours: {
            open: '09:00',
            close: '18:00'
        },
        theme: 'dark'
    }),

    saveSettings: (settings) => {
        localStorage.setItem('barber_settings', JSON.stringify(settings));
    },

    getServices: () => {
        return Settings.getSettings().services;
    },

    addService: (name, price, duration) => {
        const settings = Settings.getSettings();
        settings.services.push({ name, price: parseFloat(price), duration: parseInt(duration) });
        Settings.saveSettings(settings);
        Notifications.success(`Serviço "${name}" adicionado!`);
    },

    updateService: (index, name, price, duration) => {
        const settings = Settings.getSettings();
        settings.services[index] = { name, price: parseFloat(price), duration: parseInt(duration) };
        Settings.saveSettings(settings);
        Notifications.success('Serviço atualizado!');
    },

    deleteService: (index) => {
        if (confirm('Tem certeza que deseja deletar este serviço?')) {
            const settings = Settings.getSettings();
            settings.services.splice(index, 1);
            Settings.saveSettings(settings);
            Notifications.warning('Serviço deletado!');
        }
    },

    setBusinessHours: (open, close) => {
        const settings = Settings.getSettings();
        settings.businessHours = { open, close };
        Settings.saveSettings(settings);
        Notifications.success('Horário de funcionamento atualizado!');
    },

    setTheme: (theme) => {
        const settings = Settings.getSettings();
        settings.theme = theme;
        Settings.saveSettings(settings);
        Settings.applyTheme(theme);
        Notifications.info(`Tema ${theme === 'dark' ? 'escuro' : 'claro'} ativado!`);
    },

    applyTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
    },

    isBusinessHours: () => {
        const settings = Settings.getSettings();
        const now = new Date();
        const currentTime = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
        
        return currentTime >= settings.businessHours.open && 
               currentTime <= settings.businessHours.close;
    },

    renderSettingsPanel: () => {
        const settings = Settings.getSettings();
        
        return `
            <div class="settings-container">
                <div class="settings-section">
                    <h3>⚙️ Configurações da Barbearia</h3>
                </div>

                <div class="settings-section">
                    <h4>🕐 Horário de Funcionamento</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Abre às</label>
                            <input type="time" id="business-open" value="${settings.businessHours.open}">
                        </div>
                        <div class="form-group">
                            <label>Fecha às</label>
                            <input type="time" id="business-close" value="${settings.businessHours.close}">
                        </div>
                        <button class="btn-primary" onclick="Settings.setBusinessHours(document.getElementById('business-open').value, document.getElementById('business-close').value);">Salvar</button>
                    </div>
                </div>

                <div class="settings-section">
                    <h4>🎨 Tema</h4>
                    <div class="theme-buttons">
                        <button class="btn-theme ${settings.theme === 'dark' ? 'active' : ''}" onclick="Settings.setTheme('dark');">
                            <i class="fas fa-moon"></i> Escuro
                        </button>
                        <button class="btn-theme ${settings.theme === 'light' ? 'active' : ''}" onclick="Settings.setTheme('light');">
                            <i class="fas fa-sun"></i> Claro
                        </button>
                    </div>
                </div>

                <div class="settings-section">
                    <h4>✂️ Serviços</h4>
                    <div class="services-list">
                        ${settings.services.map((service, index) => `
                            <div class="service-item">
                                <div class="service-info">
                                    <strong>${service.name}</strong>
                                    <span>R$ ${service.price.toFixed(2)} • ${service.duration} min</span>
                                </div>
                                <div class="service-actions">
                                    <button class="btn-action" onclick="Settings.editService(${index})"><i class="fas fa-edit"></i></button>
                                    <button class="btn-action delete" onclick="Settings.deleteService(${index})"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn-add" onclick="Settings.openAddServiceModal();">
                        <i class="fas fa-plus"></i> Novo Serviço
                    </button>
                </div>

                <div class="settings-section">
                    <h4>💾 Dados</h4>
                    <div class="data-buttons">
                        <button class="btn-primary" onclick="Export.exportAppointmentsCSV();">
                            <i class="fas fa-download"></i> Exportar Agendamentos
                        </button>
                        <button class="btn-primary" onclick="Export.exportRevenueReport();">
                            <i class="fas fa-chart-bar"></i> Relatório de Receita
                        </button>
                        <button class="btn-primary" onclick="Export.backupData();">
                            <i class="fas fa-save"></i> Fazer Backup
                        </button>
                        <button class="btn-primary" onclick="document.getElementById('restore-file').click();">
                            <i class="fas fa-undo"></i> Restaurar Backup
                        </button>
                        <input type="file" id="restore-file" style="display:none;" accept=".json" onchange="Export.restoreData(this.files[0]);">
                    </div>
                </div>
            </div>
        `;
    },

    openAddServiceModal: () => {
        const name = prompt('Nome do serviço:');
        if (!name) return;
        const price = prompt('Preço (R$):');
        if (!price) return;
        const duration = prompt('Duração (minutos):');
        if (!duration) return;

        Settings.addService(name, price, duration);
        // Reload settings view
        loadSettings();
    },

    editService: (index) => {
        const service = Settings.getServices()[index];
        const name = prompt('Nome do serviço:', service.name);
        if (!name) return;
        const price = prompt('Preço (R$):', service.price);
        if (!price) return;
        const duration = prompt('Duração (minutos):', service.duration);
        if (!duration) return;

        Settings.updateService(index, name, price, duration);
        loadSettings();
    }
};

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
    const settings = Settings.getSettings();
    Settings.applyTheme(settings.theme);
});

// Export for global use
window.Settings = Settings;
