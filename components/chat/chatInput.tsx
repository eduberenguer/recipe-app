"use client";

import { useState, useContext } from "react";
import { UserInteractionsContext } from "@/app/context/context";
import { Loader2 } from "lucide-react";

interface ChatInputProps {
  toUserId: string;
  fromUserId: string;
  onMessageSent?: () => void;
  isAi: boolean;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
}

export default function ChatInput({
  toUserId,
  fromUserId,
  onMessageSent,
  isAi = false,
  isLoading = false,
  setIsLoading = () => {},
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
        setIsLoading(true);
        await contextUseInteractions?.sendMessageAi(message);
        setIsLoading(false);
        return;
      }

      await contextUseInteractions?.sendMessage(fromUserId, toUserId, message);
    } catch (error: unknown) {
      setStatus((error as Error).message || "Error sending message");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-3xl mx-auto p-4 bg-white/90 backdrop-blur-md shadow-md flex flex-col gap-3"
    >
      <textarea
        placeholder="Escribe tu mensaje..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full bg-white border border-gray-300 rounded-md p-4 resize-none h-28 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`self-center flex items-center justify-center gap-2 bg-blue-600 text-white text-base font-semibold py-2 px-6 rounded-full transition duration-200 ${
          isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-700 cursor-pointer"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" /> Enviando...
          </>
        ) : (
          "Enviar"
        )}
      </button>

      {status && (
        <p className="text-sm text-red-500 italic text-center">{status}</p>
      )}
    </form>
  );
}
