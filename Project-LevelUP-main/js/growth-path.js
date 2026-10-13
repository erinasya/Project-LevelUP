document.addEventListener('DOMContentLoaded', () => {
    const id = new URLSearchParams(location.search).get('id') || 'reading-path';
    const path = LevelUpData.pathById(id) || LevelUpData.getPaths()[0];
    const user = LevelUpProgression.currentUser();

    document.getElementById('path-title').textContent = path.title;
    document.getElementById('path-description').textContent = path.description;
    document.getElementById('path-category').textContent = path.category;
    document.getElementById('path-goal').textContent = path.goal;
    document.getElementById('path-art').src = path.art;
    document.getElementById('path-duration').textContent = path.duration;

    const cs = path.challengeIds
        .map(cid => LevelUpData.challengeById(cid))
        .filter(Boolean);

    const en = LevelUpData.getEnrollments().filter(
        e => e.userId === user?.id
    );

    const subs = LevelUpData.getSubmissions().filter(
        s => s.userId === user?.id
    );

    const isDone = c =>
        en.some(
            e => e.challengeId === c.id && e.status === 'completed'
        ) ||
        subs.some(
            s => s.challengeId === c.id && s.status === 'approved'
        );

    const completed = cs.filter(isDone).length;
    const pct = Math.round(completed / (cs.length || 1) * 100);

    document.getElementById('path-progress-label').textContent =
        `${completed} dari ${cs.length} tahap selesai`;

    document.getElementById('path-progress-percent').textContent =
        pct + '%';

    document.getElementById('path-progress-bar').style.width = pct + '%';

    document.getElementById('path-stage-count').textContent = cs.length;

    document.getElementById('path-current').textContent =
        completed >= cs.length ? 'Selesai' : `Tahap ${completed + 1}`;

    document.getElementById('path-stages').innerHTML = cs
        .map((c, i) => {
            const stageConfig = (path.stages || []).find(
                st => st.challengeId === c.id
            );

            const stageTitle = stageConfig?.name || `Stage ${i + 1}`;
            const done = isDone(c);
            const pre = c.prerequisite;

            const preDone =
                !pre || isDone(LevelUpData.challengeById(pre) || {});

            const active = en.some(
                e =>
                    e.challengeId === c.id &&
                    e.status === 'in-progress'
            );

            const locked = !done && !preDone;

            return `<div class="timeline-item ${done ? 'done' : active ? 'current' : ''}"><div class="timeline-marker">${done ? '✓' : i + 1}</div><div class="timeline-content card" style="padding:15px"><div class="between"><div><span class="eyebrow">STAGE ${String(i + 1).padStart(2, '0')} · ${LevelUpUI.escapeHTML(stageTitle)}</span><h3>${LevelUpUI.escapeHTML(c.title)}</h3></div>${LevelUpUI.statusBadge(done ? 'completed' : locked ? 'locked' : active ? 'in-progress' : 'active')}</div><p>${LevelUpUI.escapeHTML(c.description)}</p><div class="quick-stats"><span class="badge">${c.duration}</span><span class="badge yellow">${c.xp} XP</span></div>${locked ? `<div class="notice warning" style="margin-top:10px">Selesaikan ${LevelUpUI.escapeHTML(LevelUpData.challengeById(pre)?.title || 'prasyarat sebelumnya')} terlebih dahulu.</div>` : `<a class="btn ${done ? 'btn-secondary' : 'btn-primary'} btn-sm" style="margin-top:12px" href="challenge-detail.html?id=${c.id}">${done ? 'Lihat Challenge' : active ? 'Lanjutkan' : 'Mulai Tahap'} ↗</a>`}</div></div>`;
        })
        .join('');

    document.getElementById('other-paths').innerHTML = LevelUpData
        .getPaths()
        .filter(p => p.id !== path.id)
        .map(
            p => `<article class="card path-card"><div class="path-art" style="background:#EAF5FF"><img src="${p.art}" alt=""></div><span class="badge">${p.category}</span><h3>${p.title}</h3><p>${p.description}</p><a class="btn btn-secondary" href="growth-path.html?id=${p.id}">Lihat Path ↗</a></article>`
        )
        .join('');
});