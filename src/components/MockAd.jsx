import React from 'react';
import { Info } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../translations';

const MockAd = ({ type = 'banner' }) => {
    const { user } = useAuth();
    const language = user?.preferences?.language || localStorage.getItem('guest_lang') || 'tr';
    const t = useTranslation(language);

    if (Capacitor.isNativePlatform()) return null;

    // Banner: 320x50, Rectangle: 300x250
    const isBanner = type === 'banner';
    const height = isBanner ? '60px' : '250px';
    const width = '100%';
    const maxWidth = isBanner ? '100%' : '300px';

    return (
        <div style={{
            width: width,
            maxWidth: maxWidth,
            height: height,
            backgroundColor: 'var(--border-light)',
            border: '2px dashed var(--text-caption)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '24px auto',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: '4px',
                right: '6px',
                fontSize: '10px',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(255,255,255,0.5)',
                padding: '2px 6px',
                borderRadius: '4px'
            }}>
                <span>{t('sponsored')}</span>
                <Info size={10} />
            </div>
            
            <div style={{ color: 'var(--text-caption)', fontWeight: 800, fontSize: isBanner ? '14px' : '20px' }}>
                {t('test_ad')}
            </div>
            {!isBanner && (
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '12px', textAlign: 'center', padding: '0 20px', lineHeight: 1.5 }}>
                    <span dangerouslySetInnerHTML={{ __html: t('ad_rectangle_desc') }}></span>
                </div>
            )}
            {isBanner && (
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>
                    {t('ad_banner_desc')}
                </div>
            )}
        </div>
    );
};

export default MockAd;
