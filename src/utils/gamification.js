export const LEVELS = [
    { nameKey: 'level_rookie', minXp: 0, color: '#F05528' },
    { nameKey: 'level_cook', minXp: 100, color: '#3b82f6' },
    { nameKey: 'level_skilled', minXp: 300, color: '#8b5cf6' },
    { nameKey: 'level_master', minXp: 700, color: '#f59e0b' },
    { nameKey: 'level_gourmet', minXp: 1500, color: '#ef4444' }
];

export const BADGES = [
    { id: 'fire_starter', nameKey: 'badge_fire_starter', descKey: 'badge_fire_starter_desc', icon: '🍳', condition: (stats) => stats.cooked >= 1 },
    { id: 'collector', nameKey: 'badge_recipe_holic', descKey: 'badge_recipe_holic_desc', icon: '📚', condition: (stats) => stats.saved >= 20 },
    { id: 'critic', nameKey: 'badge_gourmet_writer', descKey: 'badge_gourmet_writer_desc', icon: '✍️', condition: (stats) => stats.reviews >= 5 },
    { id: 'star_hunter', nameKey: 'badge_favorite_hunter', descKey: 'badge_favorite_hunter_desc', icon: '⭐', condition: (stats) => stats.favorites >= 10 },
    { id: 'legend', nameKey: 'badge_kitchen_legend', descKey: 'badge_kitchen_legend_desc', icon: '🔥', condition: (stats) => stats.cooked >= 30 },
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
