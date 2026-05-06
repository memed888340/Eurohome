import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export function useAds() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "ads"), orderBy("createdAt", "desc"));
    
    // onSnapshot real-time yenilənməni təmin edir (elan yüklənən kimi saytda görünəcək)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const adsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAds(adsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { ads, loading };
}