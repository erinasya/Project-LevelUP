document.addEventListener('DOMContentLoaded', () => {
    const s = LevelUpAuth.currentSession();
    const earned = LS.get('earnedAchievements', []).filter(
        a => a.userId === s.userId
    );
    const earnedIds = earned.map(a => a.achievementId);

    const benefits = [
        {
            id: 'guide-reading',
            title: 'Reading Reflection Guide',
            desc: 'Panduan singkat untuk membuat ringkasan dan refleksi bacaan.',
            icon: '📘',
            category: 'learning',
            condition: 'Tersedia sebagai materi demo.',
            available: true,
            action: 'Buka Panduan',
            href: 'growth-path.html?id=reading-path'
        },
        {
            id: 'creative-brief',
            title: 'Creative Practice Pack',
            desc: 'Kumpulan brief latihan untuk mengembangkan proses kreatif.',
            icon: '🎨',
            category: 'creative',
            condition: 'Selesaikan Creative Mind.',
            available: earnedIds.includes('creative-mind'),
            action: 'Lihat Creative Path',
            href: 'growth-path.html?id=creative-path'
        },
        {
            id: 'critical-path',
            title: 'Critical Thinking Path',
            desc: 'Lanjutkan latihan membaca dan evaluasi argumen.',
            icon: '🧠',
            category: 'learning',
            condition: 'Selesaikan tahap Reading Reflection.',
            available: earnedIds.includes('book-explorer'),
            action: 'Buka Path',
            href: 'growth-path.html?id=reading-path'
        },
        {
            id: 'focus-planner',
            title: 'Weekly Focus Planner',
            desc: 'Template untuk merencanakan sesi belajar dan review mingguan.',
            icon: '🗓️',
            category: 'learning',
            condition: 'Tersedia sebagai materi demo.',
            available: true,
            action: 'Lihat Growth Plan',
            href: 'growth-plan.html'
        }
    ];

    let mode = 'all';

    const grid = document.getElementById('benefit-grid');

    function render() {
        const list = benefits.filter(
            b =>
                mode === 'all' ||
                (mode === 'available' ? b.available : !b.available)
        );

        grid.innerHTML = list
            .map(
                b => `<article class="card benefit-card ${b.available ? '' : 'locked'}"><div class="reward-symbol" style="font-size:32px">${b.icon}</div><span class="badge ${b.available ? 'green' : 'gray'}">${b.available ? 'Tersedia' : 'Terkunci'}</span><h3>${b.title}</h3><p>${b.desc}</p><div class="benefit-condition">${b.available ? 'Dapat diakses sekarang.' : b.condition}</div><a class="btn ${b.available ? 'btn-primary' : 'btn-secondary'}" href="${b.available ? b.href : 'achievements.html'}">${b.available ? b.action : 'Lihat Syarat ↗'}</a></article>`
            )
            .join('');
    }

    document.querySelectorAll('[data-benefit-filter]').forEach(b => {
        b.addEventListener('click', () => {
            mode = b.dataset.benefitFilter;

            document.querySelectorAll('[data-benefit-filter]').forEach(x => {
                x.classList.toggle('active', x === b);
            });

            render();
        });
    });

    render();
});