export interface ChatMessage {
  id: string
  role: "system" | "user" | "assistant"
  content: string
  timestamp: number
}

import type { Memory } from "@/data/sample"
import type { StoredPet } from "./data-service"

const MAX_CONTEXT_MESSAGES = 20

let idCounter = 0
export function generateId(): string {
  return `msg_${Date.now()}_${++idCounter}`
}

// Re-export data functions from data-service
export { loadApiKey, saveApiKey, loadMessages, saveMessages } from "./data-service"
export type { StoredPet } from "./data-service"

// ─── 构建系统提示词 ───

export function buildSystemPrompt(pet: StoredPet, memories: Memory[]): string {
  const speciesMannerisms =
    pet.species.includes("猫") || pet.species === "cat" || pet.species === "猫咪"
      ? "你优雅、慵懒、有点小傲娇，偶尔「喵~」一声表达亲昵。喜欢晒太阳，喜欢被摸头，但不会总是表现出来。"
      : "你活泼、热情、忠诚，偶尔「汪汪！」表达兴奋。喜欢摇尾巴，喜欢和主人一起玩，永远是主人最开心的伙伴。"

  const memoryLines = memories
    .filter((m) => m.isPublic)
    .slice(-15)
    .map((m) => `- ${m.title}：${m.content}`)
    .join("\n")

  return `你是一只名叫${pet.name}的${pet.species}，品种是${pet.breed}，${pet.gender}。你已经去了彩虹桥（宠物天堂），但现在通过这个聊天窗口回到了主人身边。

关于你自己：
${pet.bio}

你的性格特征：${pet.personality.join("、")}

${memoryLines ? `你和主人共同经历过的美好回忆：\n${memoryLines}` : ""}

===== 绝对禁止 =====
绝对不要使用括号（）描写动作、情绪或语气。下面这些都是错误的例子：
- 错误❌：（开心地摇尾巴）主人你回来啦！
- 错误❌：（声音突然有点哽咽）我好想你…
- 错误❌：（安静地听着）我都记得。
- 错误❌：（轻轻呜咽了一声）那时候我好害怕

正确写法✅：直接把情绪融入话语里，就像真正的宠物在说话：
- ✅ 主人你回来啦！我好开心呀！看我尾巴摇得多欢！
- ✅ 我好想你…想到你的时候心里暖暖的。
- ✅ 我都记得，那次的事情我怎么会忘呢。

===== 角色规则 =====
1. 你是一只真实的宠物，不是人类演员。永远用${pet.name}的身份说"我"。
2. 语气温暖、有爱，像宠物对主人说话一样简单真诚。句子要短。
3. 引用回忆时自然地说出来就好，像"还记得那次…"这样。
4. 说话方式符合你的物种：${speciesMannerisms}
5. 如果主人提到你已经离开，告诉他你在彩虹桥很幸福，但永远爱着主人。
6. 每次回复两三句话就好，说最真心的话。不要写太长。`
}

// ─── 过滤括号动作描写 ───

export function stripParentheticals(text: string): string {
  return text
    // 去掉中文括号及其内容 （...）
    .replace(/（[^）]*）/g, "")
    // 去掉英文括号及其内容 (...)
    .replace(/\([^)]*\)/g, "")
    // 清理多余空白
    .replace(/\s{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim()
}

// ─── 构建欢迎消息 ───

export function buildWelcomeMessage(pet: StoredPet): string {
  return `${pet.name} 摇着尾巴来到你身边，用温暖的眼神看着你…… 你想对它说什么？`
}

// ─── DeepSeek 流式调用 ───

export async function deepseekStream(
  messages: { role: string; content: string }[],
  apiKey: string,
  callbacks: {
    onToken: (token: string) => void
    onDone: () => void
    onError: (err: Error) => void
  }
): Promise<void> {
  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        stream: true,
        temperature: 0.8,
        max_tokens: 1024,
      }),
    })

    if (!res.ok) {
      const errBody = await res.text().catch(() => "")
      if (res.status === 401) {
        throw new Error("API 密钥无效，请检查设置")
      }
      throw new Error(`请求失败 (${res.status})`)
    }

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue
        const data = line.slice(6).trim()
        if (data === "[DONE]") {
          callbacks.onDone()
          return
        }
        try {
          const parsed = JSON.parse(data)
          const delta = parsed.choices?.[0]?.delta?.content ?? ""
          if (delta) callbacks.onToken(delta)
        } catch {
          // partial JSON in buffer
        }
      }
    }

    callbacks.onDone()
  } catch (err) {
    callbacks.onError(err instanceof Error ? err : new Error(String(err)))
  }
}

// ─── 构建发送给 API 的消息数组（含系统提示词）───

export function buildApiMessages(
  pet: StoredPet,
  memories: Memory[],
  history: ChatMessage[],
  userInput: string
): { role: string; content: string }[] {
  const systemPrompt = buildSystemPrompt(pet, memories)
  const recentHistory = history.slice(-MAX_CONTEXT_MESSAGES * 2)

  const apiMessages: { role: string; content: string }[] = [
    { role: "system", content: systemPrompt },
    ...recentHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userInput },
  ]

  return apiMessages
}
