"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Link as LinkType } from "@/data/links";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  updateDoc,
  onSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/auth-provider";

interface LinkContextType {
  links: LinkType[];
  addLink: (title: string, url: string) => Promise<boolean>;
  updateLink: (id: string, title: string, url: string) => Promise<boolean>;
  removeLink: (id: string) => Promise<void>;
  loading: boolean;
}

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export function LinkProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const syncData = async () => {
      if (!user) {
        setLinks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const q = query(
        collection(db, "users", user.uid, "likk"),
        orderBy("createdAt", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const linksData: LinkType[] = [];
        querySnapshot.forEach((doc) => {
          linksData.push({ id: doc.id, ...doc.data() } as LinkType);
        });
        setLinks(linksData);
        setLoading(false);
      }, (error) => {
        console.error("Error listening to links: ", error);
        setLoading(false);
      });

      return unsubscribe;
    };

    const unsubPromise = syncData();

    return () => {
      unsubPromise.then(unsub => unsub && typeof unsub === 'function' && unsub());
    };
  }, [user]);

  const addLink = async (title: string, url: string): Promise<boolean> => {
    if (!user) return false;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
    if (!urlPattern.test(formattedUrl)) return false;

    try {
      await addDoc(collection(db, "users", user.uid, "likk"), {
        title,
        url: formattedUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (e) {
      console.error("Error adding link: ", e);
      return false;
    }
  };

  const updateLink = async (id: string, title: string, url: string): Promise<boolean> => {
    if (!user) return false;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
    if (!urlPattern.test(formattedUrl)) return false;

    try {
      const linkRef = doc(db, "users", user.uid, "likk", id);
      await updateDoc(linkRef, {
        title,
        url: formattedUrl,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (e) {
      console.error("Error updating link: ", e);
      return false;
    }
  };

  const removeLink = async (id: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "likk", id));
    } catch (e) {
      console.error("Error removing link: ", e);
    }
  };

  return (
    <LinkContext.Provider value={{ links, addLink, updateLink, removeLink, loading }}>
      {children}
    </LinkContext.Provider>
  );
}

export function useLinks() {
  const context = useContext(LinkContext);
  if (context === undefined) {
    throw new Error("useLinks must be used within a LinkProvider");
  }
  return context;
}
