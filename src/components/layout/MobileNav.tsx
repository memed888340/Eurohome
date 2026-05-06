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
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[340px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="bg-[#1A1A1A] px-5 py-4 flex items-center justify-between shrink-0">
          <span className="text-white font-bold text-lg">
            Euro<span className="text-[#F2A900]">home</span>
            <span className="text-[#F2A900] text-xs align-super">.az</span>
          </span>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1">
            <X size={22} />
          </button>
        </div>

        {/* Action buttons */}
        <div className="px-4 py-3 border-b border-gray-100 shrink-0">
          <Button fullWidth className="mb-2">
            <Plus size={16} />
            Elan ver
          </Button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
            <User size={18} className="text-[#F2A900]" />
            Daxil ol / Qeydiyyat
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {!activeCategory ? (
            <div>
              <p className="px-5 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Kateqoriyalar</p>
              <ul>
                {CATEGORIES.map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-orange-50 transition-colors text-left group"
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

              <div className="px-5 mt-2 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Şəhərlər</p>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map(city => (
                    <button
                      key={city.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-orange-100 hover:text-[#F2A900] transition-colors"
                    >
                      <MapPin size={11} />
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-5 py-4 mt-2 border-t border-gray-100 flex gap-4">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#F2A900] transition-colors">
                  <Bell size={18} /> Bildirişlər
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#F2A900] transition-colors">
                  <Heart size={18} /> Sevimlilər
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-2 px-5 py-4 text-sm text-gray-600 hover:text-[#F2A900] transition-colors w-full border-b border-gray-100"
              >
                <ChevronLeft size={18} />
                Geri
              </button>
              <p className="px-5 pt-3 pb-2 text-base font-bold text-[#1A1A1A]">{activeCategory.name}</p>
              <ul>
                {activeCategory.subcategories.map(sub => (
                  <li key={sub.id}>
                    <a
                      href={`/category/${activeCategory.id}/${sub.id}`}
                      className="block px-5 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#F2A900] transition-colors border-b border-gray-50"
                      onClick={onClose}
                    >
                      {sub.name}
                    </a>
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
