(function () {
    const root = () => LevelUpAuth.rootPrefix();

    const userNav = [
        ['dashboard.html', 'Dashboard', '⌂'],
        ['growth-plan.html', 'My Growth Plan', '↗'],
        ['challenges.html', 'Explore', '✳'],
        ['progress.html', 'My Progress', '▥'],
        ['achievements.html', 'Achievements', '✦'],
        ['growth-insights.html', 'Insights', '⌁'],
        ['profile.html', 'Profile', '◉']
    ];

    const adminNav = [
        ['admin/dashboard.html', 'Overview', '⌂'],
        ['admin/challenges.html', 'Challenges', '✳'],
        ['admin/growth-paths.html', 'Growth Paths', '↗'],
        ['admin/submissions.html', 'Submission Review', '▥'],
        ['admin/rewards.html', 'Reward Rules', '✦'],
        ['admin/review-history.html', 'Review History', '⌁']
    ];

    function navHref(page) {
        return root() + page;
    }

    function renderShell() {
        const header = document.getElementById('site-header');
        const side = document.getElementById('app-sidebar');

        if (!header || !side) return;

        const session = LevelUpAuth.currentSession();
        const role = document.body.dataset.requireRole || session?.role || 'user';
        const nav = role === 'admin' ? adminNav : userNav;

        const currentFile = location.pathname
            .split('/')
            .pop()
            .replace('.html', '');

        const activePage = ({
            'challenge-detail': 'challenges',
            'challenge-session': 'progress',
            'proof-submission': 'progress',
            'submission-status': 'progress',
            'growth-path': 'growth-plan',
            'challenge-form': 'challenges',
            'growth-path-builder': 'growth-paths',
            'submission-detail': 'submissions',
            'onboarding': 'dashboard'
        })[currentFile] || currentFile;

        header.innerHTML = `
            <div class="brand">
                <a
                    href="${navHref(role === 'admin' ? 'admin/dashboard.html' : 'dashboard.html')}"
                    aria-label="LevelUp dashboard"
                    class="brand-link"
                    style="
                        display: inline-flex;
                        align-items: center;
                        gap: 9px;
                        flex-shrink: 0;
                        text-decoration: none;
                    "
                >
                    <img
                        class="brand-icon"
                        src="${root()}assets/images/logo/levelup-mark.png"
                        alt=""
                        style="
                            width: 38px;
                            height: 38px;
                            object-fit: contain;
                            display: block;
                            flex-shrink: 0;
                        "
                    >

                    <span
                        class="brand-wordmark"
                        style="
                            color: #244B37;
                            font-family: Georgia, 'Times New Roman', serif;
                            font-size: 22px;
                            font-weight: 800;
                            letter-spacing: -1px;
                            line-height: 1;
                            white-space: nowrap;
                        "
                    >LevelUp</span>
                </a>
            </div>

            <button
                class="icon-button mobile-menu"
                id="mobile-menu"
                aria-label="Buka navigasi"
                type="button"
            >☰</button>

            <nav
                class="topnav"
                id="topnav"
                aria-label="Navigasi utama"
            >
                ${nav.map(([href, label]) => `
                    <a
                        href="${navHref(href)}"
                        class="${activePage === href.split('/').pop().replace('.html', '') ? 'active' : ''}"
                    >${label}</a>
                `).join('')}
            </nav>

            <div class="top-actions">
                <span class="role-pill">
                    ${role === 'admin' ? 'ADMIN MODE' : 'GROWTH SPACE'}
                </span>

                <button
                    class="icon-button"
                    id="top-search"
                    title="Cari challenge"
                    aria-label="Cari challenge"
                    type="button"
                >⌕</button>

                <div
                    class="avatar"
                    title="${escapeHTML(session?.name || 'User')}"
                >
                    ${escapeHTML((session?.name || 'U').trim().charAt(0).toUpperCase())}
                </div>

                <button
                    class="icon-button"
                    data-logout
                    aria-label="Keluar"
                    title="Keluar"
                    type="button"
                >↪</button>
            </div>
        `;

        side.innerHTML = '';
        side.classList.add('hidden');

        const menu = document.getElementById('mobile-menu');

        menu?.addEventListener('click', () => {
            document.getElementById('topnav')?.classList.toggle('open');
        });

        document.getElementById('top-search')?.addEventListener('click', () => {
            location.href = navHref(
                role === 'admin'
                    ? 'admin/challenges.html'
                    : 'challenges.html'
            );
        });

        document.querySelectorAll('[data-logout]').forEach(button => {
            button.addEventListener('click', () => {
                LevelUpAuth.logout();
            });
        });

        const footer = document.querySelector('.app-footer');

        if (footer) {
            footer.innerHTML = `
                <span>
                    © ${new Date().getFullYear()} LevelUp · Grow with Purpose. Progress with Proof.
                </span>
                <span>
                    Frontend demo · Data tersimpan di browser
                </span>
            `;
        }
    }

    function toast(message, type = 'success') {
        const rootEl = document.getElementById('toast-root') || (() => {
            const element = document.createElement('div');

            element.id = 'toast-root';
            element.className = 'toast-root';

            document.body.appendChild(element);

            return element;
        })();

        const item = document.createElement('div');

        item.className = `toast ${type}`;
        item.textContent = message;

        rootEl.appendChild(item);

        setTimeout(() => {
            item.remove();
        }, 3500);
    }

    function challengeCard(challenge) {
        const prerequisite = challenge.prerequisite
            ? LevelUpData.challengeById(challenge.prerequisite)
            : null;

        const session = LevelUpAuth.currentSession();

        const enrollment = LevelUpData.enrollmentFor(
            session?.userId,
            challenge.id
        );

        const locked = !!prerequisite && !(
            LevelUpData.getSubmissions().some(submission =>
                submission.userId === session?.userId &&
                submission.challengeId === prerequisite.id &&
                submission.status === 'approved'
            ) ||
            LevelUpData.getEnrollments().some(item =>
                item.userId === session?.userId &&
                item.challengeId === prerequisite.id &&
                item.status === 'completed'
            )
        );

        const categoryClass = challenge.categoryKey === 'learning'
            ? 'card-lavender'
            : challenge.categoryKey === 'creative'
                ? 'card-peach'
                : 'card-green';

        const artClass = categoryClass.replace('card-', '');

        const artBackground = challenge.categoryKey === 'learning'
            ? '#F0E6F6'
            : challenge.categoryKey === 'creative'
                ? '#FFF0E6'
                : '#E7F2E7';

        const badgeClass = challenge.categoryKey === 'learning'
            ? 'lavender'
            : challenge.categoryKey === 'creative'
                ? 'peach'
                : 'green';

        const actionLabel = locked
            ? 'Lihat Syarat'
            : enrollment
                ? 'Lanjutkan'
                : 'Lihat Detail';

        return `
            <article class="card challenge-card">
                <div
                    class="challenge-art ${artClass}"
                    style="background: ${artBackground}"
                >
                    <img
                        src="${root()}${escapeHTML(challenge.art || '')}"
                        alt=""
                        onerror="this.style.display='none'"
                    >

                    <span class="art-emoji">
                        ${escapeHTML(challenge.icon || '✦')}
                    </span>
                </div>

                <div class="card-body">
                    <div class="between">
                        <span class="badge ${badgeClass}">
                            ${escapeHTML(challenge.category || '')}
                        </span>

                        <span class="badge gray">
                            ${escapeHTML(challenge.difficulty || '')}
                        </span>
                    </div>

                    <h3>${escapeHTML(challenge.title || '')}</h3>

                    <p>${escapeHTML(challenge.description || '')}</p>

                    <div class="challenge-meta">
                        <span class="small muted">
                            ◷ ${escapeHTML(challenge.duration || '—')}
                        </span>

                        <span class="small muted">
                            ✦ ${Number(challenge.xp) || 0} XP
                        </span>
                    </div>

                    ${locked ? `
                        <div class="notice warning">
                            Selesaikan prasyarat untuk membuka challenge ini.
                        </div>
                    ` : ''}

                    <div class="card-actions">
                        <a
                            class="btn btn-primary btn-sm"
                            href="${navHref('challenge-detail.html')}?id=${encodeURIComponent(challenge.id)}"
                        >
                            ${actionLabel}
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    function escapeHTML(value = '') {
        return String(value).replace(/[&<>"']/g, character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[character]);
    }

    function formatDate(date) {
        if (!date) return '—';

        try {
            return new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).format(new Date(date));
        } catch (error) {
            return date;
        }
    }

    function statusBadge(status) {
        const statuses = {
            'pending': ['Pending', 'yellow'],
            'needs-review': ['Needs Review', 'peach'],
            'approved': ['Approved', 'green'],
            'rejected': ['Rejected', 'red'],
            'in-progress': ['Sedang Berjalan', 'teal'],
            'completed': ['Selesai', 'green'],
            'locked': ['Locked', 'gray'],
            'active': ['Aktif', 'teal'],
            'draft': ['Draft', 'yellow'],
            'archived': ['Archived', 'gray']
        };

        const result = statuses[status] || [status || '—', 'gray'];

        return `
            <span class="badge ${result[1]}">
                ${escapeHTML(result[0])}
            </span>
        `;
    }

    function emptyState(title, description, action = '') {
        return `
            <div class="empty-state">
                <div class="empty-art">☁</div>
                <h3>${escapeHTML(title)}</h3>
                <p>${escapeHTML(description)}</p>
                ${action}
            </div>
        `;
    }

    window.LevelUpUI = {
        renderShell,
        toast,
        challengeCard,
        escapeHTML,
        formatDate,
        statusBadge,
        emptyState,
        rootPrefix: root,
        navHref
    };

    document.addEventListener('DOMContentLoaded', renderShell);
})();