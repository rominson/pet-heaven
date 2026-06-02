"use client"

import { useState } from "react"
import type { Memory } from "@/data/sample"
import { emotionLabel } from "@/data/sample"

const emotionStyles: Record<
  string,
  { bg: string; border: string; iconBg: string; glow: string }
> = {
  happy: {
    bg: "from-amber-100/60 to-amber-200/40",
    border: "border-amber-200/30",
    iconBg: "from-amber-200 to-amber-300",
    glow: "rgba(251, 191, 36, 0.12)",
  },
  sad: {
    bg: "from-indigo-100/40 to-indigo-200/20",
    border: "border-indigo-200/20",
    iconBg: "from-indigo-200 to-indigo-300/30",
    glow: "rgba(99, 102, 241, 0.12)",
  },
  nostalgic: {
    bg: "from-stone-100/50 to-stone-200/30",
    border: "border-stone-200/40",
    iconBg: "from-stone-200 to-stone-300",
    glow: "rgba(120, 113, 108, 0.15)",
  },
  calm: {
    bg: "from-emerald-100/60 to-emerald-200/20",
    border: "border-emerald-200",
    iconBg: "from-emerald-100 to-emerald-200/30",
    glow: "rgba(52, 211, 153, 0.15)",
  },
}

const emotionIcons: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  nostalgic: "💭",
  calm: "🕊️",
}

export default function MemoryCard({
  memory,
  showPetName,
  onEdit,
  onDelete,
}: {
  memory: Memory
  showPetName?: boolean
  onEdit?: (memory: Memory) => void
  onDelete?: (memory: Memory) => void
}) {
  const style = emotionStyles[memory.emotion] ?? emotionStyles.calm
  const [imgLoaded, setImgLoaded] = useState(false)
  const hasImage = !!memory.imageUrl

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all duration-300">
      {/* Action buttons — only when callbacks provided */}
      {(onEdit || onDelete) && (
        <div className="absolute top-3 right-3 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(memory) }}
              className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-neutral-500 hover:text-neutral-700 hover:bg-white transition-all duration-200"
              title="编辑"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path d="M11.5 1.5L14.5 4.5L5.5 13.5L1 15L2.5 10.5L11.5 1.5Z" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(memory) }}
              className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-neutral-500 hover:text-red-500 hover:bg-white transition-all duration-200"
              title="删除"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path d="M2 4H14M5 4V2.5C5 2.22386 5.22386 2 5.5 2H10.5C10.7761 2 11 2.22386 11 2.5V4M6.5 7V12M9.5 7V12M3.5 4L4.5 13.5C4.5 13.7761 4.72386 14 5 14H11C11.2761 14 11.5 13.7761 11.5 13.5L12.5 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      )}
      {/* Image area */}
      {hasImage && (
        <div className="relative overflow-hidden bg-neutral-100" style={{ aspectRatio: "16/9" }}>
          <img
            src={memory.imageUrl}
            alt={memory.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Loading shimmer */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
          )}

          {/* Emotion badge overlaid on image */}
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md bg-white/80 text-neutral-700 shadow-sm">
            <span>{emotionIcons[memory.emotion] ?? "💕"}</span>
            <span>{emotionLabel(memory.emotion)}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {!hasImage && (
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${style.iconBg} text-sm shadow-sm`}
              >
                {emotionIcons[memory.emotion] ?? "💕"}
              </span>
            )}
            <div>
              {!hasImage && (
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-gradient-to-r ${style.bg} text-neutral-700 border ${style.border}`}
                >
                  {emotionLabel(memory.emotion)}
                </span>
              )}
              {showPetName && (
                <span className="text-xs text-neutral-400 ml-1">
                  {memory.petName}
                </span>
              )}
            </div>
          </div>
          <span className="text-xs text-neutral-400 ml-2 shrink">
            {memory.createdAt}
          </span>
        </div>

        <h3 className="text-base font-bold text-neutral-900 mb-2 leading-snug group-hover:text-neutral-600 transition-colors duration-300">
          {memory.title}
        </h3>

        <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line line-clamp-3">
          {memory.content}
        </p>
      </div>
    </article>
  )
}
