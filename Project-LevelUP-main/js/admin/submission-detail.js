
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search),
        all = LevelUpData.getSubmissions();

    let sub = all.find(s => s.id === params.get('id'));

    if (!sub) {
        sub = all.find(s => s.status === 'pending' || s.status === 'needs-review') || all[0];
    }

    if (!sub) {
        document.getElementById('admin-review-notice').innerHTML = LevelUpUI.emptyState(
            'Tidak ada submission',
            'Submission akan muncul di sini setelah user mengirim bukti.',
            '<a href="submissions.html" class="btn btn-secondary">Kembali ke Queue</a>'
        );

        document.getElementById('admin-review-form').classList.add('hidden');
        return;
    }

    const c = LevelUpData.challengeById(sub.challengeId),
        u = LevelUpData.getUsers().find(x => x.id === sub.userId);

    document.getElementById('review-challenge-title').textContent = c?.title || 'Challenge';

    document.getElementById('review-user-meta').textContent =
        `${u?.name || 'User'} · ${u?.email || ''} · ${LevelUpUI.formatDate(sub.submittedAt)}`;

    document.getElementById('review-status-badge').outerHTML =
        LevelUpUI.statusBadge(sub.status);

    document.getElementById('review-proof-preview').textContent =
        sub.filename ? '📎 ' + sub.filename : '📝 Refleksi / catatan';

    document.getElementById('review-proof-meta').textContent =
        `Proof type: ${c?.proofType || '—'} · Verification: ${c?.verification || '—'}`;

    document.getElementById('review-reflection').textContent =
        sub.reflection || 'Tidak ada refleksi';

    document.getElementById('review-extra').textContent = sub.extra || '—';

    document.getElementById('review-criteria').innerHTML = `
        <div class="criteria-row">
            <span class="check">✓</span>
            <span>${LevelUpUI.escapeHTML(c?.criteria || 'Tidak ada kriteria')}</span>
        </div>
        ${(c?.tasks || []).map(t => `
            <div class="criteria-row">
                <span class="check">✓</span>
                <span>${LevelUpUI.escapeHTML(t)}</span>
            </div>
        `).join('')}
    `;

    document.getElementById('review-method').innerHTML = `
        <span class="badge lavender">${LevelUpUI.escapeHTML(c?.verification || 'Not set')}</span>
        <p class="small" style="margin-top:9px">
            Periksa bukti terhadap kriteria. Indikator otomatis tidak menjadi keputusan pelanggaran final.
        </p>
    `;

    document.getElementById('review-reason').value = sub.reviewReason || '';

    document.getElementById('review-detail-history').innerHTML =
        LevelUpData.getReviewHistory()
            .filter(h => h.submissionId === sub.id)
            .map(h => `
                <div class="activity-row">
                    <div class="activity-icon">${h.decision === 'approved' ? '✓' : '↻'}</div>
                    <div>
                        <strong>${h.decision}</strong>
                        <p>${LevelUpUI.escapeHTML(h.reason)}</p>
                        <p>${LevelUpUI.formatDate(h.at)}</p>
                    </div>
                </div>
            `)
            .join('') || '<p class="small muted">Belum ada keputusan sebelumnya.</p>';

    if (sub.status === 'approved' || sub.status === 'rejected') {
        document.getElementById('admin-review-form').innerHTML = `
            <span class="eyebrow">FINAL DECISION</span>
            <h2>Keputusan sudah tersimpan</h2>
            <p>Submission ini sudah memiliki keputusan final. Jika perlu koreksi, gunakan proses banding atau submission ulang sesuai aturan produk.</p>
            <div class="notice">${LevelUpUI.escapeHTML(sub.reviewReason || 'Tidak ada catatan tambahan.')}</div>
            <a href="submissions.html" class="btn btn-secondary" style="margin-top:14px">Kembali ke Queue</a>
        `;
    } else {
        document.getElementById('admin-review-form').addEventListener('submit', e => {
            e.preventDefault();

            const decision = document.getElementById('review-decision').value,
                reason = document.getElementById('review-reason').value.trim();

            if (decision === 'rejected' && !reason) {
                LevelUpUI.toast('Alasan penolakan wajib diisi.', 'error');
                return;
            }

            if (
                ['approved', 'rejected'].includes(sub.status) &&
                !confirm('Submission sudah memiliki keputusan. Simpan perubahan keputusan?')
            ) {
                return;
            }

            if (decision === 'approved') {
                if (!LevelUpProgression.approveSubmission(sub.id)) {
                    LevelUpUI.toast('Keputusan tidak dapat disimpan.', 'error');
                    return;
                }
            } else {
                if (!LevelUpProgression.rejectSubmission(sub.id, reason)) {
                    LevelUpUI.toast('Keputusan tidak dapat disimpan.', 'error');
                    return;
                }
            }

            LevelUpUI.toast('Keputusan tersimpan.');

            setTimeout(() => location.href = 'submissions.html', 500);
        });
    }
});
