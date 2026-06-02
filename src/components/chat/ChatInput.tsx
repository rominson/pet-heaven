"use client"

import { useState, useRef, useCallback } from "react"

export default function ChatInput({
  onSend,
  disabled,
  placeholder = "输入你想对宠物说的话...",
}: {
  onSend: (text: string) => void
  disabled: boolean
  placeholder?: string
}) {
  const [text, setText] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText("")
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }, [text, disabled, onSend])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value)
    // Auto-resize
    const el = e.target
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 160) + "px"
  }

  return (
    <div className="flex items-end gap-2 bg-white border border-neutral-200 rounded-2xl px-4 py-3 shadow-sm">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none text-sm text-neutral-900 placeholder-neutral-400 bg-transparent outline-none leading-relaxed max-h-40"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-caramel to-caramel-dark flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md active:scale-95"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 -ml-0.5">
          <path d="M2.5 17.5L17.5 10L2.5 2.5V8.75L12.5 10L2.5 11.25V17.5Z" />
        </svg>
      </button>
    </div>
  )
}
