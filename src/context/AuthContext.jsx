import React, { createContext, useContext, useState, useEffect } from 'react';
import { recipes } from '../data/recipes';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // User state now comprises profile info AND activity data
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            // MERGE with defaults to prevent crashes if old data exists
            return {
                reviews: [],
                history: [],
                favorites: [],
                saved: [],
                ...parsed,
                // Ensure nested preferences are also merged if they exist partially
                preferences: {
                    notifications: true,
                    darkMode: false,
                    language: 'tr',
                    ...(parsed.preferences || {})
                }
            };
        }
        return null;
    });

    // Persist user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = (email, name) => {
        const fauxUser = {
            email,
            name: name || "Mars Şef",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            // Initialize empty lists if new user
            saved: [],
            favorites: [],
            history: [],
            reviews: []
        };
        setUser(fauxUser);
    };

    const logout = () => {
        setUser(null);
    };

    // --- Action Methods ---

    const toggleSave = (recipeId) => {
        if (!user) return;
        setUser(prev => {
            const list = prev.saved || [];
            const isSaved = list.includes(recipeId);
            return {
                ...prev,
                saved: isSaved
                    ? list.filter(id => id !== recipeId)
                    : [...list, recipeId]
            };
        });
    };

    const toggleFavorite = (recipeId) => {
        if (!user) return;
        setUser(prev => {
            const list = prev.favorites || [];
            const isFav = list.includes(recipeId);
            return {
                ...prev,
                favorites: isFav
                    ? list.filter(id => id !== recipeId)
                    : [...list, recipeId]
            };
        });
    };

    const addToHistory = (recipeId) => {
        if (!user) return;
        setUser(prev => {
            // Avoid duplicates for same day? For now just push to top
            const newHistoryItem = { id: recipeId, date: new Date().toISOString() };
            return {
                ...prev,
                history: [newHistoryItem, ...(prev.history || [])]
            };
        });
    };

    const addReview = (recipeId, rating, comment) => {
        if (!user) return;
        setUser(prev => {
            const newReview = {
                id: Date.now(),
                recipeId,
                rating,
                comment,
                date: new Date().toISOString()
            };
            return {
                ...prev,
                reviews: [newReview, ...(prev.reviews || [])]
            };
        });
    };

    // --- Preferences Logic ---
    const updatePreferences = (updates) => {
        if (!user) return;
        setUser(prev => ({
            ...prev,
            preferences: { ...prev.preferences, ...updates }
        }));
    };

    // Apply dark mode whenever user changes
    useEffect(() => {
        if (user?.preferences?.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [user?.preferences?.darkMode]);

    const updateEmail = (newEmail) => {
        if (!user) return;
        setUser(prev => ({ ...prev, email: newEmail }));
    };

    const updatePassword = (newPassword) => {
        // In a real app, this would make an API call.
        // Here we just log it or maybe update a fake field.
        console.log("Password updated to", newPassword);
        alert("Şifreniz başarıyla güncellendi.");
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            toggleSave,
            toggleFavorite,
            addToHistory,
            addReview,
            updatePreferences,
            updateEmail,
            updatePassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};
