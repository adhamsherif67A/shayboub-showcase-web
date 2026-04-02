import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

interface FavoriteItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (itemId: string) => void;
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (itemId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

const LOCAL_STORAGE_KEY = "shayboub_favorites";

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user, isCustomer } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites on mount or user change
  useEffect(() => {
    loadFavorites();
  }, [user?.uid]);

  const loadFavorites = async () => {
    setLoading(true);
    
    if (user && isCustomer) {
      // Load from Firestore for logged-in customers
      try {
        const docRef = doc(db, "customers", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().favorites) {
          setFavorites(docSnap.data().favorites);
        } else {
          // Migrate from localStorage if exists
          const localFavs = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localFavs) {
            const parsedFavs = JSON.parse(localFavs);
            setFavorites(parsedFavs);
            // Save to Firestore
            await updateDoc(docRef, { favorites: parsedFavs });
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
        // Fallback to localStorage
        const localFavs = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localFavs) {
          setFavorites(JSON.parse(localFavs));
        }
      }
    } else {
      // Load from localStorage for guests
      const localFavs = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localFavs) {
        setFavorites(JSON.parse(localFavs));
      }
    }
    
    setLoading(false);
  };

  const addFavorite = async (item: FavoriteItem) => {
    const newFavorites = [...favorites, item];
    setFavorites(newFavorites);

    if (user && isCustomer) {
      // Save to Firestore
      try {
        const docRef = doc(db, "customers", user.uid);
        await updateDoc(docRef, {
          favorites: arrayUnion(item)
        });
      } catch (error) {
        console.error("Error adding favorite:", error);
      }
    } else {
      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newFavorites));
    }
  };

  const removeFavorite = async (itemId: string) => {
    const itemToRemove = favorites.find(f => f.id === itemId);
    const newFavorites = favorites.filter(f => f.id !== itemId);
    setFavorites(newFavorites);

    if (user && isCustomer && itemToRemove) {
      // Remove from Firestore
      try {
        const docRef = doc(db, "customers", user.uid);
        await updateDoc(docRef, {
          favorites: arrayRemove(itemToRemove)
        });
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    } else {
      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newFavorites));
    }
  };

  const isFavorite = (itemId: string) => {
    return favorites.some(f => f.id === itemId);
  };

  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};
