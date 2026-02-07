// Filters Module - Filtros e busca avançada
const Filters = {
    currentFilters: {
        searchTerm: '',
        status: 'all',
        dateFrom: '',
        dateTo: '',
        service: 'all'
    },

    applyFilters: (appointments) => {
        let filtered = appointments;

        // Search term
        if (Filters.currentFilters.searchTerm) {
            const term = Filters.currentFilters.searchTerm.toLowerCase();
            filtered = filtered.filter(apt =>
                apt.clientName.toLowerCase().includes(term) ||
                apt.service.toLowerCase().includes(term) ||
                apt.notes.toLowerCase().includes(term)
            );
        }

        // Status filter
        if (Filters.currentFilters.status !== 'all') {
            filtered = filtered.filter(apt => apt.status === Filters.currentFilters.status);
        }

        // Service filter
        if (Filters.currentFilters.service !== 'all') {
            filtered = filtered.filter(apt => apt.service === Filters.currentFilters.service);
        }

        // Date range filter
        if (Filters.currentFilters.dateFrom) {
            filtered = filtered.filter(apt => new Date(apt.date) >= new Date(Filters.currentFilters.dateFrom));
        }

        if (Filters.currentFilters.dateTo) {
            filtered = filtered.filter(apt => new Date(apt.date) <= new Date(Filters.currentFilters.dateTo));
        }

        return filtered;
    },

    renderFilterPanel: () => {
        const services = [
            'Corte Simples', 'Barba', 'Corte e Barba', 'Degradê', 'Hidratação', 'Coloração'
        ];

        return `
            <div class="filter-panel">
                <div class="filter-group">
                    <input type="text" id="filter-search" placeholder="🔍 Buscar cliente, serviço..." 
                           value="${Filters.currentFilters.searchTerm}"
                           onchange="Filters.updateFilter('searchTerm', this.value); Appointments.render();">
                </div>
                <div class="filter-row">
                    <div class="filter-group">
                        <label>Status</label>
                        <select id="filter-status" onchange="Filters.updateFilter('status', this.value); Appointments.render();">
                            <option value="all" ${Filters.currentFilters.status === 'all' ? 'selected' : ''}>Todos</option>
                            <option value="pending" ${Filters.currentFilters.status === 'pending' ? 'selected' : ''}>Pendente</option>
                            <option value="completed" ${Filters.currentFilters.status === 'completed' ? 'selected' : ''}>Concluído</option>
                            <option value="cancelled" ${Filters.currentFilters.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Serviço</label>
                        <select id="filter-service" onchange="Filters.updateFilter('service', this.value); Appointments.render();">
                            <option value="all" ${Filters.currentFilters.service === 'all' ? 'selected' : ''}>Todos</option>
                            ${services.map(s => `<option value="${s}" ${Filters.currentFilters.service === s ? 'selected' : ''}>${s}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="filter-row">
                    <div class="filter-group">
                        <label>De</label>
                        <input type="date" id="filter-date-from" value="${Filters.currentFilters.dateFrom}"
                               onchange="Filters.updateFilter('dateFrom', this.value); Appointments.render();">
                    </div>
                    <div class="filter-group">
                        <label>Até</label>
                        <input type="date" id="filter-date-to" value="${Filters.currentFilters.dateTo}"
                               onchange="Filters.updateFilter('dateTo', this.value); Appointments.render();">
                    </div>
                    <button class="btn-small" onclick="Filters.clearFilters(); Appointments.render();">Limpar</button>
                </div>
            </div>
        `;
    },

    updateFilter: (key, value) => {
        Filters.currentFilters[key] = value;
    },

    clearFilters: () => {
        Filters.currentFilters = {
            searchTerm: '',
            status: 'all',
            dateFrom: '',
            dateTo: '',
            service: 'all'
        };
        Notifications.info('Filtros limpos');
    }
};

// Export for global use
window.Filters = Filters;
