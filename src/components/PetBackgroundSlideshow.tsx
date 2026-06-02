"use client"

import { useState, useEffect, useRef } from "react"

// ─── 精选高画质宠物照片 ───
const PET_IMAGES = [
  "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=1920&q=80",
]

export default function PetBackgroundSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let firstLoaded = false
    PET_IMAGES.forEach((url) => {
      const img = new Image()
      img.src = url
      img.onload = () => {
        if (!firstLoaded) {
          firstLoaded = true
          setLoaded(true)
        }
      }
      img.onerror = () => {
        if (!firstLoaded) {
          firstLoaded = true
          setLoaded(true)
        }
      }
    })
  }, [])

  useEffect(() => {
    if (!loaded) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PET_IMAGES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [loaded])

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* 底色 fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm via-cream to-rose/60" />

      {/* 图片层 — 6秒轮播 + Ken Burns 缩放 */}
      {PET_IMAGES.map((url, i) => (
        <div
          key={url}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${url})`,
            opacity: i === currentIndex ? 1 : 0,
            transform: i === currentIndex ? "scale(1.05)" : "scale(1)",
            transition: "opacity 2s ease-in-out, transform 6s ease-out",
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* ─── 遮罩层：仅确保文字可读，不遮挡图片 ─── */}

      {/* 1. 全图微暖色调统一（极淡） */}
      <div className="absolute inset-0 bg-gradient-to-br from-caramel/[0.06] via-transparent to-rose/[0.04]" />

      {/* 2. 底部极简渐变 — 只占 30%，半透明暖色 */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-warm/40 via-warm/10 to-transparent" />

      {/* 3. 左侧渐变为左对齐文字提供可读性 */}
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-warm/25 via-warm/5 to-transparent" />

      {/* 4. 极淡边缘柔化 */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-warm/10 to-transparent" />
    </div>
  )
}
