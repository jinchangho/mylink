"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User as UserData } from "@/data/user";

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle User Data Synchronization
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    
    // Check if user document exists, if not create it
    const checkUserDoc = async () => {
      try {
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          const newUserData: UserData = {
            uid: user.uid,
            email: user.email || "",
            display_name: user.displayName || "User",
            photo_url: user.photoURL || "",
            username: user.email?.split("@")[0] || user.uid.substring(0, 8),
            bio: "안녕하세요! 반갑습니다.",
          };
          await setDoc(userDocRef, {
            ...newUserData,
            created_at: new Date(),
          });
        }
      } catch (error) {
        console.error("Error checking/creating user doc:", error);
      }
    };

    checkUserDoc();

    // Listen for real-time updates to user data
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.data() as UserData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to user data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
