import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvS35fQf1_VimhpG0TojUJE9eMSxyCquE",
  authDomain: "eurohome-3309a.firebaseapp.com",
  projectId: "eurohome-3309a",
  storageBucket: "eurohome-3309a.firebasestorage.app",
  messagingSenderId: "723134202823",
  appId: "1:723134202823:web:84192505a0e6934e9d4fe2",
  measurementId: "G-ZBE5WFXW20"
};

// Firebase-i başlat
const app = initializeApp(firebaseConfig);

// Digər servisləri eksport et ki, hər yerdə işlədə bilək
export const db = getFirestore(app);     // Verilənlər bazası (Elanlar üçün)
export const storage = getStorage(app);   // Şəkillər üçün
export const auth = getAuth(app);         // İstifadəçi girişi üçün

export default app;