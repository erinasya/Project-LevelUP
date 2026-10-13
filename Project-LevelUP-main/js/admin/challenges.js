
document.addEventListener('DOMContentLoaded', () => {
    const q = document.getElementById('admin-challenge-search'),
        status = document.getElementById('admin-challenge-status'),
        cat = document.getElementById('admin-challenge-category'),
        tbody = document.getElementById('admin-challenge-table'),
        empty = document.getElementById('admin-challenge-empty');

    function render() {
        const all = LevelUpData.getChallenges();

        document.getElementById('challenge-active-count').textContent =
            all.filter(c => c.status === 'active').length;

        document.getElementById('challenge-draft-count').textContent =
            all.filter(c => c.status === 'draft').length;

        document.getElementById('challenge-archived-count').textContent =
            all.filter(c => c.status === 'archived').length;

        let list = all.filter(c =>
            (c.title + ' ' + c.description).toLowerCase().includes(q.value.toLowerCase())
        );

        if (status.value !== 'all') {
            list = list.filter(c => c.status === status.value);
        }

        if (cat.value !== 'all') {
            list = list.filter(c => c.categoryKey === cat.value);
        }

        tbody.innerHTML = list.map(c => `
            <tr>
                <td>
                    <div class="row">
                        <div class="icon-tile">${c.icon || '✦'}</div>
                        <div>
                            <div class="table-title">${LevelUpUI.escapeHTML(c.title)}</div>
                            <div class="table-sub">${c.duration} · ${c.xp} XP</div>
                        </div>
                    </div>
                </td>
                <td>${c.category}</td>
                <td>${c.difficulty}</td>
                <td><span class="small">${c.verification}</span></td>
                <td>${LevelUpUI.statusBadge(c.status)}</td>
                <td>
                    <div class="admin-table-actions">
                        <a class="btn btn-secondary btn-sm" href="challenge-form.html?id=${c.id}">Edit</a>
                        <button class="btn btn-ghost btn-sm" data-archive-challenge="${c.id}">${c.status === 'archived' ? 'Aktifkan' : 'Arsipkan'}</button>
                    </div>
                </td>
            </tr>
        `).join('');

        empty.classList.toggle('hidden', list.length > 0);

        if (!list.length) {
            empty.innerHTML = LevelUpUI.emptyState(
                'Tidak ada challenge',
                'Coba ubah filter atau buat challenge baru.',
                '<a href="challenge-form.html" class="btn btn-primary">Buat Challenge</a>'
            );
        }

        tbody.querySelectorAll('[data-archive-challenge]').forEach(b =>
            b.addEventListener('click', () => {
                const all = LevelUpData.getChallenges();
                const c = all.find(x => x.id === b.dataset.archiveChallenge);

                if (!c) return;

                c.status = c.status === 'archived' ? 'active' : 'archived';

                LevelUpData.setChallenges(all);

                LevelUpUI.toast(
                    c.status === 'archived'
                        ? 'Challenge diarsipkan.'
                        : 'Challenge diaktifkan.'
                );

                render();
            })
        );
    }

    [q, status, cat].forEach(e => e.addEventListener('input', render));

    render();
});
