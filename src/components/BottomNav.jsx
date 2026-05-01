import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Bookmark, User } from 'lucide-react';
import { useTranslation } from '../translations';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
    const { user } = useAuth();
    const language = user?.preferences?.language || localStorage.getItem('guest_lang') || 'tr';
    const t = useTranslation(language);

    const navItems = [
        { icon: <Home size={24} />, label: t('home'), path: '/' },
        { icon: <Compass size={24} />, label: t('explore'), path: '/explore' },
        { icon: <Bookmark size={24} />, label: t('saved') || 'Kaydedilen', path: '/saved' },
        { icon: <User size={24} />, label: t('profile'), path: '/profile' },
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0, // Ekran genişliğine göre ortalamak için CSS ile kapsayıcıya güveneceğiz ama position fixed bunu bozar.
            // O yüzden width %100 yapıp max-width ile sınırlandıracağız.
            width: '100%',
            zIndex: 100,
            // Bu hile, position fixed olup da ortalanmış container içinde kalmasını sağlar (script ile veya layout ile yönetilir).
            // Basitlik için sticky footer mantığı kullanacağız.
        }}>
            <div style={{
                maxWidth: '480px',
                margin: '0 auto',
                backgroundColor: 'var(--bg-card)',
                padding: '12px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--border-light)',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.03)'
            }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: isActive ? 'var(--primary)' : 'var(--text-caption)',
                            gap: '4px',
                            fontSize: '10px',
                            fontWeight: 600
                        })}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default BottomNav;
