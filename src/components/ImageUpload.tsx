"use client"

import { useRef, useState } from "react"

const MAX_WIDTH = 800
const JPEG_QUALITY = 0.8

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      let { width, height } = img
      if (width > MAX_WIDTH) {
        height = (height / width) * MAX_WIDTH
        width = MAX_WIDTH
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export default function ImageUpload({
  value,
  onChange,
}: {
  value: string | undefined
  onChange: (value: string | undefined) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件")
      return
    }

    setLoading(true)
    try {
      const dataUrl = await resizeImage(file)
      onChange(dataUrl)
    } catch {
      alert("图片处理失败，请重试")
    }
    setLoading(false)
    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = ""
  }

  function handleRemove() {
    onChange(undefined)
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
        配图 <span className="text-neutral-400 font-normal">（可选）</span>
      </label>

      {value ? (
        /* Preview */
        <div className="relative rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
          <img
            src={value}
            alt="配图预览"
            className="w-full max-h-48 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            ✕
          </button>
        </div>
      ) : (
        /* Upload button */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center hover:border-neutral-300 hover:bg-neutral-100 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? (
            <span className="text-sm text-neutral-400">处理中...</span>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-neutral-400">
                <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15M17 8L12 3M12 3L7 8M12 3V15" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm text-neutral-500">点击上传图片</span>
              <span className="text-xs text-neutral-400">支持 JPG / PNG / WebP</span>
            </div>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      <p className="text-xs text-neutral-400 mt-1.5">
        图片将自动压缩至 800px 宽以内
      </p>
    </div>
  )
}
