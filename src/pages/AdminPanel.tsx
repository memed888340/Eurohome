import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import {
  collection, getDocs, deleteDoc, doc, getDoc,
  query, orderBy, Timestamp, updateDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import {
  LayoutDashboard, FileText, Users, LogOut,
  Trash2, CheckCircle, XCircle, Loader2,
  TrendingUp, ShieldCheck, Menu, X, Clock, Eye
} from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  price: number;
  city: string;
  categoryId: string;
  images?: string[];
  createdAt: Timestamp;
  phone?: string;
  status?: string;
  userId?: string;
}

interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt?: Timestamp;
}

type Tab = 'dashboard' | 'ads' | 'users';
type AdFilter = 'all' | 'pending' | 'active' | 'rejected';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:  { label: 'Yoxlamada',     color: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
  active:   { label: 'Aktiv',         color: 'bg-green-100 text-green-700 border border-green-200' },
  rejected: { label: 'Rədd edildi',   color: 'bg-red-100 text-red-700 border border-red-200' },
  expired:  { label: 'Müddəti bitib', color: 'bg-gray-100 text-gray-500 border border-gray-200' },
};

interface AdminPanelProps {
  onBack: () => void;
  onAdClick?: (adId: string) => void;
}

export default function AdminPanel({ onBack, onAdClick }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [adFilter, setAdFilter] = useState<AdFilter>('all');
  const [ads, setAds] = useState<Ad[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setChecking(false); return; }
      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(adminDoc.exists());
      } catch {
        setIsAdmin(false);
      }
      setChecking(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const adsSnap = await getDocs(query(collection(db, 'ads'), orderBy('createdAt', 'desc')));
        setAds(adsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Ad)));
        const usersSnap = await getDocs(collection(db, 'users'));
        setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() } as User)));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [isAdmin]);

  const updateAdStatus = async (e: React.MouseEvent, id: string, status: 'active' | 'rejected') => {
    e.stopPropagation();
    await updateDoc(doc(db, 'ads', id), { status });
    setAds(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteAd = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Bu elanı silmək istəyirsiniz?')) return;
    await deleteDoc(doc(db, 'ads', id));
    setAds(prev => prev.filter(a => a.id !== id));
  };

  const formatDate = (ts: Timestamp) => {
    if (!ts?.toDate) return '—';
    return ts.toDate().toLocaleDateString('az-AZ');
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <XCircle size={60} className="text-red-500" />
        <h2 className="text-2xl font-bold text-gray-800">İcazə yoxdur</h2>
        <p className="text-gray-500">Bu səhifəyə giriş yalnız adminlər üçündür.</p>
        <button onClick={onBack} className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold">
          Ana səhifəyə qayıt
        </button>
      </div>
    );
  }

  const filteredAds = adFilter === 'all' ? ads : ads.filter(a => a.status === adFilter);

  const counts = {
    all: ads.length,
    pending: ads.filter(a => a.status === 'pending').length,
    active: ads.filter(a => a.status === 'active').length,
    rejected: ads.filter(a => a.status === 'rejected').length,
  };

  const stats = [
    { label: 'Ümumi elan', value: ads.length, icon: FileText, color: 'bg-blue-50 text-blue-600' },
    { label: 'Yoxlamada', value: counts.pending, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'İstifadəçi', value: users.length, icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Bu ay', value: ads.filter(a => {
      if (!a.createdAt?.toDate) return false;
      const d = a.createdAt.toDate();
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length, icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
  ];

  const navItems: { id: Tab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ads', label: 'Elanlar', icon: FileText },
    { id: 'users', label: 'İstifadəçilər', icon: Users },
  ];

  const adFilters: { id: AdFilter; label: string }[] = [
    { id: 'all',      label: `Hamısı (${counts.all})` },
    { id: 'pending',  label: `Yoxlamada (${counts.pending})` },
    { id: 'active',   label: `Aktiv (${counts.active})` },
    { id: 'rejected', label: `Rədd edildi (${counts.rejected})` },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#1A1A1A] flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <span className="text-white font-bold text-lg">
            Euro<span className="text-[#F2A900]">home</span>
            <span className="text-[#F2A900] text-xs ml-1">Admin</span>
          </span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-[#F2A900] text-[#1A1A1A]'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {item.id === 'ads' && counts.pending > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {counts.pending}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <LogOut size={18} />
            Ana səhifəyə qayıt
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-4 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500">
              <Menu size={22} />
            </button>
            <h1 className="font-bold text-gray-900 text-lg">
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ShieldCheck size={16} className="text-green-500" />
            Admin
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">

          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                      <s.icon size={20} />
                    </div>
                    <div className="text-2xl font-black text-gray-900">{s.value}</div>
                    <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Yoxlamada olan elanlar */}
              {counts.pending > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <h2 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                    <Clock size={18} />
                    Yoxlama gözləyən elanlar ({counts.pending})
                  </h2>
                  <div className="space-y-3">
                    {ads.filter(a => a.status === 'pending').map(ad => (
                      <div
                        key={ad.id}
                        onClick={() => onAdClick?.(ad.id)}
                        className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <img
                          src={ad.images?.[0] || 'https://via.placeholder.com/48'}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          alt={ad.title}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{ad.title}</p>
                          <p className="text-xs text-gray-400">{ad.city} · {formatDate(ad.createdAt)}</p>
                        </div>
                        <span className="font-bold text-orange-500 whitespace-nowrap">{ad.price} AZN</span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => updateAdStatus(e, ad.id, 'active')}
                            className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            <CheckCircle size={14} />
                            Təsdiqlə
                          </button>
                          <button
                            onClick={(e) => updateAdStatus(e, ad.id, 'rejected')}
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            <XCircle size={14} />
                            Rədd et
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Son elanlar */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="font-bold text-gray-900 mb-4">Son elanlar</h2>
                <div className="space-y-3">
                  {ads.slice(0, 5).map(ad => {
                    const statusCfg = STATUS_CONFIG[ad.status || 'pending'];
                    return (
                      <div
                        key={ad.id}
                        onClick={() => onAdClick?.(ad.id)}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={ad.images?.[0] || 'https://via.placeholder.com/48'}
                          className="w-12 h-12 rounded-lg object-cover"
                          alt={ad.title}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">{ad.title}</p>
                          <p className="text-xs text-gray-400">{ad.city} · {formatDate(ad.createdAt)}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${statusCfg?.color}`}>
                          {statusCfg?.label}
                        </span>
                        <span className="text-sm font-bold text-orange-500 whitespace-nowrap">{ad.price} AZN</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ELANLAR */}
          {activeTab === 'ads' && (
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="font-bold text-gray-900 mb-4">Bütün elanlar</h2>
                <div className="flex gap-2 flex-wrap">
                  {adFilters.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setAdFilter(f.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        adFilter === f.id
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="animate-spin text-orange-500" size={32} />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Elan</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">Şəhər</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">Status</th>
                        <th className="px-4 py-3 text-right">Qiymət</th>
                        <th className="px-4 py-3 text-center">Əməliyyat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredAds.map(ad => {
                        const statusCfg = STATUS_CONFIG[ad.status || 'pending'];
                        return (
                          <tr
                            key={ad.id}
                            onClick={() => onAdClick?.(ad.id)}
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={ad.images?.[0] || 'https://via.placeholder.com/40'}
                                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                  alt={ad.title}
                                />
                                <div className="min-w-0">
                                  <p className="font-medium text-gray-900 truncate max-w-[180px]">{ad.title}</p>
                                  <p className="text-xs text-gray-400">#{ad.id.slice(-6).toUpperCase()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{ad.city}</td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${statusCfg?.color}`}>
                                {statusCfg?.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-orange-500">{ad.price} AZN</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={(e) => { e.stopPropagation(); onAdClick?.(ad.id); }}
                                  className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Bax / Redaktə et"
                                >
                                  <Eye size={16} />
                                </button>
                                {ad.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={(e) => updateAdStatus(e, ad.id, 'active')}
                                      className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                      title="Təsdiqlə"
                                    >
                                      <CheckCircle size={16} />
                                    </button>
                                    <button
                                      onClick={(e) => updateAdStatus(e, ad.id, 'rejected')}
                                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Rədd et"
                                    >
                                      <XCircle size={16} />
                                    </button>
                                  </>
                                )}
                                {ad.status === 'active' && (
                                  <button
                                    onClick={(e) => updateAdStatus(e, ad.id, 'rejected')}
                                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Ləğv et"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                )}
                                {ad.status === 'rejected' && (
                                  <button
                                    onClick={(e) => updateAdStatus(e, ad.id, 'active')}
                                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Aktivləşdir"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => deleteAd(e, ad.id)}
                                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Sil"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* İSTİFADƏÇİLƏR */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="font-bold text-gray-900">İstifadəçilər <span className="text-gray-400 font-normal">({users.length})</span></h2>
              </div>
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="animate-spin text-orange-500" size={32} />
                </div>
              ) : users.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <Users size={40} className="mx-auto mb-3 opacity-30" />
                  <p>İstifadəçi tapılmadı</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">İstifadəçi</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">Email</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">Qeydiyyat tarixi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                                {(user.displayName || user.email || '?')[0].toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900">{user.displayName || 'İsimsiz'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{user.email}</td>
                          <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{formatDate(user.createdAt as Timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}