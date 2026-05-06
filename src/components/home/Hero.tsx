import { TrendingUp } from 'lucide-react';
import SearchBar from '../shared/SearchBar';

const QUICK_LINKS = ['Divan', 'Kafel', 'Kondisioner', 'Soyuducu', 'Perforator', 'Dizayner', 'Xalça'];

export default function Hero() {
  return (
    <section className="relative bg-[#1A1A1A] overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F2A900' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient accent */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#F2A900]/10 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#F2A900]/20 border border-[#F2A900]/30 rounded-full px-4 py-1.5 mb-6">
            <TrendingUp size={14} className="text-[#F2A900]" />
            <span className="text-[#F2A900] text-xs font-semibold tracking-wide">Azərbaycanın #1 Ev Marketplace-i</span>
          </div>

          <h1 className="text-white font-black text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-4">
            Eviniz üçün{' '}
            <span className="text-[#F2A900] relative">
              hər şey
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                <path d="M0 5 Q100 0 200 5" stroke="#F2A900" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
              </svg>
            </span>
            {' '}bir yerdə
          </h1>

          <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8">
            Mebel, tikinti materialları, santexnika, elektrik, məişət texnikası — minlərlə elan, etibarlı satıcılar.
          </p>

          {/* Search bar */}
          <SearchBar />

          {/* Quick links */}
          <div className="mt-5 flex items-center gap-2 flex-wrap">
            <span className="text-white/40 text-xs">Tez axtarılan:</span>
            {QUICK_LINKS.map(link => (
              <a
                key={link}
                href={`/search?q=${link}`}
                className="text-xs text-white/60 hover:text-[#F2A900] transition-colors border border-white/15 hover:border-[#F2A900]/40 px-3 py-1 rounded-full"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {[
              { value: '50,000+', label: 'Aktiv elan' },
              { value: '12,000+', label: 'Satıcı' },
              { value: '8 şəhər', label: 'Əhatə dairəsi' },
            ].map(stat => (
              <div key={stat.label} className="px-4 py-4 text-center">
                <p className="text-[#F2A900] font-black text-xl md:text-2xl">{stat.value}</p>
                <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
