import React, { useRef, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useChatStore } from "../../store/chatStore";
import { generateText } from "../../utils/textGenerator";
import { throttle } from "../../utils/throttle";

export const Chat: React.FC = () => {
  const { messages, addMessage, addChunk, stopGenerating } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = () => {
    const id = nanoid();
    addMessage({ id, role: "ai", content: "", isGenerating: true });

    const throttledAddChunk = throttle((chunk: string) => {
      addChunk(id, chunk);
      scrollToBottom();
    }, 16);

    generateText(
      1000,
      (chunk) => throttledAddChunk(chunk),
      () => stopGenerating(id),
    );
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userId = nanoid();
    addMessage({
      id: userId,
      role: "user",
      content: input,
      isGenerating: false,
    });

    generateAIResponse();
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">AI Чат</h2>
            <p className="text-sm text-gray-500">{messages.length} сообщений</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            AI
          </div>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <p className="text-base font-medium text-gray-600 mb-2">
              Начните диалог
            </p>
            <p className="text-sm text-gray-500 max-w-sm text-center">
              Напишите сообщение и нажмите "Отправить", чтобы начать беседу с AI
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 ${msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white border border-gray-200"
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${msg.role === "user"
                          ? "bg-blue-400"
                          : "bg-purple-500 text-white"
                        }`}
                    >
                      {msg.role === "user" ? "В" : "AI"}
                    </div>
                    <span className="text-xs font-medium opacity-80">
                      {msg.role === "user" ? "Вы" : "Искусственный интеллект"}
                    </span>
                  </div>
                  <div className="text-sm">
                    {msg.content}
                    {msg.isGenerating && (
                      <span className="inline-flex ml-1 space-x-1">
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></span>
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse delay-150"></span>
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse delay-300"></span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Введите сообщение..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || messages.some((m) => m.isGenerating)}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-[0.98] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Отправить
          </button>
        </div>
        {messages.some((m) => m.isGenerating) && (
          <button
            onClick={() => {
              messages.forEach(
                (msg) => msg.isGenerating && stopGenerating(msg.id),
              );
            }}
            className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Остановить генерацию
          </button>
        )}
      </div>
    </div>
  );
};
