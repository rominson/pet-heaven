"use client"

import type { ChatMessage } from "@/lib/chat"

const speciesEmoji: Record<string, string> = {
  狗: "🐕",
  猫: "🐈",
  猫咪: "🐈",
  兔: "🐇",
  兔子: "🐇",
  鸟: "🐦",
  鱼: "🐟",
  仓鼠: "🐹",
  乌龟: "🐢",
}

function getPetEmoji(species: string): string {
  for (const [key, emoji] of Object.entries(speciesEmoji)) {
    if (species.includes(key)) return emoji
  }
  return "🐾"
}

export default function ChatBubble({
  message,
  petName,
  petSpecies,
}: {
  message: ChatMessage
  petName?: string
  petSpecies?: string
}) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  if (isSystem) return null

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className="shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-sm text-neutral-600">
            我
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-caramel to-caramel-dark flex items-center justify-center text-sm">
            {petSpecies ? getPetEmoji(petSpecies) : "🐾"}
          </div>
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-gradient-to-r from-caramel to-caramel-dark text-white rounded-tr-md"
            : "bg-neutral-100 text-neutral-800 rounded-tl-md"
        }`}
      >
        {!isUser && petName && (
          <div className="text-xs font-semibold text-neutral-500 mb-1">{petName}</div>
        )}
        {message.content}
      </div>
    </div>
  )
}
