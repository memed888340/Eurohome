import { Heart, Eye, MapPin, Zap } from 'lucide-react';
import { useState } from 'react';

interface AdCardProps {
  ad: any;
  onClick?: () => void; // Klik hadisəsini əlavə etdik
}

export default function AdCard({ ad, onClick }: AdCardProps) {
  const [liked, setLiked] = useState(false);

  const formattedPrice = new Intl.NumberFormat('az-AZ').format(ad.price || 0);
  const displayImage = ad.images && ad.images.length > 0 ? ad.images[0] : ad.image;

  return (
    <article 
      onClick={onClick} 
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-[#F2A900]/30 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={displayImage || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {ad.isFeatured && (
            <span className="bg-[#F2A900] text-white text-xs font-bold px-2.5 py-1 rounded-full">
              VIP
            </span>
          )}
          {ad.isUrgent && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Zap size={10} />
              Təcili
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={e => { 
            e.stopPropagation(); // Karta klikləməni dayandırır ki, səhifə dəyişməsin
            setLiked(v => !v); 
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
          aria-label="Sevimlilərə əlavə et"
        >
          <Heart
            size={15}
            className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>

        {/* Pro seller badge */}
        {ad.seller?.isPro && (
          <div className="absolute bottom-3 left-3 bg-[#1A1A1A]/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
            PRO
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-[#1A1A1A] font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#F2A900] transition-colors duration-200">
          {ad.title}
        </h3>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[#F2A900] font-bold text-lg leading-none">
            {formattedPrice} <span className="text-sm font-semibold">{ad.currency || "AZN"}</span>
          </span>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Eye size={12} />
            {ad.views || 0}
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-1 text-gray-500 text-xs">
          <MapPin size={12} className="text-[#F2A900] shrink-0" />
          <span className="truncate">{ad.city}</span>
          <span className="mx-1 text-gray-300">·</span>
          <span className="truncate">{ad.seller?.name || "İstifadəçi"}</span>
        </div>
      </div>
    </article>
  );
}