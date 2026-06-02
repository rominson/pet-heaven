import type { Memory } from "@/data/sample"
import type { ChatMessage } from "./chat"
import { getDeviceId } from "./supabase"

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

const LS = {
  PET: "pet",
  MEMORIES: "memories",
  MESSAGES: "chat_messages",
  API_KEY: "deepseek_api_key",
} as const

// =================================================================
// PET
// =================================================================

export function loadPet(): StoredPet | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(LS.PET)
  if (!raw) return null
  try { return JSON.parse(raw) as StoredPet } catch { return null }
}

export function savePet(pet: StoredPet): void {
  localStorage.setItem(LS.PET, JSON.stringify(pet))
}

// =================================================================
// MEMORIES
// =================================================================

export function loadMemories(): Memory[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(LS.MEMORIES)
  if (!raw) return []
  try { return JSON.parse(raw) as Memory[] } catch { return [] }
}

export function saveMemory(memory: Memory): void {
  const stored = JSON.parse(localStorage.getItem(LS.MEMORIES) ?? "[]")
  const idx = stored.findIndex((m: Memory) => m.id === memory.id)
  if (idx !== -1) stored[idx] = memory
  else stored.push(memory)
  localStorage.setItem(LS.MEMORIES, JSON.stringify(stored))
}

export function deleteMemory(id: string): void {
  const stored = JSON.parse(localStorage.getItem(LS.MEMORIES) ?? "[]")
  const filtered = stored.filter((m: Memory) => m.id !== id)
  localStorage.setItem(LS.MEMORIES, JSON.stringify(filtered))
}

// =================================================================
// CHAT
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
