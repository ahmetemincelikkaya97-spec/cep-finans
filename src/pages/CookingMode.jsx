import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipes } from '../data/recipes';
import { useAuth } from '../context/AuthContext';
import { X, ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { useTranslation } from '../translations';

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
        if (isCompleted || window.confirm(t('exit_cooking'))) {
            navigate(-1);
        }
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
                {/* Step Tip/Image Placeholder could go here */}

                <div style={{
                    marginBottom: '32px', padding: '8px 16px', borderRadius: '50px',
                    backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)',
                    display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px'
                }}>
                    <Clock size={16} />
                    <span>{t('take_your_time')}</span>
                </div>

                <h2 style={{
                    fontSize: '24px', fontWeight: 800, color: 'var(--text-main)',
                    textAlign: 'center', lineHeight: 1.5
                }}>
                    {recipe.steps[currentStep]}
                </h2>
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
        </div>
    );
};
export default CookingMode;
