import { Armchair, HardHat, Droplets, Zap, WashingMachine, Wrench, Users, Palette, Video as LucideIcon } from 'lucide-react';
import { CATEGORIES } from '../../data';

const ICON_MAP: Record<string, LucideIcon> = {
  Armchair,
  HardHat,
  Droplets,
  Zap,
  WashingMachine,
  Wrench,
  Users,
  Palette,
};

const BG_COLORS = [
  'bg-amber-50 hover:bg-[#F2A900]',
  'bg-stone-50 hover:bg-[#F2A900]',
  'bg-sky-50 hover:bg-[#F2A900]',
  'bg-yellow-50 hover:bg-[#F2A900]',
  'bg-blue-50 hover:bg-[#F2A900]',
  'bg-green-50 hover:bg-[#F2A900]',
  'bg-rose-50 hover:bg-[#F2A900]',
  'bg-purple-50 hover:bg-[#F2A900]',
];

const ICON_COLORS = [
  'text-amber-500',
  'text-stone-500',
  'text-sky-500',
  'text-yellow-500',
  'text-blue-500',
  'text-green-500',
  'text-rose-500',
  'text-purple-500',
];

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-7">
        <h2 className="text-[#1A1A1A] font-black text-2xl md:text-3xl">Kateqoriyalar</h2>
        <a href="/categories" className="text-[#F2A900] text-sm font-semibold hover:underline">
          Hamısı →
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORIES.map((cat, i) => {
          const Icon = ICON_MAP[cat.icon] ?? Armchair;
          return (
            <a
              key={cat.id}
              href={`/category/${cat.id}`}
              className={`group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-200 cursor-pointer ${BG_COLORS[i % BG_COLORS.length]} hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className={`transition-colors duration-200 group-hover:text-white ${ICON_COLORS[i % ICON_COLORS.length]}`}>
                <Icon size={28} strokeWidth={1.8} />
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-white text-center leading-tight transition-colors duration-200">
                {cat.name}
              </span>
              <span className="text-xs text-gray-400 group-hover:text-white/70 transition-colors duration-200">
                {cat.subcategories.length} alt
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
