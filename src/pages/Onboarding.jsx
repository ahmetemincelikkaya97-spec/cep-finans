import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Bookmark, ChefHat, ArrowRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: "Keşfet",
        description: "Binlerce farklı tarifi keşfet, mutfakta sınır tanıma!",
        icon: <Compass size={80} color="var(--primary)" />
    },
    {
        id: 2,
        title: "Kaydet",
        description: "Sevdiğin tarifleri favorilerine ekle, alışveriş listeni oluştur.",
        icon: <Bookmark size={80} color="var(--primary)" />
    },
    {
        id: 3,
        title: "Pişir",
        description: "Adım adım talimatlarla profesyonel bir şef gibi pişir!",
        icon: <ChefHat size={80} color="var(--primary)" />
    }
];

const Onboarding = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        navigate('/', { replace: true });
    };

    return (
        <div style={{
            height: '100vh', width: '100%', backgroundColor: 'var(--bg-app)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative'
        }}>
            {/* Skip Button */}
            <div style={{ position: 'absolute', top: '24px', right: '20px', zIndex: 10 }}>
                <button 
                    onClick={handleComplete}
                    style={{ 
                        padding: '8px 16px', color: 'var(--text-secondary)', 
                        fontWeight: 600, fontSize: '15px', backgroundColor: 'transparent',
                        border: 'none', cursor: 'pointer'
                    }}
                >
                    Geç (Skip)
                </button>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '40px'
                        }}
                    >
                        <div style={{
                            width: '160px', height: '160px', backgroundColor: 'var(--bg-card)',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
                        }}>
                            {slides[currentSlide].icon}
                        </div>
                        
                        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px', textAlign: 'center' }}>
                            {slides[currentSlide].title}
                        </h1>
                        
                        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, maxWidth: '280px' }}>
                            {slides[currentSlide].description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Dots */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                    {slides.map((_, index) => (
                        <div 
                            key={index}
                            style={{
                                width: index === currentSlide ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                backgroundColor: index === currentSlide ? 'var(--primary)' : 'var(--border-light)',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    style={{
                        width: '100%', padding: '18px', borderRadius: '16px',
                        backgroundColor: 'var(--primary)', color: 'white',
                        fontWeight: 700, fontSize: '16px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: '12px',
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 10px 20px -5px var(--primary)'
                    }}
                >
                    {currentSlide === slides.length - 1 ? 'Hemen Başla' : 'İleri'}
                    {currentSlide !== slides.length - 1 && <ArrowRight size={20} />}
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
