(function () {
    const challenges = [
        {
            id: 'reading-01',
            title: 'Reading Habit',
            category: 'Learning & Focus',
            categoryKey: 'learning',
            difficulty: 'Beginner',
            duration: '7 hari',
            durationDays: 7,
            minutes: 20,
            description: 'Bangun rutinitas membaca melalui sesi singkat yang konsisten.',
            objective: 'Membangun kebiasaan membaca dan mencatat pemahaman dasar.',
            tasks: [
                'Baca selama minimal 20 menit',
                'Catat halaman awal dan akhir',
                'Tulis satu hal yang dipelajari'
            ],
            criteria: 'Selesaikan minimal 5 dari 7 sesi dan isi refleksi akhir.',
            proofType: 'Session log + reflection',
            verification: 'System-checked',
            xp: 80,
            pathId: 'reading-path',
            stage: 1,
            prerequisite: null,
            status: 'active',
            icon: '📚',
            art: 'assets/images/illustrations/reading.svg',
            featured: true
        },
        {
            id: 'reading-02',
            title: 'Reading Reflection',
            category: 'Learning & Focus',
            categoryKey: 'learning',
            difficulty: 'Beginner',
            duration: '3 hari',
            durationDays: 3,
            minutes: 15,
            description: 'Latih pemahaman dengan ringkasan pendek dari bacaan.',
            objective: 'Menyampaikan gagasan utama dengan kata-kata sendiri.',
            tasks: [
                'Pilih satu bacaan',
                'Tulis ringkasan 100–150 kata',
                'Tuliskan satu pertanyaan kritis'
            ],
            criteria: 'Ringkasan memuat gagasan utama dan refleksi pribadi.',
            proofType: 'Written reflection',
            verification: 'Assessor review',
            xp: 100,
            pathId: 'reading-path',
            stage: 2,
            prerequisite: 'reading-01',
            status: 'active',
            icon: '✍️',
            art: 'assets/images/illustrations/reading.svg',
            featured: true
        },
        {
            id: 'reading-03',
            title: 'Critical Thinking',
            category: 'Learning & Focus',
            categoryKey: 'learning',
            difficulty: 'Intermediate',
            duration: '5 hari',
            durationDays: 5,
            minutes: 25,
            description: 'Belajar mengevaluasi argumen dan membangun sudut pandang.',
            objective: 'Melatih analisis informasi dan argumentasi.',
            tasks: [
                'Pilih artikel',
                'Tentukan klaim utama',
                'Catat dua bukti pendukung',
                'Tulis kesimpulan'
            ],
            criteria: 'Analisis memiliki klaim, bukti, dan kesimpulan yang saling terhubung.',
            proofType: 'Analysis document',
            verification: 'Assessor review',
            xp: 150,
            pathId: 'reading-path',
            stage: 3,
            prerequisite: 'reading-02',
            status: 'active',
            icon: '🧠',
            art: 'assets/images/illustrations/reading.svg',
            featured: false
        },
        {
            id: 'creative-01',
            title: 'Visual Observation',
            category: 'Creative & Digital Skills',
            categoryKey: 'creative',
            difficulty: 'Beginner',
            duration: '3 hari',
            durationDays: 3,
            minutes: 15,
            description: 'Latih mata kreatif dengan mengamati bentuk, warna, dan komposisi.',
            objective: 'Meningkatkan kemampuan mengamati visual.',
            tasks: [
                'Pilih objek sederhana',
                'Ambil atau buat referensi',
                'Catat tiga hal yang diamati'
            ],
            criteria: 'Catatan menyertakan tiga observasi yang spesifik.',
            proofType: 'Image + notes',
            verification: 'System-checked',
            xp: 70,
            pathId: 'creative-path',
            stage: 1,
            prerequisite: null,
            status: 'active',
            icon: '🎨',
            art: 'assets/images/illustrations/creative.svg',
            featured: true
        },
        {
            id: 'creative-02',
            title: 'Basic Composition',
            category: 'Creative & Digital Skills',
            categoryKey: 'creative',
            difficulty: 'Beginner',
            duration: '4 hari',
            durationDays: 4,
            minutes: 25,
            description: 'Buat karya visual sederhana dengan komposisi yang disengaja.',
            objective: 'Menerapkan hierarki visual dan komposisi dasar.',
            tasks: [
                'Pilih brief',
                'Buat sketsa',
                'Tentukan focal point',
                'Unggah hasil akhir'
            ],
            criteria: 'Karya sesuai brief dan memiliki focal point yang jelas.',
            proofType: 'Work artifact',
            verification: 'Assessor review',
            xp: 120,
            pathId: 'creative-path',
            stage: 2,
            prerequisite: 'creative-01',
            status: 'active',
            icon: '🖼️',
            art: 'assets/images/illustrations/creative.svg',
            featured: true
        },
        {
            id: 'creative-03',
            title: 'Design Challenge',
            category: 'Creative & Digital Skills',
            categoryKey: 'creative',
            difficulty: 'Intermediate',
            duration: '7 hari',
            durationDays: 7,
            minutes: 40,
            description: 'Selesaikan mini brief desain dari konsep hingga hasil akhir.',
            objective: 'Mengembangkan proses pemecahan masalah desain.',
            tasks: [
                'Pahami brief',
                'Buat dua ide',
                'Pilih dan kembangkan satu ide',
                'Unggah hasil dan alasan desain'
            ],
            criteria: 'Hasil akhir menjawab brief dan disertai alasan keputusan desain.',
            proofType: 'Design artifact + rationale',
            verification: 'Assessor review',
            xp: 180,
            pathId: 'creative-path',
            stage: 3,
            prerequisite: 'creative-02',
            status: 'active',
            icon: '✳️',
            art: 'assets/images/illustrations/creative.svg',
            featured: false
        },
        {
            id: 'healthy-01',
            title: 'Morning Routine',
            category: 'Healthy Habits',
            categoryKey: 'healthy',
            difficulty: 'Beginner',
            duration: '5 hari',
            durationDays: 5,
            minutes: 10,
            description: 'Bangun rutinitas pagi yang realistis dan sesuai kebutuhanmu.',
            objective: 'Mengenali pola pagi yang membantu memulai hari.',
            tasks: [
                'Pilih satu rutinitas sederhana',
                'Lakukan sesuai jadwal',
                'Catat pengalaman singkat'
            ],
            criteria: 'Catat minimal 4 dari 5 hari dan lakukan refleksi.',
            proofType: 'Daily check-in',
            verification: 'Self-reported + spot check',
            xp: 60,
            pathId: 'healthy-path',
            stage: 1,
            prerequisite: null,
            status: 'active',
            icon: '🌱',
            art: 'assets/images/illustrations/healthy.svg',
            featured: true
        },
        {
            id: 'code-01',
            title: 'Problem Solving Basics',
            category: 'Creative & Digital Skills',
            categoryKey: 'creative',
            difficulty: 'Beginner',
            duration: '4 hari',
            durationDays: 4,
            minutes: 30,
            description: 'Pecah masalah sederhana menjadi langkah yang dapat dikerjakan.',
            objective: 'Melatih logika dan penyusunan solusi.',
            tasks: [
                'Pilih satu problem',
                'Tulis input dan output',
                'Buat langkah penyelesaian',
                'Uji satu contoh'
            ],
            criteria: 'Solusi mempunyai langkah logis dan contoh uji.',
            proofType: 'Solution notes',
            verification: 'System-checked + sample review',
            xp: 90,
            pathId: 'coding-path',
            stage: 1,
            prerequisite: null,
            status: 'active',
            icon: '💻',
            art: 'assets/images/illustrations/creative.svg',
            featured: false
        },
        {
            id: 'code-02',
            title: 'Mini Coding Project',
            category: 'Creative & Digital Skills',
            categoryKey: 'creative',
            difficulty: 'Intermediate',
            duration: '7 hari',
            durationDays: 7,
            minutes: 45,
            description: 'Bangun proyek kecil yang menyelesaikan satu kebutuhan.',
            objective: 'Menggabungkan logika dan implementasi menjadi proyek.',
            tasks: [
                'Tentukan kebutuhan',
                'Buat fitur inti',
                'Uji hasil',
                'Dokumentasikan penggunaan'
            ],
            criteria: 'Proyek berjalan untuk skenario utama dan memiliki dokumentasi singkat.',
            proofType: 'Project files or repository',
            verification: 'Assessor review',
            xp: 200,
            pathId: 'coding-path',
            stage: 2,
            prerequisite: 'code-01',
            status: 'active',
            icon: '🚀',
            art: 'assets/images/illustrations/creative.svg',
            featured: false
        }
    ];

    const paths = [
        {
            id: 'reading-path',
            title: 'Reading & Critical Thinking',
            category: 'Learning & Focus',
            categoryKey: 'learning',
            description: 'Bangun rutinitas membaca, pahami gagasan, lalu latih cara berpikir kritis.',
            goal: 'Mengubah kegiatan membaca menjadi pemahaman dan refleksi.',
            duration: '15 hari',
            level: 'Beginner → Intermediate',
            icon: '📚',
            art: 'assets/images/illustrations/reading.svg',
            challengeIds: [
                'reading-01',
                'reading-02',
                'reading-03'
            ],
            status: 'active'
        },
        {
            id: 'creative-path',
            title: 'Creative Design Journey',
            category: 'Creative & Digital Skills',
            categoryKey: 'creative',
            description: 'Latih observasi visual, komposisi, dan penyelesaian brief desain sederhana.',
            goal: 'Membangun proses kreatif dari observasi menjadi karya.',
            duration: '14 hari',
            level: 'Beginner → Intermediate',
            icon: '🎨',
            art: 'assets/images/illustrations/creative.svg',
            challengeIds: [
                'creative-01',
                'creative-02',
                'creative-03'
            ],
            status: 'active'
        },
        {
            id: 'healthy-path',
            title: 'Healthy Habit Starter',
            category: 'Healthy Habits',
            categoryKey: 'healthy',
            description: 'Rancang rutinitas kecil yang realistis dan refleksikan apa yang cocok untukmu.',
            goal: 'Membangun kebiasaan tanpa tekanan streak berlebihan.',
            duration: '5 hari',
            level: 'Beginner',
            icon: '🌿',
            art: 'assets/images/illustrations/healthy.svg',
            challengeIds: [
                'healthy-01'
            ],
            status: 'active'
        },
        {
            id: 'coding-path',
            title: 'Programming Foundation',
            category: 'Creative & Digital Skills',
            categoryKey: 'creative',
            description: 'Pahami problem solving lalu terapkan dalam mini project.',
            goal: 'Melangkah dari logika dasar ke proyek kecil yang bekerja.',
            duration: '11 hari',
            level: 'Beginner → Intermediate',
            icon: '💻',
            art: 'assets/images/illustrations/creative.svg',
            challengeIds: [
                'code-01',
                'code-02'
            ],
            status: 'active'
        }
    ];

    // DAFTAR ACHIEVEMENT DENGAN IKON BARU SESUAI PERMINTAAN
    const achievements = [
        {
            id: 'first-step',
            title: 'First Step',
            description: 'Menyelesaikan challenge pertamamu.',
            icon: '🌱',
            art: 'https://cdn-icons-png.flaticon.com/512/4341/4341139.png', // 1. Tanaman yang baru tumbuh
            criteria: 'Selesaikan 1 challenge yang memenuhi kriteria.',
            xp: 30,
            unlock: null
        },
        {
            id: 'book-explorer',
            title: 'Book Explorer',
            description: 'Menuntaskan tahap awal Reading Path.',
            icon: '📖',
            art: 'https://cdn-icons-png.flaticon.com/512/3389/3389081.png', // 2. Book explorer (Tetap)
            criteria: 'Selesaikan Reading Habit.',
            xp: 50,
            unlock: 'reading-02'
        },
        {
            id: 'creative-mind',
            title: 'Creative Mind',
            description: 'Menyelesaikan tantangan kreatif pertama.',
            icon: '🎨',
            art: 'https://cdn-icons-png.flaticon.com/512/2952/2952212.png', // 3. Palet lukis & satu bidak catur
            criteria: 'Selesaikan Visual Observation.',
            xp: 40,
            unlock: 'creative-02'
        },
        {
            id: 'steady-steps',
            title: 'Steady Steps',
            description: 'Menjaga ritme aktivitas dari waktu ke waktu.',
            icon: '👟',
            art: 'https://cdn-icons-png.flaticon.com/512/3176/3176363.png', // 4. Sepatu yang sedang menempuh langkah
            criteria: 'Mencatat lima sesi valid.',
            xp: 40,
            unlock: null
        },
        {
            id: 'deep-thinker',
            title: 'Deep Thinker',
            description: 'Menyelesaikan challenge analisis.',
            icon: '🧠',
            art: 'https://cdn-icons-png.flaticon.com/512/4230/4230623.png', // 5. Gambar otak
            criteria: 'Selesaikan Critical Thinking.',
            xp: 80,
            unlock: null
        }
    ];

    const users = [
        {
            id: 'user-demo',
            name: 'Sarah',
            email: 'user@levelup.id',
            password: 'user123',
            role: 'user',
            goal: 'Membangun kebiasaan belajar dan berpikir kritis',
            interests: ['learning'],
            availableTime: '20–30 menit per hari',
            avatar: 'S'
        },
        {
            id: 'admin-demo',
            name: 'LevelUp Admin',
            email: 'admin@levelup.id',
            password: 'admin123',
            role: 'admin',
            avatar: 'A'
        }
    ];

    function seed() {
        // DISET TRUE SUPAYA MEMAKSA MEMUAT ULANG DATA ACHIEVEMENT BARU KITA
        if (true) {
            LS.set('users', users);
            LS.set('challenges', challenges);
            LS.set('paths', paths);
            LS.set('achievements', achievements);

            LS.set('enrollments', [
                {
                    id: 'enroll-1',
                    userId: 'user-demo',
                    challengeId: 'reading-01',
                    status: 'in-progress',
                    progress: 60,
                    completedTasks: [0, 1],
                    joinedAt: new Date().toISOString(),
                    lastActivity: new Date().toISOString()
                },
                {
                    id: 'enroll-2',
                    userId: 'user-demo',
                    challengeId: 'creative-01',
                    status: 'in-progress',
                    progress: 33,
                    completedTasks: [0],
                    joinedAt: new Date().toISOString(),
                    lastActivity: new Date().toISOString()
                }
            ]);

            LS.set('submissions', [
                {
                    id: 'sub-demo-1',
                    userId: 'user-demo',
                    challengeId: 'reading-02',
                    filename: 'reading-reflection.pdf',
                    reflection: 'Saya belajar merangkum ide utama dari bacaan.',
                    status: 'pending',
                    submittedAt: new Date(Date.now() - 3600000).toISOString(),
                    reviewReason: '',
                    risk: 'normal'
                },
                {
                    id: 'sub-demo-2',
                    userId: 'user-demo',
                    challengeId: 'creative-02',
                    filename: 'composition-study.png',
                    reflection: 'Mencoba mengatur focal point pada komposisi.',
                    status: 'needs-review',
                    submittedAt: new Date(Date.now() - 86400000).toISOString(),
                    reviewReason: 'Perlu peninjauan tambahan pada hasil karya.',
                    risk: 'attention'
                }
            ]);

            LS.set('reviewHistory', []);
            LS.set('profile', users[0]);
            LS.set('xp', 120);
            LS.set('initialized', true);
        }
    }

    window.LevelUpData = {
        seed,
        defaultChallenges: challenges,
        defaultPaths: paths,
        defaultAchievements: achievements,

        getUsers: () => LS.get('users', []),
        getChallenges: () => LS.get('challenges', []),
        setChallenges: v => LS.set('challenges', v),

        getPaths: () => LS.get('paths', []),
        setPaths: v => LS.set('paths', v),

        getAchievements: () => LS.get('achievements', []),

        getEnrollments: () => LS.get('enrollments', []),
        setEnrollments: v => LS.set('enrollments', v),

        getSubmissions: () => LS.get('submissions', []),
        setSubmissions: v => LS.set('submissions', v),

        getReviewHistory: () => LS.get('reviewHistory', []),
        setReviewHistory: v => LS.set('reviewHistory', v),

        getProfile: () => LS.get('profile', users[0]),
        setProfile: v => LS.set('profile', v),

        getXP: () => LS.get('xp', 0),
        setXP: v => LS.set('xp', v),

        challengeById: id =>
            LS.get('challenges', challenges).find(x => x.id === id),

        pathById: id =>
            LS.get('paths', paths).find(x => x.id === id),

        submissionById: id =>
            LS.get('submissions', []).find(x => x.id === id),

        enrollmentFor: (userId, challengeId) =>
            LS.get('enrollments', []).find(
                x => x.userId === userId && x.challengeId === challengeId
            )
    };

    seed();
})();