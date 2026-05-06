import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import Hero from './components/home/Hero';
import CategoryGrid from './components/home/CategoryGrid';
import FeaturedAds from './components/home/FeaturedAds';
import AuthModal from './components/shared/AuthModal';
import CreateAd from './pages/CreateAd';
import AdDetails from './pages/AdDetails';
import AdminPanel from './pages/AdminPanel';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

type PageState = 'home' | 'create-ad' | 'admin' | { type: 'details'; id: string };

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState<PageState>('home');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Firebase Auth dinləyicisi — səhifə yenilənsə belə user qalır
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
        setIsAdmin(adminDoc.exists());
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
  };

  const handleCreateAd = () => {
    if (!user) {
      openLogin();
    } else {
      setCurrentPage('create-ad');
    }
  };

  const handleAuthSuccess = (loggedInUser: any, adminStatus: boolean) => {
    setUser(loggedInUser);
    setIsAdmin(adminStatus);
    if (adminStatus) {
      setCurrentPage('admin');
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setIsAdmin(false);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        onMenuOpen={() => setMobileNavOpen(true)}
        onLoginClick={openLogin}
        onCreateAdClick={handleCreateAd}
        onLogoClick={() => setCurrentPage('home')}
        user={user}
        isAdmin={isAdmin}
        onAdminClick={() => setCurrentPage('admin')}
        onSignOut={handleSignOut}
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

        {currentPage === 'admin' && (
          <AdminPanel onBack={() => setCurrentPage('home')} />
        )}

        {typeof currentPage === 'object' && currentPage.type === 'details' && (
          <AdDetails
            adId={currentPage.id}
            onBack={() => setCurrentPage('home')}
          />
        )}
      </main>

      {currentPage === 'home' && <Footer />}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;