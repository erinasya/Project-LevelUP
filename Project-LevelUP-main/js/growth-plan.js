document.addEventListener('DOMContentLoaded', () => {
    const user = LevelUpProgression.currentUser();

    if (!user) return;

    const p = LevelUpData.getProfile();

    document.getElementById('main-goal-title').textContent =
        p.goal || user.goal || 'Tentukan tujuanmu';

    document.getElementById('main-goal-desc').textContent =
        `Fokus: ${(p.interests || ['learning'])
            .map(
                k =>
                    ({
                        learning: 'Learning & Focus',
                        creative: 'Creative & Digital Skills',
                        healthy: 'Healthy Habits'
                    }[k] || k)
            )
            .join(', ')} · ${p.availableTime || 'waktu fleksibel'}`;

    const en = LevelUpData.getEnrollments().filter(
        e => e.userId === user.id
    );

    const done = en.filter(e => e.status === 'completed').length;

    const total = LevelUpData.getPaths().reduce(
        (n, x) => n + x.challengeIds.length,
        0
    );

    const percent = total ? Math.round(done / total * 100) : 0;

    document.getElementById('plan-progress-number').textContent =
        percent + '%';

    document.querySelector('.progress-circle').style.setProperty(
        '--p',
        percent + '%'
    );

    document.getElementById('plan-path-count').textContent =
        LevelUpData.getPaths().length + ' jalur tersedia';

    const paths = LevelUpData.getPaths();

    document.getElementById('growth-plan-paths').innerHTML = paths
        .map(path => {
            const items = path.challengeIds
                .map(id => LevelUpData.challengeById(id))
                .filter(Boolean);

            const completed = items.filter(
                c =>
                    en.some(
                        e =>
                            e.challengeId === c.id &&
                            e.status === 'completed'
                    ) ||
                    LevelUpData.getSubmissions().some(
                        s =>
                            s.userId === user.id &&
                            s.challengeId === c.id &&
                            s.status === 'approved'
                    )
            ).length;

            return `<article class="card path-card"><div class="path-art" style="background:${path.categoryKey === 'learning' ? '#F0E6F6' : path.categoryKey === 'creative' ? '#FFF0E6' : '#E7F2E7'}"><img src="${path.art}" alt=""></div><div class="between"><span class="badge">${path.category}</span><span class="small muted">${items.length} tahap</span></div><h3>${LevelUpUI.escapeHTML(path.title)}</h3><p class="small">${LevelUpUI.escapeHTML(path.description)}</p><div class="progress-meta"><span>${completed}/${items.length} challenge selesai</span><strong>${Math.round(completed / (items.length || 1) * 100)}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${completed / (items.length || 1) * 100}%"></div></div><a class="btn btn-secondary" href="growth-path.html?id=${path.id}">Lihat Journey ↗</a></article>`;
        })
        .join('');

    const milestones = paths
        .flatMap(path =>
            path.challengeIds.map((id, i) => ({
                path,
                c: LevelUpData.challengeById(id),
                i
            }))
        )
        .filter(x => x.c)
        .slice(0, 7);

    document.getElementById('growth-plan-timeline').innerHTML = milestones
        .map(({ path, c, i }) => {
            const done = en.some(
                e =>
                    e.challengeId === c.id &&
                    e.status === 'completed'
            );

            const active = en.some(
                e =>
                    e.challengeId === c.id &&
                    e.status === 'in-progress'
            );

            return `<div class="timeline-item ${done ? 'done' : active ? 'current' : ''}"><div class="timeline-marker">${done ? '✓' : i + 1}</div><div class="timeline-content"><div class="between"><strong>${c.title}</strong>${LevelUpUI.statusBadge(done ? 'completed' : active ? 'in-progress' : c.prerequisite ? 'locked' : 'active')}</div><p>${path.title} · ${c.duration}</p></div></div>`;
        })
        .join('');

    document.getElementById('growth-plan-completed').innerHTML = done
        ? `<div class="notice success">Kamu sudah menyelesaikan ${done} challenge. Lanjutkan satu langkah berikutnya saat siap.</div>`
        : LevelUpUI.emptyState(
            'Perjalananmu baru dimulai',
            'Setelah menyelesaikan challenge, ringkasannya akan muncul di sini.'
        );
});