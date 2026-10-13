
document.addEventListener('DOMContentLoaded', () => {
    const q = document.getElementById('history-search'),
        decision = document.getElementById('history-decision'),
        tbody = document.getElementById('history-table'),
        empty = document.getElementById('history-empty');

    function render() {
        const all = LevelUpData.getReviewHistory();

        document.getElementById('history-total').textContent = all.length;

        document.getElementById('history-approved').textContent =
            all.filter(h => h.decision === 'approved').length;

        document.getElementById('history-rejected').textContent =
            all.filter(h => h.decision === 'rejected').length;

        let list = all.filter(h => {
            const user = LevelUpData.getUsers().find(u => u.id === h.userId),
                c = LevelUpData.challengeById(h.challengeId);

            return `${h.submissionId} ${user?.name || ''} ${c?.title || ''} ${h.reason}`
                .toLowerCase()
                .includes(q.value.toLowerCase());
        });

        if (decision.value !== 'all') {
            list = list.filter(h => h.decision === decision.value);
        }

        tbody.innerHTML = list.map(h => {
            const u = LevelUpData.getUsers().find(x => x.id === h.userId),
                c = LevelUpData.challengeById(h.challengeId),
                r = LevelUpData.getUsers().find(x => x.id === h.reviewerId);

            return `
                <tr>
                    <td>${LevelUpUI.formatDate(h.at)}</td>
                    <td>
                        <a class="link" href="submission-detail.html?id=${h.submissionId}">
                            ${h.submissionId.slice(-8)}
                        </a>
                    </td>
                    <td>${u?.name || 'User'}</td>
                    <td>${c?.title || 'Challenge'}</td>
                    <td>${r?.name || 'Admin'}</td>
                    <td>${LevelUpUI.statusBadge(h.decision)}</td>
                    <td>${LevelUpUI.escapeHTML(h.reason)}</td>
                </tr>
            `;
        }).join('');

        empty.classList.toggle('hidden', list.length > 0);

        if (!list.length) {
            empty.innerHTML = LevelUpUI.emptyState(
                'Belum ada riwayat',
                'Keputusan yang dibuat pada submission review akan muncul di sini.'
            );
        }
    }

    [q, decision].forEach(e => e.addEventListener('input', render));

    render();
});
