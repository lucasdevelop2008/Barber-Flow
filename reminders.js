// Reminders Module - Sistema de lembretes com notificações e som
const Reminders = {
    checkInterval: null,
    notifiedAppointments: [], // Track which appointments we've already notified

    init: () => {
        // Start checking for upcoming appointments every minute
        Reminders.checkInterval = setInterval(Reminders.checkUpcomingAppointments, 60000);
        
        // Also check immediately on init
        Reminders.checkUpcomingAppointments();
    },

    checkUpcomingAppointments: () => {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const now = new Date();
        const appointments = Data.getAppointmentsByUser(user.id);

        appointments.forEach(apt => {
            // Skip if already notified
            if (Reminders.notifiedAppointments.includes(apt.id)) {
                return;
            }

            // Skip cancelled appointments
            if (apt.status === 'cancelled') {
                return;
            }

            const appointmentDateTime = new Date(`${apt.date}T${apt.time}`);
            const timeDiff = appointmentDateTime - now; // Difference in milliseconds
            const minutesDiff = Math.floor(timeDiff / (1000 * 60));

            // Notify 15 minutes before
            if (minutesDiff === 15) {
                Reminders.notifyAppointment(apt, 'before');
                Reminders.notifiedAppointments.push(apt.id);
            }

            // Notify at exact time
            if (minutesDiff === 0 && timeDiff >= -60000) { // Within 1 minute of appointment time
                Reminders.notifyAppointment(apt, 'now');
                Reminders.notifiedAppointments.push(apt.id);
            }

            // Reset notification if appointment is in the past
            if (timeDiff < -60000) {
                const index = Reminders.notifiedAppointments.indexOf(apt.id);
                if (index > -1) {
                    Reminders.notifiedAppointments.splice(index, 1);
                }
            }
        });
    },

    notifyAppointment: (appointment, type) => {
        const messages = {
            before: `⏰ Lembrete: ${appointment.clientName} tem agendamento em 15 minutos (${appointment.service} às ${appointment.time})`,
            now: `🔔 AGORA: ${appointment.clientName} chegou! Serviço: ${appointment.service}`
        };

        const notificationType = type === 'now' ? 'warning' : 'info';
        Notifications.show(messages[type], notificationType, 0); // 0 = no auto-dismiss

        // Play sound
        Reminders.playSound();
    },

    playSound: () => {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Set frequency and duration
            oscillator.frequency.value = 800; // Hz
            oscillator.type = 'sine';

            // Create a beep pattern (3 beeps)
            const now = audioContext.currentTime;
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            oscillator.start(now);
            oscillator.stop(now + 0.1);

            // Second beep
            const osc2 = audioContext.createOscillator();
            osc2.connect(gainNode);
            osc2.frequency.value = 900;
            osc2.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, now + 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc2.start(now + 0.15);
            osc2.stop(now + 0.25);

            // Third beep
            const osc3 = audioContext.createOscillator();
            osc3.connect(gainNode);
            osc3.frequency.value = 1000;
            osc3.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, now + 0.3);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc3.start(now + 0.3);
            osc3.stop(now + 0.4);
        } catch (e) {
            console.log('Audio context not available, skipping sound');
        }
    },

    stop: () => {
        if (Reminders.checkInterval) {
            clearInterval(Reminders.checkInterval);
            Reminders.checkInterval = null;
        }
    }
};

// Initialize reminders when app loads
document.addEventListener('DOMContentLoaded', () => {
    // Start reminders after a short delay to ensure everything is loaded
    setTimeout(Reminders.init, 1000);
});

// Export for global use
window.Reminders = Reminders;
