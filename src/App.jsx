import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ShoppingListProvider } from './context/ShoppingListContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Explore from './pages/Explore';
import RecipeDetail from './pages/RecipeDetail';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import { SavedRecipes, Favorites, CookingHistory, MyReviews } from './pages/UserPages';
import { Privacy, Terms, About } from './pages/InfoPages';
import CookingMode from './pages/CookingMode';
import SplashScreen from './components/SplashScreen';
import ShoppingList from './pages/ShoppingList';
import Onboarding from './pages/Onboarding';
import MockInterstitial from './components/MockInterstitial';
import { AnimatePresence } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
// Wrapper for scrolling to top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenOnboarding');
    // Kullanıcı ilk defa giriyorsa ve onboarding sayfasında değilse yönlendir
    if (!hasSeen && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
    }

    // Reklam Sayacı Mantığı (Her 10 tarif görüntülemesinde 1 reklam)
    if (location.pathname.startsWith('/recipe/')) {
        let clicks = parseInt(localStorage.getItem('ad_click_count') || '0');
        clicks += 1;
        
        if (clicks >= 10) {
            if (Capacitor.isNativePlatform()) {
                const showRealAd = async () => {
                    try {
                        const { AdMob } = await import('@capacitor-community/admob');
                        await AdMob.prepareInterstitial({
                            adId: 'ca-app-pub-3940256099942544/1033173712', // Google Interstitial Test ID
                        });
                        await AdMob.showInterstitial();
                    } catch (e) {
                        console.error('AdMob Interstitial Error:', e);
                    }
                };
                showRealAd();
            } else {
                setShowAd(true); // Web (Mock)
            }
            clicks = 0; // Sıfırla
        }
        localStorage.setItem('ad_click_count', clicks.toString());
    }
  }, [navigate, location.pathname]);

  return (
    <>
      <ScrollToTop />
      <MockInterstitial isOpen={showAd} onClose={() => setShowAd(false)} />
      <div style={{ paddingBottom: '70px' }}> {/* Bottom Nav Spacer */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/saved" element={<SavedRecipes />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/history" element={<CookingHistory />} />
            <Route path="/reviews" element={<MyReviews />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/about" element={<About />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/cook/:id" element={<CookingMode />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
          </Routes>
        </AnimatePresence>
      </div>
      <ConditionalBottomNav />
    </>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = React.useState(true);

  // Theme and AdMob Initialization
  useEffect(() => {
    const initAdMob = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const { AdMob } = await import('@capacitor-community/admob');
          await AdMob.initialize({
            requestTrackingAuthorization: true,
          });
          console.log('AdMob initialized successfully');
        } catch (e) {
          console.error('AdMob initialization error:', e);
        }
      }
    };
    initAdMob();

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <ShoppingListProvider>
        <AnimatePresence>
          {showSplash && <SplashScreen key="splash" />}
        </AnimatePresence>
        <Router>
          <AppContent />
        </Router>
      </ShoppingListProvider>
    </AuthProvider>
  );
};

const ConditionalBottomNav = () => {
  const location = useLocation();
  // Detail, Auth, Cooking Mode, Shopping List ve Onboarding sayfalarında bottom nav gizlensin
  if (location.pathname.includes('/recipe/') || location.pathname.includes('/cook/') || location.pathname === '/auth' || location.pathname === '/shopping-list' || location.pathname === '/onboarding') return null;

  return <BottomNav />;
};

export default App;
