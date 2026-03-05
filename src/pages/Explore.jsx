import React, { useState } from 'react';
import { categories, recipes } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';
import { Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Explore = () => {
    const [activeCat, setActiveCat] = useState('all');
    const [searchQuery, setSearchQuery] = useState("");

    // Filter recipes based on category AND search query
    const filteredRecipes = recipes.filter(r => {
        const matchesCategory = activeCat === 'all'
            ? true
            : (Array.isArray(r.category) ? r.category.includes(activeCat) : r.category === activeCat);

        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    // Kategorileri filtrele (Türk, Meksika gizlensin - İtalyan ve Japon artık açık)
    const hiddenCategories = ['tr', 'mx'];
    const displayCategories = categories.filter(c => !hiddenCategories.includes(c.id));

    return (
        <div style={{ paddingBottom: '80px', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
            {/* Top Bar - Custom Style matching Home */}
            <div className="container" style={{ paddingTop: '20px', position: 'relative', zIndex: 50 }}>
                <div style={{
                    backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '16px',
                    display: 'flex', alignItems: 'center', gap: '14px', boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-light)'
                }}>
                    <Search size={22} color="var(--primary)" />
                    <input
                        type="text"
                        placeholder="Global tariflerde ara..."
                        style={{
                            border: 'none', outline: 'none', width: '100%', fontSize: '15px',
                            fontWeight: 500, color: 'var(--text-main)', backgroundColor: 'transparent'
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {/* Autocomplete Dropdown */}
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

            {/* Categories */}
            <div style={{ marginTop: '24px' }}>
                <div style={{
                    display: 'flex', overflowX: 'auto', gap: '12px', padding: '0 20px 10px 20px',
                    scrollbarWidth: 'none'
                }}>
                    {displayCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCat(cat.id)}
                            style={{
                                backgroundColor: activeCat === cat.id ? 'var(--primary)' : 'var(--bg-card)',
                                color: activeCat === cat.id ? 'white' : 'var(--text-main)',
                                padding: '8px 16px',
                                borderRadius: '50px',
                                whiteSpace: 'nowrap',
                                fontWeight: 600,
                                fontSize: '14px',
                                boxShadow: activeCat === cat.id ? '0 4px 10px rgba(240,85,40,0.3)' : 'var(--shadow-sm)',
                                border: activeCat === cat.id ? 'none' : '1px solid var(--border-light)',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span>{cat.icon}</span>
                            {cat.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="container" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h2 className="title-lg" style={{ fontSize: '20px' }}>
                        {activeCat === 'all' ? 'Öne Çıkanlar' : categories.find(c => c.id === activeCat)?.title + ' Mutfağı'}
                    </h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)', // 2 Sütunlu Grid
                    gap: '16px',
                    alignItems: 'start' // Kartların yukarı hizalanmasını sağlar (stretch yerine)
                }}>
                    {filteredRecipes.length > 0 ? (
                        filteredRecipes.map(recipe => (
                            <div key={recipe.id} style={{ position: 'relative' }}>
                                {/* Modern/Traditional Badge */}
                                <div style={{
                                    position: 'absolute', top: '8px', left: '8px', zIndex: 10,
                                    backgroundColor: recipe.isModern ? 'var(--tag-red-text)' : 'var(--tag-orange-text)',
                                    color: 'white', fontSize: '9px', fontWeight: 800,
                                    padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase'
                                }}>
                                    {recipe.isModern ? 'MODERN' : 'KLASİK'}
                                </div>
                                <RecipeCard recipe={recipe} />
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            Aradığınız kriterlere uygun tarif bulunamadı.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Explore;
