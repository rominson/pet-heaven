"use client"

import { communityMemories, type Memory, emotionLabel } from "@/data/sample"
import { useRouter } from "next/navigation"
import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { loadMemories } from "@/lib/data-service"

const emotionIcons: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  nostalgic: "💭",
  calm: "🕊️",
}

const emotionGradients: Record<string, string> = {
  happy: "from-amber-200 to-amber-300",
  sad: "from-indigo-300 to-indigo-400",
  nostalgic: "from-stone-300 to-stone-400",
  calm: "from-emerald-300 to-emerald-400",
}

// 每个圆点的视觉配置（内层稍小，外层稍大，减少拥挤）
const CIRCLE_CONFIGS = [
  { size: "w-14 h-14", duration: 3.5, delay: 0 },
  { size: "w-17 h-17", duration: 4.5, delay: 0.2 },
  { size: "w-13 h-13", duration: 4, delay: 0.5 },
  { size: "w-16 h-16", duration: 5, delay: 0.8 },
  { size: "w-15 h-15", duration: 3, delay: 1.1 },
  { size: "w-14 h-14", duration: 4.5, delay: 0.3 },
  { size: "w-18 h-18", duration: 3.5, delay: 0.6 },
  { size: "w-13 h-13", duration: 5.5, delay: 0.9 },
  { size: "w-16 h-16", duration: 4, delay: 1.3 },
]

const PREVIEW_WIDTH = 260
const PREVIEW_GAP = 16
const PREVIEW_HEIGHT = 220

/** 向日葵螺旋算法 — 生成有机散落的点坐标 */
function phyllotaxisPos(
  index: number,
  total: number,
  cw: number,
  ch: number
): { x: number; y: number } {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  // r 从 0.05（中心）到约 0.50（边缘），充分利用容器空间
  const r = 0.05 + Math.sqrt(index / (total - 1 || 1)) * 0.45
  const angle = index * goldenAngle
  // 小幅伪随机抖动
  const jx = (((index * 7 + 3) % 11) - 5) * 0.3
  const jy = (((index * 13 + 7) % 9) - 4) * 0.3
  // 使用约 90% 的容器空间，保留边缘余量
  const spread = 90
  return {
    x: cw * (0.5 + r * (spread / 100) * Math.cos(angle) + jx / 100),
    y: ch * (0.5 + r * (spread / 100) * Math.sin(angle) + jy / 100),
  }
}

