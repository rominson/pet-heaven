const speciesEmoji: Record<string, string> = {
  狗: "🐕",
  猫: "🐱",
  兔: "🐰",
  鸟: "🐦",
  鱼: "🐟",
  仓鼠: "🐹",
  龟: "🐢",
}

const speciesGradients: Record<string, string> = {
  狗: "from-neutral-200 to-neutral-300",
  猫: "from-neutral-300 to-neutral-400",
  兔: "from-stone-200 to-stone-300",
  鸟: "from-sky-100 to-sky-200",
  鱼: "from-cyan-100 to-cyan-200",
  仓鼠: "from-stone-100 to-stone-200",
  龟: "from-emerald-100 to-emerald-200",
}

const glowColors: Record<string, string> = {
  狗: "from-neutral-200/30 to-neutral-300/15",
  猫: "from-neutral-300/25 to-neutral-400/15",
  兔: "from-stone-200/30 to-stone-300/15",
  鸟: "from-sky-100/30 to-sky-200/15",
  鱼: "from-cyan-100/30 to-cyan-200/15",
  仓鼠: "from-stone-100/30 to-stone-200/15",
  龟: "from-emerald-100/30 to-emerald-200/15",
}

export default function PetAvatar({
  species,
  name,
  size = "lg",
}: {
  species: string
  name: string
  size?: "sm" | "lg"
}) {
  const emoji = speciesEmoji[species] ?? "🐾"
  const gradient = speciesGradients[species] ?? "from-neutral-200 to-neutral-300"
  const glowGradient = glowColors[species] ?? "from-neutral-200/30 to-neutral-300/15"
  const sizeClasses =
    size === "lg"
      ? "w-24 h-24 text-4xl sm:w-28 sm:h-28 sm:text-5xl"
      : "w-10 h-10 text-lg"

  return (
    <div className="relative shrink-0">
      {/* Breathing glow ring */}
      <div
        className={`absolute -inset-3 rounded-full bg-gradient-to-br ${glowGradient} blur-xl animate-pulse-soft`}
      />
      <div className="relative rounded-full ring-4 ring-white/80 shadow-xl">
        <div
          className={`${sizeClasses} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          title={name}
        >
          <span className="drop-shadow-sm">{emoji}</span>
        </div>
      </div>
    </div>
  )
}
