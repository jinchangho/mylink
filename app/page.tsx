"use client";

import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@/data/user";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Plus } from "lucide-react";
import { useLinks } from "@/components/link-provider";

export default function Home() {
  const { links } = useLinks();

  return (
    <main className="relative flex min-h-screen flex-col items-center pt-16 pb-24 px-8 bg-slate-50">
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        {/* 프로필 섹션 */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="w-24 h-24 border-2 border-white shadow-md">
            <AvatarImage src={currentUser.photo_url} alt={currentUser.display_name} />
            <AvatarFallback>{currentUser.display_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-xl font-bold">@{currentUser.username}</h1>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{currentUser.bio}</p>
          </div>
        </div>

        {/* 링크 추가 버튼 (강조됨) */}
        <Link href="/mypage" className="w-full">
          <Button 
            className="w-full py-7 bg-[#5B5FC7] hover:bg-[#4a4db0] text-white font-bold rounded-2xl shadow-lg gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-6 h-6" />
            새 링크 추가하기
          </Button>
        </Link>

        {/* 링크 목록 */}
        <div className="w-full space-y-4 pt-4">
          <h2 className="text-sm font-semibold text-slate-400 px-1">나의 링크 목록</h2>
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Card className="hover:border-[#5B5FC7]/50 transition-colors bg-white">
                <CardContent className="flex items-center p-4">
                  <div className="mr-4 w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full shrink-0">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                      alt={link.title}
                      className="w-6 h-6"
                    />
                  </div>
                  <span className="text-lg font-medium text-slate-800">{link.title}</span>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* 설정 버튼 (유지) */}
      <div className="fixed bottom-6 right-6">
        <Link href="/mypage">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-lg bg-white hover:bg-slate-50 border-slate-200 transition-all"
            aria-label="설정"
            title="설정"
          >
            <Settings className="w-5 h-5 text-slate-500" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
