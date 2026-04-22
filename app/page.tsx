"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Plus, LogIn } from "lucide-react";
import { useLinks } from "@/components/link-provider";
import { useAuth } from "@/components/auth-provider";

export default function Home() {
  const { links } = useLinks();
  const { user, userData, loading, login } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-slate-200 rounded-full" />
          <div className="w-32 h-6 bg-slate-200 rounded" />
          <div className="w-48 h-4 bg-slate-200 rounded" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-50 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">나만의 링크 페이지를 만들어보세요</h1>
        <p className="text-slate-600 mb-8 max-w-md">
          SNS 프로필에 딱 하나만 넣을 수 있는 링크, 이제 MyLink로 모든 링크를 하나로 묶어보세요.
        </p>
        <Button 
          onClick={login}
          size="lg"
          className="bg-[#5B5FC7] hover:bg-[#4a4db0] text-white px-8 py-6 rounded-2xl text-lg font-bold shadow-lg gap-2"
        >
          <LogIn className="w-6 h-6" />
          Google 계정으로 시작하기
        </Button>
      </main>
    );
  }

  // Use userData if available, otherwise fallback to firebase user info
  const profile = {
    display_name: userData?.display_name || user.displayName || "User",
    username: userData?.username || user.email?.split("@")[0] || "user",
    bio: userData?.bio || "나만의 링크를 소개해보세요.",
    photo_url: userData?.photo_url || user.photoURL || "https://github.com/shadcn.png",
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center pt-8 pb-24 px-8 bg-slate-50">
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        {/* 프로필 섹션 */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="w-24 h-24 border-2 border-white shadow-md">
            <AvatarImage src={profile.photo_url} alt={profile.display_name} />
            <AvatarFallback className="bg-slate-200 text-slate-600">
              {profile.display_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">{profile.display_name}</h1>
            <p className="text-sm font-medium text-[#5B5FC7]">@{profile.username}</p>
            <p className="text-sm text-slate-500 whitespace-pre-line mt-2">{profile.bio}</p>
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
          {links.length > 0 ? (
            links.map((link) => (
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
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
              아직 등록된 링크가 없습니다.
            </div>
          )}
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
