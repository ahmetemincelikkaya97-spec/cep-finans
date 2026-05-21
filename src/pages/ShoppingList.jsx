import React from 'react';
import { useShoppingList } from '../context/ShoppingListContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../translations';
import { ArrowLeft, Trash2, CheckCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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

const ShoppingList = () => {
    const { shoppingList, toggleItem, removeItem, clearList } = useShoppingList();
    const { user } = useAuth();
    const language = user?.preferences?.language || localStorage.getItem('guest_lang') || 'tr';
    const t = useTranslation(language);
    const navigate = useNavigate();

    return (
        <motion.div 
            initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
            style={{ paddingBottom: '100px', backgroundColor: 'var(--bg-app)', minHeight: '100vh', color: 'var(--text-main)' }}>
            
            {/* Header */}
            <div style={{
                padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, backgroundColor: 'var(--bg-app)', zIndex: 10,
                borderBottom: '1px solid var(--border-light)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate(-1)} style={{
                        padding: '8px', borderRadius: '50%', backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <ArrowLeft size={20} color="var(--text-main)" />
                    </button>
                    <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{t('shopping_list')}</h1>
                </div>
                {shoppingList.length > 0 && (
                    <button onClick={clearList} style={{ color: 'var(--tag-red-text)', background: 'none', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                        {t('remove')}
                    </button>
                )}
            </div>

            {/* List */}
            <div className="container" style={{ padding: '20px' }}>
                {shoppingList.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {shoppingList.map(item => (
                            <div key={item.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '16px', backgroundColor: 'var(--bg-card)', borderRadius: '16px',
                                boxShadow: 'var(--shadow-sm)', opacity: item.checked ? 0.6 : 1,
                                transition: 'all 0.2s'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' }} onClick={() => toggleItem(item.id)}>
                                    {item.checked ? <CheckCircle color="var(--primary)" /> : <Circle color="var(--text-caption)" />}
                                    <div>
                                        <div style={{ fontSize: '16px', fontWeight: item.checked ? 500 : 700, textDecoration: item.checked ? 'line-through' : 'none' }}>
                                            {item.name}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            {item.amount}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--tag-red-text)', padding: '8px', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
                        <p>{t('shopping_list_empty')}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ShoppingList;
