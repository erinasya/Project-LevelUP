
(function () {
    const prefix = 'levelup_v1_';

    window.LS = {
        get(key, fallback = null) {
            try {
                const raw = localStorage.getItem(prefix + key);

                return raw === null ? fallback : JSON.parse(raw);
            } catch (e) {
                console.error('LocalStorage read failed:', key, e);
                return fallback;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(prefix + key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('LocalStorage write failed:', key, e);
                window.LevelUpUI?.toast(
                    'Penyimpanan browser penuh atau tidak tersedia.',
                    'error'
                );
                return false;
            }
        },

        remove(key) {
            localStorage.removeItem(prefix + key);
        },

        id() {
            return 'lu_' + Date.now().toString(36) + '_' +
                Math.random().toString(36).slice(2, 8);
        },

        update(key, fn, fallback = []) {
            const current = this.get(key, fallback);
            const next = fn(current);

            this.set(key, next);

            return next;
        }
    };
})();
