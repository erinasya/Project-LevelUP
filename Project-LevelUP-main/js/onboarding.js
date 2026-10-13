document.addEventListener('DOMContentLoaded', () => {
    const selected = new Set(['learning']);
    const goal = document.getElementById('goal');
    const recommendation = document.getElementById('onboarding-recommendation');

    document.querySelectorAll('[data-interest]').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.interest;

            if (selected.has(key)) {
                selected.delete(key);
                btn.classList.remove('selected');
            } else {
                selected.add(key);
                btn.classList.add('selected');
            }

            updateRec();
        });
    });

    function updateRec() {
        let txt = selected.has('creative')
            ? 'Creative Design Journey'
            : selected.has('healthy')
                ? 'Healthy Habit Starter'
                : 'Reading & Critical Thinking';

        recommendation.textContent =
            txt + ' · rekomendasi berdasarkan minatmu';
    }

    goal.addEventListener('change', () => {
        if (
            goal.value.toLowerCase().includes('kreatif') ||
            goal.value.toLowerCase().includes('skill digital')
        ) {
            selected.add('creative');
        } else if (goal.value.toLowerCase().includes('rutinitas')) {
            selected.add('healthy');
        } else {
            selected.add('learning');
        }

        document.querySelectorAll('[data-interest]').forEach(b => {
            b.classList.toggle(
                'selected',
                selected.has(b.dataset.interest)
            );
        });

        updateRec();
    });

    document.getElementById('onboarding-form').addEventListener('submit', e => {
        e.preventDefault();

        const p = LevelUpData.getProfile();

        p.goal = goal.value;
        p.interests = [...selected];
        p.skillLevel = document.getElementById('skill-level').value;
        p.availableTime = document.getElementById('available-time').value;

        LevelUpData.setProfile(p);
        LS.set('onboardingDone', true);

        LevelUpUI.toast('Tujuan berhasil disimpan.');

        setTimeout(() => location.href = 'dashboard.html', 500);
    });
});