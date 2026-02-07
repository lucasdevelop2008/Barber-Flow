// Receipts Module - Gerar e imprimir recibos
const Receipts = {
    generateReceipt: (appointmentId) => {
        const appointments = Storage.getAppointments();
        const appointment = appointments.find(a => a.id === appointmentId);
        const user = Auth.getCurrentUser();

        if (!appointment || appointment.status !== 'completed') {
            Notifications.error('Agendamento não encontrado ou não foi concluído');
            return;
        }

        const receiptHTML = Receipts.buildReceiptHTML(appointment, user);
        Receipts.printReceipt(receiptHTML);
    },

    buildReceiptHTML: (appointment, user) => {
        const date = new Date(appointment.date);
        const formattedDate = date.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        return `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Recibo - BarberFlow</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Courier New', monospace;
                        background: white;
                        color: #333;
                        padding: 20px;
                    }
                    .receipt {
                        max-width: 400px;
                        margin: 0 auto;
                        border: 2px solid #333;
                        padding: 20px;
                        text-align: center;
                    }
                    .header {
                        margin-bottom: 20px;
                        border-bottom: 2px dashed #333;
                        padding-bottom: 10px;
                    }
                    .header h1 {
                        font-size: 24px;
                        margin-bottom: 5px;
                    }
                    .header p {
                        font-size: 12px;
                        color: #666;
                    }
                    .content {
                        margin: 20px 0;
                        text-align: left;
                    }
                    .item {
                        display: flex;
                        justify-content: space-between;
                        margin: 10px 0;
                        font-size: 14px;
                    }
                    .label {
                        font-weight: bold;
                    }
                    .divider {
                        border-bottom: 2px dashed #333;
                        margin: 15px 0;
                    }
                    .total {
                        display: flex;
                        justify-content: space-between;
                        font-size: 18px;
                        font-weight: bold;
                        margin: 15px 0;
                    }
                    .footer {
                        margin-top: 20px;
                        border-top: 2px dashed #333;
                        padding-top: 10px;
                        font-size: 11px;
                        color: #666;
                    }
                    .receipt-number {
                        font-size: 10px;
                        color: #999;
                        margin-top: 10px;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                        .receipt {
                            border: none;
                            max-width: 100%;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="receipt">
                    <div class="header">
                        <h1>✂️ BARBERFLOW</h1>
                        <p>${user.name}</p>
                    </div>

                    <div class="content">
                        <div class="item">
                            <span class="label">Cliente:</span>
                            <span>${appointment.clientName}</span>
                        </div>
                        <div class="item">
                            <span class="label">Serviço:</span>
                            <span>${appointment.service}</span>
                        </div>
                        <div class="item">
                            <span class="label">Data:</span>
                            <span>${formattedDate}</span>
                        </div>
                        <div class="item">
                            <span class="label">Hora:</span>
                            <span>${appointment.time}</span>
                        </div>
                        ${appointment.notes ? `
                            <div class="item">
                                <span class="label">Obs:</span>
                                <span>${appointment.notes}</span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="divider"></div>

                    <div class="total">
                        <span>TOTAL:</span>
                        <span>R$ ${appointment.price.toFixed(2)}</span>
                    </div>

                    <div class="footer">
                        <p>✓ Serviço realizado com sucesso</p>
                        <p>Obrigado pela preferência!</p>
                        <p>Volte sempre!</p>
                        <div class="receipt-number">
                            ID: ${appointment.id} | ${new Date().toLocaleString('pt-BR')}
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    },

    printReceipt: (html) => {
        const printWindow = window.open('', '', 'height=600,width=500');
        printWindow.document.write(html);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
            Notifications.success('Recibo gerado! Verifique a janela de impressão.');
        }, 250);
    },

    downloadReceiptPDF: (appointmentId) => {
        const appointments = Storage.getAppointments();
        const appointment = appointments.find(a => a.id === appointmentId);
        const user = Auth.getCurrentUser();

        if (!appointment) {
            Notifications.error('Agendamento não encontrado');
            return;
        }

        const date = new Date(appointment.date);
        const formattedDate = date.toLocaleDateString('pt-BR');
        
        let content = `
RECIBO DE SERVIÇO - BARBERFLOW
=====================================

Barbeiro: ${user.name}
Data: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}

DETALHES DO AGENDAMENTO:
-------------------------------------
Cliente: ${appointment.clientName}
Serviço: ${appointment.service}
Data do Serviço: ${formattedDate}
Hora: ${appointment.time}
${appointment.notes ? `Observações: ${appointment.notes}` : ''}

VALOR:
-------------------------------------
Serviço: R$ ${appointment.price.toFixed(2)}

TOTAL: R$ ${appointment.price.toFixed(2)}

=====================================
✓ Serviço realizado com sucesso
Obrigado pela preferência!
Volte sempre!

ID do Recibo: ${appointment.id}
        `;

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', `recibo_${appointment.id}_${new Date().toISOString().split('T')[0]}.txt`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        Notifications.success('Recibo baixado com sucesso!');
    }
};

// Export for global use
window.Receipts = Receipts;
