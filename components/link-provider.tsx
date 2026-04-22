"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { Link as LinkType } from "@/data/links";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
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
  refreshLinks: () => Promise<void>;
}

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export function LinkProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchLinks = useCallback(async () => {
    if (!user) {
      setLinks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Path: users/(user.uid)/likk as requested
      const q = query(
        collection(db, "users", user.uid, "likk"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const linksData: LinkType[] = [];
      querySnapshot.forEach((doc) => {
        linksData.push({ id: doc.id, ...doc.data() } as LinkType);
      });
      setLinks(linksData);
    } catch (e) {
      console.error("Error fetching links: ", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
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

      return () => unsubscribe();
    } else {
      setLinks([]);
      setLoading(false);
    }
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
    <LinkContext.Provider value={{ links, addLink, updateLink, removeLink, loading, refreshLinks: fetchLinks }}>
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
