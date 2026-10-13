
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search),
        id = params.get('id');
    const all = LevelUpData.getChallenges();
    const existing = id ? LevelUpData.challengeById(id) : null;
    const byId = x => document.getElementById(x);
    const form = byId('admin-challenge-form');
    const prereq = byId('challenge-prerequisite');
    const pathSelect = byId('challenge-path');

    pathSelect.innerHTML = LevelUpData.getPaths()
        .map(p => `<option value="${p.id}">${LevelUpUI.escapeHTML(p.title)}</option>`)
        .join('');

    all.filter(c => c.id !== id).forEach(c => {
        const o = document.createElement('option');
        o.value = c.id;
        o.textContent = c.title;
        prereq.appendChild(o);
    });

    if (existing) {
        byId('admin-challenge-form-title').textContent = 'Edit Challenge';
        byId('challenge-title').value = existing.title;
        byId('challenge-description').value = existing.description;
        byId('challenge-category').value = existing.categoryKey;
        byId('challenge-difficulty').value = existing.difficulty;
        byId('challenge-duration').value = existing.duration;
        byId('challenge-xp').value = existing.xp;
        byId('challenge-objective').value = existing.objective || '';
        byId('challenge-tasks').value = existing.tasks.join('\n');
        byId('challenge-criteria').value = existing.criteria;
        byId('challenge-proof').value = existing.proofType;
        byId('challenge-verification').value = existing.verification;
        byId('challenge-path').value = existing.pathId;
        byId('challenge-stage').value = existing.stage;
        prereq.value = existing.prerequisite || '';
        byId('challenge-status').value = existing.status;
    }

    function payload(forceStatus) {
        const title = byId('challenge-title').value.trim(),
            description = byId('challenge-description').value.trim(),
            criteria = byId('challenge-criteria').value.trim(),
            categoryKey = byId('challenge-category').value;

        const category = ({
            'learning': 'Learning & Focus',
            'creative': 'Creative & Digital Skills',
            'healthy': 'Healthy Habits'
        })[categoryKey];

        const dur = byId('challenge-duration').value.trim() || '5 hari';

        const tasks = byId('challenge-tasks').value
            .split('\n')
            .map(x => x.trim())
            .filter(Boolean);

        return Object.assign(
            {},
            existing || {
                id: LS.id(),
                featured: false
            },
            {
                title,
                description,
                category,
                categoryKey,
                difficulty: byId('challenge-difficulty').value,
                duration: dur,
                durationDays: parseInt(dur, 10) || 5,
                objective: byId('challenge-objective').value.trim() || description,
                tasks,
                criteria,
                proofType: byId('challenge-proof').value,
                verification: byId('challenge-verification').value,
                xp: Math.max(0, Number(byId('challenge-xp').value) || 0),
                pathId: byId('challenge-path').value,
                stage: Math.max(1, Number(byId('challenge-stage').value) || 1),
                prerequisite: prereq.value || null,
                status: forceStatus || byId('challenge-status').value,
                icon: categoryKey === 'learning' ? '📚' :
                    categoryKey === 'creative' ? '🎨' : '🌱',
                art: categoryKey === 'learning' ? 'assets/images/illustrations/reading.svg' :
                    categoryKey === 'creative' ? 'assets/images/illustrations/creative.svg' :
                        'assets/images/illustrations/healthy.svg'
            }
        );
    }

    function save(forceStatus) {
        const title = byId('challenge-title').value.trim(),
            desc = byId('challenge-description').value.trim(),
            criteria = byId('challenge-criteria').value.trim();

        if (!title || !desc || !criteria) {
            LevelUpUI.toast('Isi nama, deskripsi, dan kriteria penyelesaian.', 'error');
            form.reportValidity();
            return false;
        }

        const item = payload(forceStatus);

        if (item.status === 'active' && item.tasks.length === 0) {
            LevelUpUI.toast('Challenge aktif harus memiliki minimal satu task.', 'error');
            return false;
        }

        const arr = LevelUpData.getChallenges();
        const ix = arr.findIndex(c => c.id === item.id);

        if (ix >= 0) {
            arr[ix] = item;
        } else {
            arr.unshift(item);
        }

        LevelUpData.setChallenges(arr);

        const paths = LevelUpData.getPaths();
        let preservedStageName = 'Tahap ' + item.stage;

        paths.forEach(p => {
            if (!p.stages || !p.stages.length) {
                p.stages = (p.challengeIds || []).map((cid, i) => ({
                    name: 'Tahap ' + (i + 1),
                    challengeId: cid
                }));
            }

            const oldStage = p.stages.find(x => x.challengeId === item.id);

            if (oldStage && p.id === item.pathId) {
                preservedStageName = oldStage.name || preservedStageName;
            }

            p.stages = p.stages.filter(x => x.challengeId !== item.id);
            p.challengeIds = (p.challengeIds || []).filter(cid => cid !== item.id);
        });

        const targetPath = paths.find(p => p.id === item.pathId);

        if (targetPath) {
            const insertAt = Math.min(
                Math.max(0, item.stage - 1),
                targetPath.challengeIds.length
            );

            targetPath.challengeIds.splice(insertAt, 0, item.id);

            const stages = targetPath.stages || [];

            stages.splice(insertAt, 0, {
                name: preservedStageName,
                challengeId: item.id
            });

            targetPath.stages = stages;
            LevelUpData.setPaths(paths);
        }

        LevelUpUI.toast('Challenge berhasil disimpan.');

        setTimeout(() => location.href = 'challenges.html', 450);

        return true;
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        save();
    });

    byId('save-challenge-draft').addEventListener('click', () => save('draft'));

    function preview() {
        byId('challenge-form-preview').innerHTML = `
            <span class="badge">${byId('challenge-category').selectedOptions[0].text}</span>
            <h3 style="margin-top:10px">${LevelUpUI.escapeHTML(byId('challenge-title').value || 'Nama challenge')}</h3>
            <p class="small">${LevelUpUI.escapeHTML(byId('challenge-description').value || 'Deskripsi singkat challenge.')}</p>
            <p class="small muted">${LevelUpUI.escapeHTML(byId('challenge-duration').value)} · ${byId('challenge-xp').value || 0} XP</p>
        `;
    }

    [
        'challenge-title',
        'challenge-description',
        'challenge-category',
        'challenge-duration',
        'challenge-xp'
    ].forEach(id => byId(id).addEventListener('input', preview));

    preview();
});
