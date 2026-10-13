document.addEventListener('DOMContentLoaded', () => {
    const session = LevelUpAuth.currentSession();
    const user = LevelUpProgression.currentUser();
    const p = LevelUpData.getProfile();

    const set = (id, v) => {
        const e = document.getElementById(id);

        if (e) {
            e.value = v || '';
        }
    };

    document.getElementById('profile-heading').textContent =
        user?.name || session.name;

    document.getElementById('profile-avatar').textContent =
        (user?.name || session.name).charAt(0).toUpperCase();

    document.getElementById('profile-summary').textContent =
        session.email;

    document.getElementById('profile-level').textContent =
        'Level ' + (Math.floor(LevelUpData.getXP() / 250) + 1);

    set('profile-name', p.name || session.name);
    set('profile-email', session.email);
    set('profile-bio', p.bio || '');
    set('profile-goal', p.goal || '');
    set('profile-time', p.availableTime || '20–30 menit per hari');

    const prefs = LS.get('preferences', {});

    document.getElementById('profile-public').checked =
        !!prefs.publicAchievements;

    document.getElementById('profile-reminders').checked =
        prefs.reminders !== false;

    document.getElementById('profile-form').addEventListener('submit', e => {
        e.preventDefault();

        const next = Object.assign({}, LevelUpData.getProfile(), {
            name: document.getElementById('profile-name').value.trim(),
            bio: document.getElementById('profile-bio').value.trim(),
            goal: document.getElementById('profile-goal').value.trim(),
            availableTime: document.getElementById('profile-time').value
        });

        LevelUpData.setProfile(next);

        const users = LevelUpData.getUsers().map(u =>
            u.id === session.userId
                ? Object.assign({}, u, { name: next.name })
                : u
        );

        LS.set('users', users);

        const updated = Object.assign({}, session, {
            name: next.name
        });

        LS.set('session', updated);

        document.getElementById('profile-heading').textContent =
            next.name;

        document.getElementById('profile-avatar').textContent =
            next.name.charAt(0).toUpperCase();

        LevelUpUI.toast('Profil demo berhasil disimpan.');
    });

    document.getElementById('save-preferences').addEventListener('click', () => {
        LS.set('preferences', {
            publicAchievements: document.getElementById('profile-public').checked,
            reminders: document.getElementById('profile-reminders').checked
        });

        LevelUpUI.toast('Preferensi disimpan.');
    });
});