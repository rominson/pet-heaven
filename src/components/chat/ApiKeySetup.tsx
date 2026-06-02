"use client"

import { useState } from "react"

export default function ApiKeySetup({
  onSave,
  onBack,
}: {
  onSave: (key: string) => void
  onBack?: () => void
}) {
  const [key, setKey] = useState("")
  const [showTutorial, setShowTutorial] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!key.trim()) return
    onSave(key.trim())
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:py-20">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors mb-6"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M12.5 16.5L6 10L12.5 3.5"/>
          </svg>
          返回聊天
        </button>
      )}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🔑</div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2 font-heading">
          绑定 API Key
        </h1>
        <p className="text-sm text-neutral-500 leading-relaxed">
          聊天功能需要调用 AI 大模型 API，
          <br />
          请输入你的 DeepSeek API Key 开始使用。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all duration-300 font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={!key.trim()}
          className="w-full rounded-xl bg-gradient-to-r from-caramel to-caramel-dark py-3 text-white font-medium shadow-lg shadow-caramel/20 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
        >
          确认绑定
        </button>
      </form>

      <div className="mt-8">
        <button
          onClick={() => setShowTutorial(!showTutorial)}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors mx-auto"
        >
          <span className="text-lg">{showTutorial ? "▼" : "▶"}</span>
          如何获取 DeepSeek API Key？
        </button>

        {showTutorial && (
          <div className="mt-4 p-5 rounded-xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-600 space-y-2 leading-relaxed">
            <p>1. 打开 <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="text-caramel-dark underline underline-offset-2 hover:text-caramel">platform.deepseek.com</a> 并注册/登录账号</p>
            <p>2. 在左侧菜单找到 <strong>API Keys</strong></p>
            <p>3. 点击 <strong>Create API key</strong>，创建一个新密钥</p>
            <p>4. 复制生成的密钥（以 <code>sk-</code> 开头），粘贴到上方输入框</p>
            <p className="text-xs text-neutral-400 pt-2">DeepSeek 新用户注册会赠送一定额度的免费 token，足够日常使用</p>
          </div>
        )}
      </div>
    </div>
  )
}
