import { useState, useRef, useEffect } from "react";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { Send, ExternalLink } from "lucide-react";
import { useChatStream } from "@/hooks/useChatStream";
import { useSelector } from "react-redux";

const STREAM_API_URL = `${(import.meta.env.VITE_BASE_URL || "").replace(
  /\/$/,
  ""
)}/ai/chat/stream/`;

// const QUICK_PROMPTS = [
//   "Show me today's top stories",
//   "Any news about new dental technology?",
//   "Summarize regulatory changes this week",
//   "What's happening in dental hygiene?",
//   "Tell me a dental joke",
// ];

// Conversations are tracked per article (using the article_id) or under a
// shared "global" key when no article is in context. The session_id returned
// by the backend is stored alongside the messages so the same conversation is
// resumed on reopen.
const HISTORY_PREFIX = "ask-agent-history";

const storageKeyFor = (articleId) =>
  `${HISTORY_PREFIX}-${articleId != null && articleId !== "" ? `article-${articleId}` : "global"}`;

const loadHistory = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.messages)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const saveHistory = (key, messages, sessionId) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ messages, session_id: sessionId || null })
    );
  } catch {
    // Ignore storage errors (e.g. quota / private mode)
  }
};

export function AskAgentDrawer({ Open, onClose, article_id }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const bottomRef = useRef(null);
  const prevOpenRef = useRef(Open);
  const token = useSelector((state) => state.auth?.token);

  const { sendMessage, isStreaming } = useChatStream(STREAM_API_URL, {
    getHeaders: () => ({
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Restore conversation history whenever the drawer is (re)opened for the
  // current article. If a previous session exists, its messages and session_id
  // are loaded so the chat resumes exactly where it left off.
  useEffect(() => {
    if (Open && !prevOpenRef.current) {
      const history = loadHistory(storageKeyFor(article_id));
      if (history) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessages(history.messages);
        setSessionId(history.session_id || null);
      } else {
        setMessages([]);
        setSessionId(null);
      }
    }
    prevOpenRef.current = Open;
  }, [Open, article_id]);

  // Persist the active conversation on every change so it survives close/reopen.
  useEffect(() => {
    if (Open) {
      saveHistory(storageKeyFor(article_id), messages, sessionId);
    }
  }, [messages, sessionId, Open, article_id]);

  const handleSend = async (text) => {
    if (!text.trim() || isStreaming) return;
    const trimmed = text.trim();

    // Add user message and empty assistant placeholder
    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ]);
    setInput("");

    // Build request body matching the API contract:
    //   { question, article_id }                 -> first message for an article
    //   { question, article_id, session_id }     -> follow-up in same session
    //   { question } / { question, session_id }  -> global (no article) chat
    const extraBody = {};
    if (article_id !== undefined && article_id !== null && article_id !== "") {
      const normalizedArticleId = Number(article_id);
      extraBody.article_id = Number.isNaN(normalizedArticleId)
        ? article_id
        : normalizedArticleId;
    }
    // First message: no session_id; subsequent messages: include session_id
    if (sessionId) {
      extraBody.session_id = sessionId;
    }

    // TEMP DIAGNOSTIC: confirms the article_id prop and outgoing request body.
    console.log(
      "[AskAgent][drawer] article_id prop:", article_id,
      "| outgoing body:", { question: trimmed, ...extraBody }
    );

    let assistantContent = "";

    await sendMessage(
      trimmed,
      {
        onChunk: (chunk) => {
          assistantContent += chunk;
          setMessages((prev) => {
            const next = [...prev];
            if (next.length > 0 && next[next.length - 1].role === "assistant") {
              next[next.length - 1] = {
                ...next[next.length - 1],
                content: assistantContent,
              };
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
              if (next.length > 0 && next[next.length - 1].role === "assistant") {
                next[next.length - 1] = {
                  ...next[next.length - 1],
                  sources,
                };
              }
              return next;
            });
          }
        },
        onError: (err) => {
          const errorText =
            err?.data?.message ||
            err?.message ||
            "Something went wrong. Please try again.";
          setMessages((prev) => {
            const next = [...prev];
            if (next.length > 0 && next[next.length - 1].role === "assistant") {
              next[next.length - 1] = {
                ...next[next.length - 1],
                content: errorText,
              };
            }
            return next;
          });
        },
      },
      extraBody,
    );
  };

  const handleQuickPrompt = (prompt) => {
    handleSend(prompt);
  };

  return (
    <Drawer open={Open} onOpenChange={onClose} direction="right">
      <DrawerContent
        overlayClassName="supports-backdrop-filter:backdrop-blur-none backdrop-blur-none"
        className="w-[400px] h-screen flex flex-col p-0 rounded-none border-l border-gray-200 ml-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#1b4b8a] text-white text-[13px] font-bold flex items-center justify-center">
              P
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-gray-900 leading-tight">
              DTAgent
            </p>
            <p className="text-[11px] text-green-500 font-medium">
              ● Online
            </p>
          </div>
          <DrawerClose asChild>
            <button className="ml-auto text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded p-1.5 text-lg leading-none">
              ✕
            </button>
          </DrawerClose>
        </div>

        {/* Messages area - using the reusable ChatStreamPanel */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-[13px] text-gray-500 text-center px-6">
                Ask a question about this article or any dental news topic.
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 items-start ${
                    msg.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-[#1b4b8a] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      P
                    </div>
                  )}
                  <div
                    className={`rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed max-w-[280px] ${
                      msg.role === "user"
                        ? "bg-[#1b4b8a] text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-900 rounded-tl-none"
                    }`}
                  >
                    {msg.role === "assistant" && isStreaming && !msg.content ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    )}
                     {msg.role === "assistant" &&
                    Array.isArray(msg.sources) &&
                    msg.sources.length > 0 && (
                      <div className="mt-2.5 flex flex-col gap-1.5 max-w-[280px]">
                        <p className="text-[10px] font-semibold text-gray-400 tracking-wide uppercase">
                          Sources
                        </p>
                        {msg.sources.map((s, si) => {
                          let host = "";
                          try {
                            host = s?.url ? new URL(s.url).hostname.replace(/^www\./, "") : "";
                          } catch {
                            host = "";
                          }
                          return (
                            <a
                              key={s?.chunk_id || si}
                              href={s?.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2.5 p-2 rounded-lg border border-gray-200 bg-white hover:border-[#1b4b8a] hover:bg-blue-50/40 transition-colors"
                            >
                              <span className="w-6 h-6 rounded-md bg-[#1b4b8a] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                {si + 1}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-[12px] font-medium text-gray-800 leading-snug truncate">
                                  {s?.title || s?.url}
                                </span>
                                {host && (
                                  <span className="block text-[10px] text-gray-400 truncate">
                                    {host}
                                  </span>
                                )}
                              </span>
                              <ExternalLink size={12} className="text-gray-400 flex-shrink-0" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>

                 
                </div>
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Quick prompts */}
        {/* <div className="px-4 pt-2 pb-1 border-t border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-2">
            Quick Prompts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => handleQuickPrompt(p)}
                disabled={isStreaming}
                className="text-[12px] px-3 py-1.5 border border-gray-200 rounded-full bg-white text-gray-600 hover:bg-gray-50 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {p}
              </button>
            ))}
          </div>
        </div> */}

        {/* Input */}
        <div className="px-4 pt-2 pb-3">
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder={
                isStreaming
                  ? "Waiting for response..."
                  : "Ask agent about today's dental news…"
              }
              disabled={isStreaming}
              className="flex-1 resize-none border-none outline-none text-[13px] text-gray-700 placeholder-gray-400 bg-transparent leading-snug disabled:opacity-50"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={isStreaming || !input.trim()}
              className="w-8 h-8 rounded-lg bg-[#1b4b8a] hover:bg-[#163d72] flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={13} className="text-white" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">
            Press{" "}
            <kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 text-[10px] font-mono">
              Enter
            </kbd>{" "}
            to send ·{" "}
            <kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 text-[10px] font-mono">
              Shift+Enter
            </kbd>{" "}
            new line
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}