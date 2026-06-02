import Link from "next/link"
import { communityMemories, samplePet, emotionLabel } from "@/data/sample"
import HeroClient from "./HeroClient"

// 用于故事区域的宠物照片
const STORY_IMAGES = [
  "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
]

const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1920&q=80"

const emotionIcons: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  nostalgic: "💭",
  calm: "🕊️",
}

const features = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M20 35C20 35 6 25 6 16C6 11 10 7 15 7C17.5 7 19.5 8.5 20 10C20.5 8.5 22.5 7 25 7C30 7 34 11 34 16C34 25 20 35 20 35Z" fill="#D4A574" stroke="#C49464" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M20 12C20 12 18 10 15.5 10C13 10 11 12 11 15C11 18 15 21 20 25C25 21 29 18 29 15C29 12 27 10 24.5 10C22 10 20 12 20 12Z" fill="#FFF8F0" opacity="0.7"/>
      </svg>
    ),
    title: "纪念",
    desc: "为宠物创建专属纪念空间，记录它的故事与模样",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M8 28L12 32L26 18L22 14L8 28Z" fill="#D4A574" stroke="#C49464" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M24 16L28 12" stroke="#C49464" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="27" y="7" width="6" height="6" rx="2" transform="rotate(45 27 7)" fill="#D4A574" stroke="#C49464" strokeWidth="1.2"/>
        <path d="M8 32L6 34" stroke="#C49464" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "记录",
    desc: "写下与宠物的美好回忆，用文字留住每一个温暖瞬间",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="12" cy="20" r="4" fill="#D4A574" stroke="#C49464" strokeWidth="1.2"/>
        <circle cx="28" cy="12" r="4" fill="#D4A574" stroke="#C49464" strokeWidth="1.2"/>
        <circle cx="28" cy="28" r="4" fill="#D4A574" stroke="#C49464" strokeWidth="1.2"/>
        <line x1="15.5" y1="18" x2="24.5" y2="14" stroke="#C49464" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="15.5" y1="22" x2="24.5" y2="26" stroke="#C49464" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: "分享",
    desc: "选择公开你的故事，温暖同样经历过失去的人",
  },
]

export default function Home() {
  const latest = communityMemories.slice(0, 3)

  return (
    <div className="flex flex-col">
      {/* ──────── Hero ──────── */}
      <HeroClient />

      {/* ──────── Features ──────── */}
      <section className="bg-white px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Section header — centered */}
          <div className="mb-16 text-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-3 text-neutral-400">
              What you can do
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-heading">
              在这里，你可以
            </h2>
          </div>

          {/* Features grid — centered, no dividers */}
          <div className="grid sm:grid-cols-3 gap-y-12 sm:gap-y-0">
            {features.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mb-5 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3 font-heading">
                  {item.title}
                </h3>
                <p className="text-neutral-500 leading-relaxed text-sm max-w-56 sm:max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── Full-bleed pet photo banner ──────── */}
      <section className="relative h-[45vh] sm:h-[55vh] overflow-hidden bg-neutral-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BANNER_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 to-transparent" />
      </section>

      {/* ──────── Stories ──────── */}
      <section className="bg-white px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Section header — centered */}
          <div className="mb-16 text-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-3 text-neutral-400">
              Stories
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-heading">
              温暖故事
            </h2>
          </div>

          {/* Story gallery — photo-led, no cards */}
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {latest.map((memory, i) => (
              <article key={memory.id} className="group">
                {/* Photo area */}
                <div
                  className="relative overflow-hidden bg-neutral-100"
                  style={{ paddingBottom: "75%" }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${STORY_IMAGES[i]})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                  {/* Emotion badge */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md bg-white/20 text-white border border-white/20">
                    <span>{emotionIcons[memory.emotion]}</span>
                    <span>{emotionLabel(memory.emotion)}</span>
                  </div>
                </div>

                {/* Story info */}
                <div className="pt-5">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-neutral-900 font-heading leading-snug group-hover:text-neutral-600 transition-colors duration-300">
                      {memory.title}
                    </h3>
                  </div>
                  <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3 mb-3">
                    {memory.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>{memory.petName}</span>
                    <span>{memory.createdAt}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/community"
              className="group inline-flex items-center gap-2.5 text-neutral-700 hover:text-neutral-900 transition-colors text-sm font-medium tracking-wide border-b border-neutral-300 hover:border-neutral-700 pb-1"
            >
              查看全部故事
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
