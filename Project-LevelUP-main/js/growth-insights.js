document.addEventListener('DOMContentLoaded', () => {
    const s = LevelUpAuth.currentSession();
    const period = document.getElementById('insights-period');

    function render() {
        const ens = LevelUpData.getEnrollments().filter(
            e => e.userId === s.userId
        );

        const subs = LevelUpData.getSubmissions().filter(
            x => x.userId === s.userId
        );

        const done =
            ens.filter(e => e.status === 'completed').length +
            subs.filter(
                x =>
                    x.status === 'approved' &&
                    !ens.some(
                        e =>
                            e.challengeId === x.challengeId &&
                            e.status === 'completed'
                    )
            ).length;

        document.getElementById('insights-completed').textContent =
            done + ' challenge selesai';

        document.getElementById('personal-best-number').textContent = done;

        document.getElementById('personal-best-copy').textContent =
            done
                ? 'Challenge selesai berdasarkan catatan demo.'
                : 'Selesaikan challenge pertama untuk mulai melihat riwayat.';

        document.getElementById('insights-summary').textContent =
            done
                ? `Kamu sudah punya ${done} challenge yang tercatat selesai. Lihat kriteria berikutnya sebelum memilih langkah selanjutnya.`
                : 'Perjalananmu dimulai ketika kamu memilih dan menyelesaikan challenge pertama.';

        const path =
            LevelUpData.getPaths().find(
                p =>
                    p.categoryKey ===
                    (LevelUpData.getProfile().interests || ['learning'])[0]
            ) || LevelUpData.getPaths()[0];

        const cs = path.challengeIds
            .map(id => LevelUpData.challengeById(id))
            .filter(Boolean);

        const pct = Math.round(
            cs.filter(
                c =>
                    ens.some(
                        e =>
                            e.challengeId === c.id &&
                            e.status === 'completed'
                    ) ||
                    subs.some(
                        x =>
                            x.challengeId === c.id &&
                            x.status === 'approved'
                    )
            ).length / (cs.length || 1) * 100
        );

        document.getElementById('insights-path-progress').textContent =
            pct + '%';

        document.getElementById('insights-path-bar').style.width =
            pct + '%';

        const bars = Array.from({ length: 7 }, (_, i) => {
            const h = [23, 42, 32, 58, 44, 68, 51][i];

            return `<div class="chart-bar-wrap"><div class="chart-bar" style="height:${h}%"></div><span>${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}</span></div>`;
        }).join('');

        document.getElementById('insights-chart').innerHTML = bars;

        document.getElementById('insights-category-total').textContent =
            ens.length + subs.length;

        const categoryCounts = {};

        ens.forEach(e => {
            const c = LevelUpData.challengeById(e.challengeId);

            if (c) {
                categoryCounts[c.category] =
                    (categoryCounts[c.category] || 0) + 1;
            }
        });

        subs.forEach(x => {
            const c = LevelUpData.challengeById(x.challengeId);

            if (c) {
                categoryCounts[c.category] =
                    (categoryCounts[c.category] || 0) + 1;
            }
        });

        const colors = [
            '#47B5A8',
            '#DBC0E8',
            '#FBB28B',
            '#A3C1E2'
        ];

        document.getElementById('insights-category-legend').innerHTML =
            Object.entries(categoryCounts).length
                ? Object.entries(categoryCounts)
                    .map(
                        ([k, v], i) =>
                            `<div><div class="between"><span class="small">${k}</span><strong>${v}</strong></div><div class="progress-track" style="margin-top:4px"><div class="progress-fill" style="width:${v / (ens.length + subs.length || 1) * 100}%;background:${colors[i % colors.length]}"></div></div></div>`
                    )
                    .join('')
                : '<p class="small">Kategori akan muncul setelah kamu mulai challenge.</p>';

        const next = LevelUpData.getChallenges()
            .filter(c => c.status === 'active')
            .filter(
                c =>
                    !ens.some(
                        e =>
                            e.challengeId === c.id &&
                            e.status === 'completed'
                    ) &&
                    !subs.some(
                        x =>
                            x.challengeId === c.id &&
                            x.status === 'approved'
                    )
            )
            .slice(0, 2);

        document.getElementById('insights-next-step').innerHTML =
            next.map(LevelUpUI.challengeCard).join('') ||
            LevelUpUI.emptyState(
                'Semua tahap selesai',
                'Jelajahi jalur lain untuk tujuan baru.',
                '<a class="btn btn-primary" href="challenges.html">Explore</a>'
            );

        document.getElementById('insights-history').innerHTML =
            [...subs]
                .sort(
                    (a, b) =>
                        new Date(b.submittedAt) - new Date(a.submittedAt)
                )
                .slice(0, 5)
                .map(x => {
                    const c = LevelUpData.challengeById(x.challengeId);

                    return `<div class="activity-row"><div class="activity-icon">${c?.icon || '✦'}</div><div style="flex:1"><strong>${LevelUpUI.escapeHTML(c?.title || 'Challenge')}</strong><p>${LevelUpUI.formatDate(x.submittedAt)} · ${x.status}</p></div>${LevelUpUI.statusBadge(x.status)}</div>`;
                })
                .join('') ||
            LevelUpUI.emptyState(
                'Belum ada riwayat',
                'Aktivitasmu akan tercatat setelah kamu mengerjakan challenge.'
            );
    }

    period.addEventListener('change', render);

    render();
});