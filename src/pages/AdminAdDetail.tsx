import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import {
  ChevronLeft, Save, Loader2, CheckCircle,
  XCircle, MapPin, Phone, Tag, Image, FileText
} from 'lucide-react';
import { CATEGORIES } from '../data';

interface AdminAdDetailProps {
  adId: string;
  onBack: () => void;
}

export default function AdminAdDetail({ adId, onBack }: AdminAdDetailProps) {
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Redaktə sahələri
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');

  useEffect(() => {
    const fetchAd = async () => {
      setLoading(true);
      const snap = await getDoc(doc(db, 'ads', adId));
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        setAd(data);
        setTitle(data.title || '');
        setPrice(String(data.price || ''));
        setDescription(data.description || '');
        setCity(data.city || '');
        setPhone(data.phone || '');
        setStatus(data.status || 'pending');
        setCategoryId(data.categoryId || '');
        setSubCategoryId(data.subCategoryId || data.subCategoryId || '');
      }
      setLoading(false);
    };
    fetchAd();
  }, [adId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'ads', adId), {
        title,
        price: Number(price),
        description,
        city,
        phone,
        status,
        categoryId,
        subCategoryId,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
      alert('Xəta baş verdi!');
    }
    setSaving(false);
  };

  const formatDate = (ts: any) => {
    if (!ts?.toDate) return '—';
    return ts.toDate().toLocaleDateString('az-AZ', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const activeCategoryData = CATEGORIES.find(c => c.id === categoryId);

  const STATUS_OPTIONS = [
    { value: 'pending',  label: 'Yoxlamada',     color: 'bg-yellow-100 text-yellow-700' },
    { value: 'active',   label: 'Aktiv',          color: 'bg-green-100 text-green-700' },
    { value: 'rejected', label: 'Rədd edildi',    color: 'bg-red-100 text-red-700' },
    { value: 'expired',  label: 'Müddəti bitib',  color: 'bg-gray-100 text-gray-600' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <XCircle size={48} className="text-red-400" />
        <p className="text-gray-500">Elan tapılmadı</p>
        <button onClick={onBack} className="px-4 py-2 bg-orange-500 text-white rounded-xl">Geri</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-500 hover:text-black transition-colors p-1">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="font-bold text-gray-900">Elan Redaktəsi</h1>
              <p className="text-xs text-gray-400">#{adId.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#F2A900] hover:bg-[#d99800] text-[#1A1A1A] font-bold rounded-xl transition-colors disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Saxlanır...</>
            ) : saved ? (
              <><CheckCircle size={16} className="text-green-600" /> Saxlandı!</>
            ) : (
              <><Save size={16} /> Saxla</>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* SOL — Şəkillər + Məlumat */}
          <div className="lg:col-span-2 space-y-6">

            {/* Şəkillər */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Image size={18} className="text-orange-500" /> Şəkillər
              </h2>
              {ad.images && ad.images.length > 0 ? (
                <>
                  <div className="relative bg-gray-100 rounded-xl overflow-hidden h-64 flex items-center justify-center">
                    <img
                      src={ad.images[activeImage]}
                      className="max-w-full max-h-full object-contain"
                      alt={ad.title}
                    />
                    <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
                      {activeImage + 1} / {ad.images.length}
                    </div>
                  </div>
                  {ad.images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {ad.images.map((img: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                            activeImage === i ? 'border-[#F2A900]' : 'border-transparent'
                          }`}
                        >
                          <img src={img} className="w-full h-full object-cover" alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  Şəkil yoxdur
                </div>
              )}
            </div>

            {/* Redaktə sahələri */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border space-y-5">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-orange-500" /> Məlumatlar
              </h2>

              {/* Başlıq */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Başlıq</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#F2A900] transition-all text-sm"
                />
              </div>

              {/* Qiymət */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Qiymət (AZN)</label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#F2A900] transition-all text-sm"
                />
              </div>

              {/* Təsvir */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Təsvir</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#F2A900] transition-all text-sm resize-none"
                />
              </div>

              {/* Kateqoriya */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Tag size={14} className="inline mr-1" /> Kateqoriya
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setCategoryId(cat.id); setSubCategoryId(''); }}
                      className={`px-2 py-2 text-[11px] rounded-xl border transition-all ${
                        categoryId === cat.id
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-100 bg-gray-50 text-gray-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alt kateqoriya */}
              {activeCategoryData && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alt kateqoriya</label>
                  <div className="flex flex-wrap gap-2">
                    {activeCategoryData.subcategories.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setSubCategoryId(sub.id)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                          subCategoryId === sub.id
                            ? 'bg-black text-white'
                            : 'bg-white text-gray-500 hover:border-orange-400'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SAĞ — Status + Əlaqə + Meta */}
          <div className="space-y-6">

            {/* Status */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <h2 className="font-bold text-gray-900 mb-4">Status</h2>
              <div className="space-y-2">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-sm font-semibold ${
                      status === opt.value
                        ? 'border-[#F2A900] ' + opt.color
                        : 'border-gray-100 text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    {status === opt.value ? (
                      <CheckCircle size={16} className="text-[#F2A900]" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Əlaqə */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border space-y-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Phone size={16} className="text-orange-500" /> Əlaqə
              </h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <MapPin size={13} className="inline mr-1" /> Şəhər
                </label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white text-sm outline-none focus:border-[#F2A900]"
                >
                  <option>Bakı</option>
                  <option>Sumqayıt</option>
                  <option>Gəncə</option>
                  <option>Xırdalan</option>
                  <option>Mingəçevir</option>
                  <option>Naxçıvan</option>
                  <option>Lənkəran</option>
                  <option>Şəki</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Telefon</label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  type="tel"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#F2A900] transition-all text-sm"
                  placeholder="050 000 00 00"
                />
              </div>
            </div>

            {/* Meta məlumat */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border space-y-3">
              <h2 className="font-bold text-gray-900 mb-3">Texniki məlumat</h2>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Elan ID</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">#{adId.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tarix</span>
                <span className="text-gray-700 text-xs">{formatDate(ad.createdAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Baxış</span>
                <span className="text-gray-700">{ad.views || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">User ID</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded truncate max-w-[100px]">{ad.userId || '—'}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}