import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { useChatStream } from "@/hooks/useChatStream";
import Logo from "@/assets/dtagent.png"

// ─── Streaming endpoint & persistence ─────────────────────────────
const STREAM_API_URL = `${(import.meta.env.VITE_BASE_URL || "").replace(
  /\/$/,
  ""
)}/ai/chat/stream/`;

// Bumped to v2 so any previously persisted hardcoded welcome message (and
// older doubled-content state) from the removed INITIAL_MESSAGES is discarded
// and the page starts in a clean, empty state.
const GLOBAL_HISTORY_KEY = "ask-agent-global-chart-history-v2";

const loadGlobalHistory = () => {
  try {
    // Drop the stale pre-v2 store so the old welcome message can't resurface.
    localStorage.removeItem("ask-agent-global-chart-history");
    const raw = localStorage.getItem(GLOBAL_HISTORY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.messages)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const saveGlobalHistory = (messages, sessionId) => {
  try {
    localStorage.setItem(
      GLOBAL_HISTORY_KEY,
      JSON.stringify({ messages, session_id: sessionId || null })
    );
  } catch {
    // Ignore storage errors (e.g. quota / private mode)
  }
};

// ─── Agent Avatar ─────────────────────────────────────────────────
const AgentAvatar = ({ size = "w-10 h-10", fontSize = "text-[13px]" }) => (
  <div className={`relative ${size} flex-shrink-0`}>
    <div className={`${size} rounded-full bg-[#0f2d5c] text-white ${fontSize} font-bold flex items-center justify-center`}>
      P
    </div>
    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
  </div>
);

// ─── Message bubble ───────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] bg-[#0f2d5c] text-white text-[14px] leading-relaxed px-4 py-3 rounded-2xl rounded-tr-sm">
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-[#0f2d5c] text-white text-[12px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
        P
      </div>
      <div className="max-w-[75%] bg-blue-50 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="text-[14px] leading-relaxed whitespace-pre-wrap">
          {msg.text}
        </div>

        {Array.isArray(msg.sources) && msg.sources.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {msg.sources.map((s, si) => {
              const host = (() => {
                try {
                  return s?.url ? new URL(s.url).hostname.replace(/^www\./, "") : "";
                } catch {
                  return "";
                }
              })();
              return (
                <a
                  key={s?.chunk_id || si}
                  href={s?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-3 rounded-lg border border-gray-200 bg-white hover:border-[#1b4b8a] transition-colors"
                >
                  {host && (
                    <p className="text-[10px] font-semibold text-gray-400 tracking-wide uppercase mb-1 truncate">
                      {host}
                    </p>
                  )}
                  <p className="text-[13px] font-semibold text-gray-900 leading-snug">
                    {s?.title || s?.url}
                  </p>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Typing indicator ─────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-full bg-[#0f2d5c] text-white text-[12px] font-bold flex items-center justify-center flex-shrink-0">
      P
    </div>
    <div className="bg-blue-50 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────
const AskAgentChart = () => {
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [queriesLeft, setQueriesLeft] = useState(20);
  const [sessionId,   setSessionId]   = useState(null);
  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);
  const token = useSelector((state) => state.auth?.token);

  const { sendMessage: streamMessage, isStreaming } = useChatStream(STREAM_API_URL, {
    getHeaders: () => ({
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }),
  });

  // Restore the persisted global conversation on first mount.
  useEffect(() => {
    const history = loadGlobalHistory();
    if (history) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages(history.messages);
      setSessionId(history.session_id || null);
      setQueriesLeft((q) => Math.max(0, q - history.messages.filter((m) => m.role === "user").length));
    }
  }, []);

  // Persist the conversation on every change.
  useEffect(() => {
    saveGlobalHistory(messages, sessionId);
  }, [messages, sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming || queriesLeft <= 0) return;

    // Add user message and an empty assistant placeholder that will fill in as
    // the stream progresses.
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: trimmed },
      { id: Date.now() + 1, role: "agent", text: "" },
    ]);
    setInput("");
    setQueriesLeft((q) => q - 1);

    // First message: no session_id; subsequent messages: include session_id.
    const extraBody = {};
    if (sessionId) {
      extraBody.session_id = sessionId;
    }

    let assistantText = "";

    streamMessage(
      trimmed,
      {
        onChunk: (chunk) => {
          assistantText += chunk;
          setMessages((prev) => {
            const next = [...prev];
            if (next.length > 0 && next[next.length - 1].role === "agent") {
              next[next.length - 1] = { ...next[next.length - 1], text: assistantText };
            }
            return next;
          });
        },
        onDone: (newSessionId, sources) => {
          if (newSessionId) {
            setSessionId(newSessionId);
          }
          if (Array.isArray(sources) && sources.length > 0) {
            setMessages((prev) => {
              const next = [...prev];
              if (next.length > 0 && next[next.length - 1].role === "agent") {
                next[next.length - 1] = { ...next[next.length - 1], sources };
              }
              return next;
            });
          }
        },
        onError: (err) => {
          const errorText =
            err?.data?.message || err?.message || "Something went wrong. Please try again.";
          setMessages((prev) => {
            const next = [...prev];
            if (next.length > 0 && next[next.length - 1].role === "agent") {
              next[next.length - 1] = { ...next[next.length - 1], text: errorText };
            }
            return next;
          });
        },
      },
      extraBody,
    );
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-10 pb-6 px-4">

      {/* ── Header ── */}
      <div className="text-center mb-6">
        <img src={Logo} alt="DTAgent Logo" className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-[28px] font-bold text-gray-900 mb-2">Ask DTAgent</h1>
        <p className="text-[14px] text-gray-500 max-w-lg">
          Your AI news concierge for the dental industry. DTAgent reads today's 92 articles so you don't have to.
        </p>
      </div>

      {/* ── Chat card ── */}
      <Card className="w-full max-w-[660px] border border-gray-200 rounded-xl shadow-none overflow-hidden">

        {/* Agent header */}
        <CardHeader className="flex flex-row items-center gap-3 px-5 py-4 border-b border-gray-100 space-y-0">
          <AgentAvatar size="w-10 h-10" fontSize="text-[13px]" />
          <div>
            <p className="text-[14px] font-semibold text-gray-900 leading-tight">DTAgent</p>
            <p className="text-[12px] text-green-500 font-medium">● Online · GPT-4 Turbo</p>
          </div>
        </CardHeader>

        {/* Messages */}
        <ScrollArea className="h-[360px] px-5 py-5">
          <div className="flex flex-col gap-4">
            {messages.map((msg, idx) => {
              // While streaming, the empty agent placeholder is shown as the
              // TypingIndicator below — don't also render it as an empty bubble
              // (that produced two stacked agent bubbles).
              const isStreamingPlaceholder =
                isStreaming &&
                idx === messages.length - 1 &&
                msg.role === "agent" &&
                !msg.text;
              if (isStreamingPlaceholder) return null;
              return <MessageBubble key={msg.id} msg={msg} />;
            })}
            {isStreaming &&
              (() => {
                const last = messages[messages.length - 1];
                return last && last.role === "agent" && !last.text ? <TypingIndicator /> : null;
              })()}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <Separator />

        {/* Input area */}
        <CardContent className="px-5 pt-3 pb-4">
          <div className="flex items-end gap-3 border border-gray-300 rounded-xl px-4 py-2.5 focus-within:border-[#0f2d5c] transition-colors">
            <Textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask agent about today's dental news…"
              className="flex-1 resize-none border-none shadow-none outline-none p-0 text-[13px] text-gray-700 placeholder:text-gray-400 bg-transparent leading-snug max-h-32 focus-visible:ring-0"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => sendMessage(input)}
            //   disabled={!input.trim()}
             className="w-8 h-8 rounded-lg bg-[#1b4b8a] hover:bg-[#163d72] flex items-center justify-center flex-shrink-0"
            >
            <Send size={13} className="text-white" />
            </Button>
          </div>

          {/* Footer hint */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px] text-gray-400">
              Press{" "}
              <kbd className="bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-mono">
                Enter
              </kbd>{" "}
              to send ·{" "}
              <kbd className="bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-mono">
                Shift+Enter
              </kbd>{" "}
              new line
            </p>
            <p className="text-[11px] text-gray-400">{queriesLeft} queries left</p>
          </div>
        </CardContent>

      </Card>
    </div>
  );
};

export default AskAgentChart;
