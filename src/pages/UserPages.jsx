import React from 'react';
import { useAuth } from '../context/AuthContext';
import { recipes } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar } from 'lucide-react';

const PageHeader = ({ title }) => {
    const navigate = useNavigate();
    return (
        <div style={{
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--bg-app)',
            zIndex: 10,
            borderBottom: '1px solid var(--border-light)'
        }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    padding: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-main)'
                }}
            >
                <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{title}</h1>
        </div>
    );
};

export const SavedRecipes = () => {
    const { user } = useAuth();
    // Safe navigation if user not logged in, though Profile protects this logic mostly
    if (!user) return <div className="container" style={{ color: 'var(--text-main)' }}>Lütfen giriş yapın.</div>;

    const list = recipes.filter(r => user.saved?.includes(r.id));

    return (
        <div style={{ paddingBottom: 100, minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
            <PageHeader title="Kaydedilen Tarifler" />
            <div className="container" style={{ padding: '20px' }}>
                {list.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px',
                        alignItems: 'start'
                    }}>
                        {list.map(r => <RecipeCard key={r.id} recipe={r} variant="vertical" />)}
                    </div>
                ) : (
                    <EmptyState message="Henüz kaydedilmiş bir tarifiniz yok." />
                )}
            </div>
        </div>
    );
};

export const Favorites = () => {
    const { user } = useAuth();
    if (!user) return <div className="container" style={{ color: 'var(--text-main)' }}>Lütfen giriş yapın.</div>;

    const list = recipes.filter(r => user.favorites?.includes(r.id));

    return (
        <div style={{ paddingBottom: 100, minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
            <PageHeader title="Favorilerim" />
            <div className="container" style={{ padding: '20px' }}>
                {list.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px',
                        alignItems: 'start'
                    }}>
                        {list.map(r => <RecipeCard key={r.id} recipe={r} variant="vertical" />)}
                    </div>
                ) : (
                    <EmptyState message="Henüz favori tarifiniz yok." />
                )}
            </div>
        </div>
    );
};

export const CookingHistory = () => {
    const { user } = useAuth();
    if (!user) return <div className="container" style={{ color: 'var(--text-main)' }}>Lütfen giriş yapın.</div>;

    const historyItems = user.history ? [...user.history].reverse() : [];

    return (
        <div style={{ paddingBottom: 100, minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
            <PageHeader title="Pişirme Geçmişi" />
            <div className="container" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {historyItems.length > 0 ? (
                    historyItems.map((item, idx) => {
                        const recipe = recipes.find(r => r.id === item.id);
                        if (!recipe) return null;
                        return (
                            <div key={idx} style={{
                                backgroundColor: 'var(--bg-card)', padding: '12px', borderRadius: '16px',
                                display: 'flex', gap: '12px', alignItems: 'center',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <img src={recipe.image} alt={recipe.title} style={{ width: 60, height: 60, borderRadius: '12px', objectFit: 'cover' }} />
                                <div>
                                    <h4 style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-main)' }}>{recipe.title}</h4>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                        <Calendar size={12} />
                                        {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <EmptyState message="Henüz hiç yemek pişirmediniz." />
                )}
            </div>
        </div>
    );
};

export const MyReviews = () => {
    const { user } = useAuth();
    if (!user) return <div className="container" style={{ color: 'var(--text-main)' }}>Lütfen giriş yapın.</div>;

    const reviews = user.reviews ? [...user.reviews].reverse() : [];

    return (
        <div style={{ paddingBottom: 100, minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
            <PageHeader title="Yorumlarım & Puanlarım" />
            <div className="container" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviews.length > 0 ? (
                    reviews.map((review) => {
                        const recipe = recipes.find(r => r.id === review.recipeId);
                        return (
                            <div key={review.id} style={{
                                backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '16px',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 700, fontSize: '15px' }}>{recipe?.title || "Bilinmeyen Tarif"}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 700 }}>
                                        <Star size={14} fill="#F59E0B" /> {review.rating}
                                    </div>
                                </div>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>"{review.comment}"</p>
                                <div style={{ marginTop: '8px', fontSize: '11px', color: '#9CA3AF' }}>
                                    {new Date(review.date).toLocaleDateString('tr-TR')}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <EmptyState message="Henüz hiç yorum yapmadınız." />
                )}
            </div>
        </div>
    );
};

const EmptyState = ({ message }) => (
    <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '40px 20px', textAlign: 'center', opacity: 0.6
    }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🍽️</div>
        <p>{message}</p>
    </div>
);
