"use client"

import { useParams, useRouter } from "next/navigation"
import { samplePet, sampleMemories, type Memory } from "@/data/sample"
import type { StoredPet } from "@/lib/data-service"
import { loadPet, savePet, loadMemories, saveMemory, deleteMemory as deleteMemorySvc } from "@/lib/data-service"
import PetAvatar from "@/components/PetAvatar"
import MemoryCard from "@/components/MemoryCard"
import EditMemoryModal from "@/components/EditMemoryModal"
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog"
import ChatPanel from "@/components/chat/ChatPanel"
import ScrollReveal from "@/components/ScrollReveal"
import { useMemo, useState, useEffect } from "react"

const personalityStyles: Record<string, string> = {
  温柔: "bg-neutral-100 text-neutral-700",
  活泼: "bg-neutral-100 text-neutral-700",
  贪吃: "bg-stone-100 text-stone-700",
  粘人: "bg-neutral-100 text-neutral-700",
  胆小: "bg-neutral-100 text-neutral-600",
  勇敢: "bg-stone-100 text-stone-700",
  安静: "bg-neutral-100 text-neutral-600",
  调皮: "bg-neutral-100 text-neutral-700",
}

const DEFAULT_PERSONALITIES = ["温柔", "活泼", "贪吃", "粘人"]

