import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Plus, User, LogOut, LayoutDashboard, Briefcase } from 'lucide-react';
import { CATEGORIES } from '../../data';
import { Category } from '../../types';
import Button from '../shared/Button';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onCreateAdClick: () => void;
  user?: any;
  isAdmin?: boolean;
  onAdminClick?: () => void;
  onCabinetClick?: () => void;
  onSignOut?: () => void;
}

export default function MobileNav({
  isOpen,
  onClose,
  onLoginClick,
  onCreateAdClick,
  user,
  isAdmin,
  onAdminClick,
  onCabinetClick,
  onSignOut,
}: MobileNavProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setActiveCategory(null);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleAction = (fn: () => void) => {
    onClose();
    setTimeout(fn, 50);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    onClose();
    onSignOut?.();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[340px] bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-[#1A1A1A] px-5 py-4 flex items-center justify-between shrink-0">
          <span className="text-white font-bold text-lg">
            Euro<span className="text-[#F2A900]">home</span>
            <span className="text-[#F2A900] text-xs align-super">.az</span>
          </span>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-2">
            <X size={24} />
          </button>
        </div>

        {/* İstifadəçi profil bloku — giriş edibsə */}
        {user && (
          <div className="px-4 py-3 border-b border-gray-100 shrink-0 bg-orange-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F2A900] rounded-full flex items-center justify-center text-white font-black text-base">
                {(user.displayName || user.email || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">
                  {user.displayName || 'İstifadəçi'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="px-4 py-3 border-b border-gray-100 shrink-0">
          <Button
            fullWidth
            className="mb-2 !py-3"
            onClick={() => handleAction(onCreateAdClick)}
          >
            <Plus size={18} />
            Elan ver
          </Button>

          {/* Giriş etməyib */}
          {!user && (
            <button
              onClick={() => handleAction(onLoginClick)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 active:bg-gray-100 transition-colors text-sm font-bold border border-gray-100 touch-manipulation"
            >
              <User size={20} className="text-[#F2A900]" />
              Daxil ol / Qeydiyyat
            </button>
          )}

          {/* Giriş edibsə */}
          {user && (
            <div className="space-y-1">
              <button
                onClick={() => handleAction(() => onCabinetClick?.())}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 active:bg-gray-100 transition-colors text-sm font-bold border border-gray-100 touch-manipulation"
              >
                <Briefcase size={20} className="text-[#F2A900]" />
                Kabinetim
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleAction(() => onAdminClick?.())}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-purple-600 active:bg-purple-50 transition-colors text-sm font-bold border border-purple-100 touch-manipulation"
                >
                  <LayoutDashboard size={20} className="text-purple-500" />
                  Admin Panel
                </button>
              )}

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-500 active:bg-red-50 transition-colors text-sm font-bold border border-red-100 touch-manipulation"
              >
                <LogOut size={20} className="text-red-400" />
                Çıxış
              </button>
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {!activeCategory ? (
            <div className="pb-8">
              <p className="px-5 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Kateqoriyalar</p>
              <ul>
                {CATEGORIES.map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-orange-50 active:bg-orange-100 transition-colors text-left touch-manipulation border-b border-gray-50"
                    >
                      <span className="text-gray-800 font-medium text-sm">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{cat.subcategories.length}</span>
                        <ChevronRight size={18} className="text-gray-400" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-2 px-5 py-4 text-sm font-bold text-gray-600 active:bg-gray-50 transition-colors w-full border-b border-gray-100"
              >
                <ChevronLeft size={20} />
                Geri
              </button>
              <p className="px-5 pt-4 pb-2 text-base font-bold text-[#1A1A1A] bg-gray-50">{activeCategory.name}</p>
              <ul>
                {activeCategory.subcategories.map(sub => (
                  <li key={sub.id}>
                    <button
                      className="w-full text-left px-10 py-4 text-sm text-gray-700 active:bg-orange-50 border-b border-gray-50 touch-manipulation"
                      onClick={() => handleAction(() => {})}
                    >
                      {sub.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}