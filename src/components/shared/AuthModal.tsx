import { useState } from 'react';
import { X, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  setMode: (mode: 'login' | 'register') => void;
  onSuccess?: (user: any, isAdmin: boolean) => void;
}

export default function AuthModal({ isOpen, onClose, mode, setMode, onSuccess }: AuthModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async () => {
    setError('');

    if (!email || !password) {
      setError('Email və şifrəni doldurun.');
      return;
    }
    if (password.length < 6) {
      setError('Şifrə minimum 6 simvol olmalıdır.');
      return;
    }

    setLoading(true);
    try {
      let userCredential;

      if (mode === 'login') {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          displayName: name,
          email: email,
          createdAt: serverTimestamp(),
        });
      }

      const user = userCredential.user;
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      const isAdmin = adminDoc.exists();

      onSuccess?.(user, isAdmin);
      resetForm();
      onClose();

    } catch (err: any) {
      const code = err.code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Email və ya şifrə yanlışdır.');
      } else if (code === 'auth/email-already-in-use') {
        setError('Bu email artıq qeydiyyatdan keçib.');
      } else if (code === 'auth/invalid-email') {
        setError('Email formatı yanlışdır.');
      } else if (code === 'auth/too-many-requests') {
        setError('Çox cəhd edildi. Bir az gözləyin.');
      } else {
        setError('Xəta baş verdi: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-2xl border border-gray-100">

        <button
          onClick={() => { resetForm(); onClose(); }}
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

        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad və Soyad</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#F2A900] transition-all"
                  placeholder="Məsələn: Əli Məmmədov"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-poçt</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#F2A900] transition-all"
                placeholder="nümunə@mail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifrə</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#F2A900] transition-all"
                placeholder="••••••••"
              />
            </div>
            {mode === 'login' && (
              <div className="text-right mt-1.5">
                <button type="button" className="text-xs text-orange-500 hover:underline">
                  Şifrəni unutmusunuz?
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#F2A900] text-[#1A1A1A] font-bold py-3 rounded-xl hover:bg-[#d99800] transition-colors shadow-lg shadow-[#F2A900]/20 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Yüklənir...</>
            ) : (
              mode === 'login' ? 'Daxil ol' : 'Qeydiyyatı tamamla'
            )}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            {mode === 'login' ? 'Hesabınız yoxdur?' : 'Artıq hesabınız var?'}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
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