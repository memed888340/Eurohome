import { useState } from 'react';
import { Menu, Bell, Heart, User, Plus, ChevronDown, Search, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { CATEGORIES } from '../../data';
import Button from '../shared/Button';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

interface HeaderProps {
  onMenuOpen: () => void;
  onLoginClick: () => void;
  onLogoClick: () => void;
  onCreateAdClick: () => void;
  onAdminClick?: () => void;
  onCabinetClick?: () => void;
  onSignOut?: () => void;
  user?: any;
  isAdmin?: boolean;
}

export default function Header({
  onMenuOpen,
  onLoginClick,
  onLogoClick,
  onCreateAdClick,
  onAdminClick,
  onCabinetClick,
  onSignOut,
  user,
  isAdmin,
}: HeaderProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    setUserMenuOpen(false);
    onSignOut?.();
  };

  return (
    <header className="bg-[#1A1A1A] sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuOpen}
              className="lg:hidden text-white/70 hover:text-white transition-colors p-1"
              aria-label="Menyu"
            >
              <Menu size={22} />
            </button>

            <button onClick={onLogoClick} className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#F2A900] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-[#1A1A1A] font-black text-sm">EH</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Euro<span className="text-[#F2A900]">home</span>
                <span className="text-[#F2A900] text-xs align-super">.az</span>
              </span>
            </button>
          </div>

          {/* Desktop search */}
          <div className="hidden lg:flex flex-1 mx-8 max-w-xl">
            <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 gap-3 h-10 w-full focus-within:bg-white/15 focus-within:border-[#F2A900]/50 transition-all">
              <Search size={16} className="text-white/50" />
              <input
                type="text"
                placeholder="Nə axtarırsınız?"
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="hidden md:flex items-center justify-center w-9 h-9 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10">
              <Bell size={20} />
            </button>
            <button className="hidden md:flex items-center justify-center w-9 h-9 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10">
              <Heart size={20} />
            </button>

            {/* Giriş etməyib */}
            {!user && (
              <button
                onClick={onLoginClick}
                className="hidden md:flex items-center gap-2 text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10 text-sm"
              >
                <User size={16} />
                Daxil ol
              </button>
            )}

            {/* Giriş edib — hesab menyusu */}
            {user && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-7 h-7 bg-[#F2A900] rounded-full flex items-center justify-center text-[#1A1A1A] font-bold text-xs">
                    {(user.displayName || user.email || '?')[0].toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-medium max-w-[100px] truncate">
                    {user.displayName || user.email}
                  </span>
                  <ChevronDown size={14} className={`text-white/60 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                      
                      {/* Hesab info */}
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="text-xs text-gray-400">Hesab</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                      </div>

                      {/* Kabinetim */}
                      <button
                        onClick={() => { setUserMenuOpen(false); onCabinetClick?.(); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User size={15} className="text-gray-400" />
                        Kabinetim
                      </button>

                      {/* Admin Panel — yalnız admin görür */}
                      {isAdmin && (
                        <button
                          onClick={() => { setUserMenuOpen(false); onAdminClick?.(); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          <LayoutDashboard size={15} />
                          Admin Panel
                        </button>
                      )}

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={15} />
                          Çıxış
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <Button
              onClick={onCreateAdClick}
              size="sm"
              className="hidden md:flex items-center gap-1.5"
            >
              <Plus size={15} />
              Elan ver
            </Button>
          </div>
        </div>
      </div>

      {/* Category nav — desktop */}
      <nav className="hidden lg:block bg-[#111] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-1 h-11">
            {CATEGORIES.map(cat => (
              <li
                key={cat.id}
                className="relative group h-full flex items-center"
                onMouseEnter={() => setActiveCategory(cat.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-white/70 hover:text-[#F2A900] text-sm font-medium transition-colors rounded-lg hover:bg-white/5 whitespace-nowrap">
                  {cat.name}
                  <ChevronDown size={13} className={`transition-transform duration-200 ${activeCategory === cat.id ? 'rotate-180' : ''}`} />
                </button>

                {activeCategory === cat.id && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="absolute top-0 left-0 w-full h-2 bg-transparent" />
                    <div className="w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-150">
                      {cat.subcategories.map(sub => (
                        <button
                          key={sub.id}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#F2A900] transition-colors"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}