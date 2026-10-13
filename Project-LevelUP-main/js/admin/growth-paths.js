
document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById('admin-path-search'),
        status = document.getElementById('admin-path-status'),
        root = document.getElementById('admin-path-list');

    function render() {
        const paths = LevelUpData.getPaths();

        document.getElementById('admin-path-active').textContent =
            paths.filter(p => p.status !== 'draft').length;

        document.getElementById('admin-path-stages').textContent =
            paths.reduce((n, p) => n + (p.challengeIds?.length || 0), 0);

        document.getElementById('admin-path-challenges').textContent =
            new Set(paths.flatMap(p => p.challengeIds || [])).size;

        const list = paths
            .filter(p =>
                (p.title + ' ' + p.description)
                    .toLowerCase()
                    .includes(search.value.toLowerCase())
            )
            .filter(p =>
                status.value === 'all' ||
                (p.status || 'active') === status.value
            );

        root.innerHTML = list
            .map(p => `
                <article class="card path-card">
                    <div class="between">
                        <span class="badge">${LevelUpUI.escapeHTML(p.category)}</span>
                        ${LevelUpUI.statusBadge(p.status || 'active')}
                    </div>

                    <div class="path-art" style="background:#EAF5FF">
                        <img src="${LevelUpUI.rootPrefix()}${p.art}" alt="">
                    </div>

                    <h3>${LevelUpUI.escapeHTML(p.title)}</h3>
                    <p>${LevelUpUI.escapeHTML(p.description)}</p>

                    <div class="quick-stats">
                        <span class="badge">${p.challengeIds.length} stage/challenge</span>
                        <span class="badge yellow">${LevelUpUI.escapeHTML(p.duration)}</span>
                    </div>

                    <div class="card-actions">
                        <a class="btn btn-secondary" href="growth-path-builder.html?id=${p.id}">Edit Path</a>
                        <a class="btn btn-primary" href="../growth-path.html?id=${p.id}" target="_blank" rel="noopener">Preview ↗</a>
                    </div>
                </article>
            `)
            .join('') || LevelUpUI.emptyState(
                'Belum ada Growth Path',
                'Buat perjalanan perkembangan pertama.',
                '<a class="btn btn-primary" href="growth-path-builder.html">Buat Growth Path</a>'
            );
    }

    [search, status].forEach(e => e.addEventListener('input', render));

    render();
});
