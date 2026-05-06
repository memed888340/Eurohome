import { useState } from 'react';
import { Menu, Bell, Heart, User, Plus, ChevronDown, Search } from 'lucide-react';
import { CATEGORIES } from '../../data';
import Button from '../shared/Button';

interface HeaderProps {
  onMenuOpen: () => void;
  onLoginClick: () => void;
  onLogoClick: () => void;
  onCreateAdClick: () => void;
}

export default function Header({ 
  onMenuOpen, 
  onLoginClick, 
  onLogoClick, 
  onCreateAdClick 
}: HeaderProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <header className="bg-[#1A1A1A] sticky top-0 z-40 shadow-lg">
      {/* Top bar */}
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

            <button 
              onClick={onLogoClick} 
              className="flex items-center gap-2 group"
            >
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
            
            <button 
              onClick={onLoginClick}
              className="hidden md:flex items-center gap-2 text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10 text-sm"
            >
              <User size={16} />
              Daxil ol
            </button>

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

                {/* Dropdown Menyusu */}
                {activeCategory === cat.id && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    {/* Görünməz körpü qatı (mausun itməməsi üçün) */}
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