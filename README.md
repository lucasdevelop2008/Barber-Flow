# BarberFlow - Sistema de Gestão de Barbearia

Uma aplicação web completa para gerenciar agendamentos, clientes e receita de uma barbearia, desenvolvida com **HTML5, CSS3 e JavaScript vanilla**.

## ✨ Características

- **Autenticação Local:** Sistema de login e cadastro com dados salvos no localStorage
- **Dashboard com Insights:** Visualização de métricas em tempo real (total de agendamentos, concluídos, pendentes, receita)
- **Gestão de Agendamentos:** CRUD completo com status (pendente, concluído, cancelado)
- **Gestão de Clientes:** Registro automático de clientes com histórico de visitas
- **Interface Responsiva:** Design moderno com tema escuro profissional
- **Persistência de Dados:** Todos os dados são salvos localmente no navegador via localStorage
- **Sem Dependências:** Funciona offline, sem necessidade de servidor ou banco de dados externo

## 🚀 Como Usar

1. **Abra o arquivo `index.html` em seu navegador**
   - Não requer servidor ou instalação de dependências
   - Funciona em qualquer navegador moderno

2. **Faça login com as credenciais de demo:**
   - E-mail: `admin@barber.com`
   - Senha: `admin123`

3. **Ou crie uma nova conta:**
   - Clique em "Criar conta"
   - Preencha nome, e-mail e senha
   - Faça login com suas credenciais

## 📋 Funcionalidades

### Dashboard
- Total de agendamentos
- Agendamentos concluídos
- Agendamentos pendentes
- Receita total
- Tabela com agendamentos recentes

### Agendamentos
- Criar novo agendamento
- Editar status (pendente → concluído → cancelado)
- Adicionar observações
- Deletar agendamentos
- Visualizar data, hora e valor

### Clientes
- Lista de todos os clientes
- Histórico de visitas por cliente
- Contato (telefone e e-mail)
- Clientes criados automaticamente ao agendar

## 🛠️ Estrutura de Arquivos

```
barber-flow-vanilla/
├── index.html           # Estrutura HTML principal
├── css/
│   └── styles.css       # Estilos com tema escuro
├── js/
│   ├── storage.js       # Gerenciamento de localStorage
│   ├── auth.js          # Autenticação e login
│   ├── data.js          # Gerenciamento de dados
│   ├── dashboard.js     # Lógica do dashboard
│   ├── appointments.js  # Gerenciamento de agendamentos
│   ├── clients.js       # Gerenciamento de clientes
│   └── app.js           # Aplicação principal
└── README.md            # Este arquivo
```

## 💾 Armazenamento de Dados

Os dados são armazenados no **localStorage** do navegador:
- `barber_users` - Usuários cadastrados
- `barber_appointments` - Agendamentos
- `barber_clients` - Clientes
- `barber_current_user` - Usuário logado

**Nota:** Os dados são específicos de cada navegador e dispositivo. Se limpar o cache do navegador, os dados serão perdidos.

## 🎨 Tema

A aplicação usa um tema escuro profissional com cores:
- **Primária:** Dourado (#c9a050)
- **Fundo:** Preto (#0f0f0f, #1a1a1a)
- **Texto:** Cinza claro (#e0e0e0)

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop
- Tablet
- Mobile

## 🔐 Segurança

- Senhas são armazenadas localmente (use em ambiente seguro)
- Não há comunicação com servidores externos
- Dados não são sincronizados entre dispositivos

## 📝 Preços dos Serviços

- Corte Simples: R$ 35,00
- Barba: R$ 25,00
- Corte e Barba: R$ 50,00
- Degradê: R$ 40,00
- Hidratação: R$ 30,00
- Coloração: R$ 60,00

## 🚀 Próximas Melhorias

- [ ] Exportar dados para CSV/PDF
- [ ] Backup e restore de dados
- [ ] Sincronização com servidor
- [ ] Notificações de lembretes
- [ ] Relatórios avançados
- [ ] Integração com WhatsApp

## 📄 Licença

Livre para uso pessoal e comercial.

---

**Desenvolvido com ❤️ para barbearias**
