export const LEVELS = [
    { name: 'Mutfak Çaylağı', minXp: 0, color: '#F05528' },
    { name: 'Ev Aşçısı', minXp: 100, color: '#3b82f6' },
    { name: 'Yetenekli Şef', minXp: 300, color: '#8b5cf6' },
    { name: 'Mutfak Ustası', minXp: 700, color: '#f59e0b' },
    { name: 'Gurme Şef', minXp: 1500, color: '#ef4444' }
];

export const BADGES = [
    { id: 'fire_starter', name: 'Ateşi Yakan', description: 'İlk tarifini pişirdin.', icon: '🍳', condition: (stats) => stats.cooked >= 1 },
    { id: 'collector', name: 'Tarif Kolik', description: '20 farklı tarif kaydettin.', icon: '📚', condition: (stats) => stats.saved >= 20 },
    { id: 'critic', name: 'Gurme Yazar', description: '5 tarife yorum yaptın.', icon: '✍️', condition: (stats) => stats.reviews >= 5 },
    { id: 'star_hunter', name: 'Favori Avcısı', description: '10 tarifi favorilere ekledin.', icon: '⭐', condition: (stats) => stats.favorites >= 10 },
    { id: 'legend', name: 'Mutfak Efsanesi', description: 'Toplam 30 tarif pişirdin!', icon: '🔥', condition: (stats) => stats.cooked >= 30 },
];

export const calculateGamification = (user) => {
    if (!user) return null;

    const stats = {
        cooked: user.history?.length || 0,
        saved: user.saved?.length || 0,
        reviews: user.reviews?.length || 0,
        favorites: user.favorites?.length || 0
    };

    // Puanlama Matematiği
    const xp = (stats.cooked * 20) + (stats.reviews * 15) + (stats.favorites * 10) + (stats.saved * 5);

    // Seviye Hesaplama
    let currentLevel = LEVELS[0];
    let nextLevel = LEVELS[1];

    for (let i = 0; i < LEVELS.length; i++) {
        if (xp >= LEVELS[i].minXp) {
            currentLevel = LEVELS[i];
            nextLevel = LEVELS[i + 1] || LEVELS[i]; // Maksimum seviye sınırı
        }
    }

    // İlerleme yüzdesi
    const levelProgress = nextLevel === currentLevel 
        ? 100 
        : Math.min(100, Math.max(0, ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100));

    // Rozet kazanım durumu
    const earnedBadges = BADGES.map(badge => ({
        ...badge,
        earned: badge.condition(stats)
    }));

    return {
        stats,
        xp,
        currentLevel,
        nextLevel,
        levelProgress,
        earnedBadges
    };
};
