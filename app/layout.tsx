import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { LinkProvider } from "@/components/link-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Header } from "@/components/header";

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>
          <AuthProvider>
            <LinkProvider>
              <Header />
              <div className="pt-16">
                {children}
              </div>
            </LinkProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
