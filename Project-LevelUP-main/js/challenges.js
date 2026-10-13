document.addEventListener('DOMContentLoaded', () => {
    const user = LevelUpProgression.currentUser();
    const id = new URLSearchParams(location.search).get('id') || 'reading-01';
    const c = LevelUpData.challengeById(id) || LevelUpData.getChallenges()[0];

    let en = LevelUpData.enrollmentFor(user?.id, c.id) ||
        LevelUpProgression.createEnrollment(c.id);

    if (!en) {
        setTimeout(() => location.href = `challenge-detail.html?id=${c.id}`, 500);
        return;
    }

    document.getElementById('session-title').textContent = c.title;
    document.getElementById('session-subtitle').textContent = c.description;
    document.getElementById('session-progress-title').textContent = c.title;
    document.getElementById('session-step-title').textContent =
        c.tasks[0] || 'Selesaikan aktivitas';
    document.getElementById('session-step-desc').textContent =
        c.objective || c.description;

    document.getElementById('session-criteria').innerHTML =
        `<div class="criteria-row"><span class="check">✓</span><span>${LevelUpUI.escapeHTML(c.criteria)}</span></div>`;

    const taskRoot = document.getElementById('session-tasks');
    let completed = new Set(en.completedTasks || []);

    taskRoot.innerHTML = c.tasks
        .map((task, i) => `<label class="task-check ${completed.has(i) ? 'done' : ''}"><input type="checkbox" data-task-index="${i}" ${completed.has(i) ? 'checked' : ''}><span>${LevelUpUI.escapeHTML(task)}<small>Tugas ${i + 1} dari ${c.tasks.length}</small></span></label>`)
        .join('');

    const noteInput = document.getElementById('session-note');

    noteInput.value =
        LS.get('sessionNotes', {})[`${user.id}:${c.id}`] || '';

    const timerLabel = document.getElementById('session-timer');
    const totalSecs = Math.max(60, Number(c.minutes || 20) * 60);

    let remaining = totalSecs;
    let interval = null;

    function drawTimer() {
        timerLabel.textContent =
            `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
    }

    function pause() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }

        document.getElementById('timer-pause').disabled = true;
        document.getElementById('timer-start').disabled = false;
    }

    document.getElementById('timer-start').addEventListener('click', () => {
        if (interval) return;

        document.getElementById('timer-start').disabled = true;
        document.getElementById('timer-pause').disabled = false;

        interval = setInterval(() => {
            remaining = Math.max(0, remaining - 1);
            drawTimer();

            if (remaining === 0) {
                pause();
                LevelUpUI.toast(
                    'Waktu sesi berakhir. Catat hasilmu sebelum melanjutkan.'
                );
            }
        }, 1000);
    });

    document.getElementById('timer-pause').addEventListener('click', pause);

    document.getElementById('timer-reset').addEventListener('click', () => {
        pause();
        remaining = totalSecs;
        drawTimer();
    });

    drawTimer();

    function refresh() {
        const pct = Math.round(
            completed.size / (c.tasks.length || 1) * 100
        );

        document.getElementById('task-count').textContent =
            `${completed.size}/${c.tasks.length}`;

        document.getElementById('session-progress-percent').textContent =
            pct + '%';

        document.getElementById('session-progress-bar').style.width =
            pct + '%';

        document.getElementById('session-progress-copy').textContent =
            pct === 100
                ? 'Semua task selesai. Kamu dapat menyiapkan submission.'
                : `Selesaikan ${c.tasks.length - completed.size} tugas lagi untuk menuntaskan checklist.`;

        document.getElementById('go-submit').classList.toggle(
            'disabled',
            pct < 100
        );

        document.getElementById('go-submit').setAttribute(
            'aria-disabled',
            pct < 100 ? 'true' : 'false'
        );

        document.getElementById('go-submit').href =
            pct === 100 ? `proof-submission.html?id=${c.id}` : '#';

        taskRoot.querySelectorAll('[data-task-index]').forEach(input => {
            input.closest('.task-check').classList.toggle(
                'done',
                input.checked
            );
        });
    }

    taskRoot.querySelectorAll('[data-task-index]').forEach(input => {
        input.addEventListener('change', () => {
            const i = Number(input.dataset.taskIndex);

            input.checked
                ? completed.add(i)
                : completed.delete(i);

            refresh();
        });
    });

    document.getElementById('save-session').addEventListener('click', () => {
        const pct = Math.round(
            completed.size / (c.tasks.length || 1) * 100
        );

        LevelUpProgression.updateEnrollment(c.id, {
            completedTasks: [...completed],
            progress: pct,
            status: 'in-progress'
        });

        const notes = LS.get('sessionNotes', {});
        notes[`${user.id}:${c.id}`] = noteInput.value;

        LS.set('sessionNotes', notes);

        LevelUpUI.toast('Progress sesi disimpan.');
        refresh();
    });

    document.getElementById('go-submit').addEventListener('click', e => {
        if (completed.size < c.tasks.length) {
            e.preventDefault();

            LevelUpUI.toast(
                'Selesaikan checklist dulu sebelum submission.',
                'error'
            );

            return;
        }

        LevelUpProgression.updateEnrollment(c.id, {
            completedTasks: [...completed],
            progress: 100,
            status: 'in-progress'
        });

        const notes = LS.get('sessionNotes', {});
        notes[`${user.id}:${c.id}`] = noteInput.value;

        LS.set('sessionNotes', notes);
    });

    refresh();
});