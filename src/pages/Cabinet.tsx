import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import {
  collection, query, where, getDocs, orderBy, Timestamp
} from 'firebase/firestore';
import {
  User, Clock, CheckCircle, XCircle, AlertCircle,
  ChevronLeft, Package, Eye
} from 'lucide-react';

interface CabinetProps {
  user: any;
  onBack: () => void;
}

type FilterType = 'all' | 'pending' | 'active' | 'rejected' | 'expired';

const STATUS_CONFIG = {
  pending: {
    label: 'Yoxlamada',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock,
  },
  active: {
    label: 'Təsdiqlənmiş',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Ləğv edildi',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
  },
  expired: {
    label: 'Müddəti bitib',
    color: 'bg-gray-100 text-gray-500 border-gray-200',
    icon: AlertCircle,
  },
};

export default function Cabinet({ user, onBack }: CabinetProps) {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    if (!user) return;
    const fetchAds = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'ads'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setAds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchAds();
  }, [user]);

  const filteredAds = filter === 'all' ? ads : ads.filter(a => a.status === filter);

  const counts = {
    all: ads.length,
    pending: ads.filter(a => a.status === 'pending').length,
    active: ads.filter(a => a.status === 'active').length,
    rejected: ads.filter(a => a.status === 'rejected').length,
    expired: ads.filter(a => a.status === 'expired').length,
  };

  const formatDate = (ts: any) => {
    if (!ts?.toDate) return '—';
    return ts.toDate().toLocaleDateString('az-AZ');
  };

  const filters: { id: FilterType; label: string; activeColor: string }[] = [
    { id: 'all',      label: 'Hamısı',       activeColor: 'bg-gray-900 text-white' },
    { id: 'pending',  label: 'Yoxlamada',    activeColor: 'bg-yellow-500 text-white' },
    { id: 'active',   label: 'Aktiv',        activeColor: 'bg-green-500 text-white' },
    { id: 'rejected', label: 'Ləğv edildi',  activeColor: 'bg-red-500 text-white' },
    { id: 'expired',  label: 'Müddəti bitib',activeColor: 'bg-gray-400 text-white' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="bg-white border-b sticky top-[64px] z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-500 hover:text-black transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">Şəxsi Kabinet</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* Profil kartı */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-5">
          <div className="w-16 h-16 bg-[#F2A900] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-200">
            {(user?.displayName || user?.email || '?')[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              {user?.displayName || 'İstifadəçi'}
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <User size={13} className="text-[#F2A900]" />
              <span className="text-xs text-gray-400">Standart hesab</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-gray-900">{counts.all}</div>
            <div className="text-xs text-gray-400">Ümumi elan</div>
          </div>
        </div>

        {/* Statistika kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Yoxlamada',    count: counts.pending,  icon: Clock,         color: 'text-yellow-500', bg: 'bg-yellow-50' },
            { label: 'Aktiv',        count: counts.active,   icon: CheckCircle,   color: 'text-green-500',  bg: 'bg-green-50'  },
            { label: 'Ləğv edildi',  count: counts.rejected, icon: XCircle,       color: 'text-red-500',    bg: 'bg-red-50'    },
            { label: 'Müddəti bitib',count: counts.expired,  icon: AlertCircle,   color: 'text-gray-400',   bg: 'bg-gray-50'   },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border">
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon size={18} className={s.color} />
              </div>
              <div className="text-2xl font-black text-gray-900">{s.count}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Elanlar */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-5 border-b">
            <h3 className="font-bold text-gray-900 mb-4">Elanlarım</h3>
            <div className="flex gap-2 flex-wrap">
              {filters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === f.id
                      ? f.activeColor
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                  <span className="ml-1.5 opacity-75">({counts[f.id]})</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Yüklənir...
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Package size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">Elan tapılmadı</p>
              <p className="text-sm mt-1">Bu kateqoriyada elanınız yoxdur</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredAds.map(ad => {
                const statusCfg = STATUS_CONFIG[ad.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                const StatusIcon = statusCfg.icon;
                return (
                  <div key={ad.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <img
                      src={ad.images?.[0] || 'https://via.placeholder.com/60'}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border"
                      alt={ad.title}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{ad.title}</p>
                      <p className="text-sm text-gray-400 mt-0.5">{ad.city} · {formatDate(ad.createdAt)}</p>
                      <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg border text-xs font-semibold ${statusCfg.color}`}>
                        <StatusIcon size={12} />
                        {statusCfg.label}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-gray-900">{ad.price} AZN</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1 justify-end">
                        <Eye size={12} />
                        {ad.views || 0}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}