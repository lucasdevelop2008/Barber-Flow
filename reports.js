// Reports Module - Relatórios e gráficos
const Reports = {
    render: () => {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const appointments = Data.getAppointmentsByUser(user.id);
        const insights = Data.getInsights(user.id);

        const html = `
            <div class="reports-container">
                <div class="report-section">
                    <h3>📊 Relatórios e Análises</h3>
                </div>

                <div class="reports-grid">
                    <div class="report-card">
                        <h4>Receita por Serviço</h4>
                        <canvas id="chart-service"></canvas>
                    </div>
                    <div class="report-card">
                        <h4>Status dos Agendamentos</h4>
                        <canvas id="chart-status"></canvas>
                    </div>
                    <div class="report-card">
                        <h4>Receita Mensal</h4>
                        <canvas id="chart-monthly"></canvas>
                    </div>
                    <div class="report-card">
                        <h4>Top 5 Clientes</h4>
                        <div id="top-clients"></div>
                    </div>
                </div>

                <div class="report-section">
                    <h4>📈 Estatísticas Detalhadas</h4>
                    <div class="stats-detailed">
                        <div class="stat-item">
                            <span>Total de Agendamentos</span>
                            <strong>${insights.total}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Concluídos</span>
                            <strong>${insights.completed}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Pendentes</span>
                            <strong>${insights.pending}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Cancelados</span>
                            <strong>${appointments.filter(a => a.status === 'cancelled').length}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Receita Total</span>
                            <strong>R$ ${insights.revenue.toFixed(2)}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Ticket Médio</span>
                            <strong>R$ ${(insights.revenue / Math.max(insights.completed, 1)).toFixed(2)}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Taxa de Conclusão</span>
                            <strong>${((insights.completed / Math.max(insights.total, 1)) * 100).toFixed(1)}%</strong>
                        </div>
                        <div class="stat-item">
                            <span>Total de Clientes</span>
                            <strong>${Data.getClientsByUser(user.id).length}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('view-container').innerHTML = html;

        // Draw charts after rendering
        setTimeout(() => {
            Reports.drawServiceChart(appointments);
            Reports.drawStatusChart(appointments);
            Reports.drawMonthlyChart(appointments);
            Reports.drawTopClients(appointments);
        }, 100);
    },

    drawServiceChart: (appointments) => {
        const completed = appointments.filter(a => a.status === 'completed');
        const serviceData = {};

        completed.forEach(apt => {
            serviceData[apt.service] = (serviceData[apt.service] || 0) + apt.price;
        });

        const canvas = document.getElementById('chart-service');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const labels = Object.keys(serviceData);
        const data = Object.values(serviceData);
        const colors = ['#51cf66', '#3b82f6', '#f97316', '#c9a050', '#ff6b6b', '#8b5cf6'];

        Reports.drawPieChart(ctx, labels, data, colors);
    },

    drawStatusChart: (appointments) => {
        const statusData = {
            'Concluído': appointments.filter(a => a.status === 'completed').length,
            'Pendente': appointments.filter(a => a.status === 'pending').length,
            'Cancelado': appointments.filter(a => a.status === 'cancelled').length
        };

        const canvas = document.getElementById('chart-status');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const labels = Object.keys(statusData);
        const data = Object.values(statusData);
        const colors = ['#51cf66', '#f97316', '#ff6b6b'];

        Reports.drawPieChart(ctx, labels, data, colors);
    },

    drawMonthlyChart: (appointments) => {
        const completed = appointments.filter(a => a.status === 'completed');
        const monthlyData = {};

        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
            monthlyData[monthKey] = 0;
        }

        completed.forEach(apt => {
            const date = new Date(apt.date);
            const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
            if (monthlyData[monthKey] !== undefined) {
                monthlyData[monthKey] += apt.price;
            }
        });

        const canvas = document.getElementById('chart-monthly');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const labels = Object.keys(monthlyData);
        const data = Object.values(monthlyData);

        Reports.drawBarChart(ctx, labels, data);
    },

    drawTopClients: (appointments) => {
        const completed = appointments.filter(a => a.status === 'completed');
        const clientData = {};

        completed.forEach(apt => {
            clientData[apt.clientName] = (clientData[apt.clientName] || 0) + 1;
        });

        const sorted = Object.entries(clientData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const html = sorted.map(([name, count], index) => `
            <div class="top-client-item">
                <span class="rank">#${index + 1}</span>
                <span class="name">${name}</span>
                <span class="count">${count} visitas</span>
            </div>
        `).join('');

        const container = document.getElementById('top-clients');
        if (container) {
            container.innerHTML = html || '<p>Sem dados</p>';
        }
    },

    drawPieChart: (ctx, labels, data, colors) => {
        const total = data.reduce((a, b) => a + b, 0);
        let currentAngle = -Math.PI / 2;

        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            // Draw slice
            ctx.beginPath();
            ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, 80, currentAngle, currentAngle + sliceAngle);
            ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height / 2);
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = ctx.canvas.width / 2 + Math.cos(labelAngle) * 120;
            const labelY = ctx.canvas.height / 2 + Math.sin(labelAngle) * 120;

            ctx.fillStyle = '#e0e0e0';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(labels[index], labelX, labelY);

            currentAngle += sliceAngle;
        });
    },

    drawBarChart: (ctx, labels, data) => {
        const barWidth = ctx.canvas.width / labels.length;
        const maxValue = Math.max(...data);
        const scale = (ctx.canvas.height - 40) / maxValue;

        labels.forEach((label, index) => {
            const x = index * barWidth + 10;
            const height = data[index] * scale;
            const y = ctx.canvas.height - height - 20;

            // Draw bar
            ctx.fillStyle = '#c9a050';
            ctx.fillRect(x, y, barWidth - 20, height);

            // Draw label
            ctx.fillStyle = '#e0e0e0';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(label, x + barWidth / 2 - 10, ctx.canvas.height - 5);

            // Draw value
            ctx.fillText('R$ ' + data[index].toFixed(0), x + barWidth / 2 - 10, y - 5);
        });
    }
};

function loadReports() {
    document.getElementById('view-title').textContent = 'Relatórios';
    Reports.render();
}

// Export for global use
window.Reports = Reports;
