(function () {
    function rootPrefix() {
        return location.pathname.includes('/admin/') ? '../' : '';
    }

    function currentSession() {
        return LS.get('session', null);
    }

    function login(email, password) {
        const account = LevelUpData.getUsers().find(
            u =>
                u.email.toLowerCase() === email.trim().toLowerCase() &&
                u.password === password
        );

        if (!account) {
            return {
                ok: false,
                message: 'Email atau password belum sesuai.'
            };
        }

        const session = {
            userId: account.id,
            name: account.name,
            email: account.email,
            role: account.role,
            loginAt: new Date().toISOString()
        };

        LS.set('session', session);

        if (account.role === 'user') {
            LS.set(
                'profile',
                Object.assign(
                    {},
                    LS.get('profile', {}),
                    {
                        name: account.name,
                        email: account.email,
                        goal: account.goal || ''
                    }
                )
            );
        }

        return {
            ok: true,
            session
        };
    }

    function logout() {
        LS.remove('session');
        location.href = rootPrefix() + 'index.html';
    }

    function guard() {
        const body = document.body;

        if (!body.dataset.requireRole) {
            return;
        }

        const session = currentSession();
        const expected = body.dataset.requireRole;

        if (!session) {
            location.replace(
                rootPrefix() +
                'index.html?next=' +
                encodeURIComponent(location.pathname.split('/').pop())
            );

            return;
        }

        if (session.role !== expected) {
            location.replace(
                rootPrefix() +
                (session.role === 'admin'
                    ? 'admin/dashboard.html'
                    : 'dashboard.html')
            );

            return;
        }
    }

    window.LevelUpAuth = {
        login,
        logout,
        currentSession,
        guard,
        rootPrefix
    };

    if (document.body.dataset.requireRole) {
        guard();
    }
})();