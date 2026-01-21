import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  isGenerating?: boolean;
}

interface ChatStore {
  messages: Message[];
  addMessage: (msg: Message) => void;
  addChunk: (id: string, chunk: string) => void;
  stopGenerating: (id: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  addChunk: (id, chunk) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + chunk } : m,
      ),
    })),

  stopGenerating: (id) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, isGenerating: false } : m,
      ),
    })),
}));
