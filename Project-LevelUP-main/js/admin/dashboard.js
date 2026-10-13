
document.addEventListener('DOMContentLoaded', () => {
    const cs = LevelUpData.getChallenges(),
        paths = LevelUpData.getPaths(),
        subs = LevelUpData.getSubmissions();

    document.getElementById('admin-active-challenges').textContent =
        cs.filter(c => c.status === 'active').length;

    document.getElementById('admin-path-count').textContent = paths.length;

    document.getElementById('admin-pending-count').textContent =
        subs.filter(s => s.status === 'pending').length;

    document.getElementById('admin-review-count').textContent =
        subs.filter(s => s.status === 'needs-review').length;

    const q = document.getElementById('admin-dashboard-queue');

    q.innerHTML = subs
        .filter(s => s.status === 'pending' || s.status === 'needs-review')
        .slice(0, 5)
        .map(s => {
            const u = LevelUpData.getUsers().find(x => x.id === s.userId);
            const c = LevelUpData.challengeById(s.challengeId);

            return `
                <tr>
                    <td>
                        <div class="table-title">${u?.name || 'Demo User'}</div>
                        <div class="table-sub">${u?.email || ''}</div>
                    </td>
                    <td>${LevelUpUI.escapeHTML(c?.title || '—')}</td>
                    <td>${LevelUpUI.statusBadge(s.status)}</td>
                    <td>
                        <a class="link" href="submission-detail.html?id=${s.id}">Review ↗</a>
                    </td>
                </tr>
            `;
        })
        .join('') || '<tr><td colspan="4">Tidak ada submission yang menunggu pemeriksaan.</td></tr>';

    const draft = cs.filter(c => c.status === 'draft').length,
        active = cs.filter(c => c.status === 'active').length,
        arch = cs.filter(c => c.status === 'archived').length;

    document.getElementById('admin-content-stats').innerHTML = [
        ['Aktif', active, '#47B5A8'],
        ['Draft', draft, '#F7E289'],
        ['Archived', arch, '#A3C1E2']
    ]
        .map(x => `
            <div class="progress-list-item">
                <div class="progress-meta">
                    <span>${x[0]}</span>
                    <strong>${x[1]}</strong>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width:${x[1] / (cs.length || 1) * 100}%;background:${x[2]}"></div>
                </div>
            </div>
        `)
        .join('');

    const history = LevelUpData.getReviewHistory().slice(0, 4);

    document.getElementById('admin-recent-history').innerHTML = history
        .map(h => {
            const c = LevelUpData.challengeById(h.challengeId);

            return `
                <div class="activity-row">
                    <div class="activity-icon">${h.decision === 'approved' ? '✓' : '↻'}</div>
                    <div style="flex:1">
                        <strong>${LevelUpUI.escapeHTML(c?.title || 'Challenge')}</strong>
                        <p>${h.reason}</p>
                    </div>
                    ${LevelUpUI.statusBadge(h.decision)}
                </div>
            `;
        })
        .join('') || '<p class="muted small">Belum ada keputusan review dalam sesi demo ini.</p>';
});
