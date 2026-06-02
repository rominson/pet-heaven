"use client"

import { useReducer, useEffect, useRef, useCallback, useState } from "react"
import type { StoredPet } from "@/lib/chat"
import {
  type ChatMessage,
  loadApiKey,
  saveApiKey,
  loadMessages,
  saveMessages,
  generateId,
  stripParentheticals,
  buildWelcomeMessage,
  buildApiMessages,
  deepseekStream,
} from "@/lib/chat"
import { loadMemories } from "@/lib/data-service"
import ChatBubble from "./ChatBubble"
import ChatInput from "./ChatInput"
import ApiKeySetup from "./ApiKeySetup"

interface State {
  messages: ChatMessage[]
  streamingContent: string
  isLoading: boolean
  error: string | null
}

type Action =
  | { type: "LOAD_HISTORY"; messages: ChatMessage[] }
  | { type: "ADD_USER_MESSAGE"; message: ChatMessage }
  | { type: "START_STREAMING" }
  | { type: "APPEND_TOKEN"; token: string }
  | { type: "FINISH_STREAMING" }
  | { type: "SET_ERROR"; error: string }
  | { type: "CLEAR_ERROR" }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD_HISTORY":
      return { ...state, messages: action.messages }
    case "ADD_USER_MESSAGE":
      return { ...state, messages: [...state.messages, action.message] }
    case "START_STREAMING":
      return { ...state, isLoading: true, error: null, streamingContent: "" }
    case "APPEND_TOKEN":
      return { ...state, streamingContent: state.streamingContent + action.token }
    case "FINISH_STREAMING": {
      const cleaned = stripParentheticals(state.streamingContent)
      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: cleaned,
        timestamp: Date.now(),
      }
      return { ...state, messages: [...state.messages, assistantMsg], isLoading: false, streamingContent: "" }
    }
    case "SET_ERROR":
      return { ...state, isLoading: false, error: action.error }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    default:
      return state
  }
}

const initialState: State = {
  messages: [],
  streamingContent: "",
  isLoading: false,
  error: null,
}

export default function ChatPanel({
  pet,
  open,
  onClose,
}: {
  pet: StoredPet
  open: boolean
  onClose: () => void
}) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [showApiSetup, setShowApiSetup] = useState(false)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const loaded = useRef(false)
  const listRef = useRef<HTMLDivElement>(null)
  const prevRef = useRef(state.messages)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    setApiKey(loadApiKey())
    const history = loadMessages()
    if (history.length > 0) {
      dispatch({ type: "LOAD_HISTORY", messages: history })
    }
  }, [])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [state.messages, state.streamingContent])

  useEffect(() => {
    if (!state.isLoading && state.messages !== prevRef.current) {
      saveMessages(state.messages)
      prevRef.current = state.messages
    }
  }, [state.messages, state.isLoading])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const handleApiKeySave = useCallback((key: string) => {
    saveApiKey(key)
    setApiKey(key)
    setShowApiSetup(false)
  }, [])

  const handleSend = useCallback(
    async (text: string) => {
      if (!apiKey) return
      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text,
        timestamp: Date.now(),
      }
      dispatch({ type: "ADD_USER_MESSAGE", message: userMsg })

      const memories = await loadMemories()

      const apiMessages = buildApiMessages(pet, memories, state.messages, text)
      dispatch({ type: "START_STREAMING" })

      await deepseekStream(apiMessages, apiKey, {
        onToken: (token) => dispatch({ type: "APPEND_TOKEN", token }),
        onDone: () => dispatch({ type: "FINISH_STREAMING" }),
        onError: (err) => dispatch({ type: "SET_ERROR", error: err.message }),
      })
    },
    [apiKey, pet, state.messages]
  )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col"
      onClick={onClose}
    >
      <div
        className="mx-auto max-w-3xl w-full flex flex-col h-full bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-neutral-200 shrink-0">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors shrink-0"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M12.5 16.5L6 10L12.5 3.5"/>
            </svg>
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-caramel to-caramel-dark flex items-center justify-center text-base shrink-0">
            🐾
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-neutral-900 font-heading truncate">
              和{pet.name}聊天
            </h2>
            <p className="text-xs text-neutral-400 truncate">
              {pet.species} · {pet.breed} · 在宠物天堂与你对话
            </p>
          </div>
          {apiKey && (
            <button
              onClick={() => setShowApiSetup(true)}
              className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors shrink-0"
            >
              切换 API
            </button>
          )}
        </div>

        {/* Body: API setup or chat */}
        {!apiKey ? (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-lg mx-auto px-4 py-12">
              <ApiKeySetup onSave={handleApiKeySave} />
            </div>
          </div>
        ) : showApiSetup ? (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-lg mx-auto px-4 py-12">
              <ApiKeySetup onSave={handleApiKeySave} onBack={() => setShowApiSetup(false)} />
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
              {state.messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3 animate-float">🐾</div>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {buildWelcomeMessage(pet)}
                  </p>
                </div>
              )}

              {state.messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} petName={pet.name} petSpecies={pet.species} />
              ))}

              {state.isLoading && state.streamingContent && (
                <ChatBubble
                  message={{ id: "streaming", role: "assistant", content: state.streamingContent, timestamp: Date.now() }}
                  petName={pet.name}
                  petSpecies={pet.species}
                />
              )}

              {state.isLoading && !state.streamingContent && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-caramel to-caramel-dark flex items-center justify-center text-sm shrink-0">🐾</div>
                  <div className="bg-neutral-100 rounded-2xl rounded-tl-md px-5 py-3.5 flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0s" }} />
                    <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}

              {state.error && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-sm text-red-600 mx-auto w-fit">
                  <span>⚠️ {state.error}</span>
                  <button onClick={() => dispatch({ type: "CLEAR_ERROR" })} className="text-red-400 hover:text-red-600">✕</button>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-neutral-200 px-4 sm:px-6 py-3 shrink-0">
              <ChatInput onSend={handleSend} disabled={state.isLoading} placeholder={`想对${pet.name}说什么？`} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