export default function MemorialPage() {
  const params = useParams()
  const router = useRouter()

  const [petData, setPetData] = useState<StoredPet | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [deletingMemory, setDeletingMemory] = useState<Memory | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [chatOpen, setChatOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [localMemories, setLocalMemories] = useState<Memory[]>([])
  const [displayMemories, setDisplayMemories] = useState<Memory[]>([])

  // 编辑表单字段
  const [formName, setFormName] = useState("")
  const [formSpecies, setFormSpecies] = useState("")
  const [formBreed, setFormBreed] = useState("")
  const [formGender, setFormGender] = useState("")
  const [formBirthday, setFormBirthday] = useState("")
  const [formPassAway, setFormPassAway] = useState("")
  const [formBio, setFormBio] = useState("")

  // 从 Supabase / localStorage 加载数据
  async function loadAll() {
    const [pet, allMem] = await Promise.all([loadPet(), loadMemories()])
    if (pet) setPetData(pet)
    const localOnly = allMem.filter((m: Memory) => m.petId === params.id)
    setLocalMemories(localOnly)
    setDisplayMemories(
      localOnly.length > 0
        ? [...localOnly, ...sampleMemories.filter((m) => m.petId === params.id)]
        : []
    )
    setLoaded(true)
  }

  useEffect(() => { loadAll() }, [params.id, refreshKey])

  async function handleSavePet(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim()) return
    const data: StoredPet = {
      name: formName.trim(),
      species: formSpecies.trim() || "未知",
      breed: formBreed.trim() || "未知",
      gender: formGender.trim() || "未知",
      birthday: formBirthday.trim() || "未知",
      passAwayDate: formPassAway.trim() || "未知",
      bio: formBio.trim() || "还没有填写介绍",
      personality: DEFAULT_PERSONALITIES,
    }
    await savePet(data)
    setPetData(data)
    setShowForm(false)
  }

  function handleEdit(memory: Memory) {
    setEditingMemory(memory)
  }

  function handleSave(updated: Memory) {
    saveMemory(updated)
    setEditingMemory(null)
    setRefreshKey((k) => k + 1)
  }

  function handleDeleteRequest(memory: Memory) {
    setDeletingMemory(memory)
  }

  async function handleDeleteConfirm() {
    if (!deletingMemory) return
    await deleteMemorySvc(deletingMemory.id)
    setDeletingMemory(null)
    setRefreshKey((k) => k + 1)
  }

  const privateCount = displayMemories.filter((m) => !m.isPublic).length
  const publicCount = displayMemories.filter((m) => m.isPublic).length

  if (!loaded) return null

  // ─── 无宠物数据 → 引导创建 ───
  if (!petData) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🕊️</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3 font-heading">
              创建纪念空间
            </h1>
            <p className="text-neutral-500 text-sm max-w-sm mx-auto leading-relaxed">
              为你的宠物创建一个专属的纪念空间，
              <br />
              记录它的故事与模样。
            </p>
          </div>
        </ScrollReveal>

        {showForm ? (
          <ScrollReveal delay={100}>
            <form onSubmit={handleSavePet} className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-1.5">名字 *</label>
                  <input type="text" value={formName} onChange={e => setFormName(e.target.value)}
                    placeholder="宠物的名字" required
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all duration-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-1.5">种类</label>
                  <input type="text" value={formSpecies} onChange={e => setFormSpecies(e.target.value)}
                    placeholder="狗 / 猫 / ..."
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all duration-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-1.5">品种</label>
                  <input type="text" value={formBreed} onChange={e => setFormBreed(e.target.value)}
                    placeholder="金毛 / 布偶 / ..."
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all duration-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-1.5">性别</label>
                  <input type="text" value={formGender} onChange={e => setFormGender(e.target.value)}
                    placeholder="男孩 / 女孩"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all duration-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-1.5">出生日期</label>
                  <input type="text" value={formBirthday} onChange={e => setFormBirthday(e.target.value)}
                    placeholder="2020年3月20日"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all duration-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-1.5">离开日期</label>
                  <input type="text" value={formPassAway} onChange={e => setFormPassAway(e.target.value)}
                    placeholder="2024年8月15日"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all duration-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-1.5">介绍</label>
                <textarea value={formBio} onChange={e => setFormBio(e.target.value)} rows={3}
                  placeholder="写一段关于它的介绍..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all duration-300 resize-y" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={!formName.trim()}
                  className="flex-1 rounded-xl bg-gradient-to-r from-caramel to-caramel-dark py-3 text-white font-medium shadow-lg shadow-caramel/20 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300">
                  保存
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm text-neutral-600 font-medium hover:bg-neutral-50 transition-all duration-300">
                  取消
                </button>
              </div>
            </form>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={150}>
            <div className="text-center">
              <button onClick={() => setShowForm(true)}
                className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-caramel to-caramel-dark px-8 py-3.5 text-white font-medium shadow-xl shadow-caramel/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative z-10">🐾 添加我的宠物</span>
              </button>
            </div>
          </ScrollReveal>
        )}
      </div>
    )
  }

  // ─── 有宠物数据 → 显示纪念空间 ───
  const pet = petData

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* ──── Pet Profile Header ──── */}
      <ScrollReveal>
        <div className="bg-white border border-neutral-200 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <PetAvatar species={pet.species} name={pet.name} size="lg" />
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1 font-heading">
                {pet.name}
                <span className="ml-2 text-base font-normal text-neutral-400 font-sans">
                  {pet.species} / {pet.breed}
                </span>
              </h1>
              <p className="text-sm text-neutral-400 mb-4">
                {pet.gender} · {pet.birthday} — {pet.passAwayDate}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                {pet.personality.map((trait) => (
                  <span key={trait}
                    className={`text-xs px-3 py-1.5 rounded-full border border-neutral-200 ${
                      personalityStyles[trait] ?? "bg-neutral-100 text-neutral-600"
                    } font-medium transition-all duration-300 hover:shadow-sm`}>
                    {trait}
                  </span>
                ))}
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                {pet.bio}
              </p>
            </div>
            {/* Chat button */}
            <button
              onClick={() => setChatOpen(true)}
              className="shrink-0 self-start sm:self-center rounded-full bg-gradient-to-r from-caramel to-caramel-dark px-4 py-2 text-sm text-white font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-1.5"
            >
              <span>💬</span>
              <span>和它聊天</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* ──── Actions bar ──── */}
      <ScrollReveal delay={100}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="text-sm text-neutral-400">
            <span className="text-neutral-700 font-semibold">
              {displayMemories.length}
            </span>{" "}
            条回忆
            {displayMemories.length > 0 && (
              <span className="ml-1.5">
                ·{" "}
                <span className="text-neutral-700 font-medium">
                  {publicCount}
                </span>{" "}
                条公开 ·{" "}
                <span className="text-neutral-700 font-medium">
                  {privateCount}
                </span>{" "}
                条私密
              </span>
            )}
          </div>
          <button
            onClick={() => router.push("/create-memory")}
            className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-caramel to-caramel-dark px-5 py-2.5 text-sm text-white font-medium shadow-lg shadow-caramel/20 hover:shadow-xl hover:shadow-caramel/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden self-stretch sm:self-auto"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <span className="relative z-10">✍️ 写下回忆</span>
          </button>
        </div>
      </ScrollReveal>

      {/* ──── Memories list ──── */}
      {localMemories.length === 0 ? (
        <ScrollReveal delay={150}>
          <div className="px-8 sm:px-12 py-14 sm:py-16 text-center border border-neutral-200 bg-white">
            <div className="text-5xl mb-4 animate-float">🕊️</div>
            <p className="text-neutral-700 text-lg font-medium mb-2 font-heading">
              还没有回忆
            </p>
            <p className="text-neutral-400 text-sm mb-6">
              写下第一个与{pet.name}的美好回忆吧
            </p>
            <button
              onClick={() => router.push("/create-memory")}
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-caramel to-caramel-dark px-6 py-2.5 text-sm text-white font-medium shadow-lg shadow-caramel/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <span className="relative z-10">✍️ 写下第一篇回忆</span>
            </button>
          </div>
        </ScrollReveal>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {displayMemories.map((memory) => (
            <ScrollReveal key={memory.id} delay={60}>
              <MemoryCard
                memory={memory}
                onEdit={sampleMemories.some(sm => sm.id === memory.id) ? undefined : handleEdit}
                onDelete={sampleMemories.some(sm => sm.id === memory.id) ? undefined : handleDeleteRequest}
              />
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* ──── Chat ──── */}
      {pet && <ChatPanel pet={pet} open={chatOpen} onClose={() => setChatOpen(false)} />}

      {/* ──── Edit / Delete modals ──── */}
      {editingMemory && (
        <EditMemoryModal
          memory={editingMemory}
          isOpen={true}
          onSave={handleSave}
          onClose={() => setEditingMemory(null)}
        />
      )}
      {deletingMemory && (
        <DeleteConfirmDialog
          memoryTitle={deletingMemory.title}
          isOpen={true}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingMemory(null)}
        />
      )}
    </div>
  )
}
