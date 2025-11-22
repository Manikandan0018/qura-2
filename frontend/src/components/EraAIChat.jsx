import React, { useEffect, useRef, useState } from "react";

const PRESETS = {
  minimal: "Minimal",
  glass: "Glassmorphism",
  mobile: "Mobile",
};

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

export default function EraAIChat() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("eraai_theme") || "dark"
  );
  const [preset, setPreset] = useState(
    () => localStorage.getItem("eraai_preset") || "minimal"
  );
  const [messages, setMessages] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("eraai_messages")) || defaultMessages()
      );
    } catch {
      return defaultMessages();
    }
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  function defaultMessages() {
    return [
      {
        id: uid(),
        from: "bot",
        text: "👋 Hi! I'm EraAI — your personal intelligent assistant.",
      },
      {
        id: uid(),
        from: "bot",
        text: "Ask me anything… or try switching UI presets!",
      },
    ];
  }

  // Theme handler
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("eraai_theme", theme);
  }, [theme]);

  useEffect(() => localStorage.setItem("eraai_preset", preset), [preset]);

  useEffect(() => {
    localStorage.setItem("eraai_messages", JSON.stringify(messages));
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }));
  }, [messages]);

  function send() {
    if (!input.trim()) return;

    const user = { id: uid(), from: "user", text: input };
    setMessages((p) => [...p, user]);
    setInput("");

    // Simulated bot response
    setTimeout(() => {
      setMessages((p) => [
        ...p,
        { id: uid(), from: "bot", text: generateMockReply(input) },
      ]);
    }, 650);
  }

  function generateMockReply(text) {
    const t = text.toLowerCase();
    if (t.includes("theme")) return `You're currently using ${theme} mode.`;
    if (t.includes("style") || t.includes("preset"))
      return `Preset active: ${PRESETS[preset]}.`;

    return `"${text}" — got it! How can I help further?`;
  }

  function clearChat() {
    setMessages(defaultMessages());
  }

  // ChatGPT-like bubble style
  const bubbleClass = (from) =>
    from === "user"
      ? "bg-indigo-600 text-white self-end rounded-2xl rounded-br-sm"
      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl rounded-bl-sm";

  // Smooth presets
  const containerStyles = {
    minimal: "bg-white dark:bg-[#0f0f0f]",
    glass:
      "backdrop-blur-2xl bg-white/20 dark:bg-white/5 border border-white/10",
    mobile: "bg-white dark:bg-[#0f0f0f]",
  }[preset];

  return (
    <div className="w-full flex flex-col h-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5 px-2 md:px-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            EraAI Chat
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ChatGPT-grade UX • Clean • Responsive • Smooth
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-1.5 rounded-md bg-slate-200 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200"
          >
            <option value="minimal">Minimal</option>
            <option value="glass">Glass</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
      </div>

      {/* CHAT CONTAINER */}
      <div
        className={`flex flex-col rounded-2xl flex-1 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${containerStyles}`}
      >
        {/* CHAT MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 max-w-[85%] md:max-w-[70%] text-sm leading-relaxed shadow-sm animate-fadeIn ${bubbleClass(
                  msg.from
                )}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* INPUT (FLOATING CHATGPT STYLE) */}
        <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-800 bg-transparent">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl shadow-inner border border-slate-300 dark:border-slate-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Message EraAI…"
              className="flex-1 px-2 outline-none bg-transparent dark:text-white"
            />

            <button
              onClick={send}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition"
            >
              Send
            </button>

            <button
              onClick={clearChat}
              className="px-3 py-2 text-xs rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
