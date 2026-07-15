import { useState, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { Send, ClipboardCheck, Settings2, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetUserPreviousMessagesQuery } from "@/redux/api/chatbotApi"
import { useChatStream } from "@/hooks/useChatStream"
import { StreamingDots } from "@/components/StreamingDots"
import Loader from "@/components/ui/Loader"

const chatApiUrl = `${(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")}/chat/auth/`

function formatMessageTime(isoString) {
  if (!isoString) return ""
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hr ago`
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

const AskChatMessage = () => {
  const token = useSelector((state) => state.auth?.token)
  const { data: previousMessages = [], isLoading: isLoadingPreviousMessages } = useGetUserPreviousMessagesQuery()
  const { sendMessage, isStreaming } = useChatStream(chatApiUrl, {
    getHeaders: () => ({
      "Content-Type": "application/json",
      ...(token && { Authorization: `Token ${token}` }),
    }),
  })
  const apiMessages = useMemo(() => {
    if (!Array.isArray(previousMessages) || previousMessages.length === 0) return []
    const sorted = [...previousMessages].sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
    const out = []
    for (const m of sorted) {
      out.push({ role: "user", content: m.human_message || "", time: formatMessageTime(m.created_at) })
      out.push({ role: "assistant", content: m.ai_response || "", time: formatMessageTime(m.created_at) })
    }
    return out
  }, [previousMessages])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  useEffect(() => {
    setMessages(apiMessages)
  }, [apiMessages])

  const nowLabel = "Just now"
  const setLastAssistantMessage = (content) => {
    setMessages((prev) => {
      const next = [...prev]
      if (next.length > 0 && next[next.length - 1].role === "assistant") {
        next[next.length - 1] = { ...next[next.length - 1], content }
      }
      return next
    })
  }
  const setLastAssistantTime = () => {
    setMessages((prev) => {
      const next = [...prev]
      if (next.length > 0 && next[next.length - 1].role === "assistant") {
        next[next.length - 1] = { ...next[next.length - 1], time: nowLabel }
      }
      return next
    })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    const text = input.trim()
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, time: nowLabel },
      { role: "assistant", content: "", time: "" },
    ])
    setInput("")
    await sendMessage(text, {
      onChunk: setLastAssistantMessage,
      onDone: setLastAssistantTime,
      onError: (err) => {
        const errorText = err?.data?.message || err?.message || "Something went wrong. Please try again."
        setLastAssistantMessage(errorText)
        setLastAssistantTime()
      },
    })
  }

  const pageLoading=isLoadingPreviousMessages

  return (
    <div className="flex gap-6 h-[calc(100vh-130px)]">
      {pageLoading && <Loader />}
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              <img src="/Favricon_Transparent.png" alt="Roofus" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Roofus: AI Assistant</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Online - Ready to help
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col overflow-hidden rounded-xl border bg-card p-2 space-y-4">
          <div className="flex-1 flex flex-col gap-4 overflow-auto p-2">
            {messages?.length > 0 ? messages?.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
                    <img src="/Favricon_Transparent.png" alt="Roofus" className="w-8 h-8 object-contain" />
                  </div>
                )}
                <div className={`max-w-[75%] ${msg.role === "user" ? "text-right" : ""}`}>
                  <div className={`rounded-xl p-4 ${msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                    }`}>
                    <div className="text-sm whitespace-pre-wrap">
                      {msg.role === "assistant" && isStreaming && !msg.content ? (
                        <StreamingDots />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 block">{msg.time}</span>
                </div>
              </div>
            )):
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No messages found. Please start a new chat.</p>
            </div>
            }
          </div>
        </div>
        <form onSubmit={handleSend} className="mt-3 p-2 bg-white rounded-xl border">
          <div className="flex gap-2">
            <textarea
              className="flex-1 min-h-[44px] max-h-[120px] rounded-xl border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={isStreaming ? "Waiting for response..." : "Ask me anything about your roof..."}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend(e)
                }
              }}
              disabled={isStreaming}
            />
            <Button type="submit" size="icon" className="h-11 w-11 rounded-xl shrink-0" disabled={isStreaming}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-2">AI responses are for informational purposes. For major repairs, consult a professional roofer.</p>
      </div>

      {/* Sidebar */}
      <div className="w-80 shrink-0 space-y-4 hidden lg:block">
        {/* AI Capabilities */}
        <div className="rounded-xl border bg-card p-4">
          <h3 className="font-semibold mb-3">AI Capabilities</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ClipboardCheck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Scan Analysis</h4>
                <p className="text-xs text-muted-foreground">Understand your roof scan results</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Maintenance Tips</h4>
                <p className="text-xs text-muted-foreground">Get personalized recommendations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Insurance Help</h4>
                <p className="text-xs text-muted-foreground">Documentation guidance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Timing Advice</h4>
                <p className="text-xs text-muted-foreground">Know when to repair or replace</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default AskChatMessage