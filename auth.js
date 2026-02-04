const Auth = {
    login: (email, password) => {
        if (email === 'admin@barber.com' && password === 'admin123') {
            const user = { name: 'Administrador', email: email, role: 'admin' };
            localStorage.setItem('barber_user', JSON.stringify(user));
            return true;
        }
        return false;
    },
    logout: () => {
        localStorage.removeItem('barber_user');
        window.location.reload();
    },
    isLoggedIn: () => {
        return localStorage.getItem('barber_user') !== null;
    },
    getUser: () => {
        return JSON.parse(localStorage.getItem('barber_user'));
    }
};
