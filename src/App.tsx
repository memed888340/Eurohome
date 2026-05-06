import { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import Hero from './components/home/Hero';
import CategoryGrid from './components/home/CategoryGrid';
import FeaturedAds from './components/home/FeaturedAds';
import AuthModal from './components/shared/AuthModal';
import CreateAd from './pages/CreateAd';
import AdDetails from './pages/AdDetails';

type PageState = 'home' | 'create-ad' | { type: 'details'; id: string };

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState<PageState>('home');
  const [user, setUser] = useState<any>(null); // Firebase auth əlavə edəndə buranı yeniləyəcəksən

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
  };

  const handleCreateAd = () => {
    if (!user) {
      openLogin(); // giriş etməyibsə login modalı aç
    } else {
      setCurrentPage('create-ad');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header 
        onMenuOpen={() => setMobileNavOpen(true)} 
        onLoginClick={openLogin}
        onCreateAdClick={handleCreateAd}
        onLogoClick={() => setCurrentPage('home')}
      />
      
      <MobileNav 
        isOpen={mobileNavOpen} 
        onClose={() => setMobileNavOpen(false)}
        onLoginClick={openLogin}
        onCreateAdClick={handleCreateAd}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <>
            <Hero />
            <CategoryGrid />
            <FeaturedAds onAdClick={(id) => setCurrentPage({ type: 'details', id })} />
          </>
        )}

        {currentPage === 'create-ad' && (
          <CreateAd onCancel={() => setCurrentPage('home')} />
        )}

        {typeof currentPage === 'object' && currentPage.type === 'details' && (
          <AdDetails 
            adId={currentPage.id} 
            onBack={() => setCurrentPage('home')} 
          />
        )}
      </main>

      <Footer />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        mode={authMode}
        setMode={setAuthMode}
      />
    </div>
  );
}

export default App;