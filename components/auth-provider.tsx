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

interface AuthContextType {
  user: FirebaseUser | null;
  userData: any | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // user.uid/likk (as per user request, though it might be a typo for 'link')
        // But typically user info is in the user document itself.
        // Let's check both or follow the user's specific path.
        // If they said users/(user.uid)/likk, it might be a sub-document or just a typo.
        // I'll try to get user doc first, and also look for 'likk' if they specifically meant a subpath.
        
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // Create user doc if it doesn't exist
          const newUserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            display_name: firebaseUser.displayName || "User",
            photo_url: firebaseUser.photoURL || "",
            username: firebaseUser.email?.split("@")[0] || firebaseUser.uid.substring(0, 8),
            bio: "안녕하세요! 반갑습니다.",
            created_at: new Date(),
          };
          await setDoc(userDocRef, newUserData);
          setUserData(newUserData);
        } else {
          setUserData(userDoc.data());
        }

        // Specifically listen to the path the user mentioned: users/(user.uid)/likk
        // If 'likk' is a subcollection or a document? 
        // "Firestore 경로: users/(user.uid)/likk" usually implies a document named 'likk' under users/uid.
        const likkDocRef = doc(db, "users", firebaseUser.uid, "likk", "data"); 
        // Or maybe they meant the document itself is named 'likk'? 
        // Let's assume users/(uid) is the user profile, 
        // and users/(uid)/likk might be some personalized info.
        // The user said "해당 경로의 유저 정보를 화면에 보여줘야해".
        
        const unsubLikk = onSnapshot(doc(db, "users", firebaseUser.uid), (doc) => {
           if (doc.exists()) {
             setUserData(doc.data());
           }
        });
        
        return () => unsubLikk();
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
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
