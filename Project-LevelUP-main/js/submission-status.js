document.addEventListener('DOMContentLoaded', () => {
    const user = LevelUpAuth.currentSession().userId;
    const specific = new URLSearchParams(location.search).get('id');

    let list = LevelUpData.getSubmissions().filter(
        s => s.userId === user
    );

    if (specific) {
        list = list.filter(s => s.id === specific);
    }

    const root = document.getElementById('submission-status-list');
    const empty = document.getElementById('submission-status-empty');

    if (!list.length) {
        empty.classList.remove('hidden');

        empty.innerHTML = LevelUpUI.emptyState(
            'Belum ada submission',
            'Kirim bukti setelah memenuhi kriteria challenge.',
            '<a class="btn btn-primary" href="progress.html">My Progress</a>'
        );

        return;
    }

    root.innerHTML = list
        .map(s => {
            const c = LevelUpData.challengeById(s.challengeId);

            const statusText = {
                pending: [
                    'Menunggu pemeriksaan',
                    'Submission kamu telah tersimpan. Statusnya masih menunggu proses review.',
                    '◷',
                    'warning'
                ],
                'needs-review': [
                    'Perlu pemeriksaan',
                    'Submission ini memerlukan peninjauan tambahan. Ini bukan keputusan pelanggaran.',
                    '⌕',
                    'warning'
                ],
                approved: [
                    'Submission disetujui',
                    'Kriteria submission telah dipenuhi. Lihat achievement atau langkah berikutnya.',
                    '✓',
                    'success'
                ],
                rejected: [
                    'Submission perlu diperbaiki',
                    s.reviewReason || 'Periksa kembali kriteria challenge sebelum mengirim ulang.',
                    '↻',
                    'error'
                ]
            }[s.status] || [
                'Status belum diketahui',
                '',
                '•',
                ''
            ];

            return `<article class="card"><div class="submission-status-hero ${statusText[3] === 'success' ? '' : statusText[3] === 'error' ? '' : ''}"><div class="submission-status-icon">${statusText[2]}</div><div style="flex:1"><div class="between"><h2>${c?.title || 'Challenge'}</h2>${LevelUpUI.statusBadge(s.status)}</div><p>${statusText[0]} · Dikirim ${LevelUpUI.formatDate(s.submittedAt)}</p><p class="small mb-0">${statusText[1]}</p></div></div><div class="grid grid-2 section"><div><span class="eyebrow">SUBMITTED FILE</span><p>${LevelUpUI.escapeHTML(s.filename || 'Tidak ada file terlampir')}</p><span class="eyebrow">REFLECTION</span><p>${LevelUpUI.escapeHTML(s.reflection || '—')}</p></div><div><span class="eyebrow">REVIEW FEEDBACK</span><p>${LevelUpUI.escapeHTML(s.reviewReason || 'Belum ada catatan pemeriksaan.')}</p>${s.status === 'approved' ? `<a href="achievements.html" class="btn btn-primary">Lihat Achievement ↗</a>` : ''}${s.status === 'rejected' ? `<a href="proof-submission.html?id=${s.challengeId}" class="btn btn-secondary">Perbaiki Submission ↗</a>` : ''}</div></div></article>`;
        })
        .join('');
});