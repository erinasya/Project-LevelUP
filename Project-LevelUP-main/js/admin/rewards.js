
document.addEventListener('DOMContentLoaded', () => {
    const saved = LS.get('xpRules', {
        task: 5,
        challenge: 80,
        stage: 25
    });

    document.getElementById('xp-task').value = saved.task;
    document.getElementById('xp-challenge').value = saved.challenge;
    document.getElementById('xp-stage').value = saved.stage;

    document.getElementById('xp-rules-form').addEventListener('submit', e => {
        e.preventDefault();

        LS.set('xpRules', {
            task: Number(document.getElementById('xp-task').value) || 0,
            challenge: Number(document.getElementById('xp-challenge').value) || 0,
            stage: Number(document.getElementById('xp-stage').value) || 0
        });

        LevelUpUI.toast('Aturan XP demo diperbarui.');
    });

    document.getElementById('reward-achievement-table').innerHTML =
        LevelUpData.getAchievements()
            .map(a => `
                <tr>
                    <td>
                        <div class="row">
                            <div class="icon-tile">${a.icon}</div>
                            <div class="table-title">${a.title}</div>
                        </div>
                    </td>
                    <td>${a.criteria}</td>
                    <td>${a.xp}</td>
                    <td>${a.unlock ? LevelUpData.challengeById(a.unlock)?.title || a.unlock : 'Tidak ada'}</td>
                    <td>${LevelUpUI.statusBadge('active')}</td>
                </tr>
            `)
            .join('');
});
