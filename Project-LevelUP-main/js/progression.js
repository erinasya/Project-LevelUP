(function () {
    function currentUser() {
        const session = LevelUpAuth.currentSession();

        return session
            ? LevelUpData.getUsers().find(u => u.id === session.userId)
            : null;
    }

    function enrollment(challengeId) {
        const user = currentUser();

        return user
            ? LevelUpData.enrollmentFor(user.id, challengeId)
            : null;
    }

    function createEnrollment(challengeId) {
        const user = currentUser();

        if (!user) return null;

        const challenge = LevelUpData.challengeById(challengeId);

        if (!challenge) return null;

        const all = LevelUpData.getEnrollments();

        let found = all.find(
            e => e.userId === user.id && e.challengeId === challengeId
        );

        if (found) return found;

        if (challenge.prerequisite) {
            const preSub = LevelUpData.getSubmissions().find(
                s =>
                    s.userId === user.id &&
                    s.challengeId === challenge.prerequisite &&
                    s.status === 'approved'
            );

            const preEnrollment = all.find(
                e =>
                    e.userId === user.id &&
                    e.challengeId === challenge.prerequisite &&
                    e.status === 'completed'
            );

            if (!preSub && !preEnrollment) {
                LevelUpUI.toast(
                    'Selesaikan prasyarat sebelum bergabung.',
                    'error'
                );

                return null;
            }
        }

        found = {
            id: LS.id(),
            userId: user.id,
            challengeId,
            status: 'in-progress',
            progress: 0,
            completedTasks: [],
            joinedAt: new Date().toISOString(),
            lastActivity: new Date().toISOString()
        };

        all.push(found);
        LevelUpData.setEnrollments(all);

        return found;
    }

    function updateEnrollment(challengeId, patch) {
        const user = currentUser();

        if (!user) return;

        const arr = LevelUpData.getEnrollments();

        const idx = arr.findIndex(
            e => e.userId === user.id && e.challengeId === challengeId
        );

        if (idx < 0) return;

        arr[idx] = Object.assign({}, arr[idx], patch, {
            lastActivity: new Date().toISOString()
        });

        LevelUpData.setEnrollments(arr);

        return arr[idx];
    }

    function awardAchievement(challenge) {
        const user = currentUser();

        if (!user) return;

        const all = LS.get('earnedAchievements', []);
        let candidate = null;

        if (
            !all.some(
                a =>
                    a.userId === user.id &&
                    a.challengeId === challenge.id
            )
        ) {
            if (all.length === 0) {
                candidate = LevelUpData.getAchievements().find(
                    a => a.id === 'first-step'
                );
            } else if (challenge.id === 'reading-01') {
                candidate = LevelUpData.getAchievements().find(
                    a => a.id === 'book-explorer'
                );
            } else if (challenge.categoryKey === 'creative') {
                candidate = LevelUpData.getAchievements().find(
                    a => a.id === 'creative-mind'
                );
            }

            if (candidate) {
                all.push({
                    id: LS.id(),
                    userId: user.id,
                    achievementId: candidate.id,
                    challengeId: challenge.id,
                    earnedAt: new Date().toISOString()
                });

                LS.set('earnedAchievements', all);
            }
        }

        return candidate;
    }

    function approveSubmission(submissionId) {
        const userSession = LevelUpAuth.currentSession();

        if (!userSession || userSession.role !== 'admin') return false;

        const all = LevelUpData.getSubmissions();

        const sub = all.find(s => s.id === submissionId);

        if (!sub) return false;

        sub.status = 'approved';
        sub.reviewReason = 'Submission memenuhi kriteria demo.';
        sub.reviewedAt = new Date().toISOString();
        sub.reviewerId = userSession.userId;

        LevelUpData.setSubmissions(all);

        const h = LevelUpData.getReviewHistory();

        h.unshift({
            id: LS.id(),
            submissionId: sub.id,
            userId: sub.userId,
            challengeId: sub.challengeId,
            decision: 'approved',
            reason: sub.reviewReason,
            reviewerId: userSession.userId,
            at: sub.reviewedAt
        });

        LevelUpData.setReviewHistory(h);

        let xp = LevelUpData.getXP();
        const c = LevelUpData.challengeById(sub.challengeId);

        if (c) {
            xp += Number(c.xp || 0);
        }

        LevelUpData.setXP(xp);

        const en = LevelUpData.getEnrollments();

        const ix = en.findIndex(
            e =>
                e.userId === sub.userId &&
                e.challengeId === sub.challengeId
        );

        if (ix >= 0) {
            en[ix].status = 'completed';
            en[ix].progress = 100;

            LevelUpData.setEnrollments(en);
        }

        const earned = LS.get('earnedAchievements', []);

        if (
            c &&
            !earned.some(
                a =>
                    a.userId === sub.userId &&
                    a.challengeId === c.id
            )
        ) {
            let ach = LevelUpData.getAchievements().find(
                a => a.id === 'first-step'
            );

            if (c.categoryKey === 'creative') {
                ach = LevelUpData.getAchievements().find(
                    a => a.id === 'creative-mind'
                );
            }

            if (c.id === 'reading-01') {
                ach = LevelUpData.getAchievements().find(
                    a => a.id === 'book-explorer'
                );
            }

            if (ach) {
                earned.push({
                    id: LS.id(),
                    userId: sub.userId,
                    achievementId: ach.id,
                    challengeId: c.id,
                    earnedAt: new Date().toISOString()
                });

                LS.set('earnedAchievements', earned);
            }
        }

        return true;
    }

    function rejectSubmission(submissionId, reason) {
        const s = LevelUpAuth.currentSession();

        if (!s || s.role !== 'admin') return false;

        const arr = LevelUpData.getSubmissions();

        const sub = arr.find(x => x.id === submissionId);

        if (!sub) return false;

        sub.status = 'rejected';
        sub.reviewReason = reason.trim();
        sub.reviewedAt = new Date().toISOString();
        sub.reviewerId = s.userId;

        LevelUpData.setSubmissions(arr);

        const hist = LevelUpData.getReviewHistory();

        hist.unshift({
            id: LS.id(),
            submissionId: sub.id,
            userId: sub.userId,
            challengeId: sub.challengeId,
            decision: 'rejected',
            reason: sub.reviewReason,
            reviewerId: s.userId,
            at: sub.reviewedAt
        });

        LevelUpData.setReviewHistory(hist);

        return true;
    }

    window.LevelUpProgression = {
        currentUser,
        enrollment,
        createEnrollment,
        updateEnrollment,
        awardAchievement,
        approveSubmission,
        rejectSubmission
    };
})();