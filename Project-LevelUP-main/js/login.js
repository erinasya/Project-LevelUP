document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const message = document.getElementById('login-message');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    function showMessage(text) {
        message.textContent = text;
        message.classList.remove('hidden');
    }

    function doLogin(e) {
        e?.preventDefault();

        message.classList.add('hidden');

        if (!email.value.trim() || !password.value) {
            showMessage('Isi email dan password terlebih dahulu.');
            return;
        }

        const result = LevelUpAuth.login(
            email.value,
            password.value
        );

        if (!result.ok) {
            showMessage(result.message);
            return;
        }

        const target =
            result.session.role === 'admin'
                ? 'admin/dashboard.html'
                : (
                    LS.get('onboardingDone', false)
                        ? 'dashboard.html'
                        : 'onboarding.html'
                );

        location.href = target;
    }

    form.addEventListener('submit', doLogin);

    document.querySelectorAll('[data-demo-login]').forEach(btn => {
        btn.addEventListener('click', () => {
            const role = btn.dataset.demoLogin;

            email.value =
                role === 'admin'
                    ? 'admin@levelup.id'
                    : 'user@levelup.id';

            password.value =
                role === 'admin'
                    ? 'admin123'
                    : 'user123';

            doLogin();
        });
    });

    document.getElementById('show-password')?.addEventListener(
        'change',
        e => {
            password.type = e.target.checked ? 'text' : 'password';
        }
    );
});