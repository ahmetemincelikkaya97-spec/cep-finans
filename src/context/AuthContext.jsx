import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile,
    deleteUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch profile data from Firestore
                const docRef = doc(db, 'users', firebaseUser.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setUser({ ...firebaseUser, ...docSnap.data() });
                } else {
                    // Create default doc if missing
                    const defaultData = {
                        name: firebaseUser.displayName || 'Mars Şef',
                        saved: [], favorites: [], history: [], reviews: [],
                        preferences: { notifications: true, darkMode: false, language: 'tr' }
                    };
                    await setDoc(docRef, defaultData);
                    setUser({ ...firebaseUser, ...defaultData });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Apply dark mode whenever user changes
    useEffect(() => {
        if (user?.preferences?.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [user?.preferences?.darkMode]);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            return { success: false, message: 'Hatalı e-posta veya şifre!' };
        }
    };

    const register = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const fbUser = userCredential.user;
            await updateProfile(fbUser, { displayName: name || 'Mars Şef' });
            
            const defaultData = {
                name: name || 'Mars Şef',
                saved: [], favorites: [], history: [], reviews: [],
                preferences: { notifications: true, darkMode: false, language: 'tr' }
            };
            await setDoc(doc(db, 'users', fbUser.uid), defaultData);
            setUser({ ...fbUser, ...defaultData });
            
            return { success: true };
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                return { success: false, message: 'Bu e-posta zaten kullanımda.' };
            }
            if (error.code === 'auth/weak-password') {
                return { success: false, message: 'Şifre en az 6 karakter olmalıdır.' };
            }
            return { success: false, message: 'Kayıt olurken bir hata oluştu: ' + error.message };
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    const updateUserDoc = async (updates) => {
        if (!user || !user.uid) return;
        const newUserData = { ...user, ...updates };
        setUser(newUserData); // Optimistic UI update
        try {
            await updateDoc(doc(db, 'users', user.uid), updates);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    const toggleSave = (recipeId) => {
        if (!user) return;
        const list = user.saved || [];
        const isSaved = list.includes(recipeId);
        const newList = isSaved ? list.filter(id => id !== recipeId) : [...list, recipeId];
        updateUserDoc({ saved: newList });
    };

    const toggleFavorite = (recipeId) => {
        if (!user) return;
        const list = user.favorites || [];
        const isFav = list.includes(recipeId);
        const newList = isFav ? list.filter(id => id !== recipeId) : [...list, recipeId];
        updateUserDoc({ favorites: newList });
    };

    const addToHistory = (recipeId) => {
        if (!user) return;
        const newHistoryItem = { id: recipeId, date: new Date().toISOString() };
        const newHistory = [newHistoryItem, ...(user.history || [])];
        updateUserDoc({ history: newHistory });
    };

    const addReview = (recipeId, rating, comment) => {
        if (!user) return;
        const newReview = {
            id: Date.now(),
            recipeId,
            rating,
            comment,
            date: new Date().toISOString()
        };
        const newReviews = [newReview, ...(user.reviews || [])];
        updateUserDoc({ reviews: newReviews });
    };

    const updatePreferences = (updates) => {
        if (!user) return;
        const newPreferences = { ...user.preferences, ...updates };
        updateUserDoc({ preferences: newPreferences });
    };

    const updateEmail = async (newEmail) => {
        alert("E-posta değiştirme işlemi şu an için devre dışı.");
    };

    const updatePassword = async (newPassword) => {
        alert("Şifre güncelleme işlemi şu an için devre dışı.");
    };

    const deleteAccount = async () => {
        if (!user || !auth.currentUser) return { success: false, message: 'Kullanıcı bulunamadı.' };
        try {
            // Önce veritabanındaki kullanıcı belgesini siliyoruz
            await deleteDoc(doc(db, 'users', user.uid));
            // Sonra Auth sisteminden siliyoruz
            await deleteUser(auth.currentUser);
            // State'i temizliyoruz
            setUser(null);
            return { success: true };
        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                return { success: false, message: 'Güvenlik gereği hesabınızı silmeden önce lütfen çıkış yapıp tekrar giriş yapın.' };
            }
            return { success: false, message: 'Hesap silinirken bir hata oluştu: ' + error.message };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            toggleSave,
            toggleFavorite,
            addToHistory,
            addReview,
            updatePreferences,
            updateEmail,
            updatePassword,
            deleteAccount
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
