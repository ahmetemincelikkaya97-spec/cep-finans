import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Check, Upload, Camera } from 'lucide-react';
import { useTranslation } from '../translations';
import { motion } from 'framer-motion';
import { useRef } from 'react';

const AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bandit",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Cookie"
];

const EditProfile = () => {
    const { user, updateUserDoc } = useAuth();
    const navigate = useNavigate();
    const language = user?.preferences?.language || localStorage.getItem('guest_lang') || 'tr';
    const t = useTranslation(language);

    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [avatar, setAvatar] = useState(user?.avatar || AVATARS[0]);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUserDoc({ name, bio, avatar });
        } catch (e) {
            console.error(e);
        }
        setIsSaving(false);
        navigate(-1);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Resize and compress to save Firestore space
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 250;
                const MAX_HEIGHT = 250;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                // Convert to compressed jpeg base64
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                setAvatar(compressedBase64);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ backgroundColor: 'var(--bg-app)', minHeight: '100vh', paddingBottom: '40px' }}
        >
            {/* Header */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 10,
                backgroundColor: 'var(--bg-card)', padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <button onClick={() => navigate(-1)} style={{ padding: '8px', marginLeft: '-8px' }}>
                    <ChevronLeft size={24} color="var(--text-main)" />
                </button>
                <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
                    Profili Düzenle
                </h1>
                <button onClick={handleSave} disabled={isSaving} style={{ padding: '8px', color: 'var(--primary)', fontWeight: 700 }}>
                    {isSaving ? <span style={{ fontSize: '14px' }}>...</span> : <Save size={20} />}
                </button>
            </div>

            <div className="container" style={{ marginTop: '24px' }}>
                {/* Avatar Selection */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                        Şef Avatarı Seç
                    </h3>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700,
                            color: 'var(--primary)', padding: '6px 12px', borderRadius: '12px', backgroundColor: 'var(--primary-light)' 
                        }}>
                        <Camera size={14} /> Galeriden Seç
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                    />
                </div>
                
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none' }}>
                    {/* Custom Uploaded Avatar preview (if selected and not in AVATARS list) */}
                    {!AVATARS.includes(avatar) && avatar && (
                         <div 
                         style={{
                             minWidth: '80px', height: '80px', borderRadius: '50%',
                             backgroundColor: 'var(--bg-card)', overflow: 'hidden', cursor: 'pointer',
                             border: '4px solid var(--primary)', position: 'relative',
                             boxShadow: '0 4px 12px var(--primary)40'
                         }}
                     >
                         <img src={avatar} alt="custom-avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                         <div style={{
                                 position: 'absolute', bottom: '4px', right: '4px', backgroundColor: 'var(--primary)', color: 'white',
                                 borderRadius: '50%', padding: '2px', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                             }}>
                                 <Check size={14} />
                         </div>
                     </div>
                    )}

                    {AVATARS.map((av, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setAvatar(av)}
                            style={{
                                minWidth: '80px', height: '80px', borderRadius: '50%',
                                backgroundColor: 'var(--bg-card)', overflow: 'hidden', cursor: 'pointer',
                                border: avatar === av ? '4px solid var(--primary)' : '4px solid transparent',
                                position: 'relative', transition: 'all 0.2s',
                                boxShadow: avatar === av ? '0 4px 12px var(--primary)40' : 'var(--shadow-sm)'
                            }}
                        >
                            <img src={av} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#FFE4D6' }} />
                            {avatar === av && (
                                <div style={{
                                    position: 'absolute', bottom: '4px', right: '4px',
                                    backgroundColor: 'var(--primary)', color: 'white',
                                    borderRadius: '50%', padding: '2px', display: 'flex',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}>
                                    <Check size={14} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            İsim Soyisim veya Takma Ad
                        </label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Mutfaktaki isminizi girin"
                            style={{
                                width: '100%', padding: '16px', borderRadius: '16px',
                                border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)',
                                color: 'var(--text-main)', fontSize: '15px', fontWeight: 500, outline: 'none'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Hakkında (Biyografi)
                        </label>
                        <textarea 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="En çok hangi yemekleri pişirmeyi seversiniz?"
                            rows={4}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '16px',
                                border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)',
                                color: 'var(--text-main)', fontSize: '15px', fontWeight: 500, outline: 'none', resize: 'none'
                            }}
                        />
                    </div>
                </div>

                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    style={{
                        width: '100%', padding: '16px', backgroundColor: 'var(--primary)', color: 'white',
                        fontWeight: 700, borderRadius: '16px', marginTop: '32px', display: 'flex', justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)', border: 'none'
                    }}
                >
                    {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>
        </motion.div>
    );
};

export default EditProfile;
