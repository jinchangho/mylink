"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Link as LinkType } from "@/data/links";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface LinkContextType {
  links: LinkType[];
  addLink: (title: string, url: string) => Promise<boolean>;
  removeLink: (id: string) => Promise<void>;
  loading: boolean;
  refreshLinks: () => Promise<void>;
}

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export function LinkProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users", "anorhymous", "link"),
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
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const addLink = async (title: string, url: string): Promise<boolean> => {
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
    if (!urlPattern.test(formattedUrl)) return false;

    try {
      await addDoc(collection(db, "users", "anorhymous", "link"), {
        title,
        url: formattedUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      await fetchLinks(); // 추가 후 목록 갱신
      return true;
    } catch (e) {
      console.error("Error adding link: ", e);
      return false;
    }
  };

  const removeLink = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", "anorhymous", "link", id));
      await fetchLinks(); // 삭제 후 목록 갱신
    } catch (e) {
      console.error("Error removing link: ", e);
    }
  };

  return (
    <LinkContext.Provider value={{ links, addLink, removeLink, loading, refreshLinks: fetchLinks }}>
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
