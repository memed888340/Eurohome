import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ChevronLeft, MapPin, Phone, User, Calendar, Share2, Heart, MessageCircle, ShieldCheck } from 'lucide-react';

interface AdDetailsProps {
  adId: string;
  onBack: () => void;
}

export default function AdDetails({ adId, onBack }: AdDetailsProps) {
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showNumber, setShowNumber] = useState(false);

  useEffect(() => {
    async function fetchAd() {
      const docRef = doc(db, "ads", adId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAd({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    }
    fetchAd();
    window.scrollTo(0, 0);
  }, [adId]);

  if (loading) return <div className="p-10 text-center">Yüklənir...</div>;
  if (!ad) return <div className="p-10 text-center">Elan tapılmadı.</div>;

  const formattedPrice = new Intl.NumberFormat('az-AZ').format(ad.price);

  return (
    <div className="bg-[#F6F7F7] min-h-screen pb-12">
      {/* Üst Naviqasiya (Breadcrumbs) */}
      <div className="max-w-7xl mx-auto px-4 py-4 hidden md:flex items-center gap-2 text-sm text-gray-500">
        <button onClick={onBack} className="hover:text-[#F2A900]">Bütün elanlar</button>
        <span>/</span>
        <span className="text-gray-900 font-medium">{ad.title}</span>
      </div>

      <main className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* SOL TƏRƏF: Şəkil və Təsvir */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl p-2 shadow-sm">
              {/* Başlıq və Actionlar */}
              <div className="flex justify-between items-start mb-4 p-2">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">{ad.title}</h1>
                <div className="flex gap-4 text-gray-500">
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors"><Heart size={20}/> <span className="hidden sm:inline">Seçilmişlərdə saxla</span></button>
                </div>
              </div>

              {/* Əsas Şəkil */}
              <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center h-[300px] md:h-[500px]">
                <img 
                  src={ad.images?.[activeImage] || ad.image} 
                  className="max-w-full max-h-full object-contain"
                  alt={ad.title}
                />
              </div>

              {/* Kiçik Şəkillər (Thumbnails) */}
              {ad.images && ad.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {ad.images.map((img: string, i: number) => (
                    <button 
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 flex-shrink-0 rounded-md border-2 overflow-hidden ${activeImage === i ? 'border-[#F2A900]' : 'border-transparent'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Texniki Göstəricilər (Grid formatında) */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Şəhər</span>
                  <span className="font-medium text-gray-900">{ad.city}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Növ</span>
                  <span className="font-medium text-[#F2A900] uppercase text-xs bg-orange-50 px-2 py-1 rounded">Yeni</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Elan nömrəsi</span>
                  <span className="font-medium">#{ad.id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Baxış sayı</span>
                  <span className="font-medium">{ad.views || 0}</span>
                </div>
              </div>

              {/* Təsvir hissəsi */}
              <div className="mt-8">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Təsvir</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base italic">
                  {ad.description}
                </p>
              </div>
            </div>
          </div>

          {/* SAĞ TƏRƏF: Qiymət və Əlaqə (Sabit blok) */}
          <div className="w-full lg:w-[380px] space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">
              <div className="text-3xl font-black text-gray-900 mb-6">
                {formattedPrice} <span className="text-xl font-bold">AZN</span>
              </div>

              {/* Satıcı info */}
              <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-[#F2A900] shadow-sm">
                  <User size={30} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{ad.seller?.name || 'İstifadəçi'}</h4>
                  <button className="text-[#F2A900] text-xs font-semibold hover:underline">İstifadəçinin bütün elanları</button>
                </div>
              </div>

              <div className="space-y-3">
                {/* Nömrəni göstər düyməsi */}
                <button 
                  onClick={() => setShowNumber(true)}
                  className="w-full bg-[#28B463] hover:bg-[#239B56] text-white py-4 rounded-xl font-bold flex flex-col items-center justify-center transition-all shadow-lg shadow-green-100"
                >
                  <span className="text-xs opacity-90 font-normal">Nömrəni göstər</span>
                  <div className="flex items-center gap-2 text-lg">
                    <Phone size={20} />
                    {showNumber ? ad.phone : ad.phone?.replace(/(\d{5}).*/, "$1 ** **")}
                  </div>
                </button>

                <button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                  <MessageCircle size={20} /> Mesaj yaz
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar size={18} className="text-gray-400" />
                  <span>Yeniləndi: Bugün, 14:20</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck size={18} className="text-green-500" />
                  <span>Təhlükəsiz alış-veriş məsləhətləri</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}