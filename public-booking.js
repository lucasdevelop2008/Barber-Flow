// Public Booking Module - Agendamento público para clientes
const PublicBooking = {
    // Get available time slots for a specific date
    getAvailableSlots: (date, barberId = null) => {
        const settings = Settings.getSettings();
        const appointments = Storage.getAppointments();
        
        // Filter appointments for the selected date
        const dayAppointments = appointments.filter(apt => {
            const aptDate = new Date(apt.date).toLocaleDateString();
            const selectedDate = new Date(date).toLocaleDateString();
            
            if (barberId) {
                return aptDate === selectedDate && apt.userId === barberId;
            }
            return aptDate === selectedDate;
        });

        // Generate time slots
        const slots = [];
        const [openHour, openMin] = settings.businessHours.open.split(':').map(Number);
        const [closeHour, closeMin] = settings.businessHours.close.split(':').map(Number);
        
        let currentHour = openHour;
        let currentMin = openMin;

        while (currentHour < closeHour || (currentHour === closeHour && currentMin < closeMin)) {
            const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
            
            // Check if slot is available
            const isBooked = dayAppointments.some(apt => apt.time === timeStr);
            
            if (!isBooked) {
                slots.push({
                    time: timeStr,
                    available: true
                });
            }

            currentMin += 30; // 30-minute intervals
            if (currentMin >= 60) {
                currentMin = 0;
                currentHour += 1;
            }
        }

        return slots;
    },

    // Render public booking page
    render: () => {
        const html = `
            <div class="public-booking-container">
                <div class="booking-header">
                    <div class="booking-logo">
                        <i class="fas fa-scissors"></i>
                        <h1>BarberFlow</h1>
                    </div>
                    <p>Agende seu horário agora mesmo!</p>
                </div>

                <div class="booking-form">
                    <form id="public-booking-form">
                        <div class="form-section">
                            <h3>Seus Dados</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="client-name-public">Nome Completo *</label>
                                    <input type="text" id="client-name-public" placeholder="Seu nome" required>
                                </div>
                                <div class="form-group">
                                    <label for="client-phone">Telefone *</label>
                                    <input type="tel" id="client-phone" placeholder="(11) 99999-9999" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="client-email-public">E-mail</label>
                                <input type="email" id="client-email-public" placeholder="seu@email.com">
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Escolha o Serviço</h3>
                            <div class="services-public">
                                ${Settings.getServices().map((service, index) => `
                                    <div class="service-option">
                                        <input type="radio" id="service-${index}" name="service" value="${service.name}" required>
                                        <label for="service-${index}">
                                            <strong>${service.name}</strong>
                                            <span>R$ ${service.price.toFixed(2)} • ${service.duration} min</span>
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Escolha a Data</h3>
                            <input type="date" id="booking-date" required onchange="PublicBooking.updateAvailableSlots()">
                        </div>

                        <div class="form-section">
                            <h3>Horários Disponíveis</h3>
                            <div id="available-slots" class="available-slots">
                                <p class="text-muted">Selecione uma data para ver os horários disponíveis</p>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Observações (Opcional)</h3>
                            <textarea id="booking-notes" placeholder="Descreva qualquer preferência especial..." rows="3"></textarea>
                        </div>

                        <button type="submit" class="btn-large">
                            <i class="fas fa-check-circle"></i> Confirmar Agendamento
                        </button>
                    </form>
                </div>

                <div class="booking-info">
                    <div class="info-card">
                        <i class="fas fa-clock"></i>
                        <h4>Horário de Funcionamento</h4>
                        <p id="business-hours"></p>
                    </div>
                    <div class="info-card">
                        <i class="fas fa-phone"></i>
                        <h4>Precisa de Ajuda?</h4>
                        <p>Entre em contato conosco para dúvidas</p>
                    </div>
                </div>
            </div>
        `;

        // Check if we're in a modal or full page
        const container = document.getElementById('public-booking-container');
        if (container) {
            container.innerHTML = html;
        } else {
            document.body.innerHTML = html;
        }

        // Update business hours display
        const settings = Settings.getSettings();
        document.getElementById('business-hours').textContent = 
            `${settings.businessHours.open} - ${settings.businessHours.close}`;

        // Setup form submission
        const form = document.getElementById('public-booking-form');
        if (form) {
            form.addEventListener('submit', PublicBooking.submitBooking);
        }

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('booking-date');
        if (dateInput) {
            dateInput.min = today;
        }
    },

    updateAvailableSlots: () => {
        const dateInput = document.getElementById('booking-date');
        const slotsContainer = document.getElementById('available-slots');

        if (!dateInput.value) {
            slotsContainer.innerHTML = '<p class="text-muted">Selecione uma data</p>';
            return;
        }

        const slots = PublicBooking.getAvailableSlots(dateInput.value);

        if (slots.length === 0) {
            slotsContainer.innerHTML = '<p class="text-muted">Nenhum horário disponível para esta data</p>';
            return;
        }

        const slotsHTML = slots.map((slot, index) => `
            <div class="slot-option">
                <input type="radio" id="slot-${index}" name="time" value="${slot.time}" required>
                <label for="slot-${index}">${slot.time}</label>
            </div>
        `).join('');

        slotsContainer.innerHTML = `<div class="slots-grid">${slotsHTML}</div>`;
    },

    submitBooking: (e) => {
        e.preventDefault();

        const name = document.getElementById('client-name-public').value;
        const phone = document.getElementById('client-phone').value;
        const email = document.getElementById('client-email-public').value;
        const service = document.querySelector('input[name="service"]:checked')?.value;
        const date = document.getElementById('booking-date').value;
        const time = document.querySelector('input[name="time"]:checked')?.value;
        const notes = document.getElementById('booking-notes').value;

        if (!name || !phone || !service || !date || !time) {
            Notifications.warning('Preencha todos os campos obrigatórios');
            return;
        }

        // Get service price
        const serviceObj = Settings.getServices().find(s => s.name === service);
        const price = serviceObj ? serviceObj.price : 0;

        // Create appointment
        const appointment = {
            id: Date.now(),
            clientName: name,
            clientPhone: phone,
            clientEmail: email,
            service: service,
            date: date,
            time: time,
            price: price,
            status: 'pending',
            notes: notes,
            userId: null, // Public booking - no user assigned yet
            isPublicBooking: true,
            createdAt: new Date().toISOString()
        };

        // Save appointment
        const appointments = Storage.getAppointments();
        appointments.push(appointment);
        Storage.setAppointments(appointments);

        Notifications.success(`Agendamento confirmado! Você receberá uma confirmação em breve.`);

        // Reset form
        document.getElementById('public-booking-form').reset();
        document.getElementById('available-slots').innerHTML = 
            '<p class="text-muted">Selecione uma data para ver os horários disponíveis</p>';

        // Redirect after 3 seconds
        setTimeout(() => {
            // Se estivermos em um ambiente de arquivo local, apenas limpa o formulário
            if (window.location.protocol === 'file:') {
                document.getElementById('public-booking-form').reset();
                document.getElementById('available-slots').innerHTML = 
                    '<p class="text-muted">Selecione uma data para ver os horários disponíveis</p>';
            } else {
                window.location.href = window.location.pathname;
            }
        }, 3000);
    }
};

// Export for global use
window.PublicBooking = PublicBooking;
