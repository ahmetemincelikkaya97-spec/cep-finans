import React, { useState, useEffect } from 'react';
import { ChefHat, ArrowRight, User, Lock, Mail, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    // Theme state
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Init state from DOM
        setIsDark(document.body.classList.contains('dark-mode'));
    }, []);

    const toggleTheme = () => {
        const newStatus = !isDark;
        setIsDark(newStatus);
        if (newStatus) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, isLogin ? null : name);
        navigate('/');
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-card)', // Changed from white
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 24px',
            position: 'relative',
            color: 'var(--text-main)' // Ensure text color is dynamic
        }}>
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                style={{
                    position: 'absolute', top: '24px', right: '24px',
                    width: '40px', height: '40px', borderRadius: '50%',
                    border: '1px solid var(--border-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-main)', backgroundColor: 'var(--bg-app)'
                }}
            >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{
                        width: '80px', height: '80px', backgroundColor: 'var(--primary-light)',
                        borderRadius: '50%', margin: '0 auto 24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <ChefHat size={40} color="var(--primary)" />
                </motion.div>

                <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {isLogin ? 'Tekrar Hoş Geldin' : 'Aramıza Katıl'}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                    {isLogin ? 'Lezzet dünyasına dönmek için giriş yap.' : 'Kendi tarif defterini oluşturmak için hesap aç.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {!isLogin && (
                    <div style={{ position: 'relative' }}>
                        <User size={20} color="var(--text-caption)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Adın Soyadın"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required={!isLogin}
                            style={{
                                width: '100%', padding: '16px 16px 16px 48px',
                                borderRadius: '16px', border: '1px solid var(--border-light)',
                                backgroundColor: 'var(--bg-app)', // Changed from #F9FAFB
                                color: 'var(--text-main)', // Added for dark mode text input visibility
                                fontSize: '15px', outline: 'none'
                            }}
                        />
                    </div>
                )}

                <div style={{ position: 'relative' }}>
                    <Mail size={20} color="var(--text-caption)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="email"
                        placeholder="E-posta Adresi"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%', padding: '16px 16px 16px 48px',
                            borderRadius: '16px', border: '1px solid var(--border-light)',
                            backgroundColor: 'var(--bg-app)', // Changed form #F9FAFB
                            color: 'var(--text-main)',
                            fontSize: '15px', outline: 'none'
                        }}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <Lock size={20} color="var(--text-caption)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="password"
                        placeholder="Şifre"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%', padding: '16px 16px 16px 48px',
                            borderRadius: '16px', border: '1px solid var(--border-light)',
                            backgroundColor: 'var(--bg-app)', // Changed form #F9FAFB
                            color: 'var(--text-main)',
                            fontSize: '15px', outline: 'none'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        marginTop: '16px',
                        backgroundColor: 'var(--primary)', color: 'white', padding: '16px',
                        borderRadius: '16px', fontWeight: 700, fontSize: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        boxShadow: '0 8px 20px rgba(240, 85, 40, 0.25)'
                    }}
                >
                    {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                    <ArrowRight size={20} />
                </button>

            </form>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {isLogin ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: 'var(--primary)', fontWeight: 700, marginLeft: '6px' }}
                    >
                        {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
                    </button>
                </p>
            </div>

        </div>
    );
};

export default Auth;
