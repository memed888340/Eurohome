import { X, Mail, Lock, Phone, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  setMode: (mode: 'login' | 'register') => void;
}

export default function AuthModal({ isOpen, onClose, mode, setMode }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-2xl border border-gray-100">
        {/* Bağla butonu */}
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-gray-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Yenidən xoş gəldiniz!' : 'Hesab yaradın'}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {mode === 'login' 
              ? 'Elanlarınızı idarə etmək üçün daxil olun' 
              : 'Eurohome.az-ın imkanlarından tam yararlanın'}
          </p>
        </div>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad və Soyad</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#F2A900] focus:ring-2 focus:ring-[#F2A900]/10 transition-all" 
                  placeholder="Məsələn: Əli Məmmədov" 
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-poçt və ya Telefon</label>
            <div className="relative">
              {mode === 'login' ? (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              ) : (
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              )}
              <input 
                type="text" 
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#F2A900] focus:ring-2 focus:ring-[#F2A900]/10 transition-all" 
                placeholder={mode === 'login' ? "nümunə@mail.com" : "050 000 00 00"} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifrə</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#F2A900] focus:ring-2 focus:ring-[#F2A900]/10 transition-all" 
                placeholder="••••••••" 
              />
            </div>
            {mode === 'login' && (
              <div className="text-right mt-1.5">
                <button type="button" className="text-xs text-orange-500 hover:underline">Şifrəni unutmusunuz?</button>
              </div>
            )}
          </div>

          <button className="w-full bg-[#F2A900] text-[#1A1A1A] font-bold py-3 rounded-xl hover:bg-[#d99800] transition-colors shadow-lg shadow-[#F2A900]/20 mt-2">
            {mode === 'login' ? 'Daxil ol' : 'Qeydiyyatı tamamla'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            {mode === 'login' ? 'Hesabınız yoxdur?' : 'Artıq hesabınız var?'}
            <button 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="ml-1.5 font-bold text-[#F2A900] hover:underline"
            >
              {mode === 'login' ? 'Qeydiyyatdan keçin' : 'Daxil olun'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}