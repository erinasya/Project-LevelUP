
document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById('submission-search'),
        filter = document.getElementById('submission-filter'),
        priority = document.getElementById('submission-priority'),
        tbody = document.getElementById('submission-queue-table'),
        empty = document.getElementById('submission-queue-empty');

    function render() {
        const all = LevelUpData.getSubmissions();

        for (const [id, status] of [
            ['queue-pending', 'pending'],
            ['queue-needs-review', 'needs-review'],
            ['queue-approved', 'approved'],
            ['queue-rejected', 'rejected']
        ]) {
            document.getElementById(id).textContent =
                all.filter(s => s.status === status).length;
        }

        let list = all.filter(s => {
            const u = LevelUpData.getUsers().find(x => x.id === s.userId);
            const c = LevelUpData.challengeById(s.challengeId);

            return (`${s.id} ${u?.name || ''} ${c?.title || ''}`)
                .toLowerCase()
                .includes(search.value.toLowerCase());
        });

        if (filter.value !== 'all') {
            list = list.filter(s => s.status === filter.value);
        }

        if (priority.value !== 'all') {
            list = list.filter(s => (s.risk || 'normal') === priority.value);
        }

        list.sort((a, b) =>
            ({
                'needs-review': 0,
                pending: 1,
                approved: 2,
                rejected: 3
            }[a.status] ?? 4) -
            ({
                'needs-review': 0,
                pending: 1,
                approved: 2,
                rejected: 3
            }[b.status] ?? 4)
        );

        tbody.innerHTML = list.map(s => {
            const u = LevelUpData.getUsers().find(x => x.id === s.userId),
                c = LevelUpData.challengeById(s.challengeId);

            return `
                <tr>
                    <td>
                        <div class="table-title">${LevelUpUI.escapeHTML(s.id.slice(-8))}</div>
                        <div class="table-sub">${LevelUpUI.escapeHTML(u?.name || 'User')}</div>
                    </td>
                    <td>
                        <div class="table-title">${LevelUpUI.escapeHTML(c?.title || 'Challenge')}</div>
                        <div class="table-sub">${c?.category || ''}</div>
                    </td>
                    <td>${LevelUpUI.escapeHTML(c?.proofType || '—')}</td>
                    <td>${LevelUpUI.formatDate(s.submittedAt)}</td>
                    <td>${LevelUpUI.statusBadge(s.status)}</td>
                    <td>
                        <span class="priority-label">${s.risk === 'attention' ? '⚠ Needs Attention' : 'Normal'}</span>
                    </td>
                    <td>
                        <a class="btn btn-primary btn-sm" href="submission-detail.html?id=${s.id}">Review ↗</a>
                    </td>
                </tr>
            `;
        }).join('');

        empty.classList.toggle('hidden', list.length > 0);

        if (!list.length) {
            empty.innerHTML = LevelUpUI.emptyState(
                'Tidak ada submission',
                'Tidak ada data yang cocok dengan filter ini.',
                '<button class="btn btn-secondary" id="reset-queue">Reset Filter</button>'
            );
        }

        document.getElementById('reset-queue')?.addEventListener('click', () => {
            search.value = '';
            filter.value = 'all';
            priority.value = 'all';
            render();
        });
    }

    [search, filter, priority].forEach(e => e.addEventListener('input', render));

    render();
});
