import { useState, useRef } from 'react';
import { Camera, X, MapPin, Info, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../data';
import { db, auth } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CreateAdProps {
  onCancel: () => void;
}

export default function CreateAd({ onCancel }: CreateAdProps) {
  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [selectedSubCatId, setSelectedSubCatId] = useState<string>("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Bakı");
  const [phone, setPhone] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeCategoryData = CATEGORIES.find(cat => cat.id === selectedCatId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newFiles = [...selectedFiles, ...filesArray].slice(0, 10);
      setSelectedFiles(newFiles);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const uploadToCloudinary = async (files: File[]) => {
    const urls = [];
    const cloudName = "ddwoxaiol";
    const uploadPreset = "eurohome_preset";

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.secure_url) urls.push(data.secure_url);
    }
    return urls;
  };

  const handlePublishAd = async () => {
    if (!title || !price || !selectedCatId || selectedFiles.length === 0) {
      alert("Zəhmət olmasa ulduzlu (*) sahələri doldurun və şəkil əlavə edin!");
      return;
    }

    setIsPublishing(true);
    try {
      const imageUrls = await uploadToCloudinary(selectedFiles);

      await addDoc(collection(db, "ads"), {
        title,
        price: Number(price),
        description,
        categoryId: selectedCatId,
        subCategoryId: selectedSubCatId,
        city,
        phone,
        images: imageUrls,
        status: 'pending',                    // ← yoxlamada
        userId: auth.currentUser?.uid || '',  // ← istifadəçi uid
        views: 0,
        createdAt: serverTimestamp(),
      });

      alert("Elanınız yoxlamaya göndərildi!");
      onCancel();
    } catch (error) {
      console.error("Xəta:", error);
      alert("Xəta baş verdi, yenidən yoxlayın.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white border-b sticky top-[64px] z-30">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={onCancel} className="text-gray-500 hover:text-black">
            <X size={24} />
          </button>
          <h1 className="font-bold text-lg">Yeni Elan</h1>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6">

          {/* Şəkillər */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Camera size={20} className="text-orange-500" /> Şəkillər
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-orange-50 transition-all"
              >
                <Camera size={28} className="text-gray-300" />
                <span className="text-[10px] font-medium text-gray-500">Şəkil əlavə et</span>
              </button>

              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border">
                  <img src={src} className="w-full h-full object-cover" alt="önizləmə" />
                  <button
                    onClick={() => {
                      const newFiles = selectedFiles.filter((_, idx) => idx !== i);
                      setSelectedFiles(newFiles);
                      setPreviews(newFiles.map(f => URL.createObjectURL(f)));
                    }}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <input type="file" ref={fileInputRef} hidden multiple accept="image/*" onChange={handleFileChange} />
            </div>
          </section>

          {/* Məlumatlar */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border space-y-6">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Info size={20} className="text-orange-500" /> Detallar
            </h2>

            <div>
              <label className="block text-sm font-semibold mb-3">Kateqoriya *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCatId(cat.id); setSelectedSubCatId(""); }}
                    className={`px-2 py-2 text-[11px] rounded-xl border transition-all ${
                      selectedCatId === cat.id
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-100 bg-gray-50 text-gray-600"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {activeCategoryData && (
              <div>
                <label className="block text-sm font-semibold mb-3">Alt kateqoriya *</label>
                <div className="flex flex-wrap gap-2">
                  {activeCategoryData.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubCatId(sub.id)}
                      className={`px-4 py-2 text-xs rounded-full border transition-all ${
                        selectedSubCatId === sub.id
                          ? "bg-black text-white"
                          : "bg-white text-gray-500 hover:border-orange-400"
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Başlıq *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-semibold mb-1.5">Qiymət, AZN *</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Təsvir *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:border-orange-500 resize-none"
                />
              </div>
            </div>
          </section>

          {/* Əlaqə */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <MapPin size={20} className="text-orange-500" /> Əlaqə
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 bg-white"
              >
                <option>Bakı</option>
                <option>Sumqayıt</option>
                <option>Gəncə</option>
                <option>Xırdalan</option>
              </select>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="050 000 00 00"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>
          </section>

          <div className="flex flex-col gap-3">
            <button
              disabled={isPublishing}
              onClick={handlePublishAd}
              className={`w-full text-white font-bold py-4 rounded-2xl transition-all shadow-lg text-lg flex items-center justify-center gap-2 ${
                isPublishing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 shadow-orange-200 active:scale-[0.98]"
              }`}
            >
              {isPublishing ? (
                <><Loader2 className="animate-spin" /> Yüklənir...</>
              ) : "Elanı yoxlamaya göndər"}
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-white text-gray-600 font-semibold py-4 rounded-2xl border hover:bg-gray-50 transition-all"
            >
              Ləğv et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}