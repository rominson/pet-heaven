import type { Metadata } from "next"
import { Noto_Serif_SC } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import AmbientBackground from "@/components/AmbientBackground"

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "宠物天堂 - 爱，从未离开",
  description: "为每一个离开的小天使，保留永恒的温暖",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`${notoSerif.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col">
        <AmbientBackground />
        <div className="relative z-10 flex flex-col flex-1">
          <Header />
          <main className="flex-1">{children}</main>
        </div>

        <footer className="border-t border-neutral-200 bg-neutral-50 mt-auto">
          <div className="mx-auto max-w-5xl px-4 py-10 text-center">
            <p className="text-base font-semibold text-neutral-700 mb-1 font-heading">
              宠物天堂
            </p>
            <p className="text-sm text-neutral-400">
              爱，从未离开 —— 愿每一个离开的小天使都能在这里找到永恒的温暖
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
