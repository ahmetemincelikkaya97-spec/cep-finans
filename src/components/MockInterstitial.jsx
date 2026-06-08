import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MockInterstitial = ({ isOpen, onClose }) => {
    const [canClose, setCanClose] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3);

    useEffect(() => {
        if (isOpen) {
            // Reklam açıldığında butonu 3 saniye gizle
            setCanClose(false);
            setTimeLeft(3);
            
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanClose(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            
            return () => clearInterval(timer);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: '#111827', zIndex: 99999, // En üst katman
                    display: 'flex', flexDirection: 'column'
                }}>
                    {/* Header with Close Button */}
                    <div style={{
                        padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.1)', color: 'white',
                            padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
                            letterSpacing: '1px', textTransform: 'uppercase'
                        }}>
                            Test Reklamı
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {!canClose && (
                                <span style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600 }}>
                                    Reklamı geçmek için {timeLeft}s
                                </span>
                            )}
                            {canClose && (
                                <button 
                                    onClick={onClose}
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)', width: '36px', height: '36px',
                                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s'
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Ad Content */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '20px', textAlign: 'center'
                        }}
                    >
                        <div style={{
                            width: '180px', height: '180px', backgroundColor: '#1F2937', borderRadius: '32px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px',
                            border: '1px solid #374151', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}>
                            <ExternalLink size={64} color="#4B5563" />
                        </div>
                        <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>
                            Tam Ekran (Geçiş) Reklamı
                        </h2>
                        <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.6, maxWidth: '280px', marginBottom: '40px' }}>
                            Burası AdMob Interstitial (Geçiş) Reklam alanıdır. Sayfa geçişlerinde ekranı tamamen kaplar ve yüksek gelir sağlar.
                        </p>
                        
                        <button style={{
                            backgroundColor: '#3B82F6', color: 'white', border: 'none',
                            padding: '16px 32px', borderRadius: '50px', fontSize: '16px', fontWeight: 700,
                            width: '100%', maxWidth: '280px', cursor: 'pointer',
                            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)'
                        }}>
                            Daha Fazla Bilgi
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MockInterstitial;
