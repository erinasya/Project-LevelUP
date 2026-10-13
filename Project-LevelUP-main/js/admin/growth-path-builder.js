
document.addEventListener('DOMContentLoaded', () => {
    const $ = id => document.getElementById(id);
    const params = new URLSearchParams(location.search),
        editId = params.get('id');
    const old = editId ? LevelUpData.pathById(editId) : null;

    const challengeOptions = LevelUpData.getChallenges()
        .map(c => `<option value="${c.id}">${LevelUpUI.escapeHTML(c.title)}</option>`)
        .join('');

    let stageCounter = 0;

    function addStage(stage = { name: '', challengeId: '', prerequisite: '' }) {
        stageCounter++;

        const box = document.createElement('div');
        box.className = 'card path-stage-editor';
        box.dataset.stageCard = '';

        box.innerHTML = `
            <div class="between">
                <div class="row">
                    <span class="stage-number">${stageCounter}</span>
                    <strong>Tahap ${stageCounter}</strong>
                </div>
                <button type="button" class="btn btn-ghost btn-sm" data-remove-stage>Hapus</button>
            </div>
            <div class="form-grid section" style="margin-top:14px">
                <div class="field">
                    <label>Nama tahap</label>
                    <input data-stage-name required value="${LevelUpUI.escapeHTML(stage.name||'') }" placeholder="Contoh: Skill Foundation">
                </div>
                <div class="field">
                    <label>Challenge</label>
                    <select data-stage-challenge required>
                        <option value="">Pilih challenge</option>
                        ${challengeOptions}
                    </select>
                </div>
            </div>
        `;

        box.querySelector('[data-stage-challenge]').value = stage.challengeId || '';

        box.querySelector('[data-remove-stage]').addEventListener('click', () => {
            if (document.querySelectorAll('[data-stage-card]').length <= 1) {
                LevelUpUI.toast('Growth Path memerlukan minimal satu tahap.', 'error');
                return;
            }

            box.remove();
            renumber();
        });

        $('path-builder-stages').appendChild(box);
        renumber();
    }

    function renumber() {
        document.querySelectorAll('[data-stage-card]').forEach((el, i) => {
            el.querySelector('.stage-number').textContent = i + 1;
            el.querySelector('.between strong').textContent = 'Tahap ' + (i + 1);
        });
    }

    if (old) {
        $('path-builder-title').textContent = 'Edit Growth Path';
        $('path-name').value = old.title;
        $('path-description-input').value = old.description;
        $('path-goal-input').value = old.goal || '';
        $('path-category-select').value = old.categoryKey || 'learning';
        $('path-duration-input').value = old.duration || '14 hari';
        $('path-status-input').value = old.status || 'active';

        (old.stages?.length
            ? old.stages
            : old.challengeIds.map((id, i) => ({
                name: `Tahap ${i + 1}`,
                challengeId: id
            }))
        ).forEach(addStage);
    } else {
        addStage({
            name: 'Fondasi',
            challengeId: 'reading-01'
        });
    }

    $('add-path-stage').addEventListener('click', () => addStage());

    function save(force) {
        const title = $('path-name').value.trim(),
            desc = $('path-description-input').value.trim();

        const stages = [...document.querySelectorAll('[data-stage-card]')].map(el => ({
            name: el.querySelector('[data-stage-name]').value.trim(),
            challengeId: el.querySelector('[data-stage-challenge]').value
        }));

        if (
            !title ||
            !desc ||
            !stages.length ||
            stages.some(s => !s.name || !s.challengeId)
        ) {
            LevelUpUI.toast(
                'Lengkapi nama, deskripsi, dan challenge untuk setiap tahap.',
                'error'
            );
            return;
        }

        const ids = stages.map(s => s.challengeId);

        if (new Set(ids).size !== ids.length) {
            LevelUpUI.toast(
                'Satu challenge tidak boleh dipakai pada dua tahap yang sama dalam path ini.',
                'error'
            );
            return;
        }

        const cat = $('path-category-select').value;

        const path = Object.assign(
            {},
            old || { id: LS.id() },
            {
                title,
                description: desc,
                goal: $('path-goal-input').value.trim(),
                categoryKey: cat,
                category: ({
                    'learning': 'Learning & Focus',
                    'creative': 'Creative & Digital Skills',
                    'healthy': 'Healthy Habits'
                })[cat],
                duration: $('path-duration-input').value.trim() || '14 hari',
                status: force || $('path-status-input').value,
                challengeIds: ids,
                stages,
                icon: cat === 'learning' ? '📚' : cat === 'creative' ? '🎨' : '🌱',
                art: cat === 'learning'
                    ? 'assets/images/illustrations/reading.svg'
                    : cat === 'creative'
                        ? 'assets/images/illustrations/creative.svg'
                        : 'assets/images/illustrations/healthy.svg'
            }
        );

        const arr = LevelUpData.getPaths(),
            ix = arr.findIndex(p => p.id === path.id);

        if (ix >= 0) {
            arr[ix] = path;
        } else {
            arr.unshift(path);
        }

        LevelUpData.setPaths(arr);

        LevelUpUI.toast('Growth Path tersimpan.');

        setTimeout(() => location.href = 'growth-paths.html', 450);
    }

    $('path-builder-form').addEventListener('submit', e => {
        e.preventDefault();
        save();
    });

    $('save-path-draft').addEventListener('click', () => save('draft'));
});
