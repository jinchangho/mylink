"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { links as defaultLinks, Link as LinkType } from "@/data/links";

interface LinkContextType {
  links: LinkType[];
  addLink: (title: string, url: string) => void;
  removeLink: (id: string) => void;
}

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export function LinkProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<LinkType[]>(defaultLinks);

  const addLink = (title: string, url: string): boolean => {
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    // URL 유효성 검사 정규식
    const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
    
    if (!urlPattern.test(formattedUrl)) {
      return false;
    }

    try {
      new URL(formattedUrl);
    } catch (e) {
      return false;
    }

    const newLink: LinkType = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      url: formattedUrl,
    };
    setLinks([newLink, ...links]);
    return true;
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  return (
    <LinkContext.Provider value={{ links, addLink, removeLink }}>
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
