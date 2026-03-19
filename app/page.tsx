import Image from "next/image";
import Link from "next/link";
import { links } from "@/data/links";
import { currentUser } from "@/data/user";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "lucide-react";

export default function Home() {
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

        {/* 링크 목록 */}
        <div className="w-full space-y-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Card className="hover:border-primary transition-colors">
                <CardContent className="flex items-center p-4">
                  {link.icon && (
                    <div className="mr-4 w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full shrink-0">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                        alt={link.title}
                        className="w-6 h-6"
                      />
                    </div>
                  )}
                  <span className="text-lg font-medium">{link.title}</span>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* 설정 버튼 */}
      <div className="fixed bottom-6 right-6">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg hover:shadow-xl transition-all"
          aria-label="설정"
          title="설정"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </main>
  );
}
