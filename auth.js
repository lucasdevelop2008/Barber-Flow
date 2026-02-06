// Authentication Module
const Auth = {
    login: (email, password) => {
        const users = Storage.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            Storage.setCurrentUser(user);
            return true;
        }
        return false;
    },

    signup: (name, email, password) => {
        const users = Storage.getUsers();
        
        // Check if email already exists
        if (users.find(u => u.email === email)) {
            return false;
        }
        
        const newUser = {
            id: Math.max(...users.map(u => u.id), 0) + 1,
            name,
            email,
            password
        };
        
        users.push(newUser);
        Storage.setUsers(users);
        Storage.setCurrentUser(newUser);
        return true;
    },

    logout: () => {
        Storage.setCurrentUser(null);
    },

    isLoggedIn: () => {
        return Storage.getCurrentUser() !== null;
    },

    getCurrentUser: () => {
        return Storage.getCurrentUser();
    }
};

// Setup auth event listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const toggleSignup = document.getElementById('toggle-signup');
    const toggleLogin = document.getElementById('toggle-login');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (Auth.login(email, password)) {
                showScreen('app-screen');
                updateUserProfile();
                loadDashboard();
            } else {
                alert('E-mail ou senha inválidos!');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            if (password.length < 6) {
                alert('Senha deve ter pelo menos 6 caracteres');
                return;
            }

            if (Auth.signup(name, email, password)) {
                alert('Conta criada com sucesso! Faça login para continuar.');
                showScreen('login-screen');
                signupForm.reset();
            } else {
                alert('Este e-mail já está registrado!');
            }
        });
    }

    if (toggleSignup) {
        toggleSignup.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('signup-screen');
        });
    }

    if (toggleLogin) {
        toggleLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('login-screen');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            Auth.logout();
            showScreen('login-screen');
            document.getElementById('login-form').reset();
            document.getElementById('signup-form').reset();
        });
    }
});

// Helper functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function updateUserProfile() {
    const user = Auth.getCurrentUser();
    if (user) {
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
    }
}
