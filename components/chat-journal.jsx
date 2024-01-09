"use client";

import { useEffect } from "react";
import { useChat } from "ai/react";
import { Button } from "./ui/button";

export default function ChatJournal({ journals }) {
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat();

  useEffect(() => {
    if (journals.length > 0) {
      let context = "";
      journals.map((i) => {
        context += "> " + i.date + "\n";
        i.messages
          .filter((o) => o.role === "user")
          .map((m) => {
            context += "- " + m.content + "\n";
          });
      });
      setMessages([
        {
          id: 1,
          role: "system",
          content: `You are a smart assistant, your task is to answer questions from users based on the context provided. The context is the text provided by user daily journal.\n\n#Context:\n${context.substring(0, 2000)}\n\n#Rules:\n- Only answer questions according to the given context\n- If there is no answer or the question is taken out of context, answer "Sorry, I don't know. Do you have any other questions?"\n- Answer questions briefly and clearly\n- Answer friendly`,
        },
      ]);
    }
  }, [journals]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4">
        {messages.map((m, index) => (
          <div key={index}>
            {m.role === "assistant" && <p className="text-indigo-500">AI: {m.content}</p>}
            {m.role === "user" && <p>{m.content}</p>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 bg-indigo-50 p-4 rounded-b-xl flex items-center gap-4">
        <input value={input} onChange={handleInputChange} className="w-full flex-1 px-3 py-1 rounded" placeholder="Ask anything..." />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
