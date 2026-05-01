import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, Bookmark, Heart, Clock, ChevronRight, Star, LogOut } from 'lucide-react';
import { recipes } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';
import { useTranslation } from '../translations';

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

    // 2. GÜVENLİ VERİ ERİŞİMİ: Kullanıcı verisi eksik olsa bile varsayılanlar devreye girer.
    const safeStats = {
        cooked: user.history?.length || 0,
        saved: user.saved?.length || 0,
        reviews: user.reviews?.length || 0
    };

    // Show only saved recipes that actually exist in user's list
    const savedRecipes = recipes.filter(r => user.saved?.includes(r.id)).slice(0, 3);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div style={{ paddingBottom: '100px', backgroundColor: 'var(--bg-app)', minHeight: '100vh' }}>
            {/* Header / Cover */}
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px 20px 20px', borderRadius: '0 0 24px 24px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <button style={{ padding: '8px' }} onClick={() => navigate('/settings')}>
                        <Settings size={22} color="var(--text-main)" />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '50%',
                        border: '4px solid var(--bg-card)', boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                        overflow: 'hidden', marginBottom: '16px'
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
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '280px', lineHeight: 1.5 }}>
                        {user.bio || t('bio_default')}
                    </p>

                    {/* Stats Row */}
                    <div style={{
                        display: 'flex', gap: '30px', marginTop: '24px',
                        padding: '16px 24px', backgroundColor: 'var(--bg-app)', borderRadius: '16px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>{safeStats.cooked}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('cooked_stat')}</div>
                        </div>
                        <div style={{ width: '1px', backgroundColor: 'var(--border-light)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>{safeStats.saved}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('saved_stat')}</div>
                        </div>
                        <div style={{ width: '1px', backgroundColor: 'var(--border-light)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>{safeStats.reviews}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('reviews_stat')}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="container" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <MenuItem icon={<Bookmark size={20} />} label={t('saved_recipes')} count={safeStats.saved} onClick={() => navigate('/saved')} />
                <MenuItem icon={<Heart size={20} />} label={t('favorites')} count={user.favorites?.length} onClick={() => navigate('/favorites')} />
                <MenuItem icon={<Star size={20} />} label={t('my_reviews_ratings')} count={safeStats.reviews} onClick={() => navigate('/reviews')} />
                <MenuItem icon={<Clock size={20} />} label={t('cooking_history')} count={safeStats.cooked} onClick={() => navigate('/history')} />
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
        </div>
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
