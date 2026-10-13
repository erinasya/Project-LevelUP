document.addEventListener('DOMContentLoaded', () => {
    const s = LevelUpAuth.currentSession();
    const user = s.userId;
    const params = new URLSearchParams(location.search);

    let c = LevelUpData.challengeById(params.get('id'));

    const ens = LevelUpData.getEnrollments().filter(
        e => e.userId === user
    );

    if (!c) {
        const en =
            ens.find(e => e.status === 'in-progress' && e.progress >= 100) ||
            ens.find(e => e.status === 'in-progress');

        c = LevelUpData.challengeById(en?.challengeId) ||
            LevelUpData.getChallenges()[0];
    }

    const enroll = LevelUpData.enrollmentFor(user, c.id);

    document.getElementById('submission-challenge-title').textContent =
        c.title;

    document.getElementById('submission-challenge-desc').textContent =
        c.description;

    document.getElementById('submission-checklist').innerHTML =
        c.tasks
            .map(
                (t, i) =>
                    `<div class="submission-requirement"><span class="state-icon">${enroll?.completedTasks?.includes(i) ? '✓' : '○'}</span><span>${LevelUpUI.escapeHTML(t)}</span></div>`
            )
            .join('');

    const note = LS.get('sessionNotes', {})[`${user}:${c.id}`];

    if (note) {
        document.getElementById('proof-reflection').value = note;
    }

    const fileInput = document.getElementById('proof-file');
    const filePreview = document.getElementById('file-preview');

    let filename = '';

    fileInput.addEventListener('change', () => {
        const f = fileInput.files?.[0];

        filename = f?.name || '';

        filePreview.classList.toggle('hidden', !f);

        filePreview.innerHTML = f
            ? `<div class="file-preview"><span>📎</span><span class="file-name">${LevelUpUI.escapeHTML(f.name)}</span><span class="badge">${Math.round(f.size / 1024)} KB</span></div>`
            : '';
    });

    document.getElementById('proof-form').addEventListener('submit', e => {
        e.preventDefault();

        const latest = LevelUpData.enrollmentFor(user, c.id);

        if (!latest || latest.progress < 100) {
            LevelUpUI.toast(
                'Selesaikan semua tugas di sesi challenge sebelum mengirim.',
                'error'
            );
            return;
        }

        const reflection = document
            .getElementById('proof-reflection')
            .value.trim();

        if (reflection.length < 10) {
            LevelUpUI.toast(
                'Tambahkan refleksi minimal 10 karakter.',
                'error'
            );
            return;
        }

        const arr = LevelUpData.getSubmissions();

        const existing = arr.find(
            x =>
                x.userId === user &&
                x.challengeId === c.id &&
                x.status === 'rejected'
        );

        const sub = {
            id: existing?.id || LS.id(),
            userId: user,
            challengeId: c.id,
            filename,
            reflection,
            extra: document.getElementById('proof-pages').value.trim(),
            status: 'pending',
            submittedAt: new Date().toISOString(),
            reviewReason: '',
            risk: 'normal'
        };

        if (existing) {
            Object.assign(existing, sub);
            LevelUpData.setSubmissions(arr);
        } else {
            arr.unshift(sub);
            LevelUpData.setSubmissions(arr);
        }

        LevelUpUI.toast('Submission demo berhasil dikirim.');

        setTimeout(
            () => location.href = `submission-status.html?id=${sub.id}`,
            450
        );
    });
});