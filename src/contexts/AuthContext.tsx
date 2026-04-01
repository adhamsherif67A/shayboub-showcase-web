import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type UserRole = "admin" | "staff" | "customer" | null;

interface CustomerData {
  uid: string;
  name: string;
  email: string | null;
  phone: string | null;
  birthday: string | null;
  points: number;
  totalPointsEarned: number;
  totalPointsSpent: number;
  totalVisits: number;
  joinedAt: any;
  lastVisit: any;
}

interface AuthUser {
  uid: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  name: string;
  customerData?: CustomerData;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  birthday?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  // Email/Password Auth
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  // Social Auth
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  // Phone Auth
  loginWithPhone: (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  verifyPhoneCode: (confirmationResult: ConfirmationResult, code: string) => Promise<void>;
  // Common
  logout: () => Promise<void>;
  // Role checks
  isAdmin: boolean;
  isStaff: boolean;
  isCustomer: boolean;
  // Customer data
  refreshCustomerData: () => Promise<void>;
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

// Helper function to create or get customer document
const getOrCreateCustomerData = async (firebaseUser: User, additionalData?: Partial<CustomerData>): Promise<CustomerData | null> => {
  try {
    const customerRef = doc(db, "customers", firebaseUser.uid);
    const customerSnap = await getDoc(customerRef);

    if (customerSnap.exists()) {
      // Update last visit
      await updateDoc(customerRef, {
        lastVisit: serverTimestamp()
      });
      return customerSnap.data() as CustomerData;
    } else {
      // Create new customer document
      const newCustomerData: CustomerData = {
        uid: firebaseUser.uid,
        name: additionalData?.name || firebaseUser.displayName || "User",
        email: firebaseUser.email,
        phone: firebaseUser.phoneNumber || additionalData?.phone || null,
        birthday: additionalData?.birthday || null,
        points: 0,
        totalPointsEarned: 0,
        totalPointsSpent: 0,
        totalVisits: 0,
        joinedAt: serverTimestamp(),
        lastVisit: serverTimestamp(),
      };

      await setDoc(customerRef, newCustomerData);
      return newCustomerData;
    }
  } catch (error) {
    console.error("Error getting/creating customer data:", error);
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (firebaseUser: User, additionalData?: Partial<CustomerData>) => {
    // First check if user is admin/staff
    const usersQuery = query(
      collection(db, "users"),
      where("uid", "==", firebaseUser.uid)
    );
    const querySnapshot = await getDocs(usersQuery);
    
    if (!querySnapshot.empty) {
      // User is admin or staff
      const userData = querySnapshot.docs[0].data();
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        phone: firebaseUser.phoneNumber,
        role: userData.role as UserRole,
        name: userData.name || "User",
      });
    } else {
      // User is a customer
      const customerData = await getOrCreateCustomerData(firebaseUser, additionalData);
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        phone: firebaseUser.phoneNumber,
        role: "customer",
        name: customerData?.name || firebaseUser.displayName || "User",
        customerData: customerData || undefined,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        await loadUserData(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email/Password Login
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Email/Password Signup
  const signup = async (data: SignUpData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    
    // Update display name
    await updateProfile(userCredential.user, {
      displayName: data.name
    });

    // Create customer document
    await loadUserData(userCredential.user, {
      name: data.name,
      phone: data.phone,
      birthday: data.birthday
    });
  };

  // Google Login
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    await loadUserData(userCredential.user);
  };

  // Apple Login
  const loginWithApple = async () => {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    const userCredential = await signInWithPopup(auth, provider);
    await loadUserData(userCredential.user);
  };

  // Phone Login - Step 1: Send verification code
  const loginWithPhone = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
    return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  };

  // Phone Login - Step 2: Verify code
  const verifyPhoneCode = async (confirmationResult: ConfirmationResult, code: string) => {
    const userCredential = await confirmationResult.confirm(code);
    await loadUserData(userCredential.user);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Refresh customer data
  const refreshCustomerData = async () => {
    if (user && user.uid) {
      const customerRef = doc(db, "customers", user.uid);
      const customerSnap = await getDoc(customerRef);
      if (customerSnap.exists()) {
        const customerData = customerSnap.data() as CustomerData;
        setUser({
          ...user,
          customerData
        });
      }
    }
  };

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff" || user?.role === "admin";
  const isCustomer = user?.role === "customer";

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup,
      loginWithGoogle,
      loginWithApple,
      loginWithPhone,
      verifyPhoneCode,
      logout, 
      isAdmin, 
      isStaff,
      isCustomer,
      refreshCustomerData
    }}>
      {children}
    </AuthContext.Provider>
  );
};
