import { useState } from 'react';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../../data';
import AdCard from '../shared/AdCard';
import Button from '../shared/Button';
import { useAds } from '../../hooks/useAds';

const FILTERS = ['Hamısı', ...CATEGORIES.slice(0, 5).map(c => c.name)];

interface FeaturedAdsProps {
  onAdClick: (id: string) => void;
}

export default function FeaturedAds({ onAdClick }: FeaturedAdsProps) {
  const [activeFilter, setActiveFilter] = useState('Hamısı');
  const { ads, loading } = useAds(); 

  // Filterləmə məntiqi
  const filteredAds = activeFilter === 'Hamısı'
    ? ads
    : ads.filter(ad => {
        const cat = CATEGORIES.find(c => c.name === activeFilter);
        return cat ? ad.categoryId === cat.id : true;
      });

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#1A1A1A] font-black text-2xl md:text-3xl">Son Elanlar</h2>
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#F2A900] transition-colors border border-gray-200 rounded-lg px-3 py-2 hover:border-[#F2A900]/50">
            <SlidersHorizontal size={15} />
            Filterlər
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-7 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeFilter === filter
                  ? 'bg-[#F2A900] text-white shadow-md shadow-[#F2A900]/30'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#F2A900]/50 hover:text-[#F2A900]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid & Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Elanlar yüklənir...</p>
          </div>
        ) : filteredAds.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredAds.map(ad => (
              <AdCard 
                key={ad.id} 
                onClick={() => onAdClick(ad.id)}
                ad={{
                  ...ad,
                  image: ad.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image' 
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-lg font-medium">Bu kateqoriyada elan tapılmadı.</p>
          </div>
        )}

        {/* Load more */}
        {!loading && filteredAds.length > 0 && (
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg">
              Daha çox elan yüklə
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}