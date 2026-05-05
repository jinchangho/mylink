"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Plus, LogIn, Link as LinkIcon, BarChart3, Globe, ChevronRight, CheckCircle2, Github } from "lucide-react";
import { useLinks } from "@/components/link-provider";
import { useAuth } from "@/components/auth-provider";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const { links } = useLinks();
  const { user, userData, loading, login } = useAuth();

  const handleLinkClick = async (linkId: string) => {
    if (!user) {
      console.error("로그인이 필요합니다. 클릭 카운트가 저장되지 않습니다.");
      return;
    }

    try {
      const linkRef = doc(db, "users", user.uid, "links", linkId);
      await updateDoc(linkRef, {
        clickCount: increment(1)
      });
    } catch (error) {
      console.error("클릭 카운트 저장 중 오류 발생:", error);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-slate-200 rounded-full" />
          <div className="w-32 h-6 bg-slate-200 rounded" />
          <div className="w-48 h-4 bg-slate-200 rounded" />
        </div>
      </main>
    );
  }

  // --- 랜딩 페이지 (로그인 전) ---
  if (!user) {
    return (
      <main className="flex flex-col min-h-screen bg-white">
        {/* 1. 히어로 섹션 */}
        <section className="relative pt-20 pb-16 px-6 overflow-hidden bg-gradient-to-b from-[#5B5FC7]/5 to-white">
          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B5FC7]/10 text-[#5B5FC7] text-xs font-bold uppercase tracking-wider mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B5FC7] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5B5FC7]"></span>
              </span>
              Simple & Powerful Link Management
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
              하나의 링크로<br />
              <span className="text-[#5B5FC7]">모든 나</span>를 연결하세요
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              SNS, 포트폴리오, 비즈니스 링크까지. <br className="hidden md:block" />
              MyLink와 함께 당신의 가치를 한 페이지에 담아보세요.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                onClick={login}
                size="lg"
                className="w-full sm:w-auto bg-[#5B5FC7] hover:bg-[#4a4db0] text-white px-10 py-8 rounded-2xl text-xl font-black shadow-2xl shadow-[#5B5FC7]/20 transition-all hover:scale-105 active:scale-95 gap-3"
              >
                <LogIn className="w-6 h-6" />
                지금 무료로 시작하기
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-slate-200 px-10 py-8 rounded-2xl text-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                기능 살펴보기
              </Button>
            </div>
          </div>
          
          {/* 장식용 배경 요소 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#5B5FC7]/5 rounded-full blur-3xl -z-0"></div>
        </section>

        {/* 2. 기능 소개 섹션 */}
        <section className="py-24 px-6 bg-white border-y border-slate-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">당신을 위해 준비된 기능들</h2>
              <p className="text-slate-500 font-medium">단 몇 번의 클릭으로 완벽한 페이지를 구성하세요.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-none shadow-xl bg-slate-50/50 hover:bg-white transition-all group p-4">
                <CardHeader>
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <LinkIcon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl font-extrabold text-slate-800">무제한 링크 관리</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    SNS, 블로그, 쇼핑몰 등 원하는 만큼 링크를 추가하고 드래그 앤 드롭으로 순서를 관리하세요.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-slate-50/50 hover:bg-white transition-all group p-4">
                <CardHeader>
                  <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl font-extrabold text-slate-800">상세한 방문 통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    누가 어떤 링크를 가장 많이 클릭했는지 실시간 통계 데이터를 통해 방문자의 반응을 확인하세요.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-slate-50/50 hover:bg-white transition-all group p-4">
                <CardHeader>
                  <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Globe className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl font-extrabold text-slate-800">나만의 커스텀 URL</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    당신의 아이덴티티를 나타내는 고유한 사용자 이름을 선택하고 전 세계와 연결하세요.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 3. 미리보기 섹션 */}
        <section className="py-24 px-6 bg-slate-50 overflow-hidden">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 md:order-1 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                준비는 끝났습니다.<br />
                이제 시작해보세요.
              </h2>
              <ul className="space-y-4 inline-block md:block text-left">
                <li className="flex items-center gap-3 text-lg font-bold text-slate-700">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  30초 만에 끝나는 간편 가입
                </li>
                <li className="flex items-center gap-3 text-lg font-bold text-slate-700">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  모바일 최적화 레이아웃
                </li>
                <li className="flex items-center gap-3 text-lg font-bold text-slate-700">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  구글 계정 연동 무료 서비스
                </li>
              </ul>
              <div className="pt-4">
                <Button 
                  onClick={login}
                  size="lg"
                  className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white px-10 py-8 rounded-2xl text-xl font-black shadow-xl gap-2 transition-all hover:translate-y-[-2px]"
                >
                  나만의 페이지 만들기
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="relative order-1 md:order-2">
              {/* 모바일 목업 형태의 카드 */}
              <div className="relative z-10 w-[300px] h-[600px] mx-auto bg-white rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden flex flex-col p-6 space-y-6">
                <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mt-4" />
                <div className="w-32 h-4 bg-slate-100 rounded-full mx-auto" />
                <div className="space-y-3 mt-4">
                  <div className="w-full h-12 bg-slate-50 rounded-xl border border-slate-100" />
                  <div className="w-full h-12 bg-slate-50 rounded-xl border border-slate-100" />
                  <div className="w-full h-12 bg-[#5B5FC7]/10 rounded-xl border border-[#5B5FC7]/20" />
                  <div className="w-full h-12 bg-slate-50 rounded-xl border border-slate-100" />
                </div>
                <div className="mt-auto mb-4 w-20 h-1 bg-slate-200 rounded-full mx-auto" />
              </div>
              {/* 장식용 뒤쪽 카드 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[550px] bg-white/40 rounded-[3rem] -rotate-6 scale-95 border border-white/20 -z-0 hidden md:block" />
            </div>
          </div>
        </section>

        {/* 푸터 */}
        <footer className="py-12 px-6 border-t border-slate-100 bg-slate-50/50">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-sm font-medium">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-slate-600 font-bold text-base">MyLink</span>
              <p>© 2026 한양대학교 바이브 코딩. All rights reserved.</p>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#5B5FC7] transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <div className="hidden md:block w-1 h-1 bg-slate-300 rounded-full"></div>
              <span className="hidden md:block">Made with ❤️ for Creators</span>
            </div>
          </div>
        </footer>
      </main>
    );
  }

  // --- 대시보드 (로그인 후) ---
  const profile = {
    displayName: userData?.displayName || user.displayName || "User",
    username: userData?.username || user.email?.split("@")[0] || "user",
    bio: userData?.bio || "나만의 링크를 소개해보세요.",
    photoURL: userData?.photoURL || user.photoURL || "https://github.com/shadcn.png",
  };

  return (
    <main className="relative flex min-h-[calc(100vh-64px)] flex-col items-center pt-8 pb-24 px-8 bg-slate-50">
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        {/* 프로필 섹션 */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="w-24 h-24 border-2 border-white shadow-md">
            <AvatarImage src={profile.photoURL} alt={profile.displayName} />
            <AvatarFallback className="bg-slate-200 text-slate-600">
              {profile.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">{profile.displayName}</h1>
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
                onClick={() => handleLinkClick(link.id)}
                className="block transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Card className="hover:border-[#5B5FC7]/50 transition-colors bg-white">
                  <CardContent className="flex items-center p-4">
                    <div className="mr-4 w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full shrink-0">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                        alt={link.title}
                        className="w-6 h-6"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://www.google.com/s2/favicons?domain=linktree.com&sz=64";
                        }}
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
