"use client"

import { useEffect } from "react"

export default function DeleteConfirmDialog({
  memoryTitle,
  isOpen,
  onConfirm,
  onCancel,
}: {
  memoryTitle: string
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-neutral-900 mb-2 font-heading">
            确认删除
          </h3>
          <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
            确定要删除「{memoryTitle}」吗？
            <br />
            此操作不可撤销。
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-600 font-medium hover:bg-neutral-50 transition-all duration-300"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-neutral-800 px-4 py-2.5 text-sm text-white font-medium hover:bg-neutral-900 transition-all duration-300"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
