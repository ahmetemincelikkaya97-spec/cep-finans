import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipes } from '../data/recipes';
import { useAuth } from '../context/AuthContext';
import { X, ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { useTranslation } from '../translations';
import NoSleep from 'nosleep.js';
import { motion, AnimatePresence } from 'framer-motion';

const CookingMode = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToHistory, user } = useAuth();
    const recipe = recipes.find(r => r.id === parseInt(id));

    // get lang from user or localStorage
    const language = user?.preferences?.language || localStorage.getItem('guest_lang') || 'tr';
    const t = useTranslation(language);

    const [currentStep, setCurrentStep] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showExitToast, setShowExitToast] = useState(false);

    // Wake Lock State
    const noSleepRef = useRef(null);

    // Request Wake Lock (Works on all mobile devices and HTTP)
    useEffect(() => {
        if (!noSleepRef.current) {
            noSleepRef.current = new NoSleep();
        }

        const enableNoSleep = () => {
            if (noSleepRef.current && !noSleepRef.current.isEnabled) {
                noSleepRef.current.enable();
                // Ekrana ilk dokunuşta aktifleşir, sonra dinleyicileri kaldırıyoruz.
                document.removeEventListener('click', enableNoSleep);
                document.removeEventListener('touchstart', enableNoSleep);
            }
        };

        // NoSleep arka planda sessiz bir video oynatır, tarayıcılar video oynatımı için kullanıcı etkileşimi (dokunma) ister.
        document.addEventListener('click', enableNoSleep);
        document.addEventListener('touchstart', enableNoSleep);

        return () => {
            document.removeEventListener('click', enableNoSleep);
            document.removeEventListener('touchstart', enableNoSleep);
            if (noSleepRef.current && noSleepRef.current.isEnabled) {
                noSleepRef.current.disable();
            }
        };
    }, []);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Helper: Play Beep Sound using Web Audio API
    const playBeep = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            const playTone = (freq, startTime, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.2, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                osc.start(startTime);
                osc.stop(startTime + duration);
            };

            const now = ctx.currentTime;
            // Dıt - Dıt - Dııııııt şeklinde ritmik bir mutfak alarmı
            playTone(880, now, 0.2);
            playTone(880, now + 0.3, 0.2);
            playTone(1046, now + 0.6, 0.6);
        } catch(err) {
            console.error("Audio play error", err);
        }
    };

    // Timer Detection Effect
    useEffect(() => {
        setIsTimerRunning(false);
        setTimeLeft(0);
        
        if (!recipe || !recipe.steps[currentStep]) return;
        
        const stepText = recipe.steps[currentStep];
        const timeRegex = /(\d+(?:-\d+)?)\s*(dakika|dk|saat|sn|saniye)/i;
        const match = stepText.match(timeRegex);
        
        if (match) {
            let valueStr = match[1];
            // If it's a range like "8-9", take the higher value
            let value = parseInt(valueStr.includes('-') ? valueStr.split('-').pop() : valueStr);
            const unit = match[2].toLowerCase();
            
            let seconds = 0;
            if (unit.includes('saat')) seconds = value * 3600;
            else if (unit.includes('dakika') || unit.includes('dk')) seconds = value * 60;
            else if (unit.includes('sn') || unit.includes('saniye')) seconds = value;
            
            setTimeLeft(seconds);
        }
    }, [currentStep, recipe]);

    // Timer Countdown Effect
    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
            playBeep();
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    if (!recipe) return <div className="container" style={{ color: 'var(--text-main)' }}>{t('recipe_not_found')}</div>;

    const totalSteps = recipe.steps.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsCompleted(true);
            addToHistory(recipe.id);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleClose = () => {
        if (isCompleted) {
            navigate(-1);
            return;
        }
        if (showExitToast) {
            navigate(-1);
        } else {
            setShowExitToast(true);
            setTimeout(() => setShowExitToast(false), 2500);
        }
    };

    const toggleTimer = () => {
        if (timeLeft > 0) {
            setIsTimerRunning(!isTimerRunning);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Helper: Contextual Ingredients
    const getIngredientsForStep = (stepText) => {
        if (!recipe.ingredients) return [];
        const text = stepText.toLowerCase();
        
        return recipe.ingredients.filter(ing => {
            const cleanName = ing.name.replace(/\(.*?\)/g, '').trim().toLowerCase();
            const words = cleanName.split(' ').filter(w => w.length > 2);
            return words.some(word => text.includes(word));
        });
    };

    const currentIngredients = getIngredientsForStep(recipe.steps[currentStep]);

    // Helper: Highlight Time in Text
    const renderStepText = (text) => {
        const timeRegex = /(\d+(?:-\d+)?\s*(?:dakika|dk|saat|sn|saniye))/gi;
        const parts = text.split(timeRegex);
        
        return parts.map((part, i) => {
            if (part.match(timeRegex)) {
                return <span key={i} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{part}</span>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    if (isCompleted) {
        return (
            <div style={{
                height: '100vh', backgroundColor: 'var(--bg-app)', display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '100px', height: '100px', backgroundColor: 'var(--tag-green-bg)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '24px'
                }}>
                    <CheckCircle size={50} color="var(--tag-green-text)" />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {t('well_done_title')}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    "{recipe.title}" {t('completed_recipe')}
                </p>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '16px 32px', backgroundColor: 'var(--primary)', color: 'white',
                        borderRadius: '50px', fontWeight: 700, width: '100%'
                    }}
                >
                    {t('back_to_recipe')}
                </button>
            </div>
        );
    }

    return (
        <div style={{
            height: '100vh', backgroundColor: 'var(--bg-app)', display: 'flex',
            flexDirection: 'column', position: 'relative'
        }}>
            {/* Header */}
            <div style={{
                padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)'
            }}>
                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    {t('step')} {currentStep + 1} / {totalSteps}
                </div>
                <button onClick={handleClose} style={{ padding: '8px' }}>
                    <X size={24} color="var(--text-main)" />
                </button>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-light)' }}>
                <div style={{
                    width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary)',
                    transition: 'width 0.3s ease'
                }}></div>
            </div>

            {/* Content - Scrollable */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                
                {/* Timer or Tip */}
                {timeLeft > 0 || isTimerRunning ? (
                    <div 
                        onClick={toggleTimer}
                        style={{
                            marginBottom: '32px', padding: '12px 24px', borderRadius: '50px',
                            backgroundColor: isTimerRunning ? 'var(--primary)' : 'var(--bg-card)', 
                            border: `1px solid ${isTimerRunning ? 'var(--primary)' : 'var(--border-light)'}`,
                            display: 'flex', alignItems: 'center', gap: '8px', 
                            color: isTimerRunning ? 'white' : 'var(--text-main)', 
                            fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
                            boxShadow: isTimerRunning ? '0 4px 12px rgba(255, 90, 95, 0.3)' : 'none',
                            transition: 'all 0.3s ease', userSelect: 'none'
                        }}
                    >
                        <Clock size={20} />
                        <span>{isTimerRunning ? formatTime(timeLeft) : `⏱️ ${formatTime(timeLeft)} Başlat`}</span>
                    </div>
                ) : (
                    <div style={{
                        marginBottom: '32px', padding: '8px 16px', borderRadius: '50px',
                        backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)',
                        display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px'
                    }}>
                        <Clock size={16} />
                        <span>{t('take_your_time')}</span>
                    </div>
                )}

                <h2 style={{
                    fontSize: '24px', fontWeight: 800, color: 'var(--text-main)',
                    textAlign: 'center', lineHeight: 1.5
                }}>
                    {renderStepText(recipe.steps[currentStep])}
                </h2>

                {/* Contextual Ingredients */}
                {currentIngredients.length > 0 && (
                    <div style={{ 
                        display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', 
                        marginTop: '32px', width: '100%', maxWidth: '400px'
                    }}>
                        {currentIngredients.map((ing, idx) => (
                            <div key={idx} style={{
                                padding: '8px 12px', backgroundColor: 'var(--bg-card)', 
                                border: '1px solid var(--border-light)', borderRadius: '12px',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                fontSize: '14px', color: 'var(--text-main)', fontWeight: 500
                            }}>
                                <span>{ing.icon}</span>
                                <span>{ing.name}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '12px', marginLeft: '4px' }}>{ing.amount}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Controls */}
            <div style={{
                padding: '20px', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-light)',
                display: 'flex', alignItems: 'center', gap: '16px'
            }}>
                <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    style={{
                        width: '50px', height: '50px', borderRadius: '50%',
                        backgroundColor: 'var(--bg-app)',
                        color: currentStep === 0 ? 'var(--text-caption)' : 'var(--text-main)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid var(--border-light)'
                    }}
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    onClick={handleNext}
                    style={{
                        flex: 1, height: '50px', borderRadius: '25px',
                        backgroundColor: 'var(--primary)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '16px', gap: '8px'
                    }}
                >
                    {currentStep === totalSteps - 1 ? t('finish') : t('next_step')}
                    {currentStep !== totalSteps - 1 && <ChevronRight size={20} />}
                </button>
            </div>

            {/* Exit Toast Notification */}
            <AnimatePresence>
                {showExitToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: "-50%", scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                        exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        style={{
                            position: 'absolute',
                            top: '80px', // slightly below header
                            left: '50%',
                            backgroundColor: 'rgba(30, 30, 30, 0.9)',
                            backdropFilter: 'blur(8px)',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '50px',
                            fontWeight: 600,
                            fontSize: '14px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            zIndex: 1000,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {t('tap_again_to_exit')}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
export default CookingMode;
