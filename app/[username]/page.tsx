"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { collection, query, where, getDocs, orderBy, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User as UserData } from "@/data/user";
import { Link as LinkType } from "@/data/links";
import { useAuth } from "@/components/auth-provider";

export default function UserPublicPage() {
  const params = useParams();
  const username = params.username as string;
  const { user } = useAuth();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // 1. Find user by profile.username
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("profile.username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setExists(false);
          setLoading(false);
          return;
        }

        // Get the first matching user
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();
        const userId = userDoc.id;

        setUserData({
          uid: userId,
          email: data.email,
          ...data.profile
        } as UserData);

        // 2. Fetch links for this userId
        const linksRef = collection(db, "users", userId, "links");
        const linksQuery = query(linksRef, orderBy("createdAt", "desc"));
        const linksSnapshot = await getDocs(linksQuery);
        
        const linksData: LinkType[] = [];
        linksSnapshot.forEach((doc) => {
          linksData.push({ id: doc.id, ...doc.data() } as LinkType);
        });
        setLinks(linksData);
      } catch (error) {
        console.error("Error fetching public profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  const handleLinkClick = async (linkId: string) => {
    // 3. 에러 처리 - 로그인 확인
    if (!user) {
      console.error("로그인이 필요합니다. 클릭 카운트가 저장되지 않습니다.");
      return;
    }

    if (!userData?.uid) return;

    try {
      // 2. Firestore에 클릭 카운트 저장 users/{userId}/links/{linkId} 문서에 clickCount 필드
      // 동시 클릭해도 정확하게 카운트 서버에서 안전하게 처리
      const linkRef = doc(db, "users", userData.uid, "links", linkId);
      await updateDoc(linkRef, {
        clickCount: increment(1)
      });
    } catch (error) {
      console.error("클릭 카운트 저장 중 오류 발생:", error);
    }
  };

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

  if (!exists) {
    return notFound();
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center pt-12 pb-24 px-8 bg-slate-50">
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        {/* 프로필 섹션 */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="w-24 h-24 border-2 border-white shadow-md">
            <AvatarImage src={userData?.photoURL} alt={userData?.displayName} />
            <AvatarFallback className="bg-slate-200 text-slate-600 text-2xl">
              {userData?.displayName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">{userData?.displayName}</h1>
            <p className="text-sm font-medium text-[#5B5FC7]">@{userData?.username}</p>
            {userData?.bio && (
              <p className="text-sm text-slate-500 whitespace-pre-line mt-2">{userData.bio}</p>
            )}
          </div>
        </div>

        {/* 링크 목록 */}
        <div className="w-full space-y-4">
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
                <Card className="hover:border-[#5B5FC7]/50 transition-colors bg-white shadow-sm border-slate-100">
                  <CardContent className="flex items-center p-4">
                    <div className="mr-4 w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full shrink-0 border border-slate-100">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                        alt={link.title}
                        className="w-6 h-6"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://www.google.com/s2/favicons?domain=linktree.com&sz=64";
                        }}
                      />
                    </div>
                    <span className="text-lg font-bold text-slate-800">{link.title}</span>
                  </CardContent>
                </Card>
              </a>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
              아직 등록된 링크가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 푸터 로고 */}
      <div className="fixed bottom-8 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full shadow-sm">
        <span className="text-xs font-bold text-slate-400">Created with</span>
        <span className="text-xs font-black text-[#5B5FC7]">MyLink</span>
      </div>
    </main>
  );
}
