import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { Send } from "lucide-react";

const QUICK_PROMPTS = [
  "Show me today's top stories",
  "Any news about new dental technology?",
  "Summarize regulatory changes this week",
  "What's happening in dental hygiene?",
  "Tell me a dental joke",
];

const INITIAL_MESSAGES = [
  {
    role: "agent",
    text: "Good morning! 🌟 I'm DTAgent, your DTA news concierge. We've got 92 fresh stories from your 11 sources today — including a big ADA infection-control update. Want me to walk you through the highlights, or is there something specific on your mind?",
    cards: [],
  },
  {
    role: "user",
    text: "Show me today's top stories",
  },
  {
    role: "agent",
    text: "Great question! There are two stories worth your attention here. The ADA dropped a 14-page infection-control refresh this morning — main change is mandatory N95 during aerosol procedures starting July 1. And on the tech side, VistaCheck just got FDA clearance for AI caries detection. Want the deeper dive on either one?",
    cards: [
      { source: "ADA NEWS", time: "2H AGO", title: "ADA releases updated infection-control guidance for 2026 in response to evolving aerosol research" },
      { source: "INSIDE DENTISTRY", time: "3H AGO", title: "AI-assisted caries detection clears 510(k) hurdle, expected in chairside units by Q4" },
    ],
  },
];

const Avatar = ({ initials, size = 8 }) => (
  <div className={`w-${size} h-${size} rounded-full bg-[#1b4b8a] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>
    {initials}
  </div>
);

const ArticleCard = ({ source, time, title }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-3 mt-2">
    <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-1">
      {source} · {time}
    </p>
    <p className="text-[13px] font-semibold text-gray-900 leading-snug">{title}</p>
  </div>
);

export function AskAgentDrawer({ Open, onClose }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput]       = useState("");
  const bottomRef               = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: text.trim() }]);
    setInput("");
    // Simulated agent reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "I'm looking into that for you. Here's what I found from today's sources…", cards: [] },
      ]);
    }, 800);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <Drawer open={Open} onOpenChange={onClose} direction="right">
      <DrawerContent className="w-[400px] h-screen flex flex-col p-0 rounded-none border-l border-gray-200 ml-auto">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#1b4b8a] text-white text-[13px] font-bold flex items-center justify-center">P</div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-gray-900 leading-tight">DTAgent</p>
            <p className="text-[11px] text-green-500 font-medium">● Online · GPT-4 Turbo</p>
          </div>
          <DrawerClose asChild>
            <button className="ml-auto text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded p-1.5 text-lg leading-none">✕</button>
          </DrawerClose>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 items-start ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "agent" && <Avatar initials="P" size={7} />}
              <div className={`rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed max-w-[280px] ${
                msg.role === "user"
                  ? "bg-[#1b4b8a] text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-900 rounded-tl-none"
              }`}>
                {msg.text}
                {msg.cards?.map((c, j) => <ArticleCard key={j} {...c} />)}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-4 pt-2 pb-1 border-t border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-2">Quick Prompts</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((p) => (
              <button key={p} onClick={() => send(p)}
                className="text-[12px] px-3 py-1.5 border border-gray-200 rounded-full bg-white text-gray-600 hover:bg-gray-50 whitespace-nowrap">
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-4 pt-2 pb-3">
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask agent about today's dental news…"
              className="flex-1 resize-none border-none outline-none text-[13px] text-gray-700 placeholder-gray-400 bg-transparent leading-snug"
            />
            <button onClick={() => send(input)}
              className="w-8 h-8 rounded-lg bg-[#1b4b8a] hover:bg-[#163d72] flex items-center justify-center flex-shrink-0">
              <Send size={13} className="text-white" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">
            Press <kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 text-[10px] font-mono">Enter</kbd> to send ·{" "}
            <kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 text-[10px] font-mono">Shift+Enter</kbd> new line
            &nbsp;&nbsp; 19 queries left
          </p>
        </div>

      </DrawerContent>
    </Drawer>
  );
}