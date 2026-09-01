import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { ChevronLeft, Trophy, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateGamification } from '../utils/gamification';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../translations';

const Leaderboard = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const language = currentUser?.preferences?.language || localStorage.getItem('guest_lang') || 'tr';
    const t = useTranslation(language);
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersList = [];
                
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    const gamification = calculateGamification(userData);
                    if (gamification) {
                        usersList.push({
                            id: doc.id,
                            name: userData.name || t('anonymous_chef'),
                            avatar: userData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
                            xp: gamification.xp,
                            level: gamification.currentLevel,
                        });
                    }
                });

                // Sort by XP descending
                usersList.sort((a, b) => b.xp - a.xp);
                
                // Get top 50
                setLeaders(usersList.slice(0, 50));
                setLoading(false);
            } catch (error) {
                console.error("Liderlik tablosu çekilemedi:", error);
                setLoading(false);
            }
        };

        fetchLeaders();
    }, []);

    const getRankStyle = (index) => {
        switch(index) {
            case 0: return { color: '#fbbf24', bg: '#fef3c7', icon: <Trophy size={20} color="#fbbf24" /> }; // Gold
            case 1: return { color: '#9ca3af', bg: '#f3f4f6', icon: <Medal size={20} color="#9ca3af" /> }; // Silver
            case 2: return { color: '#b45309', bg: '#fef3c7', icon: <Medal size={20} color="#b45309" /> }; // Bronze
            default: return { color: 'var(--text-secondary)', bg: 'transparent', icon: <span style={{ fontWeight: 800, fontSize: '15px' }}>{index + 1}</span> };
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ backgroundColor: 'var(--bg-app)', minHeight: '100vh', paddingBottom: '100px' }}
        >
            {/* Header */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 10,
                backgroundColor: 'var(--bg-card)', padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)', borderBottom: '1px solid var(--border-light)'
            }}>
                <button onClick={() => navigate(-1)} style={{ padding: '8px', marginLeft: '-8px' }}>
                    <ChevronLeft size={24} color="var(--text-main)" />
                </button>
                <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={20} color="var(--primary)" /> {t('leaderboard')}
                </h1>
                <div style={{ width: '40px' }}></div> {/* Spacer for centering */}
            </div>

            <div className="container" style={{ marginTop: '20px' }}>
                <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    {t('leaderboard_desc')}
                </p>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <span className="spinner" style={{ width: '30px', height: '30px', margin: '0 auto 16px', display: 'block', borderTopColor: 'var(--primary)' }}></span>
                        {t('ranking_chefs')}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {leaders.map((leader, index) => {
                            const rank = getRankStyle(index);
                            const isMe = currentUser?.uid === leader.id;

                            return (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                                    key={leader.id}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        backgroundColor: isMe ? 'var(--primary-light)' : 'var(--bg-card)',
                                        padding: '12px 16px', borderRadius: '16px',
                                        boxShadow: isMe ? '0 4px 12px var(--primary)30' : 'var(--shadow-sm)',
                                        border: isMe ? '2px solid var(--primary)' : '1px solid var(--border-light)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {/* Rank Number / Icon */}
                                        <div style={{ 
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            backgroundColor: rank.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: rank.color
                                        }}>
                                            {rank.icon}
                                        </div>

                                        {/* Avatar with Level Border */}
                                        <div style={{
                                            width: '46px', height: '46px', borderRadius: '50%',
                                            border: `2px solid ${leader.level.color}`, overflow: 'hidden',
                                            backgroundColor: 'var(--bg-app)'
                                        }}>
                                            <img src={leader.avatar} alt={leader.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>

                                        {/* Name and Level */}
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                                                {leader.name} {isMe && <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>{t('you')}</span>}
                                            </span>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: leader.level.color }}>
                                                {t(leader.level.nameKey)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* XP */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                                            {leader.xp}
                                        </span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>XP</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Leaderboard;
