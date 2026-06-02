"use client"

import { useRouter } from "next/navigation"
import { samplePet } from "@/data/sample"
import PetAvatar from "@/components/PetAvatar"
import ScrollReveal from "@/components/ScrollReveal"
import ImageUpload from "@/components/ImageUpload"
import { useState } from "react"
import { saveMemory } from "@/lib/data-service"

const emotions = [
  { value: "happy", label: "开心", icon: "😊", activeBg: "bg-amber-100" },
  { value: "nostalgic", label: "怀念", icon: "💭", activeBg: "bg-stone-100" },
  { value: "calm", label: "平静", icon: "🕊️", activeBg: "bg-emerald-100" },
  { value: "sad", label: "感伤", icon: "😢", activeBg: "bg-indigo-100" },
] as const

export default function CreateMemoryPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [emotion, setEmotion] = useState<"happy" | "sad" | "nostalgic" | "calm">("happy")
  const [isPublic, setIsPublic] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const newMemory = {
      id: `m${Date.now()}`,
      petId: samplePet.id,
      petName: samplePet.name,
      title: title.trim(),
      content: content.trim(),
      imageUrl,
      emotion,
      isPublic,
      createdAt: new Date().toISOString().slice(0, 10),
    }

    await saveMemory(newMemory)
    setSubmitted(true)
    setTitle("")
    setContent("")
    setImageUrl("")
    setEmotion("happy")
    setIsPublic(true)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-20 text-center">
        <ScrollReveal>
          <div className="px-8 sm:px-12 py-14 sm:py-16">
            <div className="flex justify-center gap-2 mb-6">
              <span className="text-4xl animate-float" style={{ animationDelay: "0.5s" }}>
                💕
              </span>
            </div>

            <h1 className="text-2xl font-bold text-neutral-900 mb-3 font-heading">
              回忆已珍藏
            </h1>
            <p className="text-neutral-500 mb-8 leading-relaxed text-sm">
              你与{samplePet.name}的故事已经珍藏好了。
              <br />
              爱不会消失，它只是换了一种方式存在。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setSubmitted(false)}
                className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-caramel to-caramel-dark px-6 py-2.5 text-sm text-white font-medium shadow-lg shadow-caramel/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <span className="relative z-10">再写一条</span>
              </button>
              <button
                onClick={() => router.push(`/memorial/${samplePet.id}`)}
                className="rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm text-neutral-600 font-medium hover:bg-neutral-50 hover:-translate-y-0.5 transition-all duration-300"
              >
                回到纪念空间
              </button>
              <button
                onClick={() => router.push("/community")}
                className="rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm text-neutral-600 font-medium hover:bg-neutral-50 hover:-translate-y-0.5 transition-all duration-300"
              >
                看看温暖故事
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <ScrollReveal>
        <div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => router.back()}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-700 transition-all duration-300 shrink-0"
                aria-label="返回"
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M12.5 16.5L6 10L12.5 3.5"/>
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-neutral-900 font-heading">
                ✍️ 写下回忆
              </h1>
            </div>

            {/* Pet selector */}
            <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
              <PetAvatar species={samplePet.species} name={samplePet.name} size="sm" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  为 {samplePet.name} 记录回忆
                </p>
                <p className="text-xs text-neutral-400">
                  {samplePet.species} · {samplePet.breed}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                  标题
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="给你的回忆取个名字..."
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
                  placeholder={`写下你想对${samplePet.name}说的话，或者一个让你难忘的故事...`}
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
                    <div className="text-xs font-normal mt-0.5 text-neutral-400">
                      在温暖故事中展示
                    </div>
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
                    <div className="text-xs font-normal mt-0.5 text-neutral-400">
                      仅自己可见
                    </div>
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
                <span className="relative z-10">保存回忆</span>
              </button>
            </form>
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}
