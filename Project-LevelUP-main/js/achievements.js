document.addEventListener('DOMContentLoaded', () => {
    const s = LevelUpAuth.currentSession();
    const earned = LS.get('earnedAchievements', []).filter(
        a => a.userId === s.userId
    );
    let catalog = LevelUpData.getAchievements();
    let mode = 'all';

    // PETA GAMBAR KUSTOM (MEMAKSA MENGGANTI IKON SESUAI PERMINTAAN)
    const customArtMap = {
        'first-step': 'https://cdn-icons-png.flaticon.com/512/4341/4341139.png', // 1. Tanaman yang baru tumbuh
        'book-explorer': 'https://cdn-icons-png.flaticon.com/512/3389/3389081.png', // 2. Buku (Tetap)
        'creative-mind': 'https://cdn-icons-png.flaticon.com/512/2952/2952212.png', // 3. Palet lukis & bidak catur
        'steady-steps': 'https://cdn-icons-png.flaticon.com/512/3176/3176363.png', // 4. Sepatu yang sedang menempuh langkah
        'deep-thinker': 'https://cdn-icons-png.flaticon.com/512/4230/4230623.png'  // 5. Gambar otak
    };

    // Paksa timpa properti 'art' di katalog data agar menggunakan ikon baru kita
    catalog = catalog.map(item => {
        if (customArtMap[item.id]) {
            item.art = customArtMap[item.id];
        }
        return item;
    });

    const grid = document.getElementById('achievement-grid');
    const earnedIds = earned.map(x => x.achievementId);

    const countEl = document.getElementById('achievement-count');
    if (countEl) countEl.textContent = `${earned.length} earned`;

    const xp = LevelUpData.getXP();
    const xpEl = document.getElementById('achievement-xp');
    if (xpEl) xpEl.textContent = xp + ' XP';

    const level = Math.floor(xp / 250) + 1;
    const levelEl = document.getElementById('achievement-level');
    if (levelEl) levelEl.textContent = `Level ${level}`;

    const xpBarEl = document.getElementById('achievement-xp-bar');
    if (xpBarEl) {
        xpBarEl.style.width = ((xp % 250) / 250 * 100) + '%';
    }

    function render() {
        if (!grid) return;

        const list = catalog.filter(
            a =>
                mode === 'all' ||
                (mode === 'earned'
                    ? earnedIds.includes(a.id)
                    : !earnedIds.includes(a.id))
        );

        grid.innerHTML = list
            .map(a => {
                const own = earned.find(e => e.achievementId === a.id);
                const artImage = a.art; // Mengambil langsung dari art yang sudah kita timpa

                return `<article class="achievement-card ${own ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon-wrapper">
                        <img src="${artImage}" alt="${a.title}" style="width:38px;height:38px;object-fit:contain;" onerror="this.style.display='none'">
                    </div>
                    <div class="achievement-content">
                        <h3 class="achievement-title">${a.title}</h3>
                        <p class="achievement-desc">${a.description}</p>
                    </div>
                    <div class="achievement-footer">
                        <span class="achievement-status-badge ${own ? 'badge-unlocked' : 'badge-locked'}">
                            ${own ? '✨ Diraih ' + LevelUpUI.formatDate(own.earnedAt) : '🔒 Terkunci'}
                        </span>
                        <details style="display:inline-block;">
                            <summary class="achievement-action-link" style="cursor:pointer;">${own ? 'Detail ↗' : 'Cara buka ↗'}</summary>
                            <p style="margin-top:6px; font-size:11px; color:#64748b;">${a.criteria}</p>
                        </details>
                    </div>
                </article>`;
            })
            .join('');
    }

    document.querySelectorAll('[data-achievement-filter]').forEach(b => {
        b.addEventListener('click', () => {
            mode = b.dataset.achievementFilter;

            document.querySelectorAll('[data-achievement-filter]').forEach(x => {
                x.classList.toggle('active', x === b);
            });

            render();
        });
    });

    const unlocks = catalog
        .filter(a => earnedIds.includes(a.id) && a.unlock)
        .map(a => LevelUpData.challengeById(a.unlock))
        .filter(Boolean);

    const unlocksEl = document.getElementById('achievement-unlocks');
    if (unlocksEl) {
        unlocksEl.innerHTML = unlocks.length
            ? unlocks.map(LevelUpUI.challengeCard).join('')
            : LevelUpUI.emptyState(
                'Langkah berikutnya menunggu',
                'Selesaikan milestone yang sesuai untuk membuka challenge lanjutan.',
                '<a class="btn btn-primary" href="challenges.html">Explore Challenges</a>'
            );
    }

    render();
});