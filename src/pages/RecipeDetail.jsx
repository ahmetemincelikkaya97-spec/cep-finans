import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipes } from '../data/recipes';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Share2, Heart, Clock, Flame, ChefHat, PlayCircle, Bookmark, Star, Send, User } from 'lucide-react';
import { useTranslation } from '../translations';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, toggleSave, toggleFavorite, addToHistory, addReview } = useAuth();

    // get lang from user or localStorage
    const language = user?.preferences?.language || localStorage.getItem('guest_lang') || 'tr';
    const t = useTranslation(language);

    // Local state for review form
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    // Mock reviews state (starts with some fake reviews)
    const [mockReviews, setMockReviews] = useState([]);

    const recipe = recipes.find(r => r.id === parseInt(id));

    useEffect(() => {
        window.scrollTo(0, 0);
        // Generate Mock Reviews
        if (recipe) {
            const seed = recipe.id * 7;
            const count = Math.floor((Math.sin(seed) + 1) * 3) + 2; // 2 to 5 reviews
            const names = ["Ayşe Y.", "Mehmet K.", "Zeynep S.", "Can A.", "Elif B."];
            const comments = [
                "Harika bir tarif, bayıldım!",
                "Biraz tuzu fazla kaçtı ama benim hatam olabilir, yine de güzel.",
                "Tam kıvamında oldu, teşekkürler.",
                "Favori tarifim oldu, kesinlikle tavsiye ederim.",
                "Evdekiler çok beğendi, elinize sağlık."
            ];
            const generated = [];
            for (let i = 0; i < count; i++) {
                generated.push({
                    id: `mock-${i}`,
                    name: names[(recipe.id + i) % names.length],
                    rating: 4 + (i % 2), // 4 or 5 stars
                    comment: comments[(recipe.id + i) % comments.length],
                    date: new Date(Date.now() - (i * 86400000 * 2)).toISOString().split('T')[0] // pseudo dates
                });
            }
            setMockReviews(generated);
        }
    }, [id, recipe]);

    if (!recipe) return <div className="container">{t('recipe_not_found')}</div>;

    const isSaved = user?.saved?.includes(recipe.id);
    const isFav = user?.favorites?.includes(recipe.id);

    // Get user's review for this recipe
    const userReview = user?.reviews?.find(r => r.recipeId === recipe.id);

    // Combine reviews: User's review first (if exists), then mock reviews
    const allReviews = userReview
        ? [{ ...userReview, name: user.name || (language === 'en' ? "You" : "Sen"), isUser: true }, ...mockReviews]
        : mockReviews;


    const handleAction = (action) => {
        if (!user) {
            alert(language === 'en' ? "You must be logged in to perform this action." : "Bu işlemi yapmak için giriş yapmalısınız.");
            return;
        }
        action();
    };

    const handleCook = () => {
        handleAction(() => {
            navigate(`/cook/${recipe.id}`);
        });
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        handleAction(() => {
            if (comment.trim()) {
                addReview(recipe.id, rating, comment);
                setComment("");
            }
        });
    };

    return (
        <div style={{ paddingBottom: '100px', backgroundColor: 'var(--bg-app)', minHeight: '100vh', color: 'var(--text-main)' }}>
            {/* Header Image */}
            <div style={{ position: 'relative', height: '350px' }}>
                <img
                    src={recipe.image}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    alt={recipe.title}
                />

                {/* Navbar Overlay */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, padding: '20px',
                    display: 'flex', justifyContent: 'space-between',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)'
                }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowLeft color="white" />
                    </button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleAction(() => toggleSave(recipe.id))} style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bookmark color="white" fill={isSaved ? "white" : "none"} size={20} />
                        </button>
                        <button onClick={() => handleAction(() => toggleFavorite(recipe.id))} style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Heart color="white" fill={isFav ? "white" : "none"} size={20} />
                        </button>
                    </div>
                </div>

                {/* Floating Info Card */}
                <div style={{
                    position: 'absolute', bottom: '-40px', left: '20px', right: '20px',
                    backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    display: 'flex', justifyContent: 'space-around', color: 'var(--text-main)'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <Clock size={20} color="var(--primary)" style={{ marginBottom: 4 }} />
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>{recipe.time}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{t('preparation')}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 1, height: '100%', background: 'var(--border-light)' }}></div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <ChefHat size={20} color="var(--primary)" style={{ marginBottom: 4 }} />
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>{recipe.level}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{t('level')}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 1, height: '100%', background: 'var(--border-light)' }}></div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Flame size={20} color="var(--primary)" style={{ marginBottom: 4 }} />
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>{recipe.calories}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{t('energy')}</div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container" style={{ marginTop: '60px' }}>
                <div style={{
                    backgroundColor: 'var(--tag-orange-bg)', color: 'var(--tag-orange-text)',
                    display: 'inline-block', padding: '4px 8px', borderRadius: '4px',
                    fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px'
                }}>
                    {recipe.isModern ? t('modern') : t('classic')}
                </div>
                <h1 style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px', color: 'var(--text-main)' }}>
                    {recipe.title}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>
                    {recipe.description}
                </p>

                {/* Chef's Technical Tip */}
                <div style={{
                    marginTop: '24px', backgroundColor: 'var(--tag-red-bg)', borderLeft: '4px solid var(--primary)',
                    padding: '16px', borderRadius: '0 12px 12px 0'
                }}>
                    <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {t('chef_tip')}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--tag-red-text)' }}>
                        {recipe.tips || (language === 'en' ? "Ensure ingredients are fresh for authentic taste." : "Otantik bir lezzet için malzemelerin taze olmasına özen gösterin.")}
                    </div>
                </div>

                {/* Ingredients */}
                <div style={{ marginTop: '32px' }}>
                    <div className="flex-between" style={{ marginBottom: '16px' }}>
                        <h3 className="title-lg" style={{ fontSize: '20px', color: 'var(--text-main)' }}>{t('ingredients')}</h3>
                        <div style={{ fontSize: '12px', color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 8px', borderRadius: '4px' }}>
                            {t('for_two')}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recipe.ingredients && recipe.ingredients.map((ing, idx) => (
                            <div key={idx} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '12px', backgroundColor: 'var(--bg-card)', borderRadius: '12px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ fontSize: '20px' }}>{ing.icon}</div>
                                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{ing.name}</span>
                                </div>
                                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{ing.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Steps */}
                <div style={{ marginTop: '32px' }}>
                    <h3 className="title-lg" style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--text-main)' }}>{t('steps')}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {recipe.steps && recipe.steps.map((step, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    backgroundColor: 'var(--primary)', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, flexShrink: 0
                                }}>
                                    {idx + 1}
                                </div>
                                <div>
                                    <h4 style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--text-main)' }}>{t('step_word')} {idx + 1}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{step}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Review Section */}
                <div style={{ marginTop: '40px', paddingBottom: '20px' }}>
                    <h3 className="title-lg" style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--text-main)' }}>{t('reviews')}</h3>

                    {/* Review Form - Only show if user hasn't reviewed yet */}
                    {!userReview && (
                        <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>{t('add_review')}</h4>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} onClick={() => setRating(star)}>
                                        <Star
                                            size={28}
                                            fill={star <= rating ? "#F59E0B" : "var(--bg-app)"}
                                            color={star <= rating ? "#F59E0B" : "var(--text-caption)"}
                                        />
                                    </button>
                                ))}
                            </div>
                            <form onSubmit={handleSubmitReview}>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder={t('leave_comment')}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '12px',
                                        border: '1px solid var(--border-light)', marginBottom: '12px',
                                        backgroundColor: 'var(--bg-app)', color: 'var(--text-main)',
                                        fontFamily: 'inherit', resize: 'vertical', minHeight: '80px'
                                    }}
                                />
                                <button type="submit" style={{
                                    backgroundColor: 'var(--primary)', color: 'white',
                                    padding: '10px 20px', borderRadius: '12px',
                                    fontWeight: 700, fontSize: '14px', border: 'none',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }}>
                                    {t('submit')} <Send size={16} />
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Show All Reviews */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {allReviews.map((rev, idx) => (
                            <div key={idx} style={{
                                backgroundColor: rev.isUser ? 'var(--tag-green-bg)' : 'var(--bg-card)',
                                padding: '16px', borderRadius: '16px',
                                border: rev.isUser ? '1px solid var(--tag-green-text)' : '1px solid var(--border-light)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            backgroundColor: rev.isUser ? 'var(--tag-green-text)' : '#E5E7EB',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: rev.isUser ? 'white' : 'var(--text-secondary)'
                                        }}>
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: rev.isUser ? 'var(--tag-green-text)' : 'var(--text-main)' }}>
                                                {rev.name}
                                            </div>
                                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                                                {rev.date || (language === 'en' ? 'Today' : 'Bugün')}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 2 }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} fill={i < rev.rating ? "#F59E0B" : "none"} color="#F59E0B" />
                                        ))}
                                    </div>
                                </div>
                                <p style={{ fontSize: '14px', color: rev.isUser ? 'var(--tag-green-text)' : 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    {rev.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Bottom Floating Action Button */}
            <div style={{
                position: 'fixed', bottom: '20px', left: 0, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 100
            }}>
                <button
                    onClick={handleCook}
                    style={{
                        backgroundColor: 'var(--primary)', color: 'white',
                        padding: '16px 32px', borderRadius: '50px',
                        fontWeight: 700, fontSize: '16px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 10px 25px rgba(240, 85, 40, 0.4)'
                    }}>
                    <PlayCircle size={20} fill="white" color="var(--primary)" />
                    {t('start_cooking')}
                </button>
            </div>
        </div>
    );
};

export default RecipeDetail;
