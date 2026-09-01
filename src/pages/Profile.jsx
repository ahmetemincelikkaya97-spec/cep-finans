import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, Bookmark, Heart, Clock, ChevronRight, Star, LogOut, ShoppingCart, Edit2, Trophy } from 'lucide-react';
import { recipes } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';
import { useTranslation } from '../translations';
import { motion } from 'framer-motion';
import { calculateGamification } from '../utils/gamification';

const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3
};

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // get lang from user or localStorage
    const language = user?.preferences?.language || localStorage.getItem('guest_lang') || 'tr';
    const t = useTranslation(language);

    // 1. GÜVENLİK DUVARI: Kullanıcı yoksa beyaz ekran yerine bu "Misafir" kartı görünür.
    // Bu sayede uygulama asla çökmez.
    if (!user) {
        return (
            <div className="container" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', height: '100vh', textAlign: 'center',
                backgroundColor: 'var(--bg-app)'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>{t('login_title')}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    {t('login_to_access')}
                </p>
                <button
                    onClick={() => navigate('/auth')}
                    style={{
                        padding: '16px 32px', borderRadius: '16px',
                        backgroundColor: 'var(--primary)', color: 'white', fontWeight: 700
                    }}
                >
                    {t('login_btn')}
                </button>
            </div>
        );
    }

    // 2. GÜVENLİ VERİ ERİŞİMİ & OYUNLAŞTIRMA (GAMIFICATION):
    const gamification = calculateGamification(user) || {};
    const { 
        stats = { cooked: 0, saved: 0, reviews: 0, favorites: 0 }, 
        xp = 0, 
        currentLevel = { nameKey: 'level_rookie', color: '#94a3b8' }, 
        levelProgress = 0, 
        earnedBadges = [] 
    } = gamification;

    // Show only saved recipes that actually exist in user's list
    const savedRecipes = recipes.filter(r => user.saved?.includes(r.id)).slice(0, 3);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <motion.div 
            initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
            style={{ paddingBottom: '100px', backgroundColor: 'var(--bg-app)', minHeight: '100vh' }}>
            {/* Header / Cover */}
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px 20px 20px', borderRadius: '0 0 24px 24px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <button style={{ padding: '8px' }} onClick={() => navigate('/settings')}>
                        <Settings size={22} color="var(--text-main)" />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                    <div 
                        onClick={() => navigate('/edit-profile')}
                        style={{
                        width: '100px', height: '100px', borderRadius: '50%',
                        border: `4px solid ${currentLevel.color}`, 
                        boxShadow: `0 4px 20px ${currentLevel.color}60`,
                        overflow: 'hidden', marginBottom: '16px',
                        backgroundColor: 'var(--bg-app)', cursor: 'pointer', position: 'relative'
                    }}>
                        <img
                            src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                            alt="Profile"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#FFE4D6' }}
                        />
                    </div>
                    <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                        {user.name || t('anonymous_chef')}
                    </h1>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        {user.email || t('no_email')}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '280px', lineHeight: 1.5, marginBottom: '12px' }}>
                        {user.bio || t('bio_default')}
                    </p>
                    
                    {/* Edit Profile Button */}
                    <button 
                        onClick={() => navigate('/edit-profile')}
                        style={{ 
                            padding: '8px 24px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                            backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-light)', color: 'var(--text-main)',
                            display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px'
                        }}>
                        <Edit2 size={12} /> {t('edit_profile')}
                    </button>

                    {/* Level & XP Progress */}
                    <div style={{ width: '100%', maxWidth: '300px', marginTop: '20px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>
                            <span style={{ color: currentLevel.color }}>{t(currentLevel.nameKey)}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{xp} XP</span>
                        </div>
                        <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
                            <motion.div 
                                initial={{ width: 0 }} animate={{ width: `${levelProgress}%` }} transition={{ duration: 1, ease: "easeOut" }}
                                style={{ height: '100%', backgroundColor: currentLevel.color, borderRadius: '12px' }} 
                            />
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div style={{
                        display: 'flex', gap: '30px', marginTop: '24px',
                        padding: '16px 24px', backgroundColor: 'var(--bg-app)', borderRadius: '16px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>{stats.cooked}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('cooked_stat')}</div>
                        </div>
                        <div style={{ width: '1px', backgroundColor: 'var(--border-light)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>{stats.saved}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('saved_stat')}</div>
                        </div>
                        <div style={{ width: '1px', backgroundColor: 'var(--border-light)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>{stats.reviews}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('reviews_stat')}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges Section */}
            <div className="container" style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>{t('my_badges')}</h3>
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none' }}>
                    {earnedBadges.map((badge) => (
                        <div key={badge.id} style={{ 
                            minWidth: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                            opacity: badge.earned ? 1 : 0.4, filter: badge.earned ? 'none' : 'grayscale(100%)'
                        }}>
                            <div style={{ 
                                width: '56px', height: '56px', borderRadius: '50%', 
                                backgroundColor: badge.earned ? 'var(--bg-card)' : 'var(--bg-app)', 
                                border: badge.earned ? `2px solid ${currentLevel.color}` : '2px dashed var(--border-light)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '24px', boxShadow: badge.earned ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                marginBottom: '8px', transition: 'all 0.3s ease'
                            }}>
                                {badge.icon}
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: 700, textAlign: 'center', color: 'var(--text-main)' }}>{t(badge.nameKey)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Menu Items */}
            <div className="container" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <MenuItem icon={<Trophy size={20} color="var(--primary)" />} label={t('leaderboard')} onClick={() => navigate('/leaderboard')} />
                <MenuItem icon={<ShoppingCart size={20} />} label={t('shopping_list')} onClick={() => navigate('/shopping-list')} />
                <MenuItem icon={<Bookmark size={20} />} label={t('saved_recipes')} count={stats.saved} onClick={() => navigate('/saved')} />
                <MenuItem icon={<Heart size={20} />} label={t('favorites')} count={stats.favorites} onClick={() => navigate('/favorites')} />
                <MenuItem icon={<Star size={20} />} label={t('my_reviews_ratings')} count={stats.reviews} onClick={() => navigate('/reviews')} />
                <MenuItem icon={<Clock size={20} />} label={t('cooking_history')} count={stats.cooked} onClick={() => navigate('/history')} />
            </div>

            {/* Recent Saved Section */}
            {savedRecipes.length > 0 && (
                <div className="container" style={{ marginTop: '30px' }}>
                    <div className="flex-between" style={{ marginBottom: '16px' }}>
                        <h3 className="title-lg" style={{ fontSize: '18px' }}>{t('recently_saved')}</h3>
                        <span onClick={() => navigate('/saved')} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }}>{t('see_all')}</span>
                    </div>
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '10px', scrollbarWidth: 'none' }}>
                        {savedRecipes.map(recipe => (
                            <div key={recipe.id} style={{ minWidth: '160px' }}>
                                <RecipeCard recipe={recipe} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="container" style={{ marginTop: '20px', marginBottom: '20px' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%', padding: '16px', backgroundColor: 'var(--tag-red-bg)', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        color: 'var(--tag-red-text)', fontWeight: 700
                    }}>
                    <LogOut size={18} />
                    {t('logout')}
                </button>
            </div>
        </motion.div>
    );
};

// Helper component for menu items
const MenuItem = ({ icon, label, count, onClick }) => (
    <div onClick={onClick} style={{
        backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer', boxShadow: 'var(--shadow-sm)'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
                width: '36px', height: '36px', backgroundColor: 'var(--bg-app)', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)'
            }}>
                {icon}
            </div>
            <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-main)' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {count > 0 && (
                <span style={{ backgroundColor: 'var(--primary)', color: 'white', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                    {count}
                </span>
            )}
            <ChevronRight size={18} color="var(--text-caption)" />
        </div>
    </div>
);

export default Profile;
