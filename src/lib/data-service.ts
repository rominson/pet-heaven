import { supabase, getDeviceId } from "./supabase"
import type { Memory } from "@/data/sample"
import type { ChatMessage } from "./chat"

export interface StoredPet {
  name: string
  species: string
  breed: string
  gender: string
  birthday: string
  passAwayDate: string
  bio: string
  personality: string[]
}

// ─── localStorage keys ───

const LS = {
  PET: "pet",
  MEMORIES: "memories",
  MESSAGES: "chat_messages",
  API_KEY: "deepseek_api_key",
  MIGRATED: "pet_heaven_migrated",
} as const

// =================================================================
// PET
// =================================================================

export async function loadPet(): Promise<StoredPet | null> {
  // Try Supabase first
  try {
    const { data } = await supabase
      .from("pets")
      .select("*")
      .eq("device_id", getDeviceId())
      .maybeSingle()
    if (data) return mapDbPet(data)
  } catch { /* fallback */ }

  // Fallback to localStorage
  const raw = localStorage.getItem(LS.PET)
  if (!raw) return null
  try { return JSON.parse(raw) as StoredPet } catch { return null }
}

export async function savePet(pet: StoredPet): Promise<void> {
  try {
    await supabase.from("pets").upsert(
      {
        device_id: getDeviceId(),
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        gender: pet.gender,
        birthday: pet.birthday,
        pass_away_date: pet.passAwayDate,
        bio: pet.bio,
        personality: pet.personality,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "device_id", ignoreDuplicates: false }
    )
  } catch { /* fallback */ }

  localStorage.setItem(LS.PET, JSON.stringify(pet))
}

// =================================================================
// MEMORIES
// =================================================================

export async function loadMemories(): Promise<Memory[]> {
  // Try Supabase first
  try {
    const deviceId = getDeviceId()
    const { data } = await supabase
      .from("memories")
      .select("*")
      .or(`device_id.eq.${deviceId},is_public.eq.true`)
      .order("created_at", { ascending: false })
    if (data) return data.map(mapDbMemory)
  } catch { /* fallback */ }

  // Fallback to localStorage
  const raw = localStorage.getItem(LS.MEMORIES)
  if (!raw) return []
  try { return JSON.parse(raw) as Memory[] } catch { return [] }
}

export async function saveMemory(memory: Memory): Promise<void> {
  try {
    await supabase.from("memories").upsert(
      {
        id: memory.id,
        device_id: getDeviceId(),
        pet_id: memory.petId,
        pet_name: memory.petName,
        title: memory.title,
        content: memory.content,
        image_url: memory.imageUrl ?? null,
        emotion: memory.emotion,
        is_public: memory.isPublic,
        created_at: memory.createdAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id", ignoreDuplicates: false }
    )
  } catch { /* fallback */ }

  const stored = JSON.parse(localStorage.getItem(LS.MEMORIES) ?? "[]")
  const idx = stored.findIndex((m: Memory) => m.id === memory.id)
  if (idx !== -1) stored[idx] = memory
  else stored.push(memory)
  localStorage.setItem(LS.MEMORIES, JSON.stringify(stored))
}

export async function deleteMemory(id: string): Promise<void> {
  try {
    await supabase.from("memories").delete().eq("id", id)
  } catch { /* fallback */ }

  const stored = JSON.parse(localStorage.getItem(LS.MEMORIES) ?? "[]")
  const filtered = stored.filter((m: Memory) => m.id !== id)
  localStorage.setItem(LS.MEMORIES, JSON.stringify(filtered))
}

// =================================================================
// CHAT (keep in localStorage)
// =================================================================

export function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(LS.MESSAGES)
  if (!raw) return []
  try { return JSON.parse(raw) as ChatMessage[] } catch { return [] }
}

export function saveMessages(messages: ChatMessage[]): void {
  const trimmed = messages.slice(-50)
  localStorage.setItem(LS.MESSAGES, JSON.stringify(trimmed))
}

export function loadApiKey(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(LS.API_KEY)
}

export function saveApiKey(key: string): void {
  localStorage.setItem(LS.API_KEY, key)
}

// =================================================================
// DB → App mappers
// =================================================================

function mapDbPet(db: any): StoredPet {
  return {
    name: db.name,
    species: db.species,
    breed: db.breed,
    gender: db.gender,
    birthday: db.birthday,
    passAwayDate: db.pass_away_date,
    bio: db.bio,
    personality: db.personality ?? [],
  }
}

function mapDbMemory(db: any): Memory {
  return {
    id: db.id,
    petId: db.pet_id,
    petName: db.pet_name,
    title: db.title,
    content: db.content,
    imageUrl: db.image_url ?? undefined,
    emotion: db.emotion,
    isPublic: db.is_public,
    createdAt: db.created_at?.slice(0, 10) ?? "",
  }
}

// =================================================================
// One-time migration from localStorage → Supabase
// =================================================================

export async function migrateLocalStorageToSupabase(): Promise<void> {
  if (localStorage.getItem(LS.MIGRATED) === "true") return
  const hasPet = localStorage.getItem(LS.PET)
  const hasMemories = localStorage.getItem(LS.MEMORIES)
  if (!hasPet && !hasMemories) {
    localStorage.setItem(LS.MIGRATED, "true")
    return
  }

  const deviceId = getDeviceId()

  if (hasPet) {
    try {
      const pet = JSON.parse(hasPet) as StoredPet
      await supabase.from("pets").upsert(
        { device_id: deviceId, ...pet, pass_away_date: pet.passAwayDate },
        { onConflict: "device_id" }
      )
    } catch { /* skip */ }
  }

  if (hasMemories) {
    try {
      const memories: Memory[] = JSON.parse(hasMemories)
      const rows = memories.map((m) => ({
        id: m.id,
        device_id: deviceId,
        pet_id: m.petId,
        pet_name: m.petName,
        title: m.title,
        content: m.content,
        image_url: m.imageUrl ?? null,
        emotion: m.emotion,
        is_public: m.isPublic,
        created_at: m.createdAt,
      }))
      await supabase.from("memories").upsert(rows, { onConflict: "id" })
    } catch { /* skip */ }
  }

  localStorage.setItem(LS.MIGRATED, "true")
}
