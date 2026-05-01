import React from 'react';
import { Clock, BarChart2, Heart, Star, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, variant = 'vertical' }) => {
    const isHorizontal = variant === 'horizontal';

    // Mock stats generation based on ID to keep it consistent
    const generateStats = (id) => {
        const seed = id * 123;
        return {
            favorites: Math.floor((Math.sin(seed) + 1) * 500) + 50,
            reviews: Math.floor((Math.cos(seed) + 1) * 100) + 10,
        };
    };

    const stats = generateStats(recipe.id);

    return (
        <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: isHorizontal ? 'row' : 'column',
                position: 'relative',
                width: '100%',
                height: isHorizontal ? '110px' : '100%'
            }}>
                {/* Görsel */}
                <div style={{
                    width: isHorizontal ? '110px' : '100%',
                    position: 'relative',
                    flexShrink: 0,
                    aspectRatio: isHorizontal ? 'auto' : '1/1',
                    height: isHorizontal ? '100%' : 'auto'
                }}>
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/600x400/FFF0EB/F05528?text=" + encodeURIComponent(recipe.title);
                            e.target.style.objectFit = "contain";
                            e.target.style.padding = "20px";
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#FFF0EB', position: 'absolute', top: 0, left: 0 }}
                    />
                    {!isHorizontal && (
                        <button style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '50%',
                            padding: '6px',
                            display: 'flex',
                            border: 'none',
                            backdropFilter: 'blur(4px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            zIndex: 5
                        }}>
                            <Heart size={16} color="var(--primary)" />
                        </button>
                    )}
                </div>

                {/* İçerik */}
                <div style={{
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1, // Fill remaining space
                    justifyContent: 'space-between' // Push footer to bottom
                }}>
                    <div>
                        <h3 style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            marginBottom: '4px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: '1.3',
                            minHeight: '38px' // Eşit hizalama için min-height
                        }}>
                            {recipe.title}
                        </h3>

                        {/* Açıklama */}
                        <p style={{
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            marginBottom: '8px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: '1.4',
                            height: '34px' // Fixed height for 2 lines approx to ensure alignment
                        }}>
                            {recipe.description}
                        </p>

                        {/* Meta Bilgiler (Süre ve Zorluk) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                <Clock size={12} />
                                <span>{recipe.time}</span>
                            </div>
                            {recipe.level && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                    <BarChart2 size={12} />
                                    <span>{recipe.level}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* İstatistikler (Puan, Favori, Yorum) */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-light)'
                    }}>
                        {/* Puan */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 700, color: '#F59E0B' }}>
                            <Star size={12} fill="#F59E0B" />
                            <span>{recipe.rating}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            {/* Favori Sayısı */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: 'var(--text-caption)' }}>
                                <Heart size={10} fill="currentColor" />
                                <span>{stats.favorites}</span>
                            </div>
                            {/* Yorum Sayısı */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: 'var(--text-caption)' }}>
                                <MessageCircle size={10} fill="currentColor" />
                                <span>{stats.reviews}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;
