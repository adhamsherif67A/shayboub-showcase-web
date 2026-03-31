import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type UserRole = "admin" | "staff" | null;

interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Query user by uid field
        const usersQuery = query(
          collection(db, "users"),
          where("uid", "==", firebaseUser.uid)
        );
        const querySnapshot = await getDocs(usersQuery);
        
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: userData.role as UserRole,
            name: userData.name || "User",
          });
        } else {
          // User exists in Auth but not in Firestore
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: null,
            name: "User",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff" || user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
};
