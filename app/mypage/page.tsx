"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useLinks } from "@/components/link-provider";

export default function MyPage() {
  const { links, addLink, removeLink } = useLinks();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    
    const success = addLink(title, url);
    
    if (success) {
      setTitle("");
      setUrl("");
    } else {
      alert("올바른 주소 형식이 아닙니다. (예: google.com 또는 https://google.com)");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8 min-h-screen bg-slate-50/50">
      <div className="flex items-center justify-start">
        <Link href="/">
          <Button variant="outline" size="default" className="gap-2 text-slate-600 hover:text-[#5B5FC7] hover:border-[#5B5FC7] bg-white shadow-sm border-slate-200 transition-all font-medium">
            <ArrowLeft className="w-4 h-4" />
            메인으로 돌아가기
          </Button>
        </Link>
      </div>

      <header className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">내 링크 관리</h1>
        <p className="text-slate-500 font-medium">나만의 소셜 링크를 자유롭게 관리하세요.</p>
      </header>

      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <form onSubmit={handleAddLink} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-sm font-bold text-slate-800 ml-1">
              링크 제목
            </label>
            <input
              id="title"
              type="text"
              placeholder="링크 제목 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium outline-none focus:ring-2 focus:ring-[#5B5FC7]/30 focus:border-[#5B5FC7] transition-all placeholder:text-slate-400"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="url" className="text-sm font-bold text-slate-800 ml-1">
              주소 (URL)
            </label>
            <input
              id="url"
              type="text"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium outline-none focus:ring-2 focus:ring-[#5B5FC7]/30 focus:border-[#5B5FC7] transition-all placeholder:text-slate-400"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full py-7 text-base font-bold text-white rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
            style={{ backgroundColor: "#5B5FC7" }}
          >
            링크 추가하기
          </Button>
        </form>
      </section>

      <section className="space-y-6 pb-20">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mx-1">
          <h2 className="text-xl font-bold text-slate-800">링크 목록</h2>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {links.length}개의 링크
          </span>
        </div>
        
        {links.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 bg-white/50">
            <p className="text-lg">아직 등록된 링크가 없습니다.</p>
            <p className="text-sm mt-1">상단 폼을 이용해 새로운 링크를 추가해보세요!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {links.map((link) => (
              <Card key={link.id} className="group relative hover:border-[#5B5FC7]/40 hover:shadow-md transition-all duration-300 bg-white">
                <CardHeader className="p-5 flex flex-row items-center justify-between">
                  <div className="space-y-1 overflow-hidden pr-4">
                    <CardTitle className="text-lg font-bold text-slate-800 truncate">{link.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#5B5FC7] hover:underline break-all font-medium text-sm truncate"
                      >
                        {link.url}
                      </a>
                    </CardDescription>
                  </div>
                  <button 
                    onClick={() => removeLink(link.id)}
                    className="shrink-0 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="삭제"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
