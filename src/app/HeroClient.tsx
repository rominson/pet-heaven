"use client"

import Link from "next/link"
import { samplePet } from "@/data/sample"
import { useEffect, useRef, useState } from "react"
import PetBackgroundSlideshow from "@/components/PetBackgroundSlideshow"

export default function HeroClient() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 页面加载后触发入场动画
    requestAnimationFrame(() => setVisible(true))
  }, [])

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* ─── 全屏宠物图轮播 ─── */}
      <PetBackgroundSlideshow />

      {/* ─── 左侧浮动内容 ─── */}
      <div
        ref={contentRef}
        className="relative z-10 w-full px-6 sm:px-12 md:px-20 lg:px-28"
      >
        <div
          className="max-w-xl transition-all duration-[1200ms] ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          {/* 装饰线条 */}
          <div className="mb-8">
            <span className="block w-16 h-[2px] rounded-full bg-gradient-to-r from-caramel/70 via-caramel to-caramel/70" />
          </div>

          {/* 主标题 */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-5 font-heading leading-[1.15]">
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #FFF8F0 0%, #FFFAF5 40%, #FCE8D5 100%)",
                textShadow: "0 2px 20px rgba(0,0,0,0.15)",
              }}
            >
              宠物天堂
            </span>
          </h1>

          {/* 副标题 */}
          <p
            className="text-xl sm:text-2xl md:text-3xl font-medium mb-6 tracking-wide"
            style={{
              color: "#F5E6D3",
              textShadow: "0 2px 12px rgba(0,0,0,0.25)",
            }}
          >
            爱，从未离开
          </p>

          {/* 分隔 */}
          <div className="mb-8 w-12 h-px bg-gradient-to-r from-cream/60 via-cream/20 to-transparent" />

          {/* 描述文字 */}
          <p
            className="max-w-lg leading-relaxed mb-12 text-base sm:text-lg"
            style={{
              color: "rgba(255,250,245,0.85)",
              textShadow: "0 1px 8px rgba(0,0,0,0.2)",
            }}
          >
            每一个离开的小天使，都值得被永远铭记。
            在这里，为心爱的宠物建立一个温暖的纪念空间，
            让爱以另一种方式延续。
          </p>

          {/* CTA 按钮组 */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href={`/memorial/${samplePet.id}`}
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-caramel to-caramel-dark px-9 py-3.5 text-white font-medium shadow-xl shadow-caramel/30 hover:shadow-2xl hover:shadow-caramel/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative z-10 flex items-center gap-2">
                🏠 进入纪念空间
              </span>
            </Link>
            <Link
              href="/community"
              className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-medium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              style={{
                color: "rgba(255,250,245,0.9)",
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <span>📖 看看温暖故事</span>
              <span className="text-sm opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-1.5 transition-all duration-300">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 底部滚动指示符 ─── */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-1000"
        style={{ opacity: visible ? 0.4 : 0 }}
      >
        <span
          className="text-xs tracking-[0.2em]"
          style={{ color: "rgba(255,250,245,0.6)" }}
        >
          向下滚动
        </span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
          <span className="w-1 h-2 rounded-full bg-cream/50 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
