import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../translations';

const InfoPageLayout = ({ title, icon: Icon, children }) => {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', paddingBottom: '40px' }}>
            <div style={{
                position: 'sticky', top: 0, zIndex: 10,
                backgroundColor: 'var(--bg-card)', padding: '20px',
                display: 'flex', alignItems: 'center', gap: '16px',
                borderBottom: '1px solid var(--border-light)'
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '8px', borderRadius: '50%',
                        backgroundColor: 'var(--bg-app)',
                        border: '1px solid var(--border-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-main)'
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {Icon && <Icon size={20} color="var(--primary)" />}
                    <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{title}</h1>
                </div>
            </div>
            <div className="container" style={{ padding: '24px 20px' }}>
                <div style={{
                    backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '24px',
                    boxShadow: 'var(--shadow-sm)', color: 'var(--text-main)', lineHeight: '1.6'
                }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export const Privacy = () => {
    const { user } = useAuth();
    const language = user?.preferences?.language || localStorage.getItem('guest_lang') || 'tr';
    const t = useTranslation(language);

    return (
        <InfoPageLayout title={t('privacy_policy')} icon={Shield}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>{t('data_safe')}</h3>
            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                {t('data_safe_desc')}
            </p>

            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>{t('data_collected')}</h4>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                <li style={{ marginBottom: '4px' }}>{t('data_1')}</li>
                <li style={{ marginBottom: '4px' }}>{t('data_2')}</li>
                <li style={{ marginBottom: '4px' }}>{t('data_3')}</li>
                <li style={{ marginBottom: '4px' }}>{t('data_4')}</li>
            </ul>

            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>{t('data_usage')}</h4>
            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                {t('data_usage_desc')}
            </p>

            <div style={{ padding: '12px', backgroundColor: 'var(--tag-green-bg)', borderRadius: '12px', color: 'var(--tag-green-text)', fontSize: '14px', fontWeight: 600 }}>
                {t('data_control')}
            </div>
        </InfoPageLayout>
    );
};

export const Terms = () => {
    const { user } = useAuth();
    const language = user?.preferences?.language || localStorage.getItem('guest_lang') || 'tr';
    const t = useTranslation(language);

    return (
        <InfoPageLayout title={t('terms')} icon={FileText}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>{t('welcome_terms')}</h3>
            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                {t('terms_desc')}
            </p>

            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>{t('rule_1')}</h4>
            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                {t('rule_1_desc')}
            </p>

            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>{t('rule_2')}</h4>
            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                {t('rule_2_desc')}
            </p>

            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>{t('rule_3')}</h4>
            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                {t('rule_3_desc')}
            </p>
        </InfoPageLayout>
    );
};

export const About = () => {
    const { user } = useAuth();
    const language = user?.preferences?.language || localStorage.getItem('guest_lang') || 'tr';
    const t = useTranslation(language);

    return (
        <InfoPageLayout title={t('about')} icon={Info}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                    width: '80px', height: '80px', backgroundColor: 'var(--primary)',
                    borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px', fontSize: '40px'
                }}>
                    👨‍🍳
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>Mutfağın Şefi</h2>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>v1.0.2</div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>{t('mission')}</h3>
            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                {t('mission_desc')}
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>{t('developer')}</h3>
            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                {t('developer_desc')}
            </p>

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-caption)' }}>
                {t('all_rights')}
            </div>
        </InfoPageLayout>
    );
};
