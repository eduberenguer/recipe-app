"use client";

import { useState } from "react";

interface ChatInputProps {
  toUserId: string;
  fromUserId: string;
  onMessageSent?: () => void;
  isAi: boolean;
}

import { UserInteractionsContext } from "@/app/context/context";
import { useContext } from "react";

export default function ChatInput({
  toUserId,
  fromUserId,
  onMessageSent,
  isAi = false,
}: ChatInputProps) {
  const contextUseInteractions = useContext(UserInteractionsContext);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toUserId || !fromUserId || !message.trim()) return;

    try {
      setMessage("");
      onMessageSent?.();

      if (isAi) {
        setStatus("Generating recipe!");
        const recipeAi = await contextUseInteractions?.sendMessageAi(message);
        setStatus("");
        return recipeAi;
      }
      setStatus("Message sent!");
      await contextUseInteractions?.sendMessage(fromUserId, toUserId, message);
      setStatus("");
    } catch (error: unknown) {
      setStatus((error as Error).message || "Error sending message");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-gray-100 rounded-md shadow-md p-4 flex-shrink-0"
    >
      <textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-3 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <button
        type="submit"
        className="bg-blue-600 w-50 m-auto text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 hover:cursor-pointer"
      >
        Send
      </button>
      {status && <p className="text-sm mt-2 text-gray-600">{status}</p>}
    </form>
  );
}
