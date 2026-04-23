"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowLeft, Trash2, Pencil, Check, X, LogIn, Lock, User, Save, Loader2, AlertCircle } from "lucide-react";
import { useLinks } from "@/components/link-provider";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";

export default function MyPage() {
  const { user, userData, loading: authLoading, login } = useAuth();
  const { links, addLink, updateLink, removeLink, loading: linksLoading } = useLinks();
  
  // Profile states
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Link states
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<{ id: string; title: string } | null>(null);

  // Initialize profile states when userData is available
  useEffect(() => {
    if (userData) {
      setUsername(userData.username || "");
      setDisplayName(userData.displayName || "");
      setBio(userData.bio || "");
    }
  }, [userData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isUpdatingProfile) return;

    setIsUpdatingProfile(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      // 1. Username Uniqueness Check (only if changed)
      if (username !== userData?.username) {
        // Basic validation for username
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
          throw new Error("사용자 이름은 3~20자의 영문, 숫자, 언더바(_)만 가능합니다.");
        }

        const q = query(collection(db, "users"), where("profile.username", "==", username));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          throw new Error("이미 사용 중인 이름입니다. 다른 이름을 입력해주세요.");
        }
      }

      // 2. Update Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        "profile.username": username,
        "profile.displayName": displayName,
        "profile.bio": bio,
        "updated_at": new Date(),
      });

      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (error: any) {
      console.error("Profile update failed:", error);
      setProfileError(error.message || "프로필 저장 중 오류가 발생했습니다.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || isAdding) return;
    
    setIsAdding(true);
    const success = await addLink(title, url);
    setIsAdding(false);
    
    if (success) {
      setTitle("");
      setUrl("");
    } else {
      alert("올바른 주소 형식이 아닙니다. (예: google.com 또는 https://google.com)");
    }
  };

  const handleEditStart = (id: string, currentTitle: string, currentUrl: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
    setEditUrl(currentUrl);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
  };

  const handleUpdateLink = async (id: string) => {
    if (!editTitle || !editUrl || isUpdating) return;

    setIsUpdating(true);
    const success = await updateLink(id, editTitle, editUrl);
    setIsUpdating(false);

    if (success) {
      setEditingId(null);
      setEditTitle("");
      setEditUrl("");
    } else {
      alert("올바른 주소 형식이 아닙니다. (예: google.com 또는 https://google.com)");
    }
  };

  const handleDeleteRequest = (id: string, title: string) => {
    setLinkToDelete({ id, title });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!linkToDelete) return;
    await removeLink(linkToDelete.id);
    setIsDeleteDialogOpen(false);
    setLinkToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setLinkToDelete(null);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B5FC7]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-50 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 max-w-lg w-full space-y-6">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <Lock className="w-10 h-10 text-[#5B5FC7]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">링크 관리는 로그인 후 가능합니다</h1>
            <p className="text-slate-500 leading-relaxed">
              자신만의 링크를 추가하고 수정하려면 구글 계정으로 로그인이 필요합니다.<br/>
              지금 로그인하고 나만의 링크 페이지를 완성해보세요!
            </p>
          </div>
          <Button 
            onClick={login}
            size="lg"
            className="w-full bg-[#5B5FC7] hover:bg-[#4a4db0] text-white py-8 rounded-2xl text-lg font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] gap-3"
          >
            <LogIn className="w-6 h-6" />
            Google 계정으로 로그인하기
          </Button>
          <Link href="/" className="block text-sm text-slate-400 hover:text-[#5B5FC7] transition-colors pt-2">
            메인 페이지 구경하기
          </Link>
        </div>
      </main>
    );
  }

  const loading = linksLoading || authLoading;

  return (
    <div className={`max-w-xl mx-auto p-6 space-y-8 min-h-screen bg-slate-50/50 transition-opacity duration-300 ${loading ? "opacity-70 pointer-events-none" : "opacity-100"}`}>
      <div className="flex items-center justify-start">
        <Link href="/">
          <Button variant="outline" size="default" className="gap-2 text-slate-600 hover:text-[#5B5FC7] hover:border-[#5B5FC7] bg-white shadow-sm border-slate-200 transition-all font-medium" disabled={loading}>
            <ArrowLeft className="w-4 h-4" />
            메인으로 돌아가기
          </Button>
        </Link>
      </div>

      <header className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">내 페이지 관리</h1>
        <p className="text-slate-500 font-medium">프로필 정보와 링크를 자유롭게 관리하세요.</p>
      </header>

      {/* 프로필 수정 섹션 */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <User className="w-5 h-5 text-[#5B5FC7]" />
          <h2 className="text-xl font-bold text-slate-800">프로필 설정</h2>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-sm font-bold text-slate-800 ml-1">
              사용자 이름 (URL 핸들)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                mylink.com/
              </span>
              <input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                disabled={isUpdatingProfile}
                className="w-full pl-[105px] pr-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium outline-none focus:ring-2 focus:ring-[#5B5FC7]/30 focus:border-[#5B5FC7] transition-all placeholder:text-slate-400 disabled:bg-slate-50"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="displayName" className="text-sm font-bold text-slate-800 ml-1">
              표시 이름
            </label>
            <input
              id="displayName"
              type="text"
              placeholder="표시될 이름을 입력하세요"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isUpdatingProfile}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium outline-none focus:ring-2 focus:ring-[#5B5FC7]/30 focus:border-[#5B5FC7] transition-all placeholder:text-slate-400 disabled:bg-slate-50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bio" className="text-sm font-bold text-slate-800 ml-1">
              소개글
            </label>
            <textarea
              id="bio"
              placeholder="자신을 짧게 소개해주세요"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isUpdatingProfile}
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium outline-none focus:ring-2 focus:ring-[#5B5FC7]/30 focus:border-[#5B5FC7] transition-all placeholder:text-slate-400 disabled:bg-slate-50 resize-none"
            />
          </div>

          {profileError && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              <AlertCircle className="w-4 h-4" />
              {profileError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isUpdatingProfile}
            className={`w-full py-7 text-base font-bold text-white rounded-xl shadow-lg transition-all active:scale-[0.98] gap-2 ${profileSuccess ? "bg-green-600 hover:bg-green-700" : "bg-slate-900 hover:bg-slate-800"}`}
          >
            {isUpdatingProfile ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                저장 중...
              </>
            ) : profileSuccess ? (
              <>
                <Check className="w-5 h-5" />
                저장 완료!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                프로필 저장하기
              </>
            )}
          </Button>
        </form>
      </section>

      {/* 링크 추가 섹션 */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
        {loading && <div className="absolute top-0 left-0 w-full h-1 bg-[#5B5FC7]/20"><div className="h-full bg-[#5B5FC7] animate-progress-bar"></div></div>}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <Pencil className="w-5 h-5 text-[#5B5FC7]" />
          <h2 className="text-xl font-bold text-slate-800">새 링크 추가</h2>
        </div>
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
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium outline-none focus:ring-2 focus:ring-[#5B5FC7]/30 focus:border-[#5B5FC7] transition-all placeholder:text-slate-400 disabled:bg-slate-50"
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
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium outline-none focus:ring-2 focus:ring-[#5B5FC7]/30 focus:border-[#5B5FC7] transition-all placeholder:text-slate-400 disabled:bg-slate-50"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-7 text-base font-bold text-white rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#5B5FC7" }}
          >
            {loading ? "처리 중..." : "링크 추가하기"}
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
              <Card key={link.id} className={`group relative hover:border-[#5B5FC7]/40 hover:shadow-md transition-all duration-300 bg-white ${editingId === link.id ? "ring-2 ring-[#5B5FC7]/20 border-[#5B5FC7]" : ""}`}>
                <CardHeader className="p-5 flex flex-row items-center justify-between">
                  {editingId === link.id ? (
                    <div className="flex-1 space-y-3 pr-4">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-1.5 text-base font-bold border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#5B5FC7]/30 focus:border-[#5B5FC7]"
                        placeholder="제목"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#5B5FC7]/30 focus:border-[#5B5FC7]"
                        placeholder="URL"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1 overflow-hidden pr-4 flex-1">
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
                  )}

                  <div className="flex items-center gap-1">
                    {editingId === link.id ? (
                      <>
                        <button 
                          onClick={() => handleUpdateLink(link.id)}
                          disabled={isUpdating}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="저장"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={handleEditCancel}
                          disabled={isUpdating}
                          className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                          title="취소"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleEditStart(link.id, link.title, link.url)}
                          disabled={loading}
                          className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                          title="수정"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRequest(link.id, link.title)}
                          disabled={loading}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 삭제 확인 모달 */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">정말 삭제하시겠습니까?</h3>
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-900">[{linkToDelete?.title}]</span> 링크가 삭제됩니다.
                </p>
                <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
                  <p className="text-sm text-red-600 font-medium">
                    ⚠️ 이 작업은 되돌릴 수 없습니다.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleDeleteCancel}
                  className="flex-1 py-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  취소
                </Button>
                <Button 
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-6 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-200 border-none transition-all active:scale-95"
                >
                  삭제하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