export default function CommunityPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dim, setDim] = useState({ w: 900, h: 700 })

  const [allMemories, setAllMemories] = useState<Memory[]>(communityMemories)
  const [memoriesLoaded, setMemoriesLoaded] = useState(false)

  useEffect(() => {
    const allMem = loadMemories()
    const publicMemories = allMem.filter((m: Memory) => m.isPublic)
    setAllMemories([...communityMemories, ...publicMemories])
    setMemoriesLoaded(true)
  }, [])

  // 分页：每页 50 条
  const PER_PAGE = 50
  const totalPages = Math.ceil(allMemories.length / PER_PAGE)
  const [page, setPage] = useState(0)
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left')
  const [exitingMemories, setExitingMemories] = useState<Memory[]>([])

  const pageMemories = useMemo(
    () => allMemories.slice(page * PER_PAGE, (page + 1) * PER_PAGE),
    [allMemories, page]
  )

  // 翻页：旧圈先走 → 新圈后进（有一段空白间隔）
  const goNext = useCallback(() => {
    if (page >= totalPages - 1 || exitingMemories.length > 0) return
    setSlideDir('left')
    setExitingMemories(pageMemories)
    setTimeout(() => setPage((p) => p + 1), 300)
    setTimeout(() => setExitingMemories([]), 1600)
  }, [page, totalPages, pageMemories, exitingMemories])

  const goPrev = useCallback(() => {
    if (page <= 0 || exitingMemories.length > 0) return
    setSlideDir('right')
    setExitingMemories(pageMemories)
    setTimeout(() => setPage((p) => p - 1), 300)
    setTimeout(() => setExitingMemories([]), 1600)
  }, [page, pageMemories, exitingMemories])

  // 键盘快捷键
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [previewTarget, setPreviewTarget] = useState<Memory | null>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [tipPos, setTipPos] = useState({ left: 0, top: 0, showRight: true })
  const exitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const enterTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)

  // 监听容器尺寸变化
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect
      setDim({ w: width, h: Math.max(400, width * 0.8) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 过渡期间禁止水平滚动条防抖动
  useEffect(() => {
    document.body.style.overflowX = 'hidden'
    return () => { document.body.style.overflowX = '' }
  }, [])

  // 清理动画定时器
  useEffect(() => {
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current)
      if (enterTimer.current) clearTimeout(enterTimer.current)
    }
  }, [])

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, memory: Memory) => {
      if (isTouchDevice) return
      const rect = e.currentTarget.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const vw = window.innerWidth
      const showRight = vw - (cx + PREVIEW_GAP) >= PREVIEW_WIDTH

      setTipPos({
        left: showRight ? cx + PREVIEW_GAP : cx - PREVIEW_GAP - PREVIEW_WIDTH,
        top: Math.max(10, Math.min(cy - PREVIEW_HEIGHT / 2, window.innerHeight - PREVIEW_HEIGHT - 10)),
        showRight,
      })

      // 清除退出/进入定时器
      if (exitTimer.current) clearTimeout(exitTimer.current)
      if (enterTimer.current) clearTimeout(enterTimer.current)

      setHoveredId(memory.id)
      setPreviewTarget(memory)
      setPreviewVisible(false)
      // 先渲染卡片（opacity:0, scale:0.92），下一帧再触发进入动画
      enterTimer.current = setTimeout(() => {
        setPreviewVisible(true)
      }, 20)
    },
    [isTouchDevice]
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null)
    if (enterTimer.current) clearTimeout(enterTimer.current)
    // 立即设置不可见，触发退出动画（0.18s）
    setPreviewVisible(false)
    // 动画播完后清理 DOM
    exitTimer.current = setTimeout(() => {
      setPreviewTarget(null)
    }, 200)
  }, [])

  const handleClick = useCallback((memory: Memory) => {
    setSelectedMemory(memory)
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* ──── Page Header ──── */}
      <div className="text-center mb-10 sm:mb-16">
        <div className="text-4xl mb-4">📖</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2 font-heading">
          温暖故事
        </h1>
        <div className="mx-auto mb-3 w-14 h-px bg-neutral-300" />
        <p className="text-neutral-500 max-w-md mx-auto text-sm">
          每一个故事，都是一份深深的爱
        </p>
      </div>

      {allMemories.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 animate-float">🕊️</div>
          <p className="text-neutral-700 text-lg font-medium mb-2 font-heading">
            还没有公开的故事
          </p>
          <p className="text-neutral-400 text-sm mb-8">
            成为第一个分享温暖故事的人吧
          </p>
          <button className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-caramel to-caramel-dark px-6 py-2.5 text-sm text-white font-medium shadow-lg shadow-caramel/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <span className="relative z-10" onClick={() => router.push("/create-memory")}>
              ✍️ 写下回忆
            </span>
          </button>
        </div>
      ) : (
        <>
          {/* ──── 螺旋散落布局 ──── */}
          <div
            ref={containerRef}
            className="relative w-full mx-auto"
            style={{ minHeight: `${dim.h}px` }}
          >
            {/* 旧圈圈滑出 */}
            {exitingMemories.map((memory, i) => {
              const pos = phyllotaxisPos(i, exitingMemories.length, dim.w, dim.h)
              const cfg = CIRCLE_CONFIGS[i % CIRCLE_CONFIGS.length]
              const gradient =
                emotionGradients[memory.emotion] ?? "from-neutral-300 to-neutral-400"
              const hasImage = !!memory.imageUrl
              const isHovered = false
              const delay = ((i * 7 + 3) % 4) * 0.015
              return (
                <div
                  key={memory.id}
                  className="absolute"
                  style={{
                    left: pos.x,
                    top: pos.y,
                    animation: `circle-out-${slideDir} 1s ease-in ${delay}s both`,
                  }}
                >
                  <div style={{ animation: `float ${cfg.duration}s ease-in-out ${cfg.delay}s infinite` }}>
                    <div
                      className={`${cfg.size} rounded-full overflow-hidden bg-gradient-to-br ${gradient} shadow-md ring-2 ring-white/80`}
                      style={{ transform: "scale(1)", transition: "none" }}
                    >
                      {hasImage ? (
                        <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-2xl drop-shadow-sm">
                          {emotionIcons[memory.emotion] ?? "💕"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            {/* 新圈圈：无退出时正常显示，有退出时滑入 */}
            {pageMemories.map((memory, i) => {
              // 过渡期间跳过与 exitingMemories 重叠的旧页圆圈（避免同一批渲染两次）
              if (exitingMemories.length > 0 && exitingMemories.some(em => em.id === memory.id)) return null
              const pos = phyllotaxisPos(i, pageMemories.length, dim.w, dim.h)
              const cfg = CIRCLE_CONFIGS[i % CIRCLE_CONFIGS.length]
              const gradient =
                emotionGradients[memory.emotion] ?? "from-neutral-300 to-neutral-400"
              const hasImage = !!memory.imageUrl
              const isHovered = hoveredId === memory.id

              const delay = ((i * 7 + 3) % 4) * 0.015

              return (
                <div
                  key={memory.id}
                  className="absolute"
                  style={{
                    left: pos.x,
                    top: pos.y,
                    ...(exitingMemories.length > 0
                      ? {
                          animation: `circle-in-${
                            slideDir === "left" ? "right" : "left"
                          } 1s ease-out ${delay}s both`,
                        }
                      : { transform: "translate(-50%, -50%)" }),
                  }}
                >
                  {/* 浮动动画外层 */}
                  <div
                    style={{
                      animation: `float ${cfg.duration}s ease-in-out ${cfg.delay}s infinite`,
                    }}
                  >
                    {/* 圆形头像内层 — 只负责缩放 */}
                    <div
                      className={`${cfg.size} rounded-full overflow-hidden bg-gradient-to-br ${gradient} shadow-md ring-2 ring-white/80 hover:ring-caramel/40 cursor-pointer`}
                      style={{
                        transform: isHovered ? "scale(1.18)" : "scale(1)",
                        transition: "transform 0.25s ease, box-shadow 0.25s ease",
                      }}
                      onMouseEnter={(e) => handleMouseEnter(e, memory)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleClick(memory)}
                    >
                      {hasImage ? (
                      <img
                        src={memory.imageUrl}
                        alt={memory.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-2xl drop-shadow-sm">
                        {emotionIcons[memory.emotion] ?? "💕"}
                      </span>
                    )}
                  </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 页码指示 */}
          <div className="text-center mt-6 pb-8">
            <span className="text-sm text-neutral-400 tabular-nums">
              {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, allMemories.length)} / {allMemories.length}
            </span>
          </div>
        </>
      )}

      {/* ──── 左右翻页箭头 ──── */}
      {allMemories.length > 0 && (
        <>
          <button
            onClick={goPrev}
            disabled={page === 0 || exitingMemories.length > 0}
            className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-md flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-white hover:shadow-lg hover:-translate-x-0.5 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:shadow-md transition-all duration-300"
            aria-label="上一页"
          >
            <span className="text-xl sm:text-2xl leading-none -ml-0.5">←</span>
          </button>
          <button
            onClick={goNext}
            disabled={page >= totalPages - 1 || exitingMemories.length > 0}
            className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-md flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-white hover:shadow-lg hover:translate-x-0.5 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:shadow-md transition-all duration-300"
            aria-label="下一页"
          >
            <span className="text-xl sm:text-2xl leading-none -mr-0.5">→</span>
          </button>
        </>
      )}

      {/* ──── 悬浮预览卡片 ──── */}
      {!isTouchDevice && previewTarget && (
        <div
          className="fixed z-40 pointer-events-none will-change-transform"
          style={{
            left: tipPos.left,
            top: tipPos.top,
            opacity: previewVisible ? 1 : 0,
            transform: `scale(${previewVisible ? 1 : 0.92})`,
            transformOrigin: tipPos.showRight ? "left center" : "right center",
            transition: "opacity 0.18s ease-out, transform 0.18s ease-out",
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden w-[260px]">
            {previewTarget.imageUrl && (
              <div className="aspect-[16/9] bg-neutral-100 overflow-hidden">
                <img
                  src={previewTarget.imageUrl}
                  alt={previewTarget.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm">{emotionIcons[previewTarget.emotion]}</span>
                <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                  {emotionLabel(previewTarget.emotion)}
                </span>
                <span className="text-[11px] text-neutral-400 ml-auto">{previewTarget.petName}</span>
              </div>
              <h3 className="text-sm font-bold text-neutral-900 mb-1 leading-snug font-heading">
                {previewTarget.title}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3">
                {previewTarget.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ──── 点击弹窗 ──── */}
      {selectedMemory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          onClick={() => setSelectedMemory(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMemory.imageUrl && (
              <div className="aspect-[16/9] bg-neutral-100 overflow-hidden rounded-t-2xl">
                <img
                  src={selectedMemory.imageUrl}
                  alt={selectedMemory.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{emotionIcons[selectedMemory.emotion]}</span>
                  <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                    {emotionLabel(selectedMemory.emotion)}
                  </span>
                  <span className="text-xs text-neutral-400 ml-1">{selectedMemory.petName}</span>
                </div>
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors"
                >
                  ✕
                </button>
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-3 font-heading">
                {selectedMemory.title}
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                {selectedMemory.content}
              </p>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                <span>{selectedMemory.createdAt}</span>
                <span>{selectedMemory.petName} 的主人</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
