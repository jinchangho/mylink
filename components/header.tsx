"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { user, userData, login, logout, loading } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-[#5B5FC7]">
          MyLink
        </Link>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-20 h-8 bg-slate-100 animate-pulse rounded-md" />
          ) : user ? (
            <>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <User className="w-4 h-4" />
                <span>{userData?.displayName || user.displayName}님</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-slate-500 hover:text-red-500 gap-2"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </Button>
            </>
          ) : (
            <Button 
              onClick={login}
              className="bg-[#5B5FC7] hover:bg-[#4a4db0] text-white gap-2"
            >
              <LogIn className="w-4 h-4" />
              Google로 로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
