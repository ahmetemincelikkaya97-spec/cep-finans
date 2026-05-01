import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import { AnimatePresence } from 'framer-motion';

// Wrapper for scrolling to top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App = () => {
  const [showSplash, setShowSplash] = React.useState(true);

  // Theme Initialization
  useEffect(() => {
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
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>
      <Router>
        <ScrollToTop />
        <div style={{ paddingBottom: '70px' }}> {/* Bottom Nav Spacer */}
          <Routes>
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
          </Routes>
        </div>

        <ConditionalBottomNav />
      </Router>
    </AuthProvider>
  );
};

const ConditionalBottomNav = () => {
  const location = useLocation();
  // Detail, Auth ve Cooking Mode sayfalarında bottom nav gizlensin
  if (location.pathname.includes('/recipe/') || location.pathname.includes('/cook/') || location.pathname === '/auth') return null;

  return <BottomNav />;
};

export default App;
