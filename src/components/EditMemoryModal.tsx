"use client"

import { useState, useEffect } from "react"
import type { Memory } from "@/data/sample"
import ImageUpload from "@/components/ImageUpload"

const emotions = [
  { value: "happy", label: "开心", icon: "😊", activeBg: "bg-amber-100" },
  { value: "nostalgic", label: "怀念", icon: "💭", activeBg: "bg-stone-100" },
  { value: "calm", label: "平静", icon: "🕊️", activeBg: "bg-emerald-100" },
  { value: "sad", label: "感伤", icon: "😢", activeBg: "bg-indigo-100" },
] as const

export default function EditMemoryModal({
  memory,
  isOpen,
  onSave,
  onClose,
}: {
  memory: Memory
  isOpen: boolean
  onSave: (updated: Memory) => void
  onClose: () => void
}) {
  const [title, setTitle] = useState(memory.title)
  const [content, setContent] = useState(memory.content)
  const [imageUrl, setImageUrl] = useState<string | undefined>(memory.imageUrl ?? undefined)
  const [emotion, setEmotion] = useState(memory.emotion)
  const [isPublic, setIsPublic] = useState(memory.isPublic)

  // Reset form when memory changes
  useEffect(() => {
    setTitle(memory.title)
    setContent(memory.content)
    setImageUrl(memory.imageUrl ?? undefined)
    setEmotion(memory.emotion)
    setIsPublic(memory.isPublic)
  }, [memory])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const updated: Memory = {
      ...memory,
      title: title.trim(),
      content: content.trim(),
      imageUrl,
      emotion,
      isPublic,
    }
    onSave(updated)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-lg font-bold text-neutral-900 font-heading">
            ✏️ 编辑回忆
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-300 transition-all duration-300"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
              回忆内容
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-300 transition-all duration-300 resize-y"
              required
            />
          </div>

          {/* Image upload */}
          <ImageUpload value={imageUrl} onChange={setImageUrl} />

          {/* Emotion selector */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              此刻的心情
            </label>
            <div className="grid grid-cols-4 gap-3">
              {emotions.map((e) => {
                const isActive = emotion === e.value
                return (
                  <button
                    key={e.value}
                    type="button"
                    onClick={() => setEmotion(e.value)}
                    className={`relative rounded-xl py-3 text-center text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? `${e.activeBg} text-neutral-900 ring-2 ring-neutral-300 -translate-y-0.5`
                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 hover:-translate-y-0.5"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neutral-400" />
                    )}
                    <div className="text-xl mb-0.5">{e.icon}</div>
                    {e.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Public/Private toggle */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              是否公开
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`relative rounded-xl py-3.5 text-center text-sm font-medium transition-all duration-300 ${
                  isPublic
                    ? "bg-neutral-100 text-neutral-900 ring-2 ring-neutral-300"
                    : "bg-neutral-100/50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                }`}
              >
                <div className="text-lg">🌍</div>
                公开
                <div className="text-xs font-normal mt-0.5 text-neutral-400">在温暖故事中展示</div>
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`relative rounded-xl py-3.5 text-center text-sm font-medium transition-all duration-300 ${
                  !isPublic
                    ? "bg-neutral-100 text-neutral-900 ring-2 ring-neutral-300"
                    : "bg-neutral-100/50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                }`}
              >
                <div className="text-lg">🔒</div>
                私密
                <div className="text-xs font-normal mt-0.5 text-neutral-400">仅自己可见</div>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!title.trim() || !content.trim()}
            className="group relative w-full rounded-xl bg-gradient-to-r from-caramel to-caramel-dark py-3 text-white font-medium shadow-lg shadow-caramel/20 hover:shadow-xl hover:shadow-caramel/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <span className="relative z-10">保存更改</span>
          </button>
        </form>
      </div>
    </div>
  )
}
