import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Plus, User, Heart, Bell, MapPin } from 'lucide-react';
import { CATEGORIES, CITIES } from '../../data';
import { Category } from '../../types';
import Button from '../shared/Button';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
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

  return (
    <>
      {/* Backdrop - Z-indexi 40-a endirdik ki, menyunun (50) altında qalsın */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer - Z-index 50-də qaldı, hər zaman kölgədən üstün olacaq */}
      <aside
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[340px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-[#1A1A1A] px-5 py-4 flex items-center justify-between shrink-0">
          <span className="text-white font-bold text-lg">
            Euro<span className="text-[#F2A900]">home</span>
            <span className="text-[#F2A900] text-xs align-super">.az</span>
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* Action buttons - onClick hadisələri əlavə edildi */}
        <div className="px-4 py-3 border-b border-gray-100 shrink-0">
          <Button 
            fullWidth 
            className="mb-2" 
            onClick={(e) => { e.stopPropagation(); console.log("Elan ver tıklandı"); }}
          >
            <Plus size={16} />
            Elan ver
          </Button>
          <button 
            onClick={(e) => { e.stopPropagation(); console.log("Giriş tıklandı"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm font-medium touch-manipulation"
          >
            <User size={18} className="text-[#F2A900]" />
            Daxil ol / Qeydiyyat
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {!activeCategory ? (
            <div>
              <p className="px-5 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Kateqoriyalar</p>
              <ul>
                {CATEGORIES.map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveCategory(cat); }}
                      className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-orange-50 active:bg-orange-100 transition-colors text-left group touch-manipulation"
                    >
                      <span className="text-gray-800 font-medium text-sm group-hover:text-[#F2A900] transition-colors">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{cat.subcategories.length}</span>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-[#F2A900] transition-colors" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              {/* ... digər hissələr eynidir */}
            </div>
          ) : (
            <div>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveCategory(null); }}
                className="flex items-center gap-2 px-5 py-4 text-sm text-gray-600 hover:text-[#F2A900] transition-colors w-full border-b border-gray-100 touch-manipulation"
              >
                <ChevronLeft size={18} />
                Geri
              </button>
              {/* ... subcategories listi */}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}