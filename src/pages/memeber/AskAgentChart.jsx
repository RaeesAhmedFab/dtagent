import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/assets/dtagent.png"
// ─── Constants ────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  "Show me today's top stories",
  "Any news about new dental technology?",
  "Summarize regulatory changes this week",
  "What's happening in dental hygiene?",
  "Tell me a dental joke",
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "agent",
    text: "Good morning! 🌟 I'm DTAgent, your DTA news concierge. We've got 92 fresh stories from your 11 sources today — including a big ADA infection-control update. Want me to walk you through the highlights, or is there something specific on your mind?",
  },
];

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
      <div className="max-w-[75%] bg-blue-50 text-gray-900 text-[14px] leading-relaxed px-4 py-3 rounded-2xl rounded-tl-sm">
        {msg.text}
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
  const [messages,    setMessages]    = useState(INITIAL_MESSAGES);
  const [input,       setInput]       = useState("");
  const [queriesLeft, setQueriesLeft] = useState(20);
  const [isTyping,    setIsTyping]    = useState(false);
  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed || queriesLeft <= 0) return;

    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: trimmed }]);
    setInput("");
    setQueriesLeft((q) => q - 1);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "agent",
          text: "I'm looking into that for you. Here's what I found from today's 92 articles across your 11 sources…",
        },
      ]);
    }, 1200);
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
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <Separator />

        {/* Quick prompts */}
        <CardContent className="px-5 pt-4 pb-3">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2.5">
            Quick Prompts
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <Badge
                key={p}
                variant="outline"
                onClick={() => sendMessage(p)}
                className="text-[12px] font-normal px-3 py-1.5 rounded-full text-gray-600 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-colors"
              >
                {p}
              </Badge>
            ))}
          </div>
        </CardContent>

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
