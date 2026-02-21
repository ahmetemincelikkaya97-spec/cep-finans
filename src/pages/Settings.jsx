import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    ArrowLeft, Mail, Lock, Bell, Globe, Scale, Moon,
    Shield, FileText, Info, LogOut, Trash2, ChevronRight
} from 'lucide-react';

const Settings = () => {
    const navigate = useNavigate();
    const { user, logout, updatePreferences, updateEmail, updatePassword } = useAuth();

    // Local derived state for UI, usually synced with context, but here accessing directly
    const notifications = user?.preferences?.notifications ?? true;
    const darkMode = user?.preferences?.darkMode ?? false;
    const language = user?.preferences?.language ?? 'tr';

    const handleLogout = () => {
        if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
            logout();
            navigate('/auth');
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
            logout();
            navigate('/auth');
        }
    };

    const handleEmailChange = () => {
        const newEmail = prompt("Yeni e-posta adresinizi girin:", user?.email);
        if (newEmail && newEmail !== user?.email) {
            updateEmail(newEmail);
            alert("E-posta adresi güncellendi.");
        }
    };

    const handlePasswordChange = () => {
        const newPass = prompt("Yeni şifrenizi girin:");
        if (newPass) {
            updatePassword(newPass);
        }
    };

    const toggleLanguage = () => {
        const newLang = language === 'tr' ? 'en' : 'tr';
        updatePreferences({ language: newLang });
        // In a real app, this would trigger i18n change
        alert(`Dil ${newLang === 'tr' ? 'Türkçe' : 'English'} olarak ayarlandı.`);
    };

    return (
        <div style={{ paddingBottom: '40px', backgroundColor: 'var(--bg-app)', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{
                backgroundColor: 'var(--bg-card)', padding: '20px',
                display: 'flex', alignItems: 'center', gap: '16px',
                boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 0, zIndex: 10
            }}>
                <button onClick={() => navigate(-1)} style={{ padding: '8px', marginLeft: '-8px' }}>
                    <ArrowLeft size={24} color="var(--text-main)" />
                </button>
                <h1 className="title-lg" style={{ fontSize: '20px', color: 'var(--text-main)' }}>Ayarlar</h1>
            </div>

            <div className="container" style={{ paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Section: Account */}
                <Section title="Hesap">
                    <SettingsItem
                        icon={<Mail size={20} />}
                        label="E-posta"
                        value={user?.email || "Mars Şef"}
                        onClick={handleEmailChange}
                    />
                    <SettingsItem
                        icon={<Lock size={20} />}
                        label="Şifre Değiştir"
                        onClick={handlePasswordChange}
                    />
                </Section>

                {/* Section: Preferences */}
                <Section title="Tercihler">
                    <SettingsToggle
                        icon={<Bell size={20} />}
                        label="Bildirimler"
                        isOn={notifications}
                        onToggle={() => updatePreferences({ notifications: !notifications })}
                    />
                    <SettingsItem
                        icon={<Globe size={20} />}
                        label="Dil"
                        value={language === 'tr' ? "Türkçe" : "English"}
                        onClick={toggleLanguage}
                    />
                    {/* Ölçü Birimleri removed as requested */}
                    <SettingsToggle
                        icon={<Moon size={20} />}
                        label="Koyu Mod"
                        isOn={darkMode}
                        onToggle={() => updatePreferences({ darkMode: !darkMode })}
                    />
                </Section>

                {/* Section: Privacy & Support */}
                <Section title="Diğer">
                    <SettingsItem
                        icon={<Shield size={20} />}
                        label="Gizlilik ve Güvenlik"
                        onClick={() => navigate('/privacy')}
                    />
                    <SettingsItem
                        icon={<FileText size={20} />}
                        label="Kullanım Koşulları"
                        onClick={() => navigate('/terms')}
                    />
                    <SettingsItem
                        icon={<Info size={20} />}
                        label="Hakkında"
                        value="v1.0.2"
                        onClick={() => navigate('/about')}
                    />
                </Section>

                {/* Section: Danger Zone */}
                <div style={{ marginTop: '10px' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%', padding: '16px', backgroundColor: 'var(--bg-card)', borderRadius: '16px',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            color: 'var(--text-main)', marginBottom: '12px',
                            boxShadow: 'var(--shadow-sm)', textAlign: 'left'
                        }}
                    >
                        <LogOut size={20} color="var(--text-secondary)" />
                        <span style={{ fontWeight: 600, fontSize: '15px' }}>Çıkış Yap</span>
                    </button>

                    <button
                        onClick={handleDeleteAccount}
                        style={{
                            width: '100%', padding: '16px', backgroundColor: user?.preferences?.darkMode ? '#451a1a' : '#FEF2F2', borderRadius: '16px',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            color: '#EF4444',
                            boxShadow: 'var(--shadow-sm)', textAlign: 'left'
                        }}
                    >
                        <Trash2 size={20} />
                        <span style={{ fontWeight: 600, fontSize: '15px' }}>Hesabı Sil</span>
                    </button>
                </div>

                <div style={{ textAlign: 'center', color: 'var(--text-caption)', fontSize: '12px', margin: '20px 0' }}>
                    Mutfağın Şefi © 2026
                </div>

            </div>
        </div>
    );
};

// --- Sub Components ---

// --- Sub Components ---

const Section = ({ title, children }) => (
    <div>
        <h3 style={{
            fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)',
            textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px'
        }}>
            {title}
        </h3>
        <div style={{
            backgroundColor: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
        }}>
            {children}
        </div>
    </div>
);

const SettingsItem = ({ icon, label, value, onClick }) => (
    <div
        onClick={onClick}
        style={{
            padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-light)', cursor: 'pointer'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: 'var(--text-secondary)' }}>{icon}</div>
            <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-main)' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {value && <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{value}</span>}
            <ChevronRight size={18} color="var(--text-caption)" />
        </div>
    </div>
);

const SettingsToggle = ({ icon, label, isOn, onToggle }) => (
    <div
        style={{
            padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-light)'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: 'var(--text-secondary)' }}>{icon}</div>
            <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-main)' }}>{label}</span>
        </div>

        {/* iOS Style Switch */}
        <div
            onClick={onToggle}
            style={{
                width: '50px', height: '30px',
                backgroundColor: isOn ? 'var(--primary)' : 'var(--border-light)',
                borderRadius: '30px', padding: '2px', cursor: 'pointer',
                transition: 'background-color 0.3s ease', position: 'relative'
            }}
        >
            <div style={{
                width: '26px', height: '26px', backgroundColor: 'white', borderRadius: '50%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transform: isOn ? 'translateX(20px)' : 'translateX(0)',
                transition: 'transform 0.3s ease'
            }} />
        </div>
    </div>
);

export default Settings;
