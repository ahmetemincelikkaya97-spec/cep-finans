import React, { useMemo, useState } from 'react';
import { Search, Bell, UtensilsCrossed, Sparkles } from 'lucide-react';
import { recipes } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    // 1. Günün Menüsü Mantığı: Tarihe göre 3 tarif seçer.
    const dailyMenu = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        let seed = 0;
        for (let i = 0; i < today.length; i++) {
            seed += today.charCodeAt(i);
        }

        const seededRandom = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        const getRandomFrom = (list) => {
            if (!list || list.length === 0) return null;
            return list[Math.floor(seededRandom() * list.length)];
        };

        // Kategorilere ayır
        const lunchOptions = recipes.filter(r => r.category === 'soup' || r.category === 'veg' || r.tags?.includes('Salata'));
        const dinnerOptions = recipes.filter(r => r.category === 'kebab' || r.category === 'tr' || r.category === 'main' || r.tags?.includes('Et'));
        const dessertOptions = recipes.filter(r => r.category === 'dessert' || r.tags?.includes('Tatlı'));

        // Deterministik seçimler
        let lunch = getRandomFrom(lunchOptions) || recipes[0];
        let dinner = getRandomFrom(dinnerOptions) || recipes[1];

        let dessert = getRandomFrom(dessertOptions);
        if (!dessert) {
            const remaining = recipes.filter(r => r.id !== lunch.id && r.id !== dinner.id);
            dessert = getRandomFrom(remaining) || recipes[2];
        }

        // Remove types from data object if not needed, but keep structure for map
        return [
            { id: 'lunch', data: lunch },
            { id: 'dinner', data: dinner },
            { id: 'dessert', data: dessert }
        ];
    }, []);

    // 2. Filtrelemeler
    const popularRecipes = recipes.filter(r => r.rating >= 4.7).slice(0, 5);
    const traditionalTr = recipes.filter(r => r.isTraditional || r.category === 'tr' || r.tags?.includes('Türk')).slice(0, 5);
    const worldCuisines = recipes.filter(r => r.category !== 'tr' && !r.isTraditional && !r.tags?.includes('Türk')).slice(0, 5);

    return (
        <div style={{ paddingBottom: '100px', maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--bg-app)', minHeight: '100vh' }}>
            {/* Header */}
            <div className="container" style={{ paddingTop: '20px', paddingBottom: '10px' }}>
                <div className="flex-between">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{
                            width: '45px', height: '45px', background: '#FFE4D6', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-card)',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                        }}>
                            <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Avatar" width="36" />
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                HOŞ GELDİN ŞEF 👋
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                                Günaydın, {user?.name || 'Misafir'}!
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/notifications')}
                        style={{
                            width: '44px', height: '44px', borderRadius: '14px', border: '1px solid var(--border-light)',
                            backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text-main)', boxShadow: 'var(--shadow-sm)'
                        }}>
                        <Bell size={22} />
                    </button>
                </div>
            </div>

            {/* Search Bar - Custom Style */}
            <div className="container" style={{ position: 'relative', zIndex: 50 }}>
                <div style={{
                    backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '16px',
                    display: 'flex', alignItems: 'center', gap: '14px', boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-light)'
                }}>
                    <Search size={22} color="var(--primary)" />
                    <input
                        type="text"
                        placeholder="Bugün ne pişirmek istersin?"
                        style={{
                            border: 'none', outline: 'none', width: '100%', fontSize: '15px',
                            fontWeight: 500, color: 'var(--text-main)', backgroundColor: 'transparent'
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Search Results Dropdown */}
                {searchQuery.length > 0 && (
                    <div style={{
                        position: 'absolute', top: '100%', left: '20px', right: '20px',
                        backgroundColor: 'var(--bg-card)', borderRadius: '12px',
                        marginTop: '8px', boxShadow: 'var(--shadow-md)',
                        maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border-light)'
                    }}>
                        {recipes.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                            recipes.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).map(recipe => (
                                <Link
                                    to={`/recipe/${recipe.id}`}
                                    key={recipe.id}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '12px', textDecoration: 'none',
                                        borderBottom: '1px solid var(--border-light)'
                                    }}
                                >
                                    <img
                                        src={recipe.image} alt={recipe.title}
                                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{recipe.title}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{recipe.category}</div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div style={{ padding: '16px', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '14px' }}>
                                Tarif bulunamadı.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Günün Menüsü */}
            <div className="container" style={{ marginTop: '28px' }}>
                <div className="flex-between" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={20} color="var(--primary)" fill="var(--primary)" />
                        <h2 className="title-lg" style={{ fontSize: '18px', margin: 0 }}>Günün Menüsü</h2>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px'
                }}>
                    {dailyMenu.map((item, index) => {
                        const recipe = item.data;
                        return (
                            <Link to={`/recipe/${recipe.id}`} key={index} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    backgroundColor: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden',
                                    boxShadow: 'var(--shadow-sm)', height: '100%',
                                    display: 'flex', flexDirection: 'column', border: '1px solid var(--border-light)'
                                }}>
                                    <div style={{ height: '100px', overflow: 'hidden', position: 'relative' }}>
                                        <img
                                            src={recipe.image}
                                            alt={recipe.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://placehold.co/600x400/FFF0EB/F05528?text=" + encodeURIComponent(recipe.title);
                                            }}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        {/* Overlay Removed here */}
                                    </div>
                                    <div style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <h3 style={{
                                            fontSize: '13px', fontWeight: 700, color: 'var(--text-main)',
                                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                            marginBottom: '6px', lineHeight: 1.3
                                        }}>
                                            {recipe.title}
                                        </h3>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                            {recipe.time} • {recipe.calories}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Banner */}
            <div className="container" style={{ marginTop: '28px' }}>
                <Link to="/explore" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'linear-gradient(120deg, #FF6B3D 0%, #FF8F6B 100%)',
                        borderRadius: '20px', padding: '24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div>
                            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
                                Yeni Lezzetler Keşfet
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', maxWidth: '180px' }}>
                                Bugün mutfağında harikalar yaratmaya ne dersin?
                            </p>
                        </div>
                        <div style={{
                            width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <UtensilsCrossed size={24} color="white" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Section: Türk Mutfağı */}
            <div style={{ marginTop: '32px' }}>
                <div className="container flex-between" style={{ marginBottom: '16px' }}>
                    <h2 className="title-lg" style={{ fontSize: '18px' }}>Türk Mutfağı</h2>
                    <Link to="/explore" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>Tümü</Link>
                </div>
                <div style={{
                    display: 'flex', overflowX: 'auto', gap: '16px', padding: '0 20px 20px 20px',
                    scrollbarWidth: 'none', margin: '0 -20px'
                }}>
                    <div style={{ width: '20px', flexShrink: 0 }}></div> {/* Sol boşluk */}
                    {traditionalTr.map(recipe => (
                        <div key={recipe.id} style={{ minWidth: '220px', maxWidth: '220px' }}>
                            <RecipeCard recipe={recipe} />
                        </div>
                    ))}
                    <div style={{ width: '4px', flexShrink: 0 }}></div> {/* Sağ boşluk */}
                </div>
                {/* Section: Dünya Mutfağı */}
                {worldCuisines.length > 0 && (
                    <div style={{ marginTop: '0px' }}>
                        <div className="container flex-between" style={{ marginBottom: '16px' }}>
                            <h2 className="title-lg" style={{ fontSize: '18px' }}>Dünya Mutfağı</h2>
                            <Link to="/category/world" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>Tümü</Link>
                        </div>
                        <div style={{
                            display: 'flex', overflowX: 'auto', gap: '16px', padding: '0 20px 20px 20px',
                            scrollbarWidth: 'none', margin: '0 -20px'
                        }}>
                            <div style={{ width: '20px', flexShrink: 0 }}></div>
                            {worldCuisines.map(recipe => (
                                <div key={recipe.id} style={{ minWidth: '220px', maxWidth: '220px' }}>
                                    <RecipeCard recipe={recipe} />
                                </div>
                            ))}
                            <div style={{ width: '4px', flexShrink: 0 }}></div>
                        </div>
                    </div>
                )}

                {/* Section: Popüler Tarifler */}
                <div style={{ marginTop: '10px' }}>
                    <div className="container flex-between" style={{ marginBottom: '16px' }}>
                        <h2 className="title-lg" style={{ fontSize: '18px' }}>En Popülerler</h2>
                        <span style={{ color: 'var(--text-caption)', fontSize: '13px' }}>🔥</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 20px' }}>
                        {popularRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} variant="horizontal" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
