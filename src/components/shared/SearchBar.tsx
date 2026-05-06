import { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { CITIES } from '../../data';
import Button from './Button';

interface SearchBarProps {
  compact?: boolean;
}

export default function SearchBar({ compact = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cityOpen, setCityOpen] = useState(false);

  const selectedCityName = CITIES.find(c => c.id === selectedCity)?.name ?? 'Bütün şəhərlər';

  return (
    <div className={clsx(
      'flex items-stretch bg-white rounded-xl shadow-lg overflow-visible',
      compact ? 'h-12' : 'h-14 md:h-16'
    )}>
      {/* Search input */}
      <div className="flex-1 flex items-center px-4 gap-3 min-w-0">
        <Search className="text-gray-400 shrink-0" size={compact ? 16 : 20} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Nə axtarırsınız?"
          className="flex-1 min-w-0 bg-transparent text-[#1A1A1A] placeholder-gray-400 outline-none text-sm md:text-base"
        />
      </div>

      {/* Divider */}
      <div className="w-px bg-gray-200 self-stretch my-2 shrink-0 hidden md:block" />

      {/* City selector */}
      <div className="relative hidden md:flex items-center">
        <button
          onClick={() => setCityOpen(v => !v)}
          className="flex items-center gap-2 px-4 text-sm text-gray-600 hover:text-[#F2A900] transition-colors whitespace-nowrap h-full"
        >
          <MapPin size={16} className="text-[#F2A900]" />
          {selectedCityName}
          <ChevronDown size={14} className={`transition-transform duration-200 ${cityOpen ? 'rotate-180' : ''}`} />
        </button>
        {cityOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1">
            <button
              onClick={() => { setSelectedCity(''); setCityOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-[#F2A900] transition-colors"
            >
              Bütün şəhərlər
            </button>
            {CITIES.map(city => (
              <button
                key={city.id}
                onClick={() => { setSelectedCity(city.id); setCityOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-[#F2A900] transition-colors"
              >
                {city.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search button */}
      <div className="p-1.5 md:p-2 shrink-0">
        <Button size={compact ? 'sm' : 'md'} className="h-full px-4 md:px-6 rounded-lg">
          Axtar
        </Button>
      </div>
    </div>
  );
}

function clsx(...args: (string | Record<string, boolean>)[]): string {
  return args
    .flatMap(arg =>
      typeof arg === 'string'
        ? arg
        : Object.entries(arg)
            .filter(([, v]) => v)
            .map(([k]) => k)
    )
    .join(' ');
}
