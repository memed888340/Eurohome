import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { CATEGORIES } from '../../data';

export default function Footer() {
  const topCategories = CATEGORIES.slice(0, 4);

  return (
    <footer className="bg-[#1A1A1A] text-white mt-16">
      {/* CTA Banner */}
      <div className="bg-[#F2A900]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-[#1A1A1A] font-bold text-2xl">Satmaq istəyirsiniz?</h2>
            <p className="text-[#1A1A1A]/70 text-sm mt-1">Minlərlə alıcıya çatın — pulsuz elan verin!</p>
          </div>
          <a
            href="/post"
            className="bg-[#1A1A1A] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#333] transition-colors whitespace-nowrap"
          >
            İndi Elan Ver
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#F2A900] rounded-lg flex items-center justify-center">
              <span className="text-[#1A1A1A] font-black text-sm">EH</span>
            </div>
            <span className="text-white font-bold text-xl">
              Euro<span className="text-[#F2A900]">home</span>
              <span className="text-[#F2A900] text-xs align-super">.az</span>
            </span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mb-5">
            Azərbaycanda ev əşyaları, mebel, tikinti materialları və ustalar üçün №1 marketplace.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#F2A900] transition-colors">
              <Instagram size={17} />
            </a>
            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#F2A900] transition-colors">
              <Facebook size={17} />
            </a>
            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#F2A900] transition-colors">
              <Youtube size={17} />
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider text-white/50 mb-4">Kateqoriyalar</h3>
          <ul className="space-y-2.5">
            {topCategories.map(cat => (
              <li key={cat.id}>
                <a href={`/category/${cat.id}`} className="text-white/70 hover:text-[#F2A900] text-sm transition-colors">
                  {cat.name}
                </a>
              </li>
            ))}
            <li>
              <a href="/categories" className="text-[#F2A900] text-sm font-medium hover:underline">
                Hamısını gör →
              </a>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider text-white/50 mb-4">Sayt</h3>
          <ul className="space-y-2.5">
            {['Elan ver', 'Necə işləyir?', 'PRO hesab', 'Haqqımızda', 'Bloq', 'Əlaqə'].map(link => (
              <li key={link}>
                <a href="#" className="text-white/70 hover:text-[#F2A900] text-sm transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider text-white/50 mb-4">Əlaqə</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-white/70 text-sm">
              <MapPin size={16} className="text-[#F2A900] shrink-0 mt-0.5" />
              Bakı, Azərbaycan
            </li>
            <li className="flex items-center gap-3 text-white/70 text-sm">
              <Phone size={16} className="text-[#F2A900] shrink-0" />
              +994 12 555 00 00
            </li>
            <li className="flex items-center gap-3 text-white/70 text-sm">
              <Mail size={16} className="text-[#F2A900] shrink-0" />
              info@eurohome.az
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-xs">
          <p>© 2026 Eurohome.az — Bütün hüquqlar qorunur.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white/70 transition-colors">Məxfilik siyasəti</a>
            <a href="#" className="hover:text-white/70 transition-colors">İstifadə şərtləri</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
